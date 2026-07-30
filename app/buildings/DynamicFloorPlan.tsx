"use client";

import { Box, Typography } from "@mui/material";

export type FloorPlanRoom = {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isOccupied: boolean;
};

type DynamicFloorPlanProps = {
  imageUrl: string;
  rooms: FloorPlanRoom[];
  height?: number;
  onRoomClick?: (room: FloorPlanRoom) => void;
};

export default function DynamicFloorPlan({
  imageUrl,
  rooms,
  height = 280,
  onRoomClick,
}: DynamicFloorPlanProps) {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height,
        overflow: "hidden",
        borderRadius: 2,
        backgroundColor: "#f9fafb",
      }}
    >
      <Box
        component="img"
        src={imageUrl}
        alt="Bina krokisi"
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
        }}
      />

      {rooms.map((room) => (
        <Box
          key={room.id}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onRoomClick?.(room);
          }}
          sx={{
            position: "absolute",
            left: `${room.x}%`,
            top: `${room.y}%`,
            width: `${room.width}%`,
            height: `${room.height}%`,
            boxSizing: "border-box",

            backgroundColor: room.isOccupied
              ? "rgba(239, 68, 68, 0.48)"
              : "rgba(34, 197, 94, 0.48)",

            border: room.isOccupied
              ? "2px solid #dc2626"
              : "2px solid #16a34a",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            cursor: onRoomClick ? "pointer" : "default",

            transition:
              "opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",

            "&:hover": {
              opacity: 0.9,
              transform: "scale(1.02)",
              boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
              zIndex: 2,
            },
          }}
        >
          <Typography
            component="span"
            sx={{
              maxWidth: "90%",
              px: 0.75,
              py: 0.25,
              borderRadius: 1,

              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textAlign: "center",

              fontSize: {
                xs: "9px",
                sm: "11px",
                md: "12px",
              },

              fontWeight: 700,
              color: "#111827",
              backgroundColor: "rgba(255,255,255,0.88)",
            }}
          >
            {room.name}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}