import React from 'react';
import { Mountain, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-emerald-600 p-2 rounded-lg">
                <Mountain className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold">WanderOn</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              Your trusted partner for safe and unforgettable travel experiences across India. We prioritize your safety while creating memories that last a lifetime.
            </p>
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <a
                href="#"
                className="bg-gray-800 hover:bg-emerald-600 p-2 rounded-lg transition-colors duration-300"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-emerald-600 p-2 rounded-lg transition-colors duration-300"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-emerald-600 p-2 rounded-lg transition-colors duration-300"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-emerald-600 p-2 rounded-lg transition-colors duration-300"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#destinations" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                  Destinations
                </a>
              </li>
              <li>
                <a href="#safety" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                  Safety Measures
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                  Testimonials
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h3 className="text-lg font-bold mb-6">Popular Destinations</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                  Manali Adventures
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                  Ladakh Expeditions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                  Goa Beach Retreats
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                  Kashmir Valley
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                  Andaman Islands
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                  Meghalaya Tours
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="text-emerald-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <div className="text-gray-400">+91 9876543210</div>
                  <div className="text-gray-400">+91 9876543211</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="text-emerald-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <div className="text-gray-400">support@wanderon.in</div>
                  <div className="text-gray-400">info@wanderon.in</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="text-emerald-400 mt-1 flex-shrink-0" size={20} />
                <div className="text-gray-400">
                  123 Travel Street, Adventure City<br />
                  Mumbai, Maharashtra 400001
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} WanderOn. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
