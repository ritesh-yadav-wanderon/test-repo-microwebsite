import React from 'react';
import { Star, MapPin, Clock, ArrowRight } from 'lucide-react';
import { destinations } from '../data/mock';
import { Button } from './ui/button';
import { toast } from 'sonner';

const Destinations = () => {
  const handleBookNow = (destination) => {
    toast.success(`Booking initiated for ${destination.name}`);
  };

  return (
    <section id="destinations" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
              Popular Destinations
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore Amazing Places
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Handpicked destinations with verified safety standards and unforgettable experiences
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination, index) => (
            <div
              key={destination.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 cursor-pointer"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    {destination.badge}
                  </span>
                </div>
                {/* Rating */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center space-x-1 shadow-lg">
                  <Star className="text-yellow-500 fill-yellow-500" size={16} />
                  <span className="font-bold text-gray-900">{destination.rating}</span>
                  <span className="text-gray-600 text-sm">({destination.reviews})</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
                  {destination.name}
                </h3>

                {/* Location */}
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin size={18} className="mr-2 text-emerald-600" />
                  <span>{destination.location}</span>
                </div>

                {/* Duration */}
                <div className="flex items-center text-gray-600 mb-4">
                  <Clock size={18} className="mr-2 text-emerald-600" />
                  <span>{destination.duration}</span>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-gray-500 text-sm">Starting from</span>
                    <div className="text-2xl font-bold text-emerald-600">{destination.price}</div>
                  </div>
                  <Button
                    onClick={() => handleBookNow(destination)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                  >
                    <span>Book Now</span>
                    <ArrowRight size={18} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
            View All Destinations
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Destinations;
