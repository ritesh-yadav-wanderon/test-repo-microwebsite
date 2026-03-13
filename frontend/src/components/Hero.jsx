import React from 'react';
import { Button } from './ui/button';

const Hero = () => {

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

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Explore Destinations
            </Button>
            <Button className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border-2 border-white/30 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Learn About Safety
            </Button>
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
