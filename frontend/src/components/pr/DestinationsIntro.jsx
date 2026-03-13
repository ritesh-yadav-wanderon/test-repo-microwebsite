import React from 'react';
import { Plane, ThumbsUp, DollarSign, Sun } from 'lucide-react';

const DestinationsIntro = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: "40% Cost Savings",
      description: "Save significantly compared to European summer travel"
    },
    {
      icon: Sun,
      title: "Perfect Weather",
      description: "Ideal temperatures (25-30°C) vs Europe's extreme heat"
    },
    {
      icon: Plane,
      title: "Shorter Flights",
      description: "4-6 hours from India instead of 10-12 hours to Europe"
    },
    {
      icon: ThumbsUp,
      title: "Zero Conflict Risk",
      description: "Completely safe regions far from geopolitical tensions"
    }
  ];

  return (
    <section id="destinations" className="py-20 bg-white scroll-mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
            Your Perfect <span className="text-[#01AFD1]">Summer Alternative</span>
          </h2>
          <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-12">
            Discover stunning destinations that offer everything Europe promised — 
            <span className="font-bold text-[#01AFD1]"> but safer, closer, and more affordable</span>
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="text-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#01AFD1] rounded-2xl mb-4 transform hover:rotate-12 transition-transform duration-300">
                  <Icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* Divider with message */}
        <div className="text-center py-12 border-y-2 border-[#01AFD1]/20">
          <p className="text-xl font-semibold text-gray-700">
            Browse our carefully curated <span className="text-[#01AFD1] font-bold">safe international destinations</span> below
          </p>
        </div>
      </div>
    </section>
  );
};

export default DestinationsIntro;
