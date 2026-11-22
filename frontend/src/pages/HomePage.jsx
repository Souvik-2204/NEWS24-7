import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { MarketSection } from '../components/home/MarketSection';
import { FeaturedNewsGrid } from '../components/home/FeaturedNewsGrid';
import { CategorySections } from '../components/home/CategorySections';
import { NewsletterSection } from '../components/home/NewsletterSection';

export const HomePage = () => {
  return (
    <div className="w-full min-h-screen">
      {/* 1. Large Dynamic Hero News Section matching Dribbble Reference */}
      <HeroSection />

      {/* 2. Stock Market — Priority Homepage Financial Intelligence */}
      <MarketSection />

      {/* 3. Featured & Latest Editorial Grid */}
      <FeaturedNewsGrid />

      {/* 4. Specialized Section Deep Dives (India, World, Politics, Tech, Business, Sports) */}
      <CategorySections />

      {/* 5. Executive Newsletter Briefing Box */}
      <NewsletterSection />
    </div>
  );
};
