// Craft Imports
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { PlatformSection } from '@/components/sections/platform-section';
import { MagazinePreviewSection } from "@/components/sections/magazine-preview-section";
import AboutTeam from "@/components/sections/about-team";
import MagazineHeroNew from '@/components/sections/magazine-hero-new';
import { FeaturedArticles } from '@/components/sections/featured-articles';
import { MagazineSidebar } from '@/components/sections/magazine-sidebar';
import { MagazineStickyFilter } from '@/components/sections/magazine-sticky-filter';

import { DirectorySection } from '@/components/sections/directory-section';
import { BenefitsSection } from '@/components/sections/benefits-section';
import { AdvertisingOptionsSection } from '@/components/sections/advertising-options-section';
import FaqSection from "@/components/sections/faq-section";
import { CtaSection } from '@/components/sections/cta-section';
import Balancer from "react-wrap-balancer";

// Next.js Imports
import Link from "next/link";

// Icons
import { File, Pen, Tag, Diamond, User, Folder } from "lucide-react";
import { WordPressIcon } from "@/components/icons/wordpress";
import { NextJsIcon } from "@/components/icons/nextjs";

// This page is using the craft.tsx component and design system
import { getAllCategories } from '@/lib/wordpress';

export default async function Home() {
  const categories = await getAllCategories();
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <PlatformSection />
      <MagazineHeroNew />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FeaturedArticles />
        <div className="my-8">
          <MagazineStickyFilter categories={categories} />
        </div>
        <div className="lg:flex lg:gap-8">
          <main className="lg:w-2/3">
            <MagazinePreviewSection />
          </main>
          <MagazineSidebar />
        </div>
        <AboutTeam />
      </div>
      
      <DirectorySection />
      <BenefitsSection />
      <AdvertisingOptionsSection />
      <CtaSection />
      <FaqSection />
    </main>
  );
}
