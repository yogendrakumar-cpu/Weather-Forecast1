import React from 'react';
import { CloudRain } from 'lucide-react';
import { HourlyForecastData, TempUnit } from '../types/weather';
import { formatHourTime, formatTemp } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastProps {
  hourly?: HourlyForecastData;
  tempUnit: TempUnit;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly, tempUnit }) => {
  if (!hourly || !hourly.time || hourly.time.length === 0) return null;

  const next24 = hourly.time.slice(0, 24);

  return (
    <section id="hourly-forecast-section" className="w-full max-w-4xl mx-auto my-6 px-4">
      <div className="editorial-card border border-white/20 p-6 sm:p-8 rounded-sm bg-[#0F0F0F]/80 backdrop-blur-md">
        
        {/* Title */}
        <div className="mb-4 pb-4 border-b border-white/10">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/50 block mb-1">
            24-HOUR CHRONOLOGICAL SYNOPIS
          </span>
          <h3 className="text-2xl font-serif italic text-white tracking-tight">
            Hourly Trajectory
          </h3>
        </div>

        {/* Horizontal Slider */}
        <div className="flex space-x-3 overflow-x-auto pb-3 pt-2">
          {next24.map((timeStr, idx) => {
            const temp = hourly.temperature_2m?.[idx];
            const code = hourly.weathercode?.[idx] ?? 0;
            const rainProb = hourly.precipitation_probability?.[idx] ?? 0;
            const hourDate = new Date(timeStr);
            const isDayTime = hourDate.getHours() >= 6 && hourDate.getHours() <= 19 ? 1 : 0;

            return (
              <div
                key={timeStr}
                className="bg-white/5 hover:bg-white/10 border border-white/20 hover:border-sky-400 rounded-sm p-3 min-w-[84px] sm:min-w-[92px] flex flex-col items-center justify-between text-center shrink-0 transition-all font-mono group"
              >
                <span className="text-[11px] font-bold text-white/80 group-hover:text-sky-400 uppercase">
                  {formatHourTime(timeStr)}
                </span>

                <div className="my-2 p-1.5 bg-white/5 border border-white/10 rounded-sm text-sky-400">
                  <WeatherIcon code={code} isDay={isDayTime} className="w-5 h-5" />
                </div>

                <span className="text-sm font-bold text-white">
                  {formatTemp(temp, tempUnit)}
                </span>

                {rainProb > 0 ? (
                  <div className="mt-1 flex items-center space-x-1 text-[9px] font-bold text-sky-400">
                    <CloudRain className="w-2.5 h-2.5" />
                    <span>{rainProb}%</span>
                  </div>
                ) : (
                  <span className="mt-1 text-[9px] text-white/30">0%</span>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

