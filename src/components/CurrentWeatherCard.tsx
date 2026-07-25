import React from 'react';
import {
  Wind,
  Droplets,
  Sun,
  Bookmark,
  BookmarkCheck,
  ArrowUp,
  ArrowDown,
  Gauge,
  Clock,
  Thermometer,
} from 'lucide-react';
import { WeatherData, TempUnit, WindUnit } from '../types/weather';
import {
  getWeatherCondition,
  formatTemp,
  formatWind,
} from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherCardProps {
  weather: WeatherData;
  tempUnit: TempUnit;
  windUnit: WindUnit;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  weather,
  tempUnit,
  windUnit,
  isFavorite,
  onToggleFavorite,
}) => {
  const { current_weather, daily, hourly, cityInfo } = weather;
  const condition = getWeatherCondition(
    current_weather.weathercode,
    current_weather.is_day
  );

  const maxTempToday = daily?.temperature_2m_max?.[0];
  const minTempToday = daily?.temperature_2m_min?.[0];
  const uvIndexMax = daily?.uv_index_max?.[0] ?? 0;
  const humidity = hourly?.relative_humidity_2m?.[0] ?? 60;
  const apparentTemp = hourly?.apparent_temperature?.[0] ?? current_weather.temperature;
  const rainSumToday = daily?.precipitation_sum?.[0] ?? 0;

  const cityName = cityInfo.name;
  const locationSubtitle = [cityInfo.admin1, cityInfo.country]
    .filter(Boolean)
    .join(', ');

  const getUvLevel = (uv: number) => {
    if (uv <= 2) return 'LOW';
    if (uv <= 5) return 'MODERATE';
    if (uv <= 7) return 'HIGH';
    if (uv <= 10) return 'VERY HIGH';
    return 'EXTREME';
  };

  return (
    <div
      id="current-weather-card"
      className="w-full max-w-4xl mx-auto editorial-card p-6 sm:p-10 border border-white/20 bg-[#0F0F0F]/80 relative overflow-hidden backdrop-blur-md rounded-sm"
    >
      {/* Top Editorial Row */}
      <div className="flex items-start justify-between relative z-10 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2 text-[10px] uppercase font-bold tracking-[0.3em] text-white/50 mb-2">
            <div className="h-[1px] w-8 bg-sky-400" />
            <span>CURRENT LOCATION OBSERVATION</span>
          </div>
          <h2 id="current-city-title" className="text-4xl sm:text-7xl font-light tracking-tight uppercase text-white font-sans">
            {cityName}
          </h2>
          {locationSubtitle && (
            <p className="text-sm sm:text-base font-serif italic text-white/60 tracking-widest uppercase mt-1">
              {locationSubtitle}
            </p>
          )}
          <div className="flex items-center space-x-3 text-[11px] font-mono text-white/40 uppercase tracking-widest mt-3">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>UPDATED: {new Date(current_weather.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span>—</span>
            <span>{weather.timezone}</span>
          </div>
        </div>

        {/* Favorite toggle button */}
        <button
          id="toggle-favorite-city-btn"
          type="button"
          onClick={onToggleFavorite}
          className={`px-3 py-1.5 border rounded-sm transition-all flex items-center space-x-2 text-xs font-mono uppercase tracking-widest ${
            isFavorite
              ? 'bg-amber-400/20 border-amber-400 text-amber-300'
              : 'bg-white/5 border-white/20 text-white/70 hover:text-white hover:border-sky-400'
          }`}
        >
          {isFavorite ? (
            <>
              <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">SAVED</span>
            </>
          ) : (
            <>
              <Bookmark className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SAVE CITY</span>
            </>
          )}
        </button>
      </div>

      {/* Hero Temperature & Condition Row */}
      <div className="py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-b border-white/10 relative z-10">
        
        {/* Big Temperature Display */}
        <div className="flex items-baseline space-x-4">
          <span id="current-temperature-display" className="text-7xl sm:text-9xl font-mono font-bold text-white tracking-tighter leading-none">
            {formatTemp(current_weather.temperature, tempUnit)}
          </span>

          <div className="flex flex-col space-y-1">
            <span className="text-xs font-mono text-white/60 uppercase tracking-widest flex items-center">
              <Thermometer className="w-3.5 h-3.5 mr-1 text-sky-400" />
              FEELS LIKE {formatTemp(apparentTemp, tempUnit)}
            </span>
            <div className="flex items-center space-x-3 text-xs font-mono uppercase tracking-widest text-white/80 pt-1">
              <span className="flex items-center text-sky-400">
                <ArrowUp className="w-3 h-3 mr-0.5" /> HIGH: {formatTemp(maxTempToday, tempUnit)}
              </span>
              <span className="flex items-center text-white/50">
                <ArrowDown className="w-3 h-3 mr-0.5" /> LOW: {formatTemp(minTempToday, tempUnit)}
              </span>
            </div>
          </div>
        </div>

        {/* Condition Box */}
        <div className="flex items-center space-x-4 bg-white/5 p-4 border border-white/20 rounded-sm self-stretch md:self-auto">
          <div className="p-3 bg-white/5 border border-white/10 rounded-sm text-sky-400 shrink-0">
            <WeatherIcon code={current_weather.weathercode} isDay={current_weather.is_day} className="w-8 h-8" />
          </div>
          <div>
            <span id="current-weather-condition-label" className="text-xl font-serif italic text-white block uppercase">
              {condition.label}
            </span>
            <p className="text-xs text-white/60 max-w-[220px] font-sans mt-0.5">
              {condition.description}
            </p>
          </div>
        </div>

      </div>

      {/* Grid of Weather Metrics */}
      <div id="weather-metrics-grid" className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 relative z-10">
        
        <div className="bg-white/5 p-4 border border-white/20 rounded-sm">
          <div className="flex items-center space-x-2 text-sky-400 mb-1">
            <Wind className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">WIND VELOCITY</span>
          </div>
          <span className="text-lg font-mono font-bold text-white block">
            {formatWind(current_weather.windspeed, windUnit)}
          </span>
        </div>

        <div className="bg-white/5 p-4 border border-white/20 rounded-sm">
          <div className="flex items-center space-x-2 text-sky-400 mb-1">
            <Droplets className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">HUMIDITY</span>
          </div>
          <span className="text-lg font-mono font-bold text-white block">
            {humidity}%
          </span>
        </div>

        <div className="bg-white/5 p-4 border border-white/20 rounded-sm">
          <div className="flex items-center space-x-2 text-sky-400 mb-1">
            <Sun className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">UV INDEX</span>
          </div>
          <span className="text-lg font-mono font-bold text-white block">
            {uvIndexMax.toFixed(1)} <span className="text-xs text-sky-400 font-normal">({getUvLevel(uvIndexMax)})</span>
          </span>
        </div>

        <div className="bg-white/5 p-4 border border-white/20 rounded-sm">
          <div className="flex items-center space-x-2 text-sky-400 mb-1">
            <Gauge className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">PRECIPITATION</span>
          </div>
          <span className="text-lg font-mono font-bold text-white block">
            {rainSumToday} MM
          </span>
        </div>

      </div>
    </div>
  );
};

