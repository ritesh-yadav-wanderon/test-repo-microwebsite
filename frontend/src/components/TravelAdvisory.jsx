import React from 'react';
import { AlertTriangle, TrendingUp, Thermometer, Users, DollarSign, Plane } from 'lucide-react';
import { Button } from './ui/button';

const TravelAdvisory = () => {
  const europeanConcerns = [
    {
      icon: Thermometer,
      title: "Extreme Heat Waves",
      description: "Southern Europe experiencing record temperatures (40°C+) making outdoor activities challenging"
    },
    {
      icon: Users,
      title: "Peak Season Crowds",
      description: "Major cities overcrowded, long wait times at attractions, reduced travel experience"
    },
    {
      icon: DollarSign,
      title: "Premium Pricing",
      description: "Summer rates 2-3x higher for flights and accommodations across popular European destinations"
    }
  ];

  const seAsiaDestinations = [
    {
      name: "Bali, Indonesia",
      highlight: "Perfect Weather",
      description: "Dry season with pleasant temperatures, beautiful beaches, rich culture",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
      price: "₹35,999"
    },
    {
      name: "Phuket, Thailand",
      highlight: "Island Paradise",
      description: "Crystal clear waters, vibrant nightlife, world-class diving spots",
      image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800",
      price: "₹32,999"
    },
    {
      name: "Da Nang, Vietnam",
      highlight: "Hidden Gem",
      description: "Stunning coastline, ancient temples, amazing cuisine at affordable prices",
      image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800",
      price: "₹38,999"
    },
    {
      name: "Singapore",
      highlight: "Modern Marvel",
      description: "Futuristic city, gardens, shopping, food paradise with excellent safety",
      image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800",
      price: "₹45,999"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white via-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Advisory Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <AlertTriangle size={18} />
            <span>Travel Advisory</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            European Summer Travel Alert
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Planning Europe this summer? Consider these factors before booking
          </p>
        </div>

        {/* European Concerns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {europeanConcerns.map((concern, index) => {
            const Icon = concern.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md border-l-4 border-orange-500"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 p-3 rounded-lg flex-shrink-0">
                    <Icon className="text-orange-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">{concern.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{concern.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Alternative Section */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-8 md:p-12 text-white mb-12">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp size={24} />
                <span className="font-semibold text-emerald-100">Smart Alternative</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Discover Southeast Asia This Summer
              </h3>
              <p className="text-xl text-white/90 leading-relaxed">
                Experience perfect weather, rich cultures, stunning beaches, and save 40-50% compared to European summer travel. Plus, shorter flight times from India!
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-4xl font-bold">40%</div>
                <div className="text-emerald-100">Cost Savings</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">28°C</div>
                <div className="text-emerald-100">Ideal Weather</div>
              </div>
            </div>
          </div>
        </div>

        {/* Southeast Asia Destinations */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Recommended Southeast Asia Destinations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {seAsiaDestinations.map((dest, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {dest.highlight}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {dest.name}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {dest.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-500 text-xs">Starting from</span>
                      <div className="text-2xl font-bold text-emerald-600">{dest.price}</div>
                    </div>
                    <Plane className="text-emerald-600" size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gray-50 rounded-2xl p-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Need Help Planning Your Southeast Asia Trip?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our travel experts can create a customized itinerary based on your preferences, budget, and travel dates
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              Plan My Southeast Asia Trip
            </Button>
            <Button className="bg-white hover:bg-gray-100 text-gray-900 border-2 border-gray-300 px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300">
              Compare Destinations
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelAdvisory;
