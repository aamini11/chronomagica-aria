import { Lightbulb } from "lucide-react";

interface HeaderProps {
  date: Date;
  locationName: string;
  weather: {
    temp: number;
    condition: string;
    symbol: string;
  };
  toggleTheme: () => void;
  isDark: boolean;
}

export function Header({
  date,
  locationName,
  weather,
  toggleTheme,
  isDark,
}: HeaderProps) {
  // Format date: Wednesday, June 26, 2025
  const dateStr = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format time: 1:09 PM
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="w-full max-w-md mx-auto p-4 pb-2 animate-fade-in">
      <div className="flex justify-end mb-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-300"
          aria-label="Toggle theme"
        >
          <Lightbulb
            className={isDark ? "text-yellow-300" : "text-yellow-600"}
            size={24}
          />
        </button>
      </div>

      <div className="flex items-center justify-center mb-4">
        <span className="text-2xl mr-2 text-yellow-500 animate-pulse">◀</span>
        <h1 className="text-4xl font-serif text-center mx-2 font-bold tracking-tight">
          Today's Energies
        </h1>
        <span className="text-2xl ml-2 text-yellow-500 animate-pulse">▶</span>
      </div>

      <div className="flex justify-between items-end text-sm sm:text-base font-serif border-b border-gray-200 dark:border-gray-800 pb-4 mb-4">
        <div className="flex flex-col">
          <span className="font-bold text-lg">{dateStr}</span>
          <span className="opacity-80">{locationName}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-bold text-lg">{timeStr}</span>
          <span className="flex items-center gap-1">
            {Math.round(weather.temp)}° F, {weather.condition}{" "}
            <span className="text-xl">{weather.symbol}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
