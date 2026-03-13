import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

const Hero = () => {
  const [searchData, setSearchData] = useState({
    destination: '',
    date: '',
    travelers: '2'
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchData.destination || !searchData.date) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success('Searching for trips to ' + searchData.destination);
    // Mock search functionality
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1663000125985-cd7d5be0f09f)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <div className="space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2">
            <span className="text-emerald-400 font-semibold">100% Safe Travel</span>
            <span className="text-white/60">|</span>
            <span className="text-white/90">Real-Time Global Safety Monitoring</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Explore India with
            <br />
            <span className="text-emerald-400">Complete Safety</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Experience unforgettable adventures with verified guides, 24/7 support, and comprehensive safety monitoring in uncertain times
          </p>

          {/* Search Box */}
          <div className="mt-12 max-w-5xl mx-auto">
            <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Destination */}
                <div className="flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-3 hover:bg-gray-100 transition-colors duration-300">
                  <MapPin className="text-emerald-600 flex-shrink-0" size={20} />
                  <input
                    type="text"
                    placeholder="Where to?"
                    value={searchData.destination}
                    onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                    className="bg-transparent border-none outline-none w-full text-gray-900 placeholder-gray-500"
                  />
                </div>

                {/* Date */}
                <div className="flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-3 hover:bg-gray-100 transition-colors duration-300">
                  <Calendar className="text-emerald-600 flex-shrink-0" size={20} />
                  <input
                    type="date"
                    value={searchData.date}
                    onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                    className="bg-transparent border-none outline-none w-full text-gray-900"
                  />
                </div>

                {/* Travelers */}
                <div className="flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-3 hover:bg-gray-100 transition-colors duration-300">
                  <Users className="text-emerald-600 flex-shrink-0" size={20} />
                  <select
                    value={searchData.travelers}
                    onChange={(e) => setSearchData({ ...searchData, travelers: e.target.value })}
                    className="bg-transparent border-none outline-none w-full text-gray-900"
                  >
                    <option value="1">1 Traveler</option>
                    <option value="2">2 Travelers</option>
                    <option value="3">3 Travelers</option>
                    <option value="4">4+ Travelers</option>
                  </select>
                </div>

                {/* Search Button */}
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-6 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Search size={20} />
                  <span>Search</span>
                </Button>
              </div>
            </form>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mt-12 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">50K+</div>
              <div className="text-sm text-white/80">Happy Travelers</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-white/20"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">200+</div>
              <div className="text-sm text-white/80">Destinations</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-white/20"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">4.8★</div>
              <div className="text-sm text-white/80">Average Rating</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-white/20"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">100%</div>
              <div className="text-sm text-white/80">Safety Record</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/70 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
