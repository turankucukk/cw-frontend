// src/components/rooms/RoomList.tsx
"use client";

import { Grid } from '@mui/material';
import RoomCard from './RoomCard';

export default function RoomList() {
  return (
    <Grid container spacing={2} sx={{ p: 3 }}>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <RoomCard />
        </Grid>
    </Grid>
  );
}