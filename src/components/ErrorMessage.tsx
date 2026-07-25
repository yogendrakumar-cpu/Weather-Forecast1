import React from 'react';
import { AlertCircle, RefreshCw, MapPin } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onSearchPopularCity: (cityName: string) => void;
}

const POPULAR_SUGGESTIONS = ['Tokyo', 'London', 'New York', 'Paris', 'Sydney', 'Dubai'];

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  onSearchPopularCity,
}) => {
  return (
    <div id="error-message-card" className="w-full max-w-2xl mx-auto my-8 p-6 sm:p-8 bg-[#0F0F0F] border border-rose-500/40 rounded-sm shadow-2xl text-center">
      
      <div className="w-12 h-12 rounded-sm bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>

      <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-rose-400 block mb-1">
        SYNOPTIC DATA ERROR
      </span>

      <h3 className="text-2xl font-serif italic text-white mb-2">
        {message.includes('not found') ? 'Location Query Unresolved' : 'Weather Fetch Failure'}
      </h3>

      <p className="text-xs font-mono text-white/70 max-w-md mx-auto mb-6 leading-relaxed">
        {message}
      </p>

      <div className="bg-white/5 border border-white/20 rounded-sm p-4 max-w-lg mx-auto">
        <p className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-3">
          QUERY KNOWN METEOROLOGICAL STATIONS:
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {POPULAR_SUGGESTIONS.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => onSearchPopularCity(city)}
              className="px-3 py-1.5 bg-white/5 hover:bg-sky-400/10 border border-white/20 hover:border-sky-400 text-white/80 hover:text-sky-300 text-[10px] font-mono uppercase tracking-widest rounded-sm transition-all flex items-center space-x-1"
            >
              <MapPin className="w-3 h-3 text-sky-400" />
              <span>{city}</span>
            </button>
          ))}
        </div>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 px-5 py-2.5 bg-white/10 hover:bg-sky-400 text-white hover:text-black border border-white/20 hover:border-sky-400 text-xs font-mono uppercase tracking-widest font-bold rounded-sm transition-all inline-flex items-center space-x-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>RETRY DISPATCH</span>
        </button>
      )}

    </div>
  );
};

