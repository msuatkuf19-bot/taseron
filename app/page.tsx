import { HeroSection } from "@/components/landing/hero-section";
import { TrustBar } from "@/components/landing/trust-bar";
import { HowItWorks } from "@/components/landing/how-it-works";
import { AdvantagesSection } from "@/components/landing/advantages-section";
import { FeatureMockups } from "@/components/landing/feature-mockups";
import { CTASection } from "@/components/landing/cta-section";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <TrustBar />
      <HowItWorks />
      <AdvantagesSection />
      <FeatureMockups />
      <CTASection />
    </div>
  );
}

