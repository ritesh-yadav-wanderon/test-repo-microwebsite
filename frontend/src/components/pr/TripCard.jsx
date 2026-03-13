import React from 'react';
import { ExternalLink, Star, Clock, TrendingUp } from 'lucide-react';

const TripCard = ({ trip }) => {
  const tripUrl = `https://wanderon.in/trip/${trip.slug}`;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 cursor-pointer transform hover:-translate-y-2">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={trip.image}
          alt={trip.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';
          }}
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
          <a
            href={tripUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#FEE60B] hover:bg-[#e5d00a] text-[#015F74] px-6 py-3 rounded-full font-bold flex items-center space-x-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
          >
            <span>View Details</span>
            <ExternalLink size={18} />
          </a>
        </div>
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center space-x-1 shadow-lg">
          <Star className="text-yellow-500 fill-yellow-500" size={16} />
          <span className="font-bold text-gray-900">{trip.rating}</span>
          <span className="text-gray-600 text-sm">({trip.reviews})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#01AFD1] transition-colors duration-300">
          {trip.title}
        </h3>

        {/* Duration */}
        <div className="flex items-center text-gray-600 mb-4">
          <Clock size={18} className="mr-2 text-[#01AFD1]" />
          <span className="font-medium">{trip.duration}</span>
        </div>

        {/* Highlights */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {trip.highlights.slice(0, 3).map((highlight, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium"
              >
                {highlight}
              </span>
            ))}
            {trip.highlights.length > 3 && (
              <span className="text-xs bg-[#01AFD1]/10 text-[#01AFD1] px-3 py-1 rounded-full font-medium">
                +{trip.highlights.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-gray-500 text-sm">Starting from</span>
            <div className="text-2xl font-bold text-[#01AFD1]">{trip.price}</div>
          </div>
          <a
            href={tripUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-[#015F74] font-semibold hover:text-[#01AFD1] transition-colors duration-300"
          >
            <span>Book Now</span>
            <TrendingUp size={18} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
