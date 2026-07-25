import { WeatherConditionInfo, PlanningRecommendation, ActivityRating, TempUnit, WindUnit } from '../types/weather';

/**
 * Converts Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return Math.round((celsius * 9) / 5 + 32);
}

/**
 * Formats temperature according to selected unit
 */
export function formatTemp(temp: number | undefined | null, unit: TempUnit): string {
  if (temp === undefined || temp === null || isNaN(temp)) return '--';
  const rounded = Math.round(temp);
  if (unit === 'F') {
    return `${celsiusToFahrenheit(rounded)}°F`;
  }
  return `${rounded}°C`;
}

/**
 * Formats wind speed
 */
export function formatWind(speedKmh: number, unit: WindUnit): string {
  if (unit === 'mph') {
    return `${Math.round(speedKmh * 0.621371)} mph`;
  }
  if (unit === 'ms') {
    return `${(speedKmh / 3.6).toFixed(1)} m/s`;
  }
  return `${Math.round(speedKmh)} km/h`;
}

/**
 * Map WMO Weather Interpretation Codes (WW)
 * https://open-meteo.com/en/docs
 */
export function getWeatherCondition(code: number, isDay: number = 1): WeatherConditionInfo {
  switch (code) {
    case 0:
      return {
        code,
        label: isDay ? 'Clear Sky' : 'Clear Night',
        description: isDay ? 'Bright and sunny conditions' : 'Clear starlit night skies',
        iconName: isDay ? 'Sun' : 'Moon',
        bgGradient: isDay ? 'from-amber-500/20 via-sky-500/10 to-blue-600/10' : 'from-indigo-900/30 via-slate-900/20 to-zinc-900/10',
        cardAccent: 'border-amber-400/40 text-amber-500',
      };
    case 1:
      return {
        code,
        label: 'Mainly Clear',
        description: 'Mostly sunny with occasional passing light clouds',
        iconName: isDay ? 'SunMedium' : 'Moon',
        bgGradient: 'from-amber-400/15 via-sky-400/10 to-blue-500/10',
        cardAccent: 'border-amber-300/40 text-amber-500',
      };
    case 2:
      return {
        code,
        label: 'Partly Cloudy',
        description: 'A mix of sun and scattered cloud patches',
        iconName: 'CloudSun',
        bgGradient: 'from-sky-400/20 via-slate-300/15 to-indigo-500/10',
        cardAccent: 'border-sky-400/40 text-sky-500',
      };
    case 3:
      return {
        code,
        label: 'Overcast',
        description: 'Thick cloud cover spanning across the sky',
        iconName: 'Cloud',
        bgGradient: 'from-slate-500/20 via-gray-400/15 to-slate-600/10',
        cardAccent: 'border-slate-400/40 text-slate-400',
      };
    case 45:
    case 48:
      return {
        code,
        label: 'Foggy & Misty',
        description: 'Dense fog reducing visibility',
        iconName: 'CloudFog',
        bgGradient: 'from-teal-800/20 via-slate-500/15 to-zinc-600/10',
        cardAccent: 'border-teal-400/40 text-teal-400',
      };
    case 51:
    case 53:
    case 55:
      return {
        code,
        label: 'Drizzle',
        description: 'Light misty raindrops continuous or intermittent',
        iconName: 'CloudDrizzle',
        bgGradient: 'from-blue-600/20 via-cyan-500/15 to-slate-600/10',
        cardAccent: 'border-blue-400/40 text-blue-400',
      };
    case 56:
    case 57:
      return {
        code,
        label: 'Freezing Drizzle',
        description: 'Sub-zero temperatures with fine icy drizzle',
        iconName: 'CloudSnow',
        bgGradient: 'from-cyan-600/20 via-sky-300/15 to-slate-700/10',
        cardAccent: 'border-cyan-300/40 text-cyan-300',
      };
    case 61:
    case 63:
      return {
        code,
        label: 'Rain',
        description: 'Moderate steady rainfall occurring',
        iconName: 'CloudRain',
        bgGradient: 'from-blue-700/25 via-indigo-600/15 to-slate-800/10',
        cardAccent: 'border-blue-500/40 text-blue-500',
      };
    case 65:
      return {
        code,
        label: 'Heavy Rain',
        description: 'Torrential downpour with high precipitation volume',
        iconName: 'CloudRain',
        bgGradient: 'from-blue-900/30 via-indigo-800/20 to-slate-900/15',
        cardAccent: 'border-blue-600/50 text-blue-600',
      };
    case 66:
    case 67:
      return {
        code,
        label: 'Freezing Rain',
        description: 'Freezing rain forming hazardous glaze icy surfaces',
        iconName: 'CloudSnow',
        bgGradient: 'from-cyan-700/25 via-indigo-900/20 to-slate-800/15',
        cardAccent: 'border-cyan-400/40 text-cyan-400',
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        code,
        label: 'Snowfall',
        description: 'Snow flakes accumulation on ground',
        iconName: 'Snowflake',
        bgGradient: 'from-sky-300/20 via-indigo-200/15 to-slate-500/10',
        cardAccent: 'border-sky-300/50 text-sky-400',
      };
    case 80:
    case 81:
    case 82:
      return {
        code,
        label: 'Rain Showers',
        description: 'Passing rain showers with sudden intensity changes',
        iconName: 'CloudRain',
        bgGradient: 'from-blue-600/25 via-sky-600/15 to-slate-700/10',
        cardAccent: 'border-blue-400/40 text-blue-400',
      };
    case 85:
    case 86:
      return {
        code,
        label: 'Snow Showers',
        description: 'Flurries and sudden snow squalls',
        iconName: 'Snowflake',
        bgGradient: 'from-cyan-500/20 via-indigo-400/15 to-slate-700/10',
        cardAccent: 'border-cyan-300/40 text-cyan-300',
      };
    case 95:
      return {
        code,
        label: 'Thunderstorm',
        description: 'Electrical storm activity with lightning flashes',
        iconName: 'CloudLightning',
        bgGradient: 'from-purple-900/30 via-violet-800/20 to-slate-900/15',
        cardAccent: 'border-purple-500/50 text-purple-400',
      };
    case 96:
    case 99:
      return {
        code,
        label: 'Severe Thunderstorm & Hail',
        description: 'Intense thunderstorm accompanied by hail ice pellets',
        iconName: 'CloudLightning',
        bgGradient: 'from-purple-950/40 via-red-950/20 to-slate-900/20',
        cardAccent: 'border-red-500/50 text-red-400',
      };
    default:
      return {
        code,
        label: 'Variable Weather',
        description: 'Changing local meteorological conditions',
        iconName: 'Cloud',
        bgGradient: 'from-sky-500/15 via-slate-400/10 to-indigo-500/10',
        cardAccent: 'border-sky-400/40 text-sky-400',
      };
  }
}

