import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const PRFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-[#015F74] to-[#003d4d] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <img 
              src="https://d2qa7yhd82vfb6.cloudfront.net/storage/v1/object/public/assets/wanderon-logo-white.png" 
              alt="WanderOn" 
              className="h-10 mb-6"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/150x40/015F74/FFFFFF?text=WanderOn';
              }}
            />
            <p className="text-white/80 leading-relaxed mb-6">
              Your trusted partner for safe and unforgettable travel experiences. Explore the world with confidence.
            </p>
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <a
                href="https://facebook.com/wanderon"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-[#01AFD1] p-2 rounded-lg transition-colors duration-300"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com/wanderon"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-[#01AFD1] p-2 rounded-lg transition-colors duration-300"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://instagram.com/wanderon"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-[#01AFD1] p-2 rounded-lg transition-colors duration-300"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://youtube.com/wanderon"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-[#01AFD1] p-2 rounded-lg transition-colors duration-300"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-[#FEE60B]">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://wanderon.in/about" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-[#FEE60B] transition-colors duration-300">
                  About Us
                </a>
              </li>
              <li>
                <a href="https://wanderon.in/trips" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-[#FEE60B] transition-colors duration-300">
                  All Trips
                </a>
              </li>
              <li>
                <a href="https://wanderon.in/blog" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-[#FEE60B] transition-colors duration-300">
                  Travel Blog
                </a>
              </li>
              <li>
                <a href="https://wanderon.in/contact" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-[#FEE60B] transition-colors duration-300">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="https://wanderon.in/careers" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-[#FEE60B] transition-colors duration-300">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-[#FEE60B]">Popular Destinations</h3>
            <ul className="space-y-3">
              <li>
                <a href="#bali" className="text-white/80 hover:text-[#FEE60B] transition-colors duration-300">
                  Bali Packages
                </a>
              </li>
              <li>
                <a href="#thailand" className="text-white/80 hover:text-[#FEE60B] transition-colors duration-300">
                  Thailand Tours
                </a>
              </li>
              <li>
                <a href="#vietnam" className="text-white/80 hover:text-[#FEE60B] transition-colors duration-300">
                  Vietnam Trips
                </a>
              </li>
              <li>
                <a href="#singapore" className="text-white/80 hover:text-[#FEE60B] transition-colors duration-300">
                  Singapore & Malaysia
                </a>
              </li>
              <li>
                <a href="#maldives" className="text-white/80 hover:text-[#FEE60B] transition-colors duration-300">
                  Maldives Holidays
                </a>
              </li>
              <li>
                <a href="#turkey" className="text-white/80 hover:text-[#FEE60B] transition-colors duration-300">
                  Turkey Adventures
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-[#FEE60B]">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="text-[#01AFD1] mt-1 flex-shrink-0" size={20} />
                <div>
                  <div className="text-white/90">+91 98765 43210</div>
                  <div className="text-white/70 text-sm">24/7 Support</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="text-[#01AFD1] mt-1 flex-shrink-0" size={20} />
                <div>
                  <div className="text-white/90">support@wanderon.in</div>
                  <div className="text-white/70 text-sm">info@wanderon.in</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="text-[#01AFD1] mt-1 flex-shrink-0" size={20} />
                <div className="text-white/90">
                  WanderOn Travels Pvt Ltd<br />
                  New Delhi, India
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-white/70 text-sm">
              © {currentYear} WanderOn Travels Pvt Ltd. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <a href="https://wanderon.in/privacy" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#FEE60B] transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="https://wanderon.in/terms" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#FEE60B] transition-colors duration-300">
                Terms & Conditions
              </a>
              <a href="https://wanderon.in/cancellation" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#FEE60B] transition-colors duration-300">
                Cancellation Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PRFooter;
