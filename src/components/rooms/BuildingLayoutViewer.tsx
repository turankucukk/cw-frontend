"use client";

import { useState } from "react";
import { Box, Tab, Tabs, Tooltip, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import DoorFrontIcon from "@mui/icons-material/DoorFront";
import StairsIcon from "@mui/icons-material/Stairs";
import ElevatorIcon from "@mui/icons-material/Elevator";

import type { BuildingLayout, BuildingLayoutItemType } from "@/src/lib/api/building";
import type { Room } from "@/src/lib/api/rooms";

const FEATURE_META: Record<
  Exclude<BuildingLayoutItemType, "room">,
  { icon: React.ReactNode; color: string }
> = {
  entrance: { icon: <DoorFrontIcon fontSize="small" />, color: "#2e7d32" },
  stairs: { icon: <StairsIcon fontSize="small" />, color: "#ed6c02" },
  elevator: { icon: <ElevatorIcon fontSize="small" />, color: "#0288d1" },
  corridor: { icon: null, color: "#757575" },
};

export default function BuildingLayoutViewer({
  layout,
  rooms,
}: {
  layout?: BuildingLayout | null;
  rooms: Room[];
}) {
  const router = useRouter();
  const floorsWithItems = (layout?.floors ?? []).filter((f) => f.items.length > 0);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(
    floorsWithItems[0]?.floor ?? null
  );

  if (floorsWithItems.length === 0) return null;

  const activeFloor =
    floorsWithItems.find((f) => f.floor === selectedFloor) ?? floorsWithItems[0];
  const roomsById = new Map(rooms.map((room) => [room.id, room]));

  return (
    <Box data-testid="building-layout-viewer">
      {floorsWithItems.length > 1 && (
        <Tabs
          value={activeFloor.floor}
          onChange={(_e, value) => setSelectedFloor(value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2, borderBottom: "1px solid #e0e0e0" }}
          centered={floorsWithItems.length <= 4}
        >
          {floorsWithItems.map((f) => (
            <Tab key={f.floor} value={f.floor} label={f.floor} />
          ))}
        </Tabs>
      )}

      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: 900,
          aspectRatio: `${activeFloor.canvasWidth} / ${activeFloor.canvasHeight}`,
          bgcolor: "#fafafa",
          border: "1px solid #e0e0e0",
          borderRadius: 1,
          overflow: "hidden",
          mx: "auto",
        }}
      >
        {activeFloor.items.map((item) => {
          const isRoom = item.itemType === "room";
          const room = isRoom ? roomsById.get(item.roomId!) : undefined;
          const hasInteriorLayout = !!room?.layout_data?.items?.length;
          const feature = item.itemType !== "room" ? FEATURE_META[item.itemType] : null;

          const box = (
            <Box
              onClick={() => room?.id && router.push(`/rooms/${room.id}`)}
              data-testid={
                isRoom ? `building-layout-room-${item.roomId}` : `building-layout-feature-${item.id}`
              }
              sx={{
                position: "absolute",
                left: `${(item.x / activeFloor.canvasWidth) * 100}%`,
                top: `${(item.y / activeFloor.canvasHeight) * 100}%`,
                width: `${(item.width / activeFloor.canvasWidth) * 100}%`,
                height: `${(item.height / activeFloor.canvasHeight) * 100}%`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
                textAlign: "center",
                bgcolor: isRoom ? (hasInteriorLayout ? "#fff" : "#f0f0f0") : `${feature!.color}1a`,
                border: `1px solid ${isRoom ? "#bbb" : feature!.color}`,
                borderRadius: item.itemType === "corridor" ? 1 : 0.5,
                color: isRoom ? (hasInteriorLayout ? "#333" : "#999") : feature!.color,
                overflow: "hidden",
                cursor: room ? "pointer" : "default",
                transition: "all 0.15s ease",
                "&:hover": room
                  ? { bgcolor: "#e3f2fd", borderColor: "#1976d2", color: "#1976d2" }
                  : undefined,
              }}
            >
              {isRoom ? <MeetingRoomIcon fontSize="small" /> : feature!.icon}
              <Typography variant="caption" sx={{ fontSize: 11, lineHeight: 1.2, px: 0.5 }}>
                {room?.name ?? item.label}
              </Typography>
            </Box>
          );

          if (!isRoom) return <Box key={item.id}>{box}</Box>;

          return (
            <Tooltip
              key={item.id}
              title={
                room
                  ? `${room.name}${room.capacity ? ` · ${room.capacity} kişi` : ""}${
                      hasInteriorLayout ? "" : " · kroki henüz eklenmedi"
                    }`
                  : item.label
              }
            >
              {box}
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
}
