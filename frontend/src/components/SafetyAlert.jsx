import React, { useState } from 'react';
import { X, AlertCircle, Shield } from 'lucide-react';

const SafetyAlert = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="bg-amber-100 p-2 rounded-lg flex-shrink-0">
              <Shield className="text-amber-700" size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="text-amber-700" size={18} />
                <h3 className="font-bold text-gray-900">Global Travel Safety Update</h3>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                We continuously monitor international situations including Middle East tensions. All our India domestic tours are unaffected and operate with enhanced safety protocols. Our expert team provides real-time advisories for international destinations.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 p-1 hover:bg-amber-100 rounded-lg transition-colors duration-200"
            aria-label="Close alert"
          >
            <X className="text-gray-600" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SafetyAlert;
