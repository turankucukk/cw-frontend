// src/components/rooms/RoomList.tsx
"use client";

import { Box, Alert, Grid } from "@mui/material";
import RoomCard from "./RoomCard";
import { type Room } from "@/src/lib/api/rooms";

interface RoomListProps {
  rooms?: Room[];
  search?: string;
  selectedBuildingId?: string | number | null;
  minCapacity?: number;
  selectedFeatures?: string[];
  error?: string | null;
}

export default function RoomList({
  rooms = [],
  search = "",
  selectedBuildingId = null,
  minCapacity = 0,
  selectedFeatures = [],
  error = null,
}: RoomListProps) {
  if (error) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        {error}
      </Alert>
    );
  }

  const filteredRooms = rooms.filter((room) => {
    const searchTerm = (search ?? "").toLowerCase();
    const minCap = minCapacity ?? 0;
    const features = selectedFeatures ?? [];

    const matchesSearch = room.name ? room.name.toLowerCase().includes(searchTerm) : true;
    const matchesBuilding =
      selectedBuildingId === null ||
      selectedBuildingId === undefined ||
      room.building_id === selectedBuildingId;
    const matchesCapacity = (room.capacity ?? 0) >= minCap;
    const matchesFeatures = features.every((f) =>
      (room.features ?? []).includes(f)
    );

    return matchesSearch && matchesBuilding && matchesCapacity && matchesFeatures;
  });

  if (filteredRooms.length === 0) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <Alert severity="info">Filtrelere uyan oda bulunamadı.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={3}>
        {filteredRooms.map((room) => (
          <Grid key={room.id} size={{ xs: 12, sm: 6, md: 6 }}>
            <RoomCard room={room} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}