import { Card, CardContent } from '@/components/ui/card'

const mockWeather = {
	location: 'San Francisco, CA',
	temp: 62,
	high: 68,
	low: 55,
	condition: 'Partly Cloudy',
	conditionEmoji: '🌤️',
	humidity: 72,
	windSpeed: 12,
}

// Toggle this to preview the fallback UI
const hasLocation = true

export function WeatherWidget({ date }: { date: Date }) {
	const formattedDate = date.toLocaleString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	})

	if (!hasLocation) {
		return (
			<Card className="w-full max-w-lg">
				<CardContent className="flex flex-col items-center gap-2 p-4 text-center">
					<span className="text-muted-foreground text-sm">{formattedDate}</span>
					<span className="text-2xl">🌍</span>
					<span className="text-muted-foreground text-sm">
						Enable location access to see your local weather
					</span>
				</CardContent>
			</Card>
		)
	}

	const w = mockWeather
	return (
		<Card className="w-full max-w-lg">
			<CardContent className="flex flex-col gap-2 p-4">
				<span className="text-muted-foreground text-center text-sm">
					{formattedDate}
				</span>
				<div className="flex items-center justify-between gap-4">
					{/* Left: Location & Condition */}
					<div className="flex flex-col gap-1">
						<span className="text-muted-foreground text-sm">
							📍 {w.location}
						</span>
						<span className="text-3xl font-bold">
							{w.conditionEmoji} {w.temp}°F
						</span>
						<span className="text-muted-foreground text-sm">{w.condition}</span>
					</div>

					{/* Right: Details */}
					<div className="text-muted-foreground flex flex-col gap-1 text-right text-sm">
						<span>
							H: {w.high}° L: {w.low}°
						</span>
						<span>💧 {w.humidity}%</span>
						<span>💨 {w.windSpeed} mph</span>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
