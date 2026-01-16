'use client';

import { useRef } from 'react';
import PopupModal from './components/popUp/discount/DiscountModal';
import { PopupModalRef } from '@/lib/types';
import Navigation from './components/indexPageSections/Navigation';
import Footer from './components/indexPageSections/Footer';
import HeroSection from './components/indexPageSections/HeroSection';
import StatsSection from './components/indexPageSections/StatsSection';
import HowItWorksSection from './components/indexPageSections/HowItWorksSection';
import BenefitsSection from './components/indexPageSections/BenefitsSection';
import SwissFrancSection from './components/indexPageSections/SwissFrancSection';
import FeaturesSection from './components/indexPageSections/FeaturesSection';
import PricingSection from './components/indexPageSections/PricingSection';
import TeamSection from './components/indexPageSections/TeamSection';
import CTASection from './components/indexPageSections/CTASection';

export default function Home() {
  const popupRef = useRef<PopupModalRef>(null);

  const handleCTAClick = () => {
    popupRef.current?.open();
  };

  return (
    <div className="bg-gray-50">
      <PopupModal ref={popupRef} />
      <Navigation />
      <HeroSection onCTAClick={handleCTAClick} />
      <StatsSection />
      <HowItWorksSection />
      <BenefitsSection />
      <SwissFrancSection />
      <FeaturesSection />
      <PricingSection />
      <TeamSection />
      <CTASection onCTAClick={handleCTAClick} />
      <Footer />
    </div>
  );
}
