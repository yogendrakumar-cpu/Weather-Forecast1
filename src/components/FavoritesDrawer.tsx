import React from 'react';
import { Bookmark, Trash2, X, MapPin, ChevronRight, Building2 } from 'lucide-react';
import { CityResult } from '../types/weather';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteCities: CityResult[];
  onSelectCity: (city: CityResult) => void;
  onRemoveFavorite: (cityId: number) => void;
  onClearAll: () => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favoriteCities,
  onSelectCity,
  onRemoveFavorite,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div id="favorites-drawer-overlay" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end">
      <div id="favorites-drawer-content" className="w-full max-w-md bg-[#0F0F0F] border-l border-white/20 h-full p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between border-b border-white/20 pb-4 mb-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/50 block mb-1">
                SAVED LOCATIONS ARCHIVE
              </span>
              <h3 className="text-2xl font-serif italic text-white tracking-tight">
                Favorite Cities
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 border border-white/20 rounded-sm bg-white/5 text-white/70 hover:text-white hover:border-sky-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List of Saved Cities */}
          {favoriteCities.length === 0 ? (
            <div className="text-center py-12 px-4 bg-white/5 rounded-sm border border-white/20 my-4">
              <Building2 className="w-8 h-8 text-white/30 mx-auto mb-3" />
              <p className="text-xs font-mono uppercase tracking-widest text-white/80">No saved locations</p>
              <p className="text-xs text-white/50 mt-2 font-sans leading-relaxed">
                Click "SAVE CITY" on any weather observation card to build your personalized archive.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
              {favoriteCities.map((city) => (
                <div
                  key={city.id}
                  className="bg-white/5 hover:bg-white/10 border border-white/20 hover:border-sky-400 rounded-sm p-4 flex items-center justify-between group transition-all"
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCity(city);
                      onClose();
                    }}
                    className="flex items-center space-x-3 text-left flex-1"
                  >
                    <MapPin className="w-4 h-4 text-sky-400" />
                    <div>
                      <p className="text-sm font-mono font-bold uppercase tracking-wider text-white group-hover:text-sky-400 transition-colors">
                        {city.name}
                      </p>
                      <p className="text-xs text-white/50 font-mono">
                        {[city.admin1, city.country].filter(Boolean).join(' — ')}
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => onRemoveFavorite(city.id)}
                      className="p-1.5 text-white/40 hover:text-rose-400 transition-colors"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {favoriteCities.length > 0 && (
          <div className="border-t border-white/20 pt-4 flex items-center justify-between font-mono text-xs">
            <span className="text-white/50 uppercase tracking-widest">
              {favoriteCities.length} {favoriteCities.length === 1 ? 'LOCATION' : 'LOCATIONS'}
            </span>
            <button
              type="button"
              onClick={onClearAll}
              className="text-rose-400 hover:text-rose-300 uppercase tracking-widest flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>CLEAR ALL</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

