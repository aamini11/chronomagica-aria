import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../components/Header";
import { PlanetaryTable } from "../components/PlanetaryTable";
import { PlanetaryHours } from "../components/PlanetaryHours";
import {
  getPlanetaryData,
  getPlanetaryHours,
  getLuckStatus,
} from "../utils/astronomy";
import { getWeather, WeatherData } from "../utils/weather";
import { Observer } from "astronomy-engine";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [date, setDate] = React.useState(new Date());
  const [location, setLocation] = React.useState<{
    lat: number;
    lon: number;
    name: string;
  }>({
    lat: 29.9841, // Default: Metairie, LA (approx) or New Orleans
    lon: -90.1529,
    name: "Metairie, LA", // Default placeholder
  });
  const [weather, setWeather] = React.useState<WeatherData>({
    temperature: 0,
    condition: "Loading...",
    symbol: "",
    isDay: true,
  });
  const [isDark, setIsDark] = React.useState(false);

  // Update time every minute
  React.useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Get Location
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Reverse geocoding to get the real name
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            // Construct a nice name: "City, PrincipalSubdivision" or just "City"
            const city = data.city || data.locality || "";
            const region =
              data.principalSubdivisionCode || data.principalSubdivision || "";
            const locationName =
              city && region
                ? `${city}, ${region}`
                : city || "Detected Location";

            setLocation((prev) => ({
              ...prev,
              lat: latitude,
              lon: longitude,
              name: locationName,
            }));
          } catch (error) {
            console.error("Error reverse geocoding:", error);
            // Fallback if geocoding fails
            setLocation((prev) => ({
              ...prev,
              lat: latitude,
              lon: longitude,
              name: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
            }));
          }
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
    }
  }, []);

  // Get Weather when location changes
  React.useEffect(() => {
    getWeather(location.lat, location.lon).then(setWeather);
  }, [location]);

  // Derived Data
  const observer = new Observer(location.lat, location.lon, 0);
  console.log("Observer created:", observer);
  const planets = React.useMemo(
    () => getPlanetaryData(date, observer),
    [date, location]
  );
  const hours = React.useMemo(
    () => getPlanetaryHours(date, observer),
    [date, location]
  );
  const luck = React.useMemo(() => getLuckStatus(date), [date]);

  // Theme toggle
  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-500 ${
        isDark
          ? "bg-gradient-to-b from-black via-[#0f0f1a] to-[#1a1a2e] text-white"
          : "bg-gradient-to-b from-white via-[#f8f9fa] to-[#e9ecef] text-black"
      }`}
    >
      <div className="container mx-auto px-4 py-6 max-w-lg">
        <Header
          date={date}
          locationName={location.name}
          weather={{
            temp: weather.temperature,
            condition: weather.condition,
            symbol: weather.symbol,
          }}
          toggleTheme={toggleTheme}
          isDark={isDark}
        />

        <PlanetaryTable planets={planets} isDark={isDark} />

        <PlanetaryHours hours={hours} currentDate={date} isDark={isDark} />

        <div className="w-full text-center py-8">
          <h2
            className="text-3xl font-serif font-bold tracking-wide animate-fade-in"
            style={{ color: luck.color }}
          >
            {luck.text}
          </h2>
        </div>
      </div>
    </div>
  );
}
