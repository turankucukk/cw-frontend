// src/components/rooms/RoomsSection.tsx
"use client";
import { Box } from '@mui/material';
import GlassCard from '@/src/components/layout/GlassCard';
import AboutSection from './AboutSection';
import CTASection from './CTASection';
import FeaturesSection from './FeaturesSection';
import HowItWorks from './HowItWorks';
import StatisticsSection from './StatisticsSection';
import TestimonialsSection from './TestimonailsSection';
import TrustedSection from './TrustedSection';
import Hero from '../layout/Hero';
import Footer from '../layout/Footer';

export default function RoomsSection() {
  return (
    <Box>
        <Hero/>
        <AboutSection/>
        <HowItWorks/>
        <FeaturesSection/>
        <CTASection/>
        <TrustedSection/>
        <StatisticsSection/>
        <TestimonialsSection/>
        <Footer/>
    </Box>



     
  );
}