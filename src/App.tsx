import React, { useState, useEffect, useCallback } from 'react';
import { CityResult, WeatherData, TempUnit, WindUnit } from './types/weather';
import {
  searchAndFetchWeather,
  getWeatherForecast,
  getWeatherByCoords,
  CityNotFoundError,
  WeatherFetchError,
} from './services/openMeteoService';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { RecommendationsCard } from './components/RecommendationsCard';
import { Forecast7Day } from './components/Forecast7Day';
import { HourlyForecast } from './components/HourlyForecast';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { ErrorMessage } from './components/ErrorMessage';
import { SkeletonLoader } from './components/SkeletonLoader';

const LAST_CITY_KEY = 'weather_intel_last_city';
const FAVORITES_KEY = 'weather_intel_favorites';
const TEMP_UNIT_KEY = 'weather_intel_temp_unit';

export default function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Preferences
  const [tempUnit, setTempUnit] = useState<TempUnit>(() => {
    return (localStorage.getItem(TEMP_UNIT_KEY) as TempUnit) || 'C';
  });
  const [windUnit, setWindUnit] = useState<WindUnit>('kmh');

  // Favorites
  const [favoriteCities, setFavoriteCities] = useState<CityResult[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);

  // Save preferences to local storage
  useEffect(() => {
    localStorage.setItem(TEMP_UNIT_KEY, tempUnit);
  }, [tempUnit]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteCities));
  }, [favoriteCities]);

  // Fetch weather by city string
  const handleSearchCity = useCallback(async (cityName: string) => {
    if (!cityName.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await searchAndFetchWeather(cityName);
      setWeather(data);
      localStorage.setItem(LAST_CITY_KEY, data.cityInfo.name);
    } catch (err: unknown) {
      if (err instanceof CityNotFoundError) {
        setErrorMessage(err.message);
      } else if (err instanceof WeatherFetchError) {
        setErrorMessage(err.message);
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('An unexpected error occurred while fetching weather data.');
      }
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch weather by selected city result object from search dropdown/favorites
  const handleSelectCityResult = useCallback(async (city: CityResult) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await getWeatherForecast(city.latitude, city.longitude, city);
      setWeather(data);
      localStorage.setItem(LAST_CITY_KEY, city.name);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to fetch weather for selected city.');
      }
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch weather using browser geolocation
  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await getWeatherByCoords(latitude, longitude);
          setWeather(data);
          localStorage.setItem(LAST_CITY_KEY, data.cityInfo.name);
        } catch (err: unknown) {
          if (err instanceof Error) {
            setErrorMessage(err.message);
          } else {
            setErrorMessage('Could not determine weather for your current location.');
          }
          setWeather(null);
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setIsLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          setErrorMessage('Location access was denied. Please search for your city name manually.');
        } else {
          setErrorMessage('Unable to retrieve your location. Please type a city name in the search bar.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, []);

  // Initial Boot: Load last city or default to Tokyo
  useEffect(() => {
    const lastCity = localStorage.getItem(LAST_CITY_KEY);
    if (lastCity) {
      handleSearchCity(lastCity);
    } else {
      handleSearchCity('Tokyo');
    }
  }, [handleSearchCity]);

  // Favorites logic
  const isCurrentCityFavorite = weather
    ? favoriteCities.some((c) => c.id === weather.cityInfo.id || c.name.toLowerCase() === weather.cityInfo.name.toLowerCase())
    : false;

  const toggleCurrentCityFavorite = () => {
    if (!weather) return;
    const currentCity = weather.cityInfo;

    if (isCurrentCityFavorite) {
      setFavoriteCities((prev) =>
        prev.filter((c) => c.id !== currentCity.id && c.name.toLowerCase() !== currentCity.name.toLowerCase())
      );
    } else {
      setFavoriteCities((prev) => [...prev, currentCity]);
    }
  };

  const removeFavorite = (cityId: number) => {
    setFavoriteCities((prev) => prev.filter((c) => c.id !== cityId));
  };

  const clearAllFavorites = () => {
    setFavoriteCities([]);
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#F0F0F0] flex flex-col font-sans selection:bg-sky-400 selection:text-black antialiased">
      
      {/* Navigation Header */}
      <Header
        tempUnit={tempUnit}
        onToggleTempUnit={setTempUnit}
        windUnit={windUnit}
        onChangeWindUnit={setWindUnit}
        favoriteCount={favoriteCities.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        
        {/* Search Bar Section */}
        <SearchBar
          onSearchCity={handleSearchCity}
          onSelectCityResult={handleSelectCityResult}
          onUseCurrentLocation={handleUseCurrentLocation}
          isLoading={isLoading}
        />

        {/* Display Error state */}
        {errorMessage && !isLoading && (
          <ErrorMessage
            message={errorMessage}
            onRetry={() => handleSearchCity(localStorage.getItem(LAST_CITY_KEY) || 'Tokyo')}
            onSearchPopularCity={handleSearchCity}
          />
        )}

        {/* Display Loading state */}
        {isLoading && <SkeletonLoader />}

        {/* Display Weather Content */}
        {!isLoading && !errorMessage && weather && (
          <div className="animate-in fade-in duration-300">
            {/* 1. Current Weather Hero Card */}
            <CurrentWeatherCard
              weather={weather}
              tempUnit={tempUnit}
              windUnit={windUnit}
              isFavorite={isCurrentCityFavorite}
              onToggleFavorite={toggleCurrentCityFavorite}
            />

            {/* 2. Planning Recommendations Section */}
            <RecommendationsCard weather={weather} />

            {/* 3. Hourly Forecast (24 Hours) */}
            <HourlyForecast hourly={weather.hourly} tempUnit={tempUnit} />

            {/* 4. 7-Day Forecast Section (Cards & Recharts Chart) */}
            <Forecast7Day daily={weather.daily} tempUnit={tempUnit} />
          </div>
        )}

      </main>

      {/* Favorites Drawer Modal */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favoriteCities={favoriteCities}
        onSelectCity={handleSelectCityResult}
        onRemoveFavorite={removeFavorite}
        onClearAll={clearAllFavorites}
      />

      {/* Editorial Footer */}
      <footer className="border-t border-white/20 bg-[#0F0F0F] text-white/40 py-8 text-xs font-mono uppercase tracking-widest">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} WEATHER INTELLIGENCE. POWERED BY OPEN-METEO APIS.</p>
          <p className="text-white/30">METEOROLOGICAL OBSERVATION & SYNOPTIC ANALYSIS</p>
        </div>
      </footer>

    </div>
  );
}
