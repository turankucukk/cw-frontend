// src/components/rooms/RoomsSection.tsx
"use client";

import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import RoomList from './RoomList';
import BuildingFloorPlan from '@/src/components/rooms/BuildingFloorPlan';
import GlassCard from '@/src/components/layout/GlassCard';
import Navbar from '../layout/Navbar';
import FilterBar from './FilterBar';
import Footer from '../layout/Footer';
<<<<<<< HEAD
import { getBuildings, type Building } from '@/src/lib/api/building';
import { useSearchParams } from 'next/navigation';
=======

>>>>>>> AliBranch
export default function RoomsSection() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [search, setSearch] = useState('');
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
  const [minCapacity, setMinCapacity] = useState(0);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const searhPrams =useSearchParams();
 
  useEffect(() => {
    getBuildings().then(setBuildings);
  }, []);

  useEffect(()=>{

    const buildingIdFromUrl=searhPrams.get('buildingId');
    if(buildingIdFromUrl)
    {
      setSelectedBuildingId(Number(buildingIdFromUrl));
    }
  },[searhPrams]);

  return (
<<<<<<< HEAD
    <>
      <Navbar />
      <Box sx={{ px: { xs: 3, md: 8 }, mt: { xs: 2, md: 10 } }}>
        <GlassCard>
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            buildings={buildings}
            selectedBuildingId={selectedBuildingId}
            onBuildingChange={setSelectedBuildingId}
            minCapacity={minCapacity}
            onCapacityChange={setMinCapacity}
            selectedFeatures={selectedFeatures}
            onFeaturesChange={setSelectedFeatures}
          />
        </GlassCard>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, py: 2 }}>
          <Box sx={{ flex: { md: '0 0 55%' } }}>
            <GlassCard>
              <RoomList
                search={search}
      selectedBuildingId={selectedBuildingId}
      minCapacity={minCapacity}
      selectedFeatures={selectedFeatures} />
            </GlassCard>
          </Box>
          <Box sx={{ flex: { md: '0 0 40%' }, display: 'flex', justifyContent: 'center' }}>
=======
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
>>>>>>> AliBranch
            <GlassCard>
              <BuildingFloorPlan />
            </GlassCard>
          </Box>
<<<<<<< HEAD
        </Box>
      </Box>
      <Footer />
    </>
=======

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
>>>>>>> AliBranch
  );
}