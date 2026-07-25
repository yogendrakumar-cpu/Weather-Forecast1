import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Snowflake,
  SunMedium,
} from 'lucide-react';
import { getWeatherCondition } from '../utils/weatherUtils';

interface WeatherIconProps {
  code: number;
  isDay?: number;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ code, isDay = 1, className = 'w-6 h-6' }) => {
  const cond = getWeatherCondition(code, isDay);

  switch (cond.iconName) {
    case 'Sun':
      return <Sun className={`${className} text-amber-400 animate-pulse`} />;
    case 'Moon':
      return <Moon className={`${className} text-indigo-300`} />;
    case 'SunMedium':
      return <SunMedium className={`${className} text-amber-300`} />;
    case 'CloudSun':
      return <CloudSun className={`${className} text-amber-200`} />;
    case 'Cloud':
      return <Cloud className={`${className} text-slate-300`} />;
    case 'CloudFog':
      return <CloudFog className={`${className} text-teal-300`} />;
    case 'CloudDrizzle':
      return <CloudDrizzle className={`${className} text-sky-300`} />;
    case 'CloudRain':
      return <CloudRain className={`${className} text-blue-400`} />;
    case 'CloudSnow':
      return <CloudSnow className={`${className} text-cyan-200`} />;
    case 'CloudLightning':
      return <CloudLightning className={`${className} text-purple-400 animate-bounce`} />;
    case 'Snowflake':
      return <Snowflake className={`${className} text-cyan-200`} />;
    default:
      return <Cloud className={`${className} text-slate-300`} />;
  }
};
