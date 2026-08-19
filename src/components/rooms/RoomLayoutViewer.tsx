"use client";

import { Box, Typography } from "@mui/material";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import TvIcon from "@mui/icons-material/Tv";
import SensorDoorIcon from "@mui/icons-material/SensorDoor";
import WindowIcon from "@mui/icons-material/Window";
import DrawIcon from "@mui/icons-material/Draw";

import type { RoomLayout, RoomLayoutItemType } from "@/src/lib/api/rooms";

const ITEM_META: Record<RoomLayoutItemType, { label: string; icon: React.ReactNode }> = {
  table: { label: "Masa", icon: <TableRestaurantIcon fontSize="small" /> },
  chair: { label: "Sandalye", icon: <EventSeatIcon fontSize="small" /> },
  screen: { label: "Ekran", icon: <TvIcon fontSize="small" /> },
  door: { label: "Kapı", icon: <SensorDoorIcon fontSize="small" /> },
  window: { label: "Pencere", icon: <WindowIcon fontSize="small" /> },
  whiteboard: { label: "Beyaz Tahta", icon: <DrawIcon fontSize="small" /> },
};

export default function RoomLayoutViewer({ layout }: { layout?: RoomLayout | null }) {
  if (!layout || !layout.items || layout.items.length === 0) return null;

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 700,
        aspectRatio: `${layout.canvasWidth} / ${layout.canvasHeight}`,
        bgcolor: "#fafafa",
        border: "1px solid #e0e0e0",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      {layout.items.map((item) => {
        const meta = ITEM_META[item.type];
        return (
          <Box
            key={item.id}
            sx={{
              position: "absolute",
              left: `${(item.x / layout.canvasWidth) * 100}%`,
              top: `${(item.y / layout.canvasHeight) * 100}%`,
              width: `${(item.width / layout.canvasWidth) * 100}%`,
              height: `${(item.height / layout.canvasHeight) * 100}%`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#fff",
              border: "1px solid #bbb",
              borderRadius: 0.5,
              color: "#555",
              overflow: "hidden",
            }}
          >
            {meta.icon}
            <Typography variant="caption" sx={{ fontSize: 9, lineHeight: 1 }}>
              {item.label ?? meta.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
