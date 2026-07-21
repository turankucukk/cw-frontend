// src/components/rooms/RoomsSection.tsx
"use client";

import { Box } from '@mui/material';
import RoomList from './RoomList';
import BuildingFloorPlan from '@/src/components/rooms/BuildingFloorPlan';
import FilterBar from './FilterBar';
import GlassCard from '@/src/components/layout/GlassCard';
export default function RoomsSection() {
  return (
   <Box sx={{ px: { xs: 3, md: 8 } }}>
      <GlassCard sx={{mt:2}}>
        <FilterBar />
      </GlassCard>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, py: 4 }}>
      
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
  );
}