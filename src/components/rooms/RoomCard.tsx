// src/components/rooms/RoomCard.tsx
"use client";

import { Card, CardContent, Typography, Stack, Chip } from "@mui/material";
export default function RoomCard() {
  return (
    <Card sx={{ maxWidth: 345, margin: "1rem" }}>

      <CardContent> 
        <Typography variant="h6">Toplantı Odası A</Typography>
        <Typography color="text.secondary" sx={{ mb: 1 }}>
          Kapasite: 5 kişi
        </Typography>
        <Stack direction="row" spacing={1}>
          <Chip label="Wifi" size="small" />
          <Chip label="TV" size="small" />
          <Chip label="Beyaz Tahta" size="small" />
        </Stack>
      </CardContent>
    </Card>
  );
}