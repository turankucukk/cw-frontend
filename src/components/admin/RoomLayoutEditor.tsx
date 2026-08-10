"use client";

import { useState } from "react";
import { Rnd } from "react-rnd";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import TvIcon from "@mui/icons-material/Tv";
import SensorDoorIcon from "@mui/icons-material/SensorDoor";
import WindowIcon from "@mui/icons-material/Window";
import DrawIcon from "@mui/icons-material/Draw";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";

import {
  RoomLayout,
  RoomLayoutItem,
  RoomLayoutItemType,
  updateRoomLayout,
} from "@/src/lib/api/rooms";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const ITEM_DEFAULTS: Record<
  RoomLayoutItemType,
  { label: string; icon: React.ReactNode; width: number; height: number }
> = {
  table: { label: "Masa", icon: <TableRestaurantIcon fontSize="small" />, width: 100, height: 60 },
  chair: { label: "Sandalye", icon: <EventSeatIcon fontSize="small" />, width: 40, height: 40 },
  screen: { label: "Ekran", icon: <TvIcon fontSize="small" />, width: 100, height: 20 },
  door: { label: "Kapı", icon: <SensorDoorIcon fontSize="small" />, width: 60, height: 15 },
  window: { label: "Pencere", icon: <WindowIcon fontSize="small" />, width: 80, height: 15 },
  whiteboard: { label: "Beyaz Tahta", icon: <DrawIcon fontSize="small" />, width: 100, height: 20 },
};

function createItem(type: RoomLayoutItemType, existingCount: number): RoomLayoutItem {
  const defaults = ITEM_DEFAULTS[type];
  // Yeni öğeler tam merkezde üst üste binmesin diye köşegen boyunca kademeli yerleştirilir.
  const cascade = (existingCount % 8) * 24;
  const x = Math.min(CANVAS_WIDTH - defaults.width, CANVAS_WIDTH / 2 - defaults.width / 2 + cascade);
  const y = Math.min(CANVAS_HEIGHT - defaults.height, CANVAS_HEIGHT / 2 - defaults.height / 2 + cascade);
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    label: defaults.label,
    x,
    y,
    width: defaults.width,
    height: defaults.height,
  };
}

export default function RoomLayoutEditor({
  roomId,
  initialLayout,
}: {
  roomId: number;
  initialLayout?: RoomLayout | null;
}) {
  const [items, setItems] = useState<RoomLayoutItem[]>(initialLayout?.items ?? []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleAddItem = (type: RoomLayoutItemType) => {
    const newItem = createItem(type, items.length);
    setItems((prev) => [...prev, newItem]);
    setSelectedId(newItem.id);
  };

  const handleDeleteSelected = () => {
    if (!selectedId) return;
    setItems((prev) => prev.filter((item) => item.id !== selectedId));
    setSelectedId(null);
  };

  const handleSave = async () => {
    setSaving(true);
    const layout: RoomLayout = {
      version: 1,
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
      items,
    };
    const res = await updateRoomLayout(roomId, layout);
    if (res.success) {
      alert("Kroki kaydedildi.");
    } else {
      alert("Kaydetme hatası: " + res.error);
    }
    setSaving(false);
  };

  return (
    <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" } }}>
      <Paper sx={{ p: 2, width: { xs: "100%", md: 220 }, flexShrink: 0, height: "fit-content" }}>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
          Öğe Ekle
        </Typography>
        <Stack spacing={1}>
          {(Object.keys(ITEM_DEFAULTS) as RoomLayoutItemType[]).map((type) => (
            <Button
              key={type}
              variant="outlined"
              startIcon={ITEM_DEFAULTS[type].icon}
              onClick={() => handleAddItem(type)}
              fullWidth
              sx={{ justifyContent: "flex-start" }}
              data-testid={`palette-${type}`}
            >
              {ITEM_DEFAULTS[type].label}
            </Button>
          ))}
        </Stack>

        <Stack spacing={1} sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteSelected}
            disabled={!selectedId}
            fullWidth
          >
            Seçileni Sil
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={saving}
            fullWidth
          >
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </Stack>
      </Paper>

      <Box sx={{ overflow: "auto", maxWidth: "100%" }}>
        <Box
          sx={{
            position: "relative",
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            bgcolor: "#fafafa",
            border: "2px solid #ccc",
            borderRadius: 1,
            flexShrink: 0,
          }}
          onClick={() => setSelectedId(null)}
          data-testid="layout-canvas"
        >
          {items.map((item) => {
            const defaults = ITEM_DEFAULTS[item.type];
            const isSelected = item.id === selectedId;
            return (
              <Rnd
                key={item.id}
                size={{ width: item.width, height: item.height }}
                position={{ x: item.x, y: item.y }}
                bounds="parent"
                enableResizing={isSelected}
                onDragStop={(_e, d) => {
                  setItems((prev) =>
                    prev.map((it) => (it.id === item.id ? { ...it, x: d.x, y: d.y } : it))
                  );
                }}
                onResizeStop={(_e, _direction, ref, _delta, position) => {
                  setItems((prev) =>
                    prev.map((it) =>
                      it.id === item.id
                        ? {
                            ...it,
                            width: parseInt(ref.style.width, 10),
                            height: parseInt(ref.style.height, 10),
                            x: position.x,
                            y: position.y,
                          }
                        : it
                    )
                  );
                }}
                onMouseDown={(e: MouseEvent) => {
                  e.stopPropagation();
                  setSelectedId(item.id);
                }}
                onClick={(e: MouseEvent) => e.stopPropagation()}
                data-testid={`layout-item-${item.id}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isSelected ? "#e3f2fd" : "#fff",
                  border: isSelected ? "2px solid #1976d2" : "1px solid #999",
                  borderRadius: 4,
                  fontSize: 10,
                  color: "#333",
                  userSelect: "none",
                  cursor: "move",
                }}
              >
                {defaults.icon}
                <span>{item.label}</span>
              </Rnd>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
