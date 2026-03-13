import React from 'react';
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

const PRFooter = () => {
  const currentYear = new Date().getFullYear();

  const internationalTrips = [
    { name: 'Europe', url: 'https://wanderon.in/international-trips/europe-tour-packages' },
    { name: 'Bali', url: 'https://wanderon.in/international-trips/bali-tour-packages' },
    { name: 'Vietnam', url: 'https://wanderon.in/international-trips/vietnam-tour-packages' },
    { name: 'Thailand', url: 'https://wanderon.in/international-trips/thailand-tour-packages' },
    { name: 'Kazakhstan', url: 'https://wanderon.in/international-trips/kazakhstan-tour-packages' },
    { name: 'Singapore', url: 'https://wanderon.in/international-trips/singapore-tour-packages' },
    { name: 'Bhutan', url: 'https://wanderon.in/international-trips/bhutan-tour-packages' },
    { name: 'Maldives', url: 'https://wanderon.in/international-trips/maldives-tour-packages' },
    { name: 'Dubai', url: 'https://wanderon.in/international-trips/dubai-tour-packages' },
    { name: 'Malaysia', url: 'https://wanderon.in/international-trips/malaysia-tour-packages' }
  ];

  const indiaTrips = [
    { name: 'Ladakh', url: 'https://wanderon.in/india-trips/leh-ladakh-tour-packages' },
    { name: 'Spiti Valley', url: 'https://wanderon.in/india-trips/spiti-valley-tour-packages' },
    { name: 'Meghalaya', url: 'https://wanderon.in/india-trips/meghalaya-tour-packages' },
    { name: 'Kashmir', url: 'https://wanderon.in/india-trips/kashmir-tour-packages' },
    { name: 'Himachal Pradesh', url: 'https://wanderon.in/india-trips/himachal-pradesh-tour-packages' },
    { name: 'Andaman', url: 'https://wanderon.in/india-trips/andaman-tour-packages' },
    { name: 'Kerala', url: 'https://wanderon.in/india-trips/kerala-tour-packages' },
    { name: 'Rajasthan', url: 'https://wanderon.in/india-trips/rajasthan-tour-packages' },
    { name: 'Nagaland', url: 'https://wanderon.in/india-trips/nagaland-tour-packages' }
  ];

  const wanderonSpecial = [
    { name: 'Community Trips', url: 'https://wanderon.in/upcoming-community-trips' },
    { name: 'Honeymoon Trips', url: 'https://wanderon.in/honeymoon-packages' },
    { name: 'Corporate Trips', url: 'https://wanderon.in/corporate-tours' },
    { name: 'Weekend Getaways', url: 'https://wanderon.in/weekend-getaways' }
  ];

  const quickLinks = [
    { name: 'About Us', url: 'https://wanderon.in/about-us' },
    { name: 'Privacy Policy', url: 'https://wanderon.in/privacy-policy' },
    { name: 'Terms & Conditions', url: 'https://wanderon.in/terms-condition' },
    { name: 'Customer Success & Support', url: 'https://wanderon.in/customer-success-&-support' },
    { name: 'Disclaimer', url: 'https://wanderon.in/disclaimer' },
    { name: 'Careers', url: 'https://wanderon.in/careers' },
    { name: 'Blogs', url: 'https://wanderon.in/blogs' },
    { name: 'Payments', url: 'https://wanderon.in/payment' },
    { name: 'Investor Relations', url: 'https://wanderon.in/investor-relations' }
  ];

  return (
    <footer className="bg-[#1a2e35] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* International Trips */}
          <div>
            <h3 className="text-xl font-light mb-6 text-white">International Trips</h3>
            <ul className="space-y-3">
              {internationalTrips.map((trip) => (
                <li key={trip.name}>
                  <a
                    href={trip.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white transition-colors duration-300 font-light text-base"
                  >
                    {trip.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* India Trips */}
          <div>
            <h3 className="text-xl font-light mb-6 text-white">India Trips</h3>
            <ul className="space-y-3">
              {indiaTrips.map((trip) => (
                <li key={trip.name}>
                  <a
                    href={trip.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white transition-colors duration-300 font-light text-base"
                  >
                    {trip.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* WanderOn Special */}
          <div>
            <h3 className="text-xl font-light mb-6 text-white">WanderOn Special</h3>
            <ul className="space-y-3">
              {wanderonSpecial.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white transition-colors duration-300 font-light text-base"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-light mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white transition-colors duration-300 font-light text-base"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10"></div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Company Info */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 tracking-wide">WANDERON EXPERIENCES PVT LTD</h2>
          <p className="text-white/70 text-sm mb-4">CIN-U63040HR2019PTC118957</p>
          <p className="text-white/80 text-base">
            3rd Floor, Building No-436, Phase IV, Udyog Vihar, Sector-18, Gurugram, Haryana-122015
          </p>
        </div>

        {/* Contact Info */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 mb-8 text-white/80">
          <a
            href="mailto:hello@wanderon.in"
            className="hover:text-white transition-colors duration-300"
          >
            hello@wanderon.in
          </a>
          <a
            href="tel:+919090403075"
            className="hover:text-white transition-colors duration-300"
          >
            +91-9090403075
          </a>
          <a
            href="https://wanderon.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-300"
          >
            www.wanderon.in
          </a>
        </div>

        {/* Social Media Icons */}
        <div className="flex items-center justify-center space-x-6">
          <a
            href="https://m.facebook.com/wander.on"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors duration-300"
          >
            <Facebook size={24} className="text-white" />
          </a>
          <a
            href="https://www.instagram.com/wander.on/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors duration-300"
          >
            <Instagram size={24} className="text-white" />
          </a>
          <a
            href="https://www.linkedin.com/company/wanderontravelcommunity"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors duration-300"
          >
            <Linkedin size={24} className="text-white" />
          </a>
          <a
            href="https://m.youtube.com/c/WanderOn"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors duration-300"
          >
            <Youtube size={24} className="text-white" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default PRFooter;
