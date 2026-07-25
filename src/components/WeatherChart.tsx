import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { DailyForecast, TempUnit } from '../types/weather';
import { celsiusToFahrenheit, formatDayName } from '../utils/weatherUtils';

interface WeatherChartProps {
  daily: DailyForecast;
  tempUnit: TempUnit;
}

export const WeatherChart: React.FC<WeatherChartProps> = ({ daily, tempUnit }) => {
  if (!daily || !daily.time) return null;

  const data = daily.time.map((timeStr, idx) => {
    const rawMax = daily.temperature_2m_max?.[idx] ?? 0;
    const rawMin = daily.temperature_2m_min?.[idx] ?? 0;

    const maxVal = tempUnit === 'F' ? celsiusToFahrenheit(rawMax) : Math.round(rawMax);
    const minVal = tempUnit === 'F' ? celsiusToFahrenheit(rawMin) : Math.round(rawMin);

    return {
      day: formatDayName(timeStr, true).toUpperCase(),
      fullDate: formatDayName(timeStr, false),
      High: maxVal,
      Low: minVal,
      unit: tempUnit === 'F' ? '°F' : '°C',
    };
  });

  return (
    <div id="temperature-chart-container" className="w-full h-64 sm:h-72 my-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffffff" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#ffffff" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="2 2" stroke="#ffffff" opacity={0.1} />
          
          <XAxis
            dataKey="day"
            stroke="#ffffff"
            opacity={0.4}
            fontSize={10}
            fontFamily="monospace"
            tickLine={false}
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
          />
          
          <YAxis
            stroke="#ffffff"
            opacity={0.4}
            fontSize={10}
            fontFamily="monospace"
            tickLine={false}
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            unit={`°${tempUnit}`}
          />

          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const dataPoint = payload[0].payload;
                return (
                  <div className="bg-[#0f0f0f] border border-white/20 p-3 rounded-none shadow-2xl text-xs space-y-1 font-mono">
                    <p className="font-bold text-white uppercase border-b border-white/10 pb-1">
                      {dataPoint.fullDate}
                    </p>
                    <p className="text-sky-400 font-semibold flex items-center justify-between space-x-3">
                      <span>HIGH TEMP:</span>
                      <span className="text-sm">{dataPoint.High}{dataPoint.unit}</span>
                    </p>
                    <p className="text-white/70 font-semibold flex items-center justify-between space-x-3">
                      <span>LOW TEMP:</span>
                      <span className="text-sm">{dataPoint.Low}{dataPoint.unit}</span>
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />

          <Area
            type="monotone"
            dataKey="High"
            stroke="#38bdf8"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorHigh)"
            name="High Temp"
          />
          <Area
            type="monotone"
            dataKey="Low"
            stroke="#ffffff"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            fillOpacity={1}
            fill="url(#colorLow)"
            name="Low Temp"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

