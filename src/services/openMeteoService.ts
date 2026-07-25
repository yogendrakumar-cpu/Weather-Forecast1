import { CityResult, GeocodingResponse, WeatherData } from '../types/weather';

export class CityNotFoundError extends Error {
  constructor(cityName: string) {
    super(`City "${cityName}" not found. Please try another search.`);
    this.name = 'CityNotFoundError';
  }
}

export class WeatherFetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WeatherFetchError';
  }
}

/**
 * Searches for cities using the Open-Meteo Geocoding API
 * https://geocoding-api.open-meteo.com/v1/search?name=CITY_NAME
 */
export async function searchCities(cityName: string, count: number = 8): Promise<CityResult[]> {
  const trimmed = cityName.trim();
  if (!trimmed) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=${count}&language=en&format=json`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new WeatherFetchError(`Geocoding server responded with status ${res.status}`);
    }
    const data: GeocodingResponse = await res.json();

    if (!data.results || data.results.length === 0) {
      return [];
    }

    return data.results;
  } catch (err) {
    if (err instanceof WeatherFetchError) throw err;
    throw new WeatherFetchError('Failed to connect to the geocoding service. Please check your network connection.');
  }
}

/**
 * Fetches current weather & 7-day forecast for given lat & lon
 * https://api.open-meteo.com/v1/forecast?latitude=LAT&longitude=LON...
 */
export async function getWeatherForecast(
  latitude: number,
  longitude: number,
  cityInfo: CityResult
): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum,windspeed_10m_max,uv_index_max,sunrise,sunset&hourly=temperature_2m,relative_humidity_2m,weathercode,windspeed_10m,precipitation_probability,apparent_temperature&timezone=auto`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new WeatherFetchError(`Weather service responded with status ${res.status}`);
    }

    const data = await res.json();

    if (!data.current_weather || !data.daily) {
      throw new WeatherFetchError('Incomplete weather data received from Open-Meteo service.');
    }

    return {
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone || 'auto',
      elevation: data.elevation || 0,
      current_weather: data.current_weather,
      daily: data.daily,
      hourly: data.hourly,
      cityInfo,
    };
  } catch (err) {
    if (err instanceof WeatherFetchError) throw err;
    throw new WeatherFetchError('Unable to retrieve weather forecast data.');
  }
}

/**
 * Main search function: searches city name, takes top result, and fetches forecast
 * Throws CityNotFoundError if city does not exist
 */
export async function searchAndFetchWeather(cityName: string): Promise<WeatherData> {
  const cities = await searchCities(cityName, 1);
  if (!cities || cities.length === 0) {
    throw new CityNotFoundError(cityName);
  }

  const topCity = cities[0];
  return getWeatherForecast(topCity.latitude, topCity.longitude, topCity);
}

/**
 * Gets weather by precise geolocation lat/lon
 */
export async function getWeatherByCoords(latitude: number, longitude: number): Promise<WeatherData> {
  // Create a synthetic city result or try reverse geocoding
  let cityInfo: CityResult = {
    id: Date.now(),
    name: 'Your Location',
    latitude,
    longitude,
    country: 'Local Coordinates',
  };

  try {
    // Attempt reverse lookup with open-meteo if possible or bigdatacloud/nominatim
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum,windspeed_10m_max,uv_index_max,sunrise,sunset&hourly=temperature_2m,relative_humidity_2m,weathercode,windspeed_10m,precipitation_probability,apparent_temperature&timezone=auto`);
    
    if (res.ok) {
      const data = await res.json();
      // Try to find city name from geocoding with rounded lat/lon or timezone
      if (data.timezone) {
        const tzParts = data.timezone.split('/');
        if (tzParts.length > 1) {
          cityInfo.name = tzParts[tzParts.length - 1].replace(/_/g, ' ');
        }
      }

      return {
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone || 'auto',
        elevation: data.elevation || 0,
        current_weather: data.current_weather,
        daily: data.daily,
        hourly: data.hourly,
        cityInfo,
      };
    }
  } catch {
    // Fall back to default fetch
  }

  return getWeatherForecast(latitude, longitude, cityInfo);
}
