import React from 'react';
import { AlertTriangle, Shield, Globe } from 'lucide-react';
import { Button } from '../ui/button';

const PRHero = () => {
  const scrollToDestinations = () => {
    document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#01AFD1] via-[#015F74] to-[#003d4d]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#FEE60B] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FEE60B] rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Alert Badge */}
        <div className="inline-flex items-center space-x-3 bg-red-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-full mb-8 animate-pulse-slow">
          <AlertTriangle size={24} className="flex-shrink-0" />
          <span className="font-bold text-lg">Travel Advisory: Europe & Middle East</span>
        </div>

        {/* Main Heading */}
        <h1 className="font-black !text-4xl mb-6 text-white">
          Your Europe plans changed. Your summer doesn't have to.
          <br />
          <span className="text-[#FEE60B]">Safety Over Uncertainty</span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-8">
          Due to escalating Iran-Israel-US tensions, we recommend exploring stunning
          <span className="font-bold text-[#FEE60B]"> Southeast Asia & Island Paradises</span> 
          {' '}this summer — safer, closer, and more affordable than Europe
        </p>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mb-12 text-white">
          <div className="flex items-center space-x-2">
            <Shield className="text-[#FEE60B]" size={28} />
            <div>
              <div className="text-2xl font-bold">50K+</div>
              <div className="text-sm text-white/80">Safe Trips</div>
            </div>
          </div>
          <div className="hidden md:block w-px h-12 bg-white/20"></div>
          <div className="flex items-center space-x-2">
            <Globe className="text-[#FEE60B]" size={28} />
            <div>
              <div className="text-2xl font-bold">120+</div>
              <div className="text-sm text-white/80">Destinations</div>
            </div>
          </div>
          <div className="hidden md:block w-px h-12 bg-white/20"></div>
          <div className="flex items-center space-x-2">
            <div>
              <div className="text-2xl font-bold">4.8★</div>
              <div className="text-sm text-white/80">Rating</div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={scrollToDestinations}
            className="bg-[#FEE60B] hover:bg-[#e5d00a] text-[#015F74] px-10 py-7 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">

            Explore Safe Destinations
          </Button>
          <Button
            onClick={() => document.getElementById('advisory')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border-2 border-white/30 px-10 py-7 rounded-full font-bold text-lg shadow-lg transition-all duration-300">

            Read Full Advisory
          </Button>
        </div>

        {/* Additional Message */}
        <p className="mt-12 text-white/70 text-sm max-w-2xl mx-auto">
          Updated as of December 2024 • Monitored 24/7 by WanderOn Travel Experts
        </p>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/70 rounded-full"></div>
        </div>
      </div>
    </div>);

};

export default PRHero;