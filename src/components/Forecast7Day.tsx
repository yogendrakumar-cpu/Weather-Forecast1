import React, { useState } from 'react';
import { Calendar, BarChart2, LayoutGrid, CloudRain } from 'lucide-react';
import { DailyForecast, TempUnit } from '../types/weather';
import { formatDayName, formatTemp, getWeatherCondition } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';
import { WeatherChart } from './WeatherChart';

interface Forecast7DayProps {
  daily: DailyForecast;
  tempUnit: TempUnit;
}

export const Forecast7Day: React.FC<Forecast7DayProps> = ({ daily, tempUnit }) => {
  const [viewMode, setViewMode] = useState<'cards' | 'chart'>('cards');

  if (!daily || !daily.time || daily.time.length === 0) return null;

  return (
    <section id="7day-forecast-section" className="w-full max-w-4xl mx-auto my-6 px-4">
      <div className="editorial-card border border-white/20 p-6 sm:p-8 rounded-sm bg-[#0F0F0F]/80 backdrop-blur-md">
        
        {/* Header & Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/50 block mb-1">
              7-DAY SYNOPTIC FORECAST
            </span>
            <h3 className="text-2xl font-serif italic text-white tracking-tight">
              Weekly Outlook
            </h3>
          </div>

          {/* View Toggle */}
          <div id="forecast-view-toggle" className="bg-white/5 p-1 border border-white/20 flex items-center space-x-1 self-start sm:self-auto rounded-sm">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest transition-all rounded-none ${
                viewMode === 'cards'
                  ? 'bg-sky-400 text-black'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              CARDS
            </button>
            <button
              type="button"
              onClick={() => setViewMode('chart')}
              className={`px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest transition-all rounded-none ${
                viewMode === 'chart'
                  ? 'bg-sky-400 text-black'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              TREND CHART
            </button>
          </div>
        </div>

        {/* Content based on View Mode */}
        {viewMode === 'chart' ? (
          <WeatherChart daily={daily} tempUnit={tempUnit} />
        ) : (
          <div id="daily-cards-grid" className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {daily.time.slice(0, 7).map((dateStr, idx) => {
              const maxTemp = daily.temperature_2m_max?.[idx];
              const minTemp = daily.temperature_2m_min?.[idx];
              const code = daily.weathercode?.[idx] ?? 0;
              const rainSum = daily.precipitation_sum?.[idx] ?? 0;
              const cond = getWeatherCondition(code);

              return (
                <div
                  key={dateStr}
                  className="bg-white/5 border border-white/20 hover:border-sky-400 rounded-sm p-3.5 flex flex-col justify-between items-center text-center transition-all group"
                >
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-white group-hover:text-sky-400">
                    {formatDayName(dateStr, true)}
                  </span>
                  <span className="text-[9px] font-mono text-white/40 mb-2 uppercase">
                    {new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>

                  <div className="my-2 p-2 bg-white/5 border border-white/10 rounded-sm group-hover:border-sky-400/40 text-sky-400 transition-colors">
                    <WeatherIcon code={code} className="w-6 h-6" />
                  </div>

                  <span className="text-[10px] font-sans text-white/70 line-clamp-1 mb-2 h-4 uppercase">
                    {cond.label}
                  </span>

                  <div className="w-full border-t border-white/10 pt-2 mt-1">
                    <div className="flex items-center justify-between text-xs font-mono font-bold">
                      <span className="text-sky-400">
                        {formatTemp(maxTemp, tempUnit)}
                      </span>
                      <span className="text-white/30 text-[10px]">—</span>
                      <span className="text-white/60">
                        {formatTemp(minTemp, tempUnit)}
                      </span>
                    </div>

                    {rainSum > 0 && (
                      <div className="mt-1 flex items-center justify-center space-x-1 text-[9px] font-mono text-sky-400">
                        <CloudRain className="w-2.5 h-2.5" />
                        <span>{rainSum}MM</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

