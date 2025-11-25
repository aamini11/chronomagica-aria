import { getPlanetaryStatus, getZodiacSign, PLANETS } from "@/lib/astronomy";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function PlanetaryTable({ date }: { date: Date }) {
  return (
    <Card className="max-w-lg text-xl w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Planetary Table</CardTitle>
        <CardDescription>
          {date.toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Planet</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead>Zodiac Sign</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PLANETS.map((planet) => {
              const status = getPlanetaryStatus(planet, date);
              const zodiacSign = getZodiacSign(planet, date);
              return (
                <TableRow
                  key={planet.name}
                  style={{ backgroundColor: planet.color }}
                >
                  <TableCell>
                    {planet.symbol} {planet.name}
                  </TableCell>

                  <TableCell
                    className={cn("text-center", {
                      "text-red-500": status === "℞ Retrograde",
                    })}
                  >
                    {typeof status === "object"
                      ? `${status.symbol} ${status.name}`
                      : status}
                  </TableCell>

                  <TableCell>
                    {zodiacSign.symbol} {zodiacSign.name}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
