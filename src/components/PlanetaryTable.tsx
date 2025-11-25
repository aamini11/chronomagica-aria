import { PlanetStatus } from "../utils/astronomy";
import { cn } from "../lib/utils";
import { Card, CardContent } from "./ui/card";

interface PlanetaryTableProps {
  planets: PlanetStatus[];
  isDark: boolean;
}

export function PlanetaryTable({ planets, isDark }: PlanetaryTableProps) {
  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <Card className="overflow-hidden border-0 shadow-lg">
        <CardContent className="p-0">
          <div className="flex flex-col w-full">
            {planets.map((planet) => (
              <div
                key={planet.name}
                className="flex items-center justify-between px-4 py-3 text-sm sm:text-base font-serif font-bold transition-colors"
                style={{
                  backgroundColor: isDark ? planet.darkModeColor : planet.color,
                  color: isDark ? "#fff" : "#000",
                }}
              >
                <div className="flex items-center w-1/3">
                  <span className="text-lg mr-2">{planet.symbol}</span>
                  <span>{planet.name}</span>
                </div>

                <div className="flex items-center justify-center w-1/3 text-center">
                  {planet.status && (
                    <span
                      className={cn(
                        "whitespace-nowrap text-xs sm:text-sm",
                        planet.isRetrograde && "text-[#ff0036]" // Red if retrograde
                      )}
                    >
                      {planet.status}
                    </span>
                  )}
                  {planet.isRetrograde && !planet.status && (
                    <span className="text-[#ff0036] text-xs sm:text-sm">
                      Retrograde ℞
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-end w-1/3">
                  <span>{planet.sign}</span>
                  <span className="ml-2 bg-black/10 dark:bg-white/20 px-1.5 rounded text-sm">
                    {planet.signSymbol}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
