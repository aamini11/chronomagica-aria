# Chronomagica — Overview

Chronomagica is a one page webapp that displays astrological and planetary information for users. The webapp pulls the user's location data to accurately calculate the moon phases, planetary hour changes, and whether a day is considered lucky, neutral, or unlucky - based off this calculation:

The first (1) day of the new moon and the day after (2) are both lucky.
Days 3 and 4 that follow are neutral.
Days 5, 15, and 25 are unlucky.
Days 7, 14, and 17 are lucky.
All other days are neutral.
The pattern starts again every new moon.

## Symbols

### Weather

☀️ - Sunny or Clear
☁️ - Cloudy
🌤 - Partly Cloudy
🌩️ - Thunderstorm
🌧️ - Raining
🌨️ - Snowing
🌫️ - Foggy

Sunrise hours unicode: ☀
Sunset hours unicode: ☾

### Moon Phases

New Moon - 🌑︎
Waxing Crescent - 🌒︎
First Quarter - 🌓︎
Waxing Gibbous - 🌔︎
Full Moon - 🌕︎
Waning Gibbous - 🌖︎
Last Quarter - 🌗︎
Waning Crescent - 🌘︎

The retrograde symbol: ℞

### Planets

Sol - ☉
Luna - ☽︎
Mercury - ☿
Venus - ♀
Mars - ♂
Jupiter - ♃
Saturn - ♄
Uranus - ♅
Neptune - ♆
Pluto - ⯓

### Zodiac Signs

Aries - ♈︎
Taurus - ♉︎
Gemini - ♊︎
Cancer - ♋︎
Leo - ♌︎
Virgo - ♍︎
Libra - ♎︎
Scorpio - ♏︎
Sagittarius - ♐︎
Capricorn - ♑︎
Aquarius - ♒︎
Pisces - ♓︎

## Colors

Light Mode:
Sol - #ffd071
Luna - #d1d1d1
Mercury - #fff59c
Venus - #95f3ad
Mars - #ffc5c5
Jupiter - #9fdcff
Saturn - #a5a5a5
Uranus - #c9bcff
Neptune - #f9b6ff
Pluto - #e5baa5

Dark Mode:
Sol - #ac7403
Luna - #919191
Mercury - #918308
Venus - #004812
Mars - #7a0000
Jupiter - #00467f
Saturn - #1d1d1d
Uranus - #250076
Neptune - #7b0085
Pluto - #4f2916

Lucky Text: #009626
Unlucky Text: #ff0036
Neutral Text: #000

## Structure

### Header

Current Date | Current Time
Current Location (Auto-detected but adjustable) | Current Weather

### Astrology Table

A table with 3 columns:
Planet Name | Planet Status | Planet Sign

#### Planet Status

The sun (labeled as Sol) should only have a status if there is a 'Solar Eclipse' or 'Lunar Eclipse'. (It should also say if it's a Partial or Total Eclipse.)

The moon (labeled as Luna) should always show the current moon phase for its status. (The options are above in the moon phases section.)

All other planets should ONLY have a status if it is currently Retrograde. If a planet is Retrograde, all text in the row should also be made red.

### Planetary Hours

A table with 2 columns:
Planetary Hour | Planet Name + Planetary Sign

### Lucky Status

Display the lucky status for the current day.
