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
import { getBuildings, type Building } from '@/src/lib/api/building';
import { getRooms, type Room } from '@/src/lib/api/rooms';
import { useSearchParams } from 'next/navigation';

export default function RoomsSection() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [search, setSearch] = useState('');
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
  const [minCapacity, setMinCapacity] = useState(0);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    getBuildings().then(setBuildings);
  }, []);

  useEffect(() => {
    getRooms().then((data) => setRooms(data.filter((r) => r.isActive)));
  }, []);

  useEffect(() => {
    const buildingIdFromUrl = searchParams.get('buildingId');
    if (buildingIdFromUrl) {
      setSelectedBuildingId(Number(buildingIdFromUrl));
    }
  }, [searchParams]);

  return (
    <>
      <Navbar />
      <Box sx={{ px: { xs: 3, md: 8 }, mt: { xs: 2, md: 10 } }}>
        <GlassCard sx={{mt:{xs:10 , md:3}}}>
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
                rooms={rooms}
                search={search}
                selectedBuildingId={selectedBuildingId}
                minCapacity={minCapacity}
                selectedFeatures={selectedFeatures}
              />
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