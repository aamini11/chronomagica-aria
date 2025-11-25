import { PlanetaryHour } from "../utils/astronomy";
import { cn } from "../lib/utils";
import { Card, CardContent } from "./ui/card";

interface PlanetaryHoursProps {
  hours: PlanetaryHour[];
  currentDate: Date;
  isDark: boolean;
}

interface HourRowProps {
  hour: PlanetaryHour;
  index: number;
  offset: number;
  currentHourIndex: number;
  isDark: boolean;
}

function HourRow({
  hour,
  index,
  offset,
  currentHourIndex,
  isDark,
}: HourRowProps) {
  const isCurrent = index + offset === currentHourIndex;
  const rowNum = index + offset + 1;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-2 text-sm sm:text-base font-serif border-b border-gray-100 dark:border-gray-800 last:border-0 transition-colors",
        isCurrent ? "bg-[#95f3ad] dark:bg-[#004812]" : "bg-white dark:bg-black",
        isCurrent && isDark && "text-white", // Ensure text is visible on green in dark mode
        !isCurrent && "text-black dark:text-white"
      )}
    >
      <div className="w-8 font-bold opacity-50">{rowNum}</div>
      <div className="flex-1 text-center font-bold">
        {formatTime(hour.start)} - {formatTime(hour.end)}
      </div>
      <div className="w-24 text-right font-bold flex justify-end items-center gap-2">
        <span>{hour.planet}</span>
        <span className="text-lg">{hour.symbol}</span>
      </div>
    </div>
  );
}

export function PlanetaryHours({
  hours,
  currentDate,
  isDark,
}: PlanetaryHoursProps) {
  // Find current hour index
  const currentHourIndex = hours.findIndex(
    (h) => currentDate >= h.start && currentDate < h.end
  );

  // Split into day (0-11) and night (12-23)
  const dayHours = hours.slice(0, 12);
  const nightHours = hours.slice(12, 24);

  return (
    <div className="w-full max-w-md mx-auto mt-4 mb-6">
      <Card className="overflow-hidden border-0 shadow-lg">
        <CardContent className="p-0">
          {/* Day Header */}
          <div className="flex justify-center items-center py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
            <span className="text-2xl text-yellow-500">☀</span>
          </div>

          {dayHours.map((hour, i) => (
            <HourRow
              key={i}
              hour={hour}
              index={i}
              offset={0}
              currentHourIndex={currentHourIndex}
              isDark={isDark}
            />
          ))}

          {/* Night Header */}
          <div className="flex justify-center items-center py-2 bg-gray-50 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
            <span className="text-2xl text-blue-400">☾</span>
          </div>

          {nightHours.map((hour, i) => (
            <HourRow
              key={i}
              hour={hour}
              index={i}
              offset={12}
              currentHourIndex={currentHourIndex}
              isDark={isDark}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
