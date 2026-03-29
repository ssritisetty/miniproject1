import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, Search, MapPin, Loader2, CloudLightning, Droplets } from 'lucide-react';

const WeatherWidget = () => {
  const [city, setCity] = useState('New York');
  const [searchInput, setSearchInput] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMockWeather(city);
  }, [city]);

  const fetchMockWeather = (loc) => {
    setLoading(true);
    setTimeout(() => {
      const temp = 15 + (loc.length % 15); 
      const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Stormy', 'Windy'];
      const condition = conditions[loc.length % conditions.length];
      
      setWeatherData({
        location: loc,
        temperature: temp,
        condition: condition,
        humidity: 40 + (loc.length * 2 % 40),
        windSpeed: 5 + (loc.length % 15)
      });
      setLoading(false);
    }, 600);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCity(searchInput);
      setSearchInput('');
    }
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'Sunny': return <Sun className="text-amber-400" size={24} />;
      case 'Cloudy': return <Cloud className="text-gray-400" size={24} />;
      case 'Rainy': return <CloudRain className="text-blue-400" size={24} />;
      case 'Stormy': return <CloudLightning className="text-indigo-500" size={24} />;
      case 'Windy': return <Wind className="text-teal-400" size={24} />;
      default: return <Sun className="text-amber-400" size={24} />;
    }
  };

  return (
    <div className="w-full bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full px-6 py-3 flex items-center justify-between gap-6 transition-all duration-700 animate-fadeIn overflow-hidden flex-wrap sm:flex-nowrap my-4">
      {/* Search Input enclosed in the bar */}
      <form onSubmit={handleSearch} className="relative flex items-center shrink-0 w-full sm:w-auto">
        <Search size={14} className="absolute left-3 text-gray-400" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Location..."
          className="w-full sm:w-32 lg:w-40 bg-gray-50/80 border border-gray-100 rounded-full py-1.5 pl-8 pr-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all font-medium"
        />
      </form>

      {/* Weather Data Strip (The Sleeping Bar) */}
      <div className="flex items-center flex-1 justify-between gap-4 sm:gap-8 min-w-max">
        {loading ? (
          <div className="flex items-center justify-center w-full gap-2 text-primary-500 text-sm font-medium">
            <Loader2 className="animate-spin" size={16} /> Scanning skies...
          </div>
        ) : weatherData ? (
          <>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-primary-400" />
              <span className="font-bold text-gray-800 text-sm">{weatherData.location}</span>
            </div>
            
            <div className="flex items-center justify-center gap-3 border-l border-r border-gray-200/60 px-4 sm:px-8">
              {getWeatherIcon(weatherData.condition)}
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-gray-800 tracking-tighter leading-none">{weatherData.temperature}°</span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-none">{weatherData.condition}</span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs font-medium text-gray-500">
              <div className="flex items-center gap-1.5 tooltip" title="Humidity">
                <Droplets size={14} className="text-blue-300" />
                <span>{weatherData.humidity}%</span>
              </div>
              <div className="flex items-center gap-1.5 tooltip" title="Wind">
                <Wind size={14} className="text-teal-300" />
                <span>{weatherData.windSpeed} km/h</span>
              </div>
            </div>
          </>
        ) : (
          <span className="text-sm text-gray-400 font-medium w-full text-center">Weather unavailable</span>
        )}
      </div>
    </div>
  );
};

export default WeatherWidget;
