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
    <Box sx={{ width: '100%', overflowX: 'hidden', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <Box 
        sx={{ 
          flexGrow: 1,
          px: { xs: 1.5, sm: 3, md: 6, lg: 8 }, 
          pt: { xs: '96px', sm: '108px', md: '120px' },
          pb: { xs: 4, md: 8 }
        }}
      >
        {/* 1. ÜST KISIM: Filtre Barı */}
        <Box sx={{ mb: 3 }}>
          <GlassCard>
            <FilterBar />
          </GlassCard>
        </Box>
        
        {/* 
          İÇERİK DÜZENİ:
          - Masaüstünde (md): Sol tarafta Kat Planı (Kroki) / Sağ tarafta Oda Listesi veya tam tersi yan yana
          - Mobilde (xs): Üstte Kroki (Kat Planı), altında Oda Listesi
        */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: { xs: 3, md: 4 }, 
            alignItems: { xs: 'stretch', md: 'flex-start' }
          }}
        >
          {/* FİLTRENİN HEMEN ALTINA GELEN KISIM: Kat Planı (Kroki) */}
          <Box sx={{ flex: { md: '0 0 40%' }, width: '100%' }}>
            <GlassCard>
              <BuildingFloorPlan />
            </GlassCard>
          </Box>

          {/* KROKİNİN ALTINA GELEN KISIM: Oda Listesi */}
          <Box sx={{ flex: { md: '0 0 58%' }, width: '100%' }}>
            <GlassCard>
              <RoomList />
            </GlassCard>
          </Box>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}