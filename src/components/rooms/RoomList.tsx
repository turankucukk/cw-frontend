// src/components/rooms/RoomList.tsx
"use client";

import { useEffect, useState } from 'react';
import { Grid, CircularProgress, Alert, Box } from '@mui/material';
import { getRooms, type Room } from '@/src/lib/api/rooms';
import RoomCard from './RoomCard';

export default function RoomList() {
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

  return (
    <Grid container spacing={2} sx={{ p: 3 }}>
      {rooms.map((room) => (
        <Grid size={{ xs: 12, sm: 6, md: 6 }} key={room.id}>
          <RoomCard room={room} />
        </Grid>
      ))}
    </Grid>
  );
} 
