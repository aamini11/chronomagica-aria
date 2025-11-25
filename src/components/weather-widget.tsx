import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface WeatherData {
	location: string
	temp: number
	high: number
	low: number
	condition: string
	conditionEmoji: string
	humidity: number
	windSpeed: number
}

interface GeolocationPositionError {
	code: number
	message: string
}

export function WeatherWidget({ date }: { date: Date }) {
	const [weather, setWeather] = useState<WeatherData | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [hasLocation, setHasLocation] = useState(false)

	const formattedDate = date.toLocaleString('en-US', {
		weekday: 'short',
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
	})

	const getWeatherEmoji = (condition: string): string => {
		const conditionLower = condition.toLowerCase()
		if (conditionLower.includes('clear') || conditionLower.includes('sunny'))
			return '☀️'
		if (conditionLower.includes('cloud')) return '☁️'
		if (conditionLower.includes('rain')) return '🌧️'
		if (conditionLower.includes('snow')) return '❄️'
		if (conditionLower.includes('thunder') || conditionLower.includes('storm'))
			return '⛈️'
		if (conditionLower.includes('fog') || conditionLower.includes('mist'))
			return '🌫️'
		return '🌤️'
	}

	useEffect(() => {
		const getLocationAndWeather = async () => {
			try {
				setLoading(true)
				setError(null)

				// Get user's location
				const position = await new Promise<GeolocationPosition>(
					(resolve, reject) => {
						if (!navigator.geolocation) {
							reject(new Error('Geolocation is not supported'))
							return
						}
						navigator.geolocation.getCurrentPosition(resolve, reject, {
							enableHighAccuracy: true,
							timeout: 10000,
							maximumAge: 300000, // 5 minutes
						})
					},
				)

				const { latitude, longitude } = position.coords
				setHasLocation(true)

				// Get weather data from Open-Meteo (free, no API key required)
				const weatherResponse = await fetch(
					`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`,
				)

				if (!weatherResponse.ok) {
					throw new Error('Failed to fetch weather data')
				}

				const weatherData = await weatherResponse.json()

				// Convert weather code to description
				const weatherCodes: { [key: number]: string } = {
					0: 'Clear sky',
					1: 'Mainly clear',
					2: 'Partly cloudy',
					3: 'Overcast',
					45: 'Fog',
					48: 'Depositing rime fog',
					51: 'Light drizzle',
					53: 'Moderate drizzle',
					55: 'Dense drizzle',
					56: 'Light freezing drizzle',
					57: 'Dense freezing drizzle',
					61: 'Slight rain',
					63: 'Moderate rain',
					65: 'Heavy rain',
					66: 'Light freezing rain',
					67: 'Heavy freezing rain',
					71: 'Slight snow fall',
					73: 'Moderate snow fall',
					75: 'Heavy snow fall',
					77: 'Snow grains',
					80: 'Slight rain showers',
					81: 'Moderate rain showers',
					82: 'Heavy rain showers',
					85: 'Slight snow showers',
					86: 'Heavy snow showers',
					95: 'Thunderstorm',
					96: 'Thunderstorm with slight hail',
					99: 'Thunderstorm with heavy hail',
				}

				const condition =
					weatherCodes[weatherData.current.weather_code] || 'Unknown'
				const temp = Math.round(weatherData.current.temperature_2m)
				const high = Math.round(weatherData.daily.temperature_2m_max[0])
				const low = Math.round(weatherData.daily.temperature_2m_min[0])

				// Try to get location name via reverse geocoding
				let location = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`
				try {
					const geoResponse = await fetch(
						`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
					)
					if (geoResponse.ok) {
						const geoData = await geoResponse.json()
						location = geoData.city
							? `${geoData.city}, ${geoData.countryCode || ''}`.trim()
							: location
					}
				} catch {
					// Keep default coordinates if geocoding fails
				}

				setWeather({
					location,
					temp,
					high,
					low,
					condition,
					conditionEmoji: getWeatherEmoji(condition),
					humidity: weatherData.current.relative_humidity_2m,
					windSpeed: Math.round(weatherData.current.wind_speed_10m),
				})
			} catch (err) {
				const error = err as GeolocationPositionError | Error
				if ('code' in error) {
					// Geolocation error
					switch (error.code) {
						case 1:
							setError(
								'Location access denied. Please enable location permissions.',
							)
							break
						case 2:
							setError('Location information unavailable.')
							break
						case 3:
							setError('Location request timed out.')
							break
						default:
							setError('Failed to get location.')
					}
				} else {
					setError(error.message || 'Failed to fetch weather data.')
				}
				setHasLocation(false)
			} finally {
				setLoading(false)
			}
		}

		getLocationAndWeather()
	}, [])

	if (loading) {
		return (
			<Card className="w-full max-w-lg">
				<CardContent className="flex flex-col items-center gap-2 p-4 text-center">
					<span className="text-muted-foreground text-sm">{formattedDate}</span>
					<div className="flex items-center gap-2">
						<div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
						<span className="text-muted-foreground text-sm">
							Loading weather...
						</span>
					</div>
				</CardContent>
			</Card>
		)
	}

	if (error || !hasLocation) {
		return (
			<Card className="w-full max-w-lg">
				<CardContent className="flex flex-col items-center gap-2 p-4 text-center">
					<span className="text-muted-foreground text-sm">{formattedDate}</span>
					<span className="text-2xl">🌍</span>
					<span className="text-muted-foreground text-sm">
						{error || 'Enable location access to see your local weather'}
					</span>
				</CardContent>
			</Card>
		)
	}

	if (!weather) {
		return (
			<Card className="w-full max-w-lg">
				<CardContent className="flex flex-col items-center gap-2 p-4 text-center">
					<span className="text-muted-foreground text-sm">{formattedDate}</span>
					<span className="text-2xl">❌</span>
					<span className="text-muted-foreground text-sm">
						Failed to load weather data
					</span>
				</CardContent>
			</Card>
		)
	}

	const w = weather
	return (
		<Card className="w-full max-w-sm">
			<CardContent className="flex items-center justify-between p-4">
				<div className="flex items-center gap-3">
					<span className="text-4xl">{w.conditionEmoji}</span>
					<div>
						<span className="text-2xl font-bold">{w.temp}°F</span>
						<div className="text-muted-foreground text-xs">
							H:{w.high}° L:{w.low}°
						</div>
					</div>
				</div>
				<div className="text-right">
					<div className="text-sm font-medium">{w.location}</div>
					<div className="text-muted-foreground text-xs">{w.condition}</div>
					<div className="text-muted-foreground text-xs">
						💧{w.humidity}% • 💨{w.windSpeed}mph
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
