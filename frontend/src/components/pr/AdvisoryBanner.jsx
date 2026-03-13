import React from 'react';
import { AlertTriangle, XCircle, ShieldAlert } from 'lucide-react';
import { travelAdvisory } from '../../data/safeTravel';

const AdvisoryBanner = () => {
  return (
    <section id="advisory" className="py-16 bg-gradient-to-br from-red-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-red-100 text-red-700 px-6 py-3 rounded-full mb-6">
            <ShieldAlert size={24} />
            <span className="font-bold text-lg">Official Travel Advisory</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            {travelAdvisory.title}
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            {travelAdvisory.subtitle}
          </p>
        </div>

        {/* Concerns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {travelAdvisory.concerns.map((concern, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-red-500"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both`
              }}
            >
              <div className="flex items-start space-x-4">
                <div className="bg-red-100 p-3 rounded-lg flex-shrink-0">
                  {concern.severity === 'high' ? (
                    <XCircle className="text-red-600" size={28} />
                  ) : (
                    <AlertTriangle className="text-orange-600" size={28} />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">
                    {concern.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {concern.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recommendation Box */}
        <div className="bg-gradient-to-r from-[#01AFD1] to-[#015F74] rounded-3xl p-10 text-white shadow-2xl">
          <div className="flex items-start space-x-6">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl flex-shrink-0">
              <AlertTriangle size={40} className="text-[#FEE60B]" />
            </div>
            <div className="flex-1">
              <h3 className="text-3xl font-bold mb-4">WanderOn Recommendation</h3>
              <p className="text-xl leading-relaxed mb-6">
                {travelAdvisory.recommendation}
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-[#FEE60B] hover:bg-[#e5d00a] text-[#015F74] px-8 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  View Safe Alternatives
                </button>
                <a 
                  href="tel:+919090403075" 
                  className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border-2 border-white/50 px-8 py-3 rounded-full font-bold transition-all duration-300"
                >
                  Call: +91-9090403075
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            <strong>Last Updated:</strong> December 2024 | <strong>Source:</strong> Indian Government Travel Advisories, International News Agencies
          </p>
        </div>
      </div>
    </section>
  );
};

export default AdvisoryBanner;
