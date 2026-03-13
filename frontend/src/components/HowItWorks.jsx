import React from 'react';
import { CheckCircle } from 'lucide-react';
import { howItWorks } from '../data/mock';

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
              Simple Process
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your journey to safe and memorable travel starts with just four simple steps
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Desktop Timeline Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-600 transform -translate-y-1/2" 
               style={{ top: '120px' }}></div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {howItWorks.map((step, index) => (
              <div
                key={step.step}
                className="relative"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both`
                }}
              >
                {/* Step Card */}
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative z-10">
                  {/* Step Number */}
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-3xl font-bold text-white">{step.step}</span>
                      </div>
                      <div className="absolute -bottom-2 -right-2">
                        <CheckCircle className="text-emerald-600 bg-white rounded-full" size={32} />
                      </div>
                    </div>
                  </div>

                  {/* Step Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Mobile Connector */}
                {index < howItWorks.length - 1 && (
                  <div className="md:hidden flex justify-center my-4">
                    <div className="w-1 h-8 bg-gradient-to-b from-emerald-400 to-emerald-600"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-12 text-white shadow-xl">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Start Your Adventure?
          </h3>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of happy travelers who have experienced safe and unforgettable journeys with WanderOn
          </p>
          <button className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
            Start Planning Your Trip
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
