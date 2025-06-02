import HeroSection from "../../components/landing/Hero";
import Footer from "../../components/layout/Footer";
import Navbar from "../../components/layout/Navbar";
import FeaturesSection from "../../components/landing/FeaturesSection";
import HowItWorksSection from "../../components/landing/HowItWorks";
import TestimonialsSection from "../../components/landing/Testimonials";
import StatsSection from "../../components/landing/Stats";

import CtaSection from "../../components/landing/CTASection";

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <StatsSection />
      <CtaSection />
      <Footer />

    </div>
  );
};

export default LandingPage;
