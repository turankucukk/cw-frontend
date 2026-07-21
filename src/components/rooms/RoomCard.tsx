// src/components/rooms/RoomCard.tsx
"use client";

import { Card, CardContent, Typography, Chip, Stack, Box } from '@mui/material';
import type { Room } from '@/src/lib/api/rooms';

export default function RoomCard({ room }: { room: Room }) {
  return (
    <Card sx={{ maxWidth: 300 }}>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {room.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Kapasite: {room.capacity} kişi · {room.floor}. kat
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
          {room.features.map((feature) => (
            <Chip key={feature} label={feature} size="small" />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}