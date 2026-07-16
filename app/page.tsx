import Navbar from "@/src/components/layout/Navbar";
import AboutSection from "@/src/components/home/AboutSection";
import Hero from "@/src/components/layout/Hero";
import HowItWorks from "@/src/components/home/HowItWorks";
import FeaturesSection from "@/src/components/home/FeaturesSection";
import StatisticsSection from "@/src/components/home/StatisticsSection";
import TestimonialsSection from "@/src/components/home/TestimonailsSection";
import TrustedSection from "@/src/components/home/TrustedSection";
import CTASection from "@/src/components/home/CTASection";
import Footer from "@/src/components/layout/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <AboutSection />
      <HowItWorks/>
      <FeaturesSection />
      <StatisticsSection />
      <TestimonialsSection />
      <TrustedSection />
      <CTASection />
      <Footer />
    </main>
  );
}
