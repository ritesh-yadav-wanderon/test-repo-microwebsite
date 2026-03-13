import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Phone } from 'lucide-react';
import { faqs } from '../../data/safeTravel';

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-[#01AFD1]/10 text-[#01AFD1] px-6 py-3 rounded-full mb-6">
            <HelpCircle size={24} />
            <span className="font-bold text-lg">Frequently Asked Questions</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Got Questions? We've Got Answers
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about safe travel this summer
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg"
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`
              }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-300"
              >
                <span className="text-lg font-bold text-gray-900 pr-8">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="flex-shrink-0 text-[#01AFD1]" size={24} />
                ) : (
                  <ChevronDown className="flex-shrink-0 text-gray-400" size={24} />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-[#01AFD1] to-[#015F74] rounded-3xl p-10 text-white shadow-2xl">
          <h3 className="text-3xl font-bold mb-4">Still Have Questions?</h3>
          <p className="text-xl mb-6 text-white/90">
            Our travel experts are available 24/7 to help you plan the perfect safe journey
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://api.whatsapp.com/send?phone=919090403075&text=Hi%20WanderOn%2C%20I%20have%20a%20query!"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20BA5A] text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-3"
            >
              <WhatsAppIcon />
              Chat on WhatsApp
            </a>
            <button
              onClick={() => {
                // Copy to clipboard
                navigator.clipboard.writeText('+919090403075');
                // Open phone dialer
                window.location.href = 'tel:+919090403075';
              }}
              className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border-2 border-white/50 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center gap-2"
            >
              <Phone size={20} />
              Call: +91-9090403075
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
