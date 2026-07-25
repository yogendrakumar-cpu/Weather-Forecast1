import React from 'react';
import { Bookmark, Compass, Sparkles } from 'lucide-react';
import { TempUnit, WindUnit } from '../types/weather';

interface HeaderProps {
  tempUnit: TempUnit;
  onToggleTempUnit: (unit: TempUnit) => void;
  windUnit: WindUnit;
  onChangeWindUnit: (unit: WindUnit) => void;
  favoriteCount: number;
  onOpenFavorites: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  tempUnit,
  onToggleTempUnit,
  windUnit,
  onChangeWindUnit,
  favoriteCount,
  onOpenFavorites,
}) => {
  return (
    <header id="app-header" className="w-full bg-[#0F0F0F]/90 backdrop-blur-md border-b border-white/20 text-[#F0F0F0] sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        
        {/* Editorial Logo & Title */}
        <div id="brand-logo" className="flex flex-col cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-1 font-bold">
            Meteorological Intelligence v.4.0
          </span>
          <div className="flex items-baseline space-x-2">
            <h1 className="text-3xl sm:text-4xl font-serif italic leading-none tracking-tight">
              Weather<span className="text-sky-400">.</span>Intelligence
            </h1>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-widest font-mono text-sky-400 border border-sky-400/30 bg-sky-400/10">
              Open-Meteo
            </span>
          </div>
        </div>

        {/* Controls: Unit Toggles & Favorites */}
        <div id="header-controls" className="flex items-center space-x-3 self-end md:self-auto">
          
          {/* Temperature Unit Toggle */}
          <div id="temp-unit-toggle" className="bg-white/5 p-1 rounded-sm border border-white/20 flex items-center space-x-1">
            <button
              id="unit-celsius-btn"
              type="button"
              onClick={() => onToggleTempUnit('C')}
              className={`px-3 py-1 text-xs font-mono font-bold tracking-wider rounded-none transition-colors ${
                tempUnit === 'C'
                  ? 'bg-sky-400 text-black shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              °C
            </button>
            <button
              id="unit-fahrenheit-btn"
              type="button"
              onClick={() => onToggleTempUnit('F')}
              className={`px-3 py-1 text-xs font-mono font-bold tracking-wider rounded-none transition-colors ${
                tempUnit === 'F'
                  ? 'bg-sky-400 text-black shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              °F
            </button>
          </div>

          {/* Wind Unit Selector */}
          <select
            id="wind-unit-select"
            value={windUnit}
            onChange={(e) => onChangeWindUnit(e.target.value as WindUnit)}
            className="hidden sm:block bg-white/5 border border-white/20 text-white/80 text-xs font-mono tracking-wider rounded-sm px-3 py-1.5 focus:outline-none focus:border-sky-400 cursor-pointer uppercase"
          >
            <option value="kmh" className="bg-[#0f0f0f] text-white">KM/H</option>
            <option value="mph" className="bg-[#0f0f0f] text-white">MPH</option>
            <option value="ms" className="bg-[#0f0f0f] text-white">M/S</option>
          </select>

          {/* Saved Favorites Drawer Button */}
          <button
            id="open-favorites-btn"
            type="button"
            onClick={onOpenFavorites}
            className="relative px-3.5 py-1.5 rounded-sm bg-white/5 border border-white/20 text-white/80 hover:text-white hover:border-sky-400 transition-all flex items-center space-x-2 text-xs uppercase tracking-widest font-semibold"
            title="Saved Favorite Cities"
          >
            <Bookmark className={`w-3.5 h-3.5 ${favoriteCount > 0 ? 'text-amber-400 fill-amber-400/20' : ''}`} />
            <span>Saved</span>
            {favoriteCount > 0 && (
              <span className="ml-1 bg-sky-400/20 text-sky-300 border border-sky-400/30 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-none">
                {favoriteCount}
              </span>
            )}
          </button>

        </div>
      </div>
    </header>
  );
};

