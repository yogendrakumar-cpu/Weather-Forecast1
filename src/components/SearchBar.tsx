import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Navigation, X, Building2 } from 'lucide-react';
import { CityResult } from '../types/weather';
import { searchCities } from '../services/openMeteoService';

interface SearchBarProps {
  onSearchCity: (cityName: string) => void;
  onSelectCityResult: (city: CityResult) => void;
  onUseCurrentLocation: () => void;
  isLoading: boolean;
}

const POPULAR_CITIES = [
  { name: 'Tokyo', country: 'Japan' },
  { name: 'New York', country: 'United States' },
  { name: 'London', country: 'United Kingdom' },
  { name: 'Paris', country: 'France' },
  { name: 'Sydney', country: 'Australia' },
  { name: 'Copenhagen', country: 'Denmark' },
  { name: 'Dubai', country: 'UAE' },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearchCity,
  onSelectCityResult,
  onUseCurrentLocation,
  isLoading,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CityResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const results = await searchCities(trimmed, 6);
        setSuggestions(results);
        setShowDropdown(results.length > 0);
      } catch {
        setSuggestions([]);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setShowDropdown(false);
    onSearchCity(query.trim());
  };

  const handleSelectSuggestion = (city: CityResult) => {
    setQuery(`${city.name}${city.country ? `, ${city.country}` : ''}`);
    setShowDropdown(false);
    onSelectCityResult(city);
  };

  return (
    <div id="search-section" className="w-full max-w-4xl mx-auto my-4 sm:my-6 px-4">
      <div className="relative" ref={dropdownRef}>
        
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <div className="relative w-full flex items-center border-b border-white/40 focus-within:border-sky-400 transition-colors pb-1">
            
            <Search className="w-4 h-4 text-white/50 mr-3 shrink-0" />

            <input
              id="city-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
              placeholder="SEARCH CITY LOCATION..."
              autoComplete="off"
              className="w-full bg-transparent py-2.5 px-1 text-sm sm:text-base font-mono tracking-widest text-white uppercase focus:outline-none placeholder:text-white/20"
            />

            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSuggestions([]);
                  setShowDropdown(false);
                }}
                className="text-white/40 hover:text-white p-1 transition-colors mr-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              id="city-search-submit-btn"
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-4 py-2 bg-sky-400 hover:bg-sky-300 text-black font-mono font-bold text-xs uppercase tracking-widest rounded-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1.5 shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <span>SEARCH</span>
              )}
            </button>
          </div>
        </form>

        {showDropdown && suggestions.length > 0 && (
          <div id="city-suggestions-dropdown" className="absolute top-full left-0 right-0 mt-2 bg-[#0F0F0F] border border-white/20 rounded-sm shadow-2xl z-50 overflow-hidden divide-y divide-white/10">
            {suggestions.map((city) => (
              <button
                key={`${city.id}-${city.latitude}-${city.longitude}`}
                type="button"
                onClick={() => handleSelectSuggestion(city)}
                className="w-full text-left px-4 py-3 hover:bg-white/5 hover:text-sky-400 transition-colors flex items-center justify-between text-white/90 text-sm group"
              >
                <div className="flex items-center space-x-3">
                  <Building2 className="w-4 h-4 text-sky-400" />
                  <div>
                    <p className="font-semibold uppercase tracking-wider group-hover:text-sky-400">
                      {city.name}
                    </p>
                    <p className="text-xs text-white/40 font-mono">
                      {[city.admin1, city.country].filter(Boolean).join(' — ')}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-white/30 font-mono">
                  {city.latitude.toFixed(2)}°N, {city.longitude.toFixed(2)}°E
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div id="quick-location-bar" className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        <button
          id="use-geolocation-btn"
          type="button"
          onClick={onUseCurrentLocation}
          disabled={isLoading}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/20 text-sky-400 font-mono text-[10px] uppercase tracking-widest rounded-sm transition-all"
        >
          <Navigation className="w-3 h-3 text-sky-400" />
          <span>USE GPS LOCATION</span>
        </button>

        <div id="popular-city-chips" className="flex items-center space-x-2 overflow-x-auto py-1 no-scrollbar">
          <span className="text-white/40 font-mono uppercase text-[10px] tracking-widest hidden sm:inline">QUICK SEARCH:</span>
          {POPULAR_CITIES.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => {
                setQuery(c.name);
                onSearchCity(c.name);
              }}
              className="px-2.5 py-1 bg-white/5 hover:bg-sky-400/10 border border-white/10 hover:border-sky-400/40 text-white/70 hover:text-sky-300 font-mono text-[10px] uppercase tracking-widest rounded-sm whitespace-nowrap transition-all"
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

