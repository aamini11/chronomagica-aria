import {
  Body,
  Observer,
  SearchRiseSet,
  MoonPhase,
  Ecliptic,
  MakeTime,
  SearchGlobalSolarEclipse,
  SearchLunarEclipse,
  GeoVector,
} from "astronomy-engine";

export type PlanetStatus = {
  name: string;
  symbol: string;
  sign: string;
  signSymbol: string;
  isRetrograde: boolean;
  color: string;
  darkModeColor: string;
  status?: string;
};

export type PlanetaryHour = {
  start: Date;
  end: Date;
  planet: string;
  symbol: string;
};

const PLANETS = [
  {
    name: "Sol",
    symbol: "☉",
    body: Body.Sun,
    color: "#ffd071",
    darkColor: "#ac7403",
  },
  {
    name: "Luna",
    symbol: "☽︎",
    body: Body.Moon,
    color: "#d1d1d1",
    darkColor: "#919191",
  },
  {
    name: "Mercury",
    symbol: "☿",
    body: Body.Mercury,
    color: "#fff59c",
    darkColor: "#918308",
  },
  {
    name: "Venus",
    symbol: "♀",
    body: Body.Venus,
    color: "#95f3ad",
    darkColor: "#004812",
  },
  {
    name: "Mars",
    symbol: "♂",
    body: Body.Mars,
    color: "#ffc5c5",
    darkColor: "#7a0000",
  },
  {
    name: "Jupiter",
    symbol: "♃",
    body: Body.Jupiter,
    color: "#9fdcff",
    darkColor: "#00467f",
  },
  {
    name: "Saturn",
    symbol: "♄",
    body: Body.Saturn,
    color: "#a5a5a5",
    darkColor: "#1d1d1d",
  },
  {
    name: "Uranus",
    symbol: "♅",
    body: Body.Uranus,
    color: "#c9bcff",
    darkColor: "#250076",
  },
  {
    name: "Neptune",
    symbol: "♆",
    body: Body.Neptune,
    color: "#f9b6ff",
    darkColor: "#7b0085",
  },
  {
    name: "Pluto",
    symbol: "⯓",
    body: Body.Pluto,
    color: "#e5baa5",
    darkColor: "#4f2916",
  },
];

const ZODIAC = [
  { name: "Aries", symbol: "♈︎" },
  { name: "Taurus", symbol: "♉︎" },
  { name: "Gemini", symbol: "♊︎" },
  { name: "Cancer", symbol: "♋︎" },
  { name: "Leo", symbol: "♌︎" },
  { name: "Virgo", symbol: "♍︎" },
  { name: "Libra", symbol: "♎︎" },
  { name: "Scorpio", symbol: "♏︎" },
  { name: "Sagittarius", symbol: "♐︎" },
  { name: "Capricorn", symbol: "♑︎" },
  { name: "Aquarius", symbol: "♒︎" },
  { name: "Pisces", symbol: "♓︎" },
];

const MOON_PHASES = [
  { name: "New Moon", symbol: "🌑︎" },
  { name: "Waxing Crescent", symbol: "🌒︎" },
  { name: "First Quarter", symbol: "🌓︎" },
  { name: "Waxing Gibbous", symbol: "🌔︎" },
  { name: "Full Moon", symbol: "🌕︎" },
  { name: "Waning Gibbous", symbol: "🌖︎" },
  { name: "Last Quarter", symbol: "🌗︎" },
  { name: "Waning Crescent", symbol: "🌘︎" },
];

function getZodiacSign(longitude: number) {
  const index = Math.floor(longitude / 30) % 12;
  return ZODIAC[index];
}

function getMoonPhaseData(date: Date) {
  const phase = MoonPhase(MakeTime(date));
  const segment = Math.round(phase / 45) % 8;
  return MOON_PHASES[segment];
}

function isRetrograde(body: Body, date: Date): boolean {
  if (body === Body.Sun || body === Body.Moon) return false;

  const time1 = MakeTime(date);
  const time0 = MakeTime(new Date(date.getTime() - 3600000)); // 1 hour ago

  const vec1 = GeoVector(body, time1, true);
  const vec0 = GeoVector(body, time0, true);

  const ecl1 = Ecliptic(vec1);
  const ecl0 = Ecliptic(vec0);

  let diff = ecl1.elon - ecl0.elon;
  // Handle wrap around 360
  if (diff < -180) diff += 360;
  if (diff > 180) diff -= 360;

  return diff < 0;
}

function isSameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function getSolarEclipseStatus(date: Date): string {
  const yesterday = new Date(date);
  yesterday.setDate(date.getDate() - 1);
  const t = MakeTime(yesterday);

  const eclipse = SearchGlobalSolarEclipse(t);

  if (isSameDay(date, eclipse.peak.date)) {
    return `${eclipse.kind} Solar Eclipse`;
  }
  return "";
}

