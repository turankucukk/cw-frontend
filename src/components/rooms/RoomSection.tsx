// src/components/rooms/RoomsSection.tsx
"use client";

import { Box } from '@mui/material';
import RoomList from './RoomList';
import BuildingFloorPlan from '@/src/components/rooms/BuildingFloorPlan';
import FilterBar from './FilterBar';
import GlassCard from '@/src/components/layout/GlassCard';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
export default function RoomsSection() {
  return (
      <>
    <Navbar />
   <Box sx={{ px: { xs: 3, md: 8 } , mt: { xs: 2, md: 10 } }}>
      <GlassCard >
        <FilterBar />
      </GlassCard>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, py: 2 }}>
      
        <Box sx={{ flex: { md: '0 0 55%' } }}>
          <GlassCard>
            <RoomList />
          </GlassCard>
        </Box>
        <Box sx={{ flex: { md: '0 0 40%' }, display: 'flex', justifyContent: 'center' }}>
          <GlassCard>
            <BuildingFloorPlan />
          </GlassCard>
        </Box>
      </Box>
    </Box>
      <Footer />
      </>
  );
}