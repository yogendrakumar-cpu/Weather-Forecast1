export interface CityResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  admin1?: string;
  country?: string;
  population?: number;
  timezone?: string;
}

export interface GeocodingResponse {
  results?: CityResult[];
  generationtime_ms?: number;
}

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
  time: string;
}

export interface DailyForecast {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weathercode: number[];
  precipitation_sum?: number[];
  windspeed_10m_max?: number[];
  uv_index_max?: number[];
  sunrise?: string[];
  sunset?: string[];
}

export interface HourlyForecastData {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  weathercode: number[];
  windspeed_10m: number[];
  precipitation_probability: number[];
  apparent_temperature?: number[];
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  elevation: number;
  current_weather: CurrentWeather;
  daily: DailyForecast;
  hourly?: HourlyForecastData;
  cityInfo: CityResult;
}

export interface WeatherConditionInfo {
  code: number;
  label: string;
  description: string;
  iconName: string;
  bgGradient: string;
  cardAccent: string;
}

export interface PlanningRecommendation {
  id: string;
  category: 'clothing' | 'protection' | 'activity' | 'general';
  title: string;
  advice: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  icon: string;
}

export interface ActivityRating {
  name: string;
  rating: 'Excellent' | 'Good' | 'Moderate' | 'Poor';
  score: number; // 1-5
  reason: string;
  icon: string;
}

export type TempUnit = 'C' | 'F';
export type WindUnit = 'kmh' | 'mph' | 'ms';
