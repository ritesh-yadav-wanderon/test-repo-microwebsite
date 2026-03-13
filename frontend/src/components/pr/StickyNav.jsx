import React, { useState, useEffect } from 'react';

const StickyNav = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const destinations = [
    { id: 'bali', name: 'Bali' },
    { id: 'thailand', name: 'Thailand' },
    { id: 'vietnam', name: 'Vietnam' },
    { id: 'singapore', name: 'Singapore & Malaysia' },
    { id: 'maldives', name: 'Maldives' },
    { id: 'mauritius', name: 'Mauritius' },
    { id: 'turkey', name: 'Turkey' },
    { id: 'egypt', name: 'Egypt' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);

      // Detect active section
      destinations.forEach(dest => {
        const element = document.getElementById(dest.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(dest.id);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`${
        isSticky ? 'fixed top-0 left-0 right-0 shadow-lg' : 'relative'
      } bg-white z-40 transition-all duration-300 border-b-2 border-[#01AFD1]`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <img 
              src="https://wanderon.in/_next/image?url=%2Fassets%2Fimages%2Fwanderon-logo-blue.avif&w=256&q=75" 
              alt="WanderOn" 
              className="h-8"
            />
            <span className="hidden md:block text-sm font-medium text-gray-600">
              Safe Destinations 2026
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 overflow-x-auto">
            {destinations.map((dest) => (
              <button
                key={dest.id}
                onClick={() => scrollToSection(dest.id)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                  activeSection === dest.id
                    ? 'bg-[#01AFD1] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {dest.name}
              </button>
            ))}
          </div>

          {/* Mobile Dropdown */}
          <div className="lg:hidden">
            <select
              onChange={(e) => scrollToSection(e.target.value)}
              value={activeSection}
              className="px-4 py-2 rounded-lg border-2 border-[#01AFD1] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#01AFD1]"
            >
              <option value="">Select Destination</option>
              {destinations.map((dest) => (
                <option key={dest.id} value={dest.id}>
                  {dest.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default StickyNav;