/**
 * Generate actionable planning recommendations based on current weather parameters
 */
export function generateRecommendations(
  weatherCode: number,
  temperature: number,
  windSpeed: number,
  uvIndex: number = 3,
  rainProb: number = 0
): { mainAdvice: string; recommendations: PlanningRecommendation[] } {
  const recommendations: PlanningRecommendation[] = [];
  let mainAdvice = "Fair weather conditions today. Enjoy your day outdoors!";

  const isRainy = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(weatherCode) || rainProb >= 40;
  const isSnowy = [71, 73, 75, 77, 85, 86].includes(weatherCode);
  const isStormy = [95, 96, 99].includes(weatherCode);
  const isClear = [0, 1].includes(weatherCode);

  // Set Main Summary Headline
  if (isStormy) {
    mainAdvice = "Severe weather notice! Stay indoors and secure loose items.";
  } else if (isRainy) {
    mainAdvice = "Looks like rain, bring an umbrella!";
  } else if (isSnowy) {
    mainAdvice = "Snowy conditions ahead! Bundle up in warm layers and watch for ice.";
  } else if (temperature < 5) {
    mainAdvice = "Freezing temperatures today! Dress heavily in thermals and warm boots.";
  } else if (uvIndex >= 6 || (isClear && temperature > 22)) {
    mainAdvice = "Clear skies and high UV, don't forget sunscreen!";
  } else if (windSpeed > 35) {
    mainAdvice = "Breezy conditions today! Secure loose light gear outdoors.";
  }

  // 1. Rain / Water protection
  if (isRainy) {
    recommendations.push({
      id: 'rain-gear',
      category: 'protection',
      title: 'Umbrella & Raincoat Required',
      advice: 'Precipitation expected. Carry a waterproof umbrella or wear a rain shell jacket.',
      type: 'warning',
      icon: 'Umbrella',
    });
  }

  // 2. UV / Sun protection
  if (uvIndex >= 6) {
    recommendations.push({
      id: 'uv-high',
      category: 'protection',
      title: 'High UV Index (SPF 30+)',
      advice: `UV index peaks around ${uvIndex.toFixed(1)}. Apply SPF 30+ sunscreen, wear polarized sunglasses & a wide brim hat.`,
      type: 'alert',
      icon: 'Sun',
    });
  } else if (uvIndex >= 3 && isClear) {
    recommendations.push({
      id: 'uv-moderate',
      category: 'protection',
      title: 'Moderate Sun Exposure',
      advice: 'Good idea to apply sunscreen if spending extended hours outdoors.',
      type: 'info',
      icon: 'SunMedium',
    });
  }

  // 3. Clothing Suggestions
  if (temperature <= 0) {
    recommendations.push({
      id: 'cloth-freezing',
      category: 'clothing',
      title: 'Heavy Winter Thermal Gear',
      advice: 'Freezing weather! Wear insulated parkas, wool gloves, thick scarf, and thermal base layers.',
      type: 'alert',
      icon: 'Shirt',
    });
  } else if (temperature <= 12) {
    recommendations.push({
      id: 'cloth-cold',
      category: 'clothing',
      title: 'Warm Jacket & Sweater',
      advice: 'Chilly weather. A fleece or insulated jacket over long sleeves is ideal.',
      type: 'info',
      icon: 'Shirt',
    });
  } else if (temperature <= 22) {
    recommendations.push({
      id: 'cloth-mild',
      category: 'clothing',
      title: 'Light Layering',
      advice: 'Comfortable mild weather. Long sleeves or a light jacket/cardigan work great.',
      type: 'success',
      icon: 'Shirt',
    });
  } else {
    recommendations.push({
      id: 'cloth-hot',
      category: 'clothing',
      title: 'Light & Breathable Clothing',
      advice: 'Warm weather! Opt for lightweight cotton/linen attire and stay well hydrated.',
      type: 'success',
      icon: 'Shirt',
    });
  }

  // 4. Wind Advice
  if (windSpeed >= 30) {
    recommendations.push({
      id: 'wind-heavy',
      category: 'general',
      title: 'Strong Wind Gusts',
      advice: `Wind speeds reaching ${Math.round(windSpeed)} km/h. Windbreaker jacket recommended. Take care when cycling.`,
      type: 'warning',
      icon: 'Wind',
    });
  }

  return { mainAdvice, recommendations };
}

