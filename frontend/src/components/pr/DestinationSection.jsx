import React from 'react';
import TripCard from './TripCard';
import { MapPin } from 'lucide-react';

const DestinationSection = ({ id, title, description, trips, gradient }) => {
  return (
    <section id={id} className="py-20 scroll-mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center space-x-2 ${gradient} text-white px-6 py-3 rounded-full mb-6`}>
            <MapPin size={20} />
            <span className="font-bold">{title}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Explore {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Trips Grid */}
        <div className={`grid grid-cols-1 ${trips.length === 1 ? 'md:grid-cols-1 max-w-2xl mx-auto' : trips.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6 justify-items-center`}>
          {trips.map((trip, index) => (
            <div
              key={trip.id}
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              <TripCard trip={trip} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DestinationSection;
