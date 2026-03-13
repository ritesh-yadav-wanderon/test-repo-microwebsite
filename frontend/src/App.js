import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

// PR Page Components
import StickyNav from "@/components/pr/StickyNav";
import PRHero from "@/components/pr/PRHero";
import AdvisoryBanner from "@/components/pr/AdvisoryBanner";
import DestinationsIntro from "@/components/pr/DestinationsIntro";
import DestinationSection from "@/components/pr/DestinationSection";
import FAQSection from "@/components/pr/FAQSection";
import PRFooter from "@/components/pr/PRFooter";

// Data
import {
  baliTrips,
  thailandTrips,
  vietnamTrips,
  singaporeMalaysiaTrips,
  maldivesTrips,
  mauritiusTrips,
  turkeyTrips,
  egyptTrips
} from "@/data/safeTravel";

const PRLandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <StickyNav />
      <PRHero />
      <AdvisoryBanner />
      <DestinationsIntro />
      
      {/* Bali */}
      <DestinationSection
        id="bali"
        title="Bali, Indonesia"
        description="Experience tropical paradise with pristine beaches, ancient temples, vibrant culture, and world-class hospitality. Perfect alternative to Mediterranean destinations."
        trips={baliTrips}
        gradient="bg-gradient-to-r from-orange-500 to-pink-500"
      />

      {/* Thailand */}
      <DestinationSection
        id="thailand"
        title="Thailand"
        description="Discover the Land of Smiles with stunning islands, bustling markets, mouth-watering cuisine, and legendary Thai hospitality. Safer and more affordable than ever."
        trips={thailandTrips}
        gradient="bg-gradient-to-r from-yellow-500 to-orange-500"
      />

      {/* Vietnam */}
      <DestinationSection
        id="vietnam"
        title="Vietnam"
        description="Explore rich history, breathtaking landscapes, delicious cuisine, and warm hospitality. From Ha Long Bay to Ho Chi Minh City — unforgettable experiences await."
        trips={vietnamTrips}
        gradient="bg-gradient-to-r from-red-500 to-yellow-500"
      />

      {/* Singapore & Malaysia */}
      <DestinationSection
        id="singapore"
        title="Singapore & Malaysia"
        description="Experience futuristic cities, diverse cultures, incredible food, and family-friendly attractions. The perfect blend of modern luxury and traditional charm."
        trips={singaporeMalaysiaTrips}
        gradient="bg-gradient-to-r from-blue-500 to-purple-500"
      />

      {/* Maldives */}
      <DestinationSection
        id="maldives"
        title="Maldives"
        description="Escape to island paradise with crystal-clear waters, luxury resorts, romantic sunsets, and world-class diving. The ultimate tropical getaway."
        trips={maldivesTrips}
        gradient="bg-gradient-to-r from-cyan-500 to-blue-500"
      />

      {/* Mauritius */}
      <DestinationSection
        id="mauritius"
        title="Mauritius"
        description="Discover the jewel of the Indian Ocean with pristine beaches, lush landscapes, diverse culture, and exceptional resorts. Perfect for honeymooners and families."
        trips={mauritiusTrips}
        gradient="bg-gradient-to-r from-teal-500 to-emerald-500"
      />

      {/* Turkey */}
      <DestinationSection
        id="turkey"
        title="Turkey"
        description="Bridge between Europe and Asia offering ancient history, stunning landscapes, vibrant bazaars, and warm hospitality. Istanbul, Cappadocia, and Mediterranean coast await."
        trips={turkeyTrips}
        gradient="bg-gradient-to-r from-red-600 to-yellow-500"
      />

      {/* Egypt */}
      <DestinationSection
        id="egypt"
        title="Egypt"
        description="Walk through history with the Pyramids, Sphinx, Valley of Kings, and Nile River. Ancient wonders combined with Red Sea beach resorts."
        trips={egyptTrips}
        gradient="bg-gradient-to-r from-yellow-600 to-orange-600"
      />

      <FAQSection />
      <PRFooter />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PRLandingPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