function getLunarEclipseStatus(date: Date): string {
  const yesterday = new Date(date);
  yesterday.setDate(date.getDate() - 1);
  const t = MakeTime(yesterday);

  const eclipse = SearchLunarEclipse(t);

  if (isSameDay(date, eclipse.peak.date)) {
    return `${eclipse.kind} Lunar Eclipse`;
  }
  return "";
}

export function getPlanetaryData(
  date: Date,
  _observer: Observer
): PlanetStatus[] {
  return PLANETS.map((planet) => {
    const time = MakeTime(date);
    const vec = GeoVector(planet.body, time, true);
    const ecl = Ecliptic(vec);
    const zodiac = getZodiacSign(ecl.elon);

    let status = "";
    let isRetro = false;

    if (planet.name === "Luna") {
      const moonPhase = getMoonPhaseData(date);
      status = moonPhase.name + " " + moonPhase.symbol;
    } else if (planet.name === "Sol") {
      const solar = getSolarEclipseStatus(date);
      const lunar = getLunarEclipseStatus(date);
      if (solar) status = solar;
      else if (lunar) status = lunar;
    } else {
      isRetro = isRetrograde(planet.body, date);
    }

    return {
      name: planet.name,
      symbol: planet.symbol,
      sign: zodiac.name,
      signSymbol: zodiac.symbol,
      isRetrograde: isRetro,
      color: planet.color,
      darkModeColor: planet.darkColor,
      status: status,
    };
  });
}

export function getLuckStatus(date: Date): { text: string; color: string } {
  const phase = MoonPhase(MakeTime(date));
  const age = (phase / 360) * 29.53059;
  const day = Math.floor(age) + 1;

  let status = "neutral";
  let color = "#000";

  if ([1, 2, 7, 14, 17].includes(day)) {
    status = "lucky";
    color = "#009626";
  } else if ([5, 15, 25].includes(day)) {
    status = "unlucky";
    color = "#ff0036";
  }

  return { text: `Today is ${status}.`, color };
}

const CHALDEAN_NAMES = [
  "Saturn",
  "Jupiter",
  "Mars",
  "Sun",
  "Venus",
  "Mercury",
  "Moon",
];

function getDayRuler(date: Date): string {
  const dayOfWeek = date.getDay();
  const rulers = [
    "Sun",
    "Moon",
    "Mars",
    "Mercury",
    "Jupiter",
    "Venus",
    "Saturn",
  ];
  return rulers[dayOfWeek];
}

export function getPlanetaryHours(
  date: Date,
  observer: Observer
): PlanetaryHour[] {
  const astroTime = MakeTime(date);
  const sunrise = SearchRiseSet(Body.Sun, observer, +1, astroTime, 1);
  const sunset = SearchRiseSet(Body.Sun, observer, -1, astroTime, 1);

  if (!sunrise || !sunset) return [];

  const riseTime = sunrise.date;
  const setTime = sunset.date;

  const dayLength = setTime.getTime() - riseTime.getTime();
  const dayHourLength = dayLength / 12;

  const nextDay = MakeTime(new Date(date.getTime() + 24 * 3600000));
  const nextSunrise = SearchRiseSet(Body.Sun, observer, +1, nextDay, 1);
  const nextRiseTime = nextSunrise
    ? nextSunrise.date
    : new Date(riseTime.getTime() + 24 * 3600000);
  const nightLength = nextRiseTime.getTime() - setTime.getTime();
  const nightHourLength = nightLength / 12;

  const dayRuler = getDayRuler(date);
  let rulerIndex = CHALDEAN_NAMES.indexOf(dayRuler);

  const hours: PlanetaryHour[] = [];

  for (let i = 0; i < 12; i++) {
    const start = new Date(riseTime.getTime() + i * dayHourLength);
    const end = new Date(riseTime.getTime() + (i + 1) * dayHourLength);
    const planetName = CHALDEAN_NAMES[rulerIndex % 7];
    const planetInfo = PLANETS.find((p) => p.body.toString() === planetName)!;

    hours.push({
      start,
      end,
      planet: planetInfo.name,
      symbol: planetInfo.symbol,
    });
    rulerIndex++;
  }

  for (let i = 0; i < 12; i++) {
    const start = new Date(setTime.getTime() + i * nightHourLength);
    const end = new Date(setTime.getTime() + (i + 1) * nightHourLength);
    const planetName = CHALDEAN_NAMES[rulerIndex % 7];
    const planetInfo = PLANETS.find((p) => p.body.toString() === planetName)!;

    hours.push({
      start,
      end,
      planet: planetInfo.name,
      symbol: planetInfo.symbol,
    });
    rulerIndex++;
  }

  return hours;
}
