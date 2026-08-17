
"use client";

import { Box } from '@mui/material';
import AboutSection from './AboutSection';
import CTASection from './CTASection';
import FeaturesSection from './FeaturesSection';
import HowItWorks from './HowItWorks';
import StatisticsSection from './StatisticsSection';
import TestimonialsSection from './TestimonailsSection'; // Dosya isminize sadık kalındı
import TrustedSection from './TrustedSection';
import Hero from '../layout/Hero';
import Footer from '../layout/Footer';

export default function RoomsSection() {
  return (
    <Box 
      component="main"
      sx={{ 
        width: "100%", 
        overflowX: "hidden", // Mobilde sağa-sola taşmaları önler
        display: "flex", 
        flexDirection: "column",
        gap: { xs: 4, sm: 6, md: 8 } // Ekran boyutuna göre seksiyonlar arası dikey boşluk
      }}
    >
      <Hero />
      <AboutSection />
      <HowItWorks />
      <FeaturesSection />
      <CTASection />
      <TrustedSection />
      <StatisticsSection />
      <TestimonialsSection />
      <Footer />
    </Box>
  );
}