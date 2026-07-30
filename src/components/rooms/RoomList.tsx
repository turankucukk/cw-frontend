// src/components/rooms/RoomList.tsx
"use client";

import { useEffect, useState } from 'react';
import { Grid, CircularProgress, Alert, Box } from '@mui/material';
import { getRooms, type Room } from '@/src/lib/api/rooms';
import RoomCard from './RoomCard';

interface RoomListProps {
  search: string;
  selectedBuildingId: number | null;
  minCapacity: number;
  selectedFeatures: string[];
}
  
export default function RoomList({ search, selectedBuildingId, minCapacity, selectedFeatures }: RoomListProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getRooms()
      .then((data) => setRooms(data))
      .catch(() => setError('Odalar yüklenirken bir hata oluştu.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;
  }

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.name.toLowerCase().includes(search.toLowerCase());
    const matchesBuilding = selectedBuildingId === null || room.building_id === selectedBuildingId;
    const matchesCapacity = room.capacity >= minCapacity;
    const matchesFeatures = selectedFeatures.every((f) => (room.features ?? []).includes(f));
    return matchesSearch && matchesBuilding && matchesCapacity && matchesFeatures;
  });

  if (filteredRooms.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Alert severity="info">Filtrelere uyan oda bulunamadı.</Alert>
      </Box>
    );
  }

  return (
    <Grid container spacing={2} sx={{ p: 3 }}>
      {filteredRooms.map((room) => (
        <Grid size={{ xs: 12, sm: 6, md: 6 }} key={room.id}>
          <RoomCard room={room} />
        </Grid>
      ))}
    </Grid>
  );
}