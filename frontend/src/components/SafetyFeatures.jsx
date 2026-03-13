import React from 'react';
import { ShieldCheck, Phone, Heart, Activity, Home, AlertTriangle } from 'lucide-react';
import { safetyFeatures } from '../data/mock';

const iconMap = {
  ShieldCheck: ShieldCheck,
  Phone: Phone,
  Heart: Heart,
  Activity: Activity,
  Home: Home,
  AlertTriangle: AlertTriangle
};

const SafetyFeatures = () => {
  return (
    <section id="safety" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
              Your Safety in Changing Times
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Travel with Complete Peace of Mind
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            In a world with evolving geopolitical situations, we've implemented advanced safety measures including real-time conflict monitoring and expert risk assessment to ensure every journey is secure
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {safetyFeatures.map((feature, index) => {
            const Icon = iconMap[feature.icon];
            return (
              <div
                key={feature.id}
                className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 cursor-pointer"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="bg-emerald-100 group-hover:bg-emerald-600 w-14 h-14 rounded-xl flex items-center justify-center transition-colors duration-300">
                      <Icon className="text-emerald-600 group-hover:text-white transition-colors duration-300" size={28} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Questions about traveling during geopolitical tensions?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our expert team monitors global situations 24/7 and provides real-time guidance. All India domestic tours remain completely safe and unaffected by international conflicts.
          </p>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
            Talk to Safety Expert
          </button>
        </div>
      </div>
    </section>
  );
};

export default SafetyFeatures;