/**
 * Generate ratings for popular outdoor activities
 */
export function generateActivityRatings(
  weatherCode: number,
  temperature: number,
  windSpeed: number,
  rainProb: number = 0
): ActivityRating[] {
  const isRainy = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(weatherCode) || rainProb > 30;
  const isClear = [0, 1].includes(weatherCode);

  // Running
  let runScore = 5;
  let runReason = "Ideal temperature and comfortable conditions.";
  if (isRainy) {
    runScore = 1;
    runReason = "Wet ground and rainfall make running slippery.";
  } else if (temperature > 30) {
    runScore = 2;
    runReason = "High heat index. Run in early morning or late evening.";
  } else if (temperature < 2) {
    runScore = 2;
    runReason = "Cold air; wear thermal running gear and warm up thoroughly.";
  } else if (windSpeed > 30) {
    runScore = 3;
    runReason = "Strong wind resistance expected.";
  }

  // Cycling
  let cycleScore = 5;
  let cycleReason = "Great visibility and smooth riding weather.";
  if (isRainy) {
    cycleScore = 1;
    cycleReason = "Slippery roads and reduced brake effectiveness.";
  } else if (windSpeed > 35) {
    cycleScore = 1;
    cycleReason = "Dangerous crosswinds for bicycling.";
  } else if (temperature < 5) {
    cycleScore = 2;
    cycleReason = "Cold wind chill; protect hands and ears.";
  }

  // Outdoor Dining
  let diningScore = 5;
  let diningReason = "Pleasant atmosphere for outdoor seating.";
  if (isRainy || weatherCode >= 50) {
    diningScore = 1;
    diningReason = "Rainfall makes outdoor patio dining unviable.";
  } else if (temperature < 14) {
    diningScore = 2;
    diningReason = "Crisp air; heated patio lamps required.";
  } else if (temperature > 32) {
    diningScore = 2;
    diningReason = "Too warm for direct sun seating; find shaded areas.";
  }

  // Hiking
  let hikeScore = 5;
  let hikeReason = "Clear trails and clear atmospheric visibility.";
  if (isRainy) {
    hikeScore = 1;
    hikeReason = "Muddy trails and elevated stream crossing hazard.";
  } else if (temperature < 0) {
    hikeScore = 2;
    hikeReason = "Icy trail conditions; microspikes recommended.";
  }

  // Stargazing
  let starScore = 5;
  let starReason = "Clear night skies with minimal cloud interference.";
  if (!isClear) {
    starScore = 1;
    starReason = "Cloud cover obstructs celestial visibility.";
  }

  const scoreToRating = (s: number): ActivityRating['rating'] => {
    if (s >= 5) return 'Excellent';
    if (s >= 4) return 'Good';
    if (s >= 3) return 'Moderate';
    return 'Poor';
  };

  return [
    { name: 'Running & Jogging', rating: scoreToRating(runScore), score: runScore, reason: runReason, icon: 'Footprints' },
    { name: 'Cycling', rating: scoreToRating(cycleScore), score: cycleScore, reason: cycleReason, icon: 'Bike' },
    { name: 'Outdoor Patio Dining', rating: scoreToRating(diningScore), score: diningScore, reason: diningReason, icon: 'Sparkles' },
    { name: 'Hiking & Trails', rating: scoreToRating(hikeScore), score: hikeScore, reason: hikeReason, icon: 'Compass' },
    { name: 'Night Stargazing', rating: scoreToRating(starScore), score: starScore, reason: starReason, icon: 'Star' },
  ];
}

/**
 * Format a day date string (e.g., "2026-07-25" -> "Saturday, Jul 25")
 */
export function formatDayName(dateStr: string, isShort: boolean = false): string {
  try {
    const date = new Date(dateStr + 'T00:00:00');
    if (isNaN(date.getTime())) return dateStr;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(dateStr + 'T00:00:00');

    const diffDays = Math.round((targetDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (diffDays === 0) return isShort ? 'Today' : 'Today';
    if (diffDays === 1) return isShort ? 'Tomorrow' : 'Tomorrow';

    if (isShort) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

/**
 * Format time string (e.g. "2026-07-25T14:00" -> "2:00 PM")
 */
export function formatHourTime(timeStr: string): string {
  try {
    const date = new Date(timeStr);
    if (isNaN(date.getTime())) return timeStr.split('T')[1] || timeStr;
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  } catch {
    return timeStr;
  }
}
