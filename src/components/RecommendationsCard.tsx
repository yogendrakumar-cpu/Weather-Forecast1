import React, { useState } from 'react';
import {
  Umbrella,
  Sun,
  SunMedium,
  Shirt,
  Wind,
  Footprints,
  Bike,
  Sparkles,
  Compass,
  Star,
  Info,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { WeatherData } from '../types/weather';
import { generateRecommendations, generateActivityRatings } from '../utils/weatherUtils';

interface RecommendationsCardProps {
  weather: WeatherData;
}

export const RecommendationsCard: React.FC<RecommendationsCardProps> = ({ weather }) => {
  const [showActivities, setShowActivities] = useState(true);

  const { current_weather, daily, hourly } = weather;
  const uvIndexMax = daily?.uv_index_max?.[0] ?? 3;
  const rainProbMax = hourly?.precipitation_probability?.[0] ?? 0;

  const { mainAdvice, recommendations } = generateRecommendations(
    current_weather.weathercode,
    current_weather.temperature,
    current_weather.windspeed,
    uvIndexMax,
    rainProbMax
  );

  const activityRatings = generateActivityRatings(
    current_weather.weathercode,
    current_weather.temperature,
    current_weather.windspeed,
    rainProbMax
  );

  const renderAdviceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Umbrella':
        return <Umbrella className="w-4 h-4 text-sky-400" />;
      case 'Sun':
        return <Sun className="w-4 h-4 text-sky-400" />;
      case 'SunMedium':
        return <SunMedium className="w-4 h-4 text-sky-400" />;
      case 'Shirt':
        return <Shirt className="w-4 h-4 text-sky-400" />;
      case 'Wind':
        return <Wind className="w-4 h-4 text-sky-400" />;
      default:
        return <Info className="w-4 h-4 text-sky-400" />;
    }
  };

  const renderActivityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints':
        return <Footprints className="w-3.5 h-3.5 text-sky-400" />;
      case 'Bike':
        return <Bike className="w-3.5 h-3.5 text-sky-400" />;
      case 'Sparkles':
        return <Sparkles className="w-3.5 h-3.5 text-sky-400" />;
      case 'Compass':
        return <Compass className="w-3.5 h-3.5 text-sky-400" />;
      case 'Star':
        return <Star className="w-3.5 h-3.5 text-sky-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-sky-400" />;
    }
  };

  const getRatingBadgeClass = (rating: string) => {
    switch (rating) {
      case 'Excellent':
        return 'bg-sky-400 text-black border-sky-400';
      case 'Good':
        return 'bg-white/20 text-white border-white/30';
      case 'Moderate':
        return 'bg-amber-400/20 text-amber-300 border-amber-400/40';
      case 'Poor':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-white/10 text-white/60 border-white/20';
    }
  };

  return (
    <section id="planning-recommendations-section" className="w-full max-w-4xl mx-auto my-6 px-4">
      <div className="editorial-card border border-white/20 p-6 sm:p-8 rounded-sm bg-[#0F0F0F]/80 backdrop-blur-md relative overflow-hidden">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/50 block mb-1">
              METEOROLOGICAL GUIDANCE & SUITABILITY
            </span>
            <h3 className="text-2xl font-serif italic text-white tracking-tight">
              Planning Intelligence
            </h3>
          </div>
        </div>

        {/* Main Banner Advice */}
        <div id="main-weather-advice-banner" className="mb-6 p-4 rounded-sm bg-sky-400/10 border border-sky-400/40 flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0" />
          <div>
            <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-widest block">CHIEF SYNOPTIC SUMMARY</span>
            <p className="text-base sm:text-lg font-serif italic text-white leading-snug">
              "{mainAdvice}"
            </p>
          </div>
        </div>

        {/* Actionable Tips */}
        <div id="recommendations-list" className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-6">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-white/5 border border-white/20 rounded-sm p-4 flex items-start space-x-3"
            >
              <div className="p-2 bg-white/5 border border-white/10 rounded-sm shrink-0 mt-0.5">
                {renderAdviceIcon(rec.icon)}
              </div>
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                  {rec.title}
                </h4>
                <p className="text-xs text-white/70 font-sans mt-1 leading-relaxed">
                  {rec.advice}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Outdoor Activity Ratings */}
        <div className="border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={() => setShowActivities(!showActivities)}
            className="w-full flex items-center justify-between text-left group cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase tracking-widest text-white/80 group-hover:text-sky-400 transition-colors">
                OUTDOOR ACTIVITY SUITABILITY INDEX
              </span>
              <span className="text-[9px] font-mono bg-white/10 text-white/60 px-2 py-0.5 border border-white/20 rounded-none">
                5 METRICS
              </span>
            </div>
            {showActivities ? (
              <ChevronUp className="w-4 h-4 text-white/40 group-hover:text-sky-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/40 group-hover:text-sky-400" />
            )}
          </button>

          {showActivities && (
            <div id="outdoor-activity-ratings" className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {activityRatings.map((act) => (
                <div
                  key={act.name}
                  className="bg-white/5 border border-white/20 rounded-sm p-3 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2 text-white">
                      {renderActivityIcon(act.icon)}
                      <span className="text-xs font-mono uppercase tracking-wider font-bold">{act.name}</span>
                    </div>
                    <span className={`text-[9px] font-mono uppercase tracking-widest font-bold px-2 py-0.5 border ${getRatingBadgeClass(act.rating)}`}>
                      {act.rating}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/50 leading-tight font-sans">
                    {act.reason}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

