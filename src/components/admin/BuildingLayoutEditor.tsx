"use client";

import { useRef, useState } from "react";
import { Rnd } from "react-rnd";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import DoorFrontIcon from "@mui/icons-material/DoorFront";
import StairsIcon from "@mui/icons-material/Stairs";
import ElevatorIcon from "@mui/icons-material/Elevator";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import GestureIcon from "@mui/icons-material/Gesture";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";

import {
  BuildingFloorLayout,
  BuildingLayoutItem,
  BuildingLayoutItemType,
  updateBuildingLayout,
} from "@/src/lib/api/building";
import type { Room } from "@/src/lib/api/rooms";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const DEFAULT_FLOOR_NAME = "Genel";
const ROOM_ITEM_WIDTH = 160;
const ROOM_ITEM_HEIGHT = 110;
const GRID_GAP = 16;
const GRID_COLS = Math.max(1, Math.floor((CANVAS_WIDTH + GRID_GAP) / (ROOM_ITEM_WIDTH + GRID_GAP)));

const FEATURE_DEFAULTS: Record<
  Exclude<BuildingLayoutItemType, "room">,
  { label: string; icon: React.ReactNode; width: number; height: number; color: string }
> = {
  entrance: { label: "Giriş", icon: <DoorFrontIcon fontSize="small" />, width: 70, height: 40, color: "#2e7d32" },
  stairs: { label: "Merdiven", icon: <StairsIcon fontSize="small" />, width: 70, height: 70, color: "#ed6c02" },
  elevator: { label: "Asansör", icon: <ElevatorIcon fontSize="small" />, width: 60, height: 60, color: "#0288d1" },
  corridor: { label: "Koridor", icon: null, width: 320, height: 40, color: "#757575" },
};

const CLICK_FEATURE_TYPES: Array<Exclude<BuildingLayoutItemType, "room" | "corridor">> = [
  "entrance",
  "stairs",
  "elevator",
];

function floorEffective(floor?: string | null) {
  return floor?.trim() || DEFAULT_FLOOR_NAME;
}

function floorSortKey(name: string): [number, string] {
  const match = name.match(/\d+/);
  return [match ? parseInt(match[0], 10) : Number.MAX_SAFE_INTEGER, name];
}

function cascadePosition(width: number, height: number, existingCount: number) {
  const cascade = (existingCount % 8) * 24;
  return {
    x: Math.min(CANVAS_WIDTH - width, CANVAS_WIDTH / 2 - width / 2 + cascade),
    y: Math.min(CANVAS_HEIGHT - height, CANVAS_HEIGHT / 2 - height / 2 + cascade),
  };
}

export default function BuildingLayoutEditor({
  buildingId,
  rooms,
  initialLayout,
}: {
  buildingId: number;
  rooms: Room[];
  initialLayout?: { floors: BuildingFloorLayout[] } | null;
}) {
  const [floors, setFloors] = useState<BuildingFloorLayout[]>(initialLayout?.floors ?? []);
  const [selectedFloor, setSelectedFloor] = useState<string>(() => {
    if (initialLayout?.floors?.[0]) return initialLayout.floors[0].floor;
    const firstRoomFloor = rooms.map((r) => floorEffective(r.floor))[0];
    return firstRoomFloor ?? DEFAULT_FLOOR_NAME;
  });
  const [newFloorName, setNewFloorName] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [corridorDrawMode, setCorridorDrawMode] = useState(false);
  const [drawRect, setDrawRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const drawStartRef = useRef({ x: 0, y: 0 });

  const floorNames = Array.from(
    new Set([...floors.map((f) => f.floor), ...rooms.map((r) => floorEffective(r.floor))])
  ).sort((a, b) => {
    const [an, as] = floorSortKey(a);
    const [bn, bs] = floorSortKey(b);
    return an !== bn ? an - bn : as.localeCompare(bs, "tr");
  });

  const currentFloorItems = floors.find((f) => f.floor === selectedFloor)?.items ?? [];
  const roomsOnThisFloor = rooms.filter((r) => floorEffective(r.floor) === selectedFloor);
  const placedRoomIds = new Set(
    currentFloorItems.filter((i) => i.itemType === "room").map((i) => i.roomId)
  );
  const unplacedRooms = roomsOnThisFloor.filter((room) => room.id && !placedRoomIds.has(room.id));

  const updateCurrentFloorItems = (
    updater: (items: BuildingLayoutItem[]) => BuildingLayoutItem[]
  ) => {
    setFloors((prev) => {
      const exists = prev.some((f) => f.floor === selectedFloor);
      if (!exists) {
        return [
          ...prev,
          {
            floor: selectedFloor,
            canvasWidth: CANVAS_WIDTH,
            canvasHeight: CANVAS_HEIGHT,
            items: updater([]),
          },
        ];
      }
      return prev.map((f) => (f.floor === selectedFloor ? { ...f, items: updater(f.items) } : f));
    });
  };

  const handleAddFloor = () => {
    const name = newFloorName.trim();
    if (!name || floorNames.includes(name)) return;
    setFloors((prev) => [
      ...prev,
      { floor: name, canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT, items: [] },
    ]);
    setSelectedFloor(name);
    setNewFloorName("");
  };

  const handleAddRoom = (room: Room) => {
    const { x, y } = cascadePosition(ROOM_ITEM_WIDTH, ROOM_ITEM_HEIGHT, currentFloorItems.length);
    const newItem: BuildingLayoutItem = {
      id: `room-${room.id}-${Date.now()}`,
      itemType: "room",
      roomId: room.id!,
      label: room.name,
      x,
      y,
      width: ROOM_ITEM_WIDTH,
      height: ROOM_ITEM_HEIGHT,
    };
    updateCurrentFloorItems((items) => [...items, newItem]);
    setSelectedId(newItem.id);
  };

  const handleAutoArrange = () => {
    if (unplacedRooms.length === 0) return;
    const newItems: BuildingLayoutItem[] = unplacedRooms.map((room, index) => {
      const col = index % GRID_COLS;
      const row = Math.floor(index / GRID_COLS);
      return {
        id: `room-${room.id}-${Date.now()}-${index}`,
        itemType: "room",
        roomId: room.id!,
        label: room.name,
        x: col * (ROOM_ITEM_WIDTH + GRID_GAP),
        y: row * (ROOM_ITEM_HEIGHT + GRID_GAP),
        width: ROOM_ITEM_WIDTH,
        height: ROOM_ITEM_HEIGHT,
      };
    });
    updateCurrentFloorItems((items) => [...items, ...newItems]);
    setSelectedId(null);
  };

  const handleAddFeature = (type: Exclude<BuildingLayoutItemType, "room">) => {
    const defaults = FEATURE_DEFAULTS[type];
    const { x, y } = cascadePosition(defaults.width, defaults.height, currentFloorItems.length);
    const newItem: BuildingLayoutItem = {
      id: `${type}-${Date.now()}`,
      itemType: type,
      label: defaults.label,
      x,
      y,
      width: defaults.width,
      height: defaults.height,
    };
    updateCurrentFloorItems((items) => [...items, newItem]);
    setSelectedId(newItem.id);
  };

  const handleDeleteSelected = () => {
    if (!selectedId) return;
    updateCurrentFloorItems((items) => items.filter((item) => item.id !== selectedId));
    setSelectedId(null);
  };

  const handleClearFloor = () => {
    if (currentFloorItems.length === 0) return;
    if (confirm(`"${selectedFloor}" katındaki tüm oda ve öğeler silinecek, emin misiniz?`)) {
      updateCurrentFloorItems(() => []);
      setSelectedId(null);
    }
  };

  const getCanvasPoint = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!corridorDrawMode) {
      setSelectedId(null);
      return;
    }
    const pos = getCanvasPoint(e);
    drawStartRef.current = pos;
    setDrawRect({ x: pos.x, y: pos.y, width: 0, height: 0 });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!corridorDrawMode || !drawRect) return;
    const pos = getCanvasPoint(e);
    const start = drawStartRef.current;
    setDrawRect({
      x: Math.max(0, Math.min(start.x, pos.x)),
      y: Math.max(0, Math.min(start.y, pos.y)),
      width: Math.abs(pos.x - start.x),
      height: Math.abs(pos.y - start.y),
    });
  };

  const handleCanvasMouseUp = () => {
    if (!corridorDrawMode) return;
    if (drawRect && drawRect.width >= 20 && drawRect.height >= 15) {
      const newItem: BuildingLayoutItem = {
        id: `corridor-${Date.now()}`,
        itemType: "corridor",
        label: FEATURE_DEFAULTS.corridor.label,
        x: Math.min(drawRect.x, CANVAS_WIDTH - drawRect.width),
        y: Math.min(drawRect.y, CANVAS_HEIGHT - drawRect.height),
        width: Math.min(drawRect.width, CANVAS_WIDTH),
        height: Math.min(drawRect.height, CANVAS_HEIGHT),
      };
      updateCurrentFloorItems((items) => [...items, newItem]);
      setSelectedId(newItem.id);
    }
    setDrawRect(null);
    setCorridorDrawMode(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await updateBuildingLayout(buildingId, { version: 2, floors });
    if (res.success) {
      alert("Bina krokisi kaydedildi.");
    } else {
      alert("Kaydetme hatası: " + res.error);
    }
    setSaving(false);
  };

  return (
    <Box>
      <Tabs
        value={selectedFloor}
        onChange={(_e, value) => {
          setSelectedFloor(value);
          setSelectedId(null);
        }}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2, borderBottom: "1px solid #e0e0e0" }}
      >
        {floorNames.map((name) => (
          <Tab key={name} value={name} label={name} data-testid={`floor-tab-${name}`} />
        ))}
      </Tabs>

      <Stack direction="row" spacing={1} sx={{ mb: 3, maxWidth: 360 }}>
        <TextField
          size="small"
          placeholder="Yeni kat adı (Örn: 2. Kat)"
          value={newFloorName}
          onChange={(e) => setNewFloorName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddFloor()}
          fullWidth
        />
        <IconButton onClick={handleAddFloor} disabled={!newFloorName.trim()} color="primary">
          <AddIcon />
        </IconButton>
      </Stack>

      <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" } }}>
        <Paper sx={{ p: 2, width: { xs: "100%", md: 260 }, flexShrink: 0, height: "fit-content" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1.5 }}>
            Oda Ekle ({selectedFloor})
          </Typography>

          <Button
            variant="contained"
            color="secondary"
            size="small"
            startIcon={<AutoAwesomeIcon fontSize="small" />}
            onClick={handleAutoArrange}
            disabled={unplacedRooms.length === 0}
            fullWidth
            sx={{ mb: 2 }}
            data-testid="building-layout-auto-arrange"
          >
            {unplacedRooms.length === 0
              ? "Eklenecek oda yok"
              : `Kalan ${unplacedRooms.length} Odayı Otomatik Yerleştir`}
          </Button>

          <Autocomplete
            options={unplacedRooms}
            getOptionLabel={(room) => room.name}
            value={null}
            onChange={(_e, room) => {
              if (room) handleAddRoom(room);
            }}
            disabled={unplacedRooms.length === 0}
            noOptionsText="Eşleşen oda yok"
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={
                  unplacedRooms.length === 0
                    ? "Bu katta eklenecek oda yok"
                    : "Odalar sekmesinden ara..."
                }
                size="small"
                data-testid="building-layout-room-search"
              />
            )}
            renderOption={(props, room) => {
              const { key, ...optionProps } = props;
              return (
                <li key={key ?? room.id} {...optionProps} data-testid={`palette-room-${room.id}`}>
                  <MeetingRoomIcon fontSize="small" sx={{ mr: 1, opacity: 0.6 }} />
                  {room.name}
                </li>
              );
            }}
          />

          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 3, mb: 1.5 }}>
            Yapısal Öğe Ekle
          </Typography>
          <Stack spacing={1}>
            {CLICK_FEATURE_TYPES.map((type) => (
              <Button
                key={type}
                variant="outlined"
                startIcon={FEATURE_DEFAULTS[type].icon}
                onClick={() => handleAddFeature(type)}
                fullWidth
                sx={{
                  justifyContent: "flex-start",
                  color: FEATURE_DEFAULTS[type].color,
                  borderColor: FEATURE_DEFAULTS[type].color,
                }}
                data-testid={`palette-feature-${type}`}
              >
                {FEATURE_DEFAULTS[type].label}
              </Button>
            ))}

            <Button
              variant={corridorDrawMode ? "contained" : "outlined"}
              startIcon={<GestureIcon fontSize="small" />}
              onClick={() => {
                setDrawRect(null);
                setCorridorDrawMode((v) => !v);
              }}
              fullWidth
              sx={{
                justifyContent: "flex-start",
                color: corridorDrawMode ? "#fff" : FEATURE_DEFAULTS.corridor.color,
                borderColor: FEATURE_DEFAULTS.corridor.color,
                bgcolor: corridorDrawMode ? FEATURE_DEFAULTS.corridor.color : undefined,
              }}
              data-testid="palette-feature-corridor-draw"
            >
              {corridorDrawMode ? "Çiziliyor... (İptal)" : "Koridor Çiz"}
            </Button>
            {corridorDrawMode && (
              <Typography variant="caption" color="text.secondary">
                Plan üzerinde sürükleyerek koridorun boyunu ve enini çizin.
              </Typography>
            )}
          </Stack>

          {currentFloorItems.length > 0 && (
            <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap", gap: 1 }}>
              {currentFloorItems.map((item) => (
                <Chip
                  key={item.id}
                  size="small"
                  label={item.label}
                  color={item.id === selectedId ? "primary" : "default"}
                  onClick={() => setSelectedId(item.id)}
                />
              ))}
            </Stack>
          )}

          <Stack spacing={1} sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteSelected}
              disabled={!selectedId}
              fullWidth
            >
              Seçileni Kaldır
            </Button>
            <Button
              variant="text"
              color="error"
              size="small"
              startIcon={<DeleteSweepIcon fontSize="small" />}
              onClick={handleClearFloor}
              disabled={currentFloorItems.length === 0}
              fullWidth
              data-testid="building-layout-clear-floor"
            >
              Bu Katı Temizle
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={saving}
              fullWidth
            >
              {saving ? "Kaydediliyor..." : "Tüm Katları Kaydet"}
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
              cursor: corridorDrawMode ? "crosshair" : "default",
            }}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            data-testid="building-layout-canvas"
          >
            {drawRect && (
              <Box
                sx={{
                  position: "absolute",
                  left: drawRect.x,
                  top: drawRect.y,
                  width: drawRect.width,
                  height: drawRect.height,
                  border: `2px dashed ${FEATURE_DEFAULTS.corridor.color}`,
                  bgcolor: `${FEATURE_DEFAULTS.corridor.color}22`,
                  pointerEvents: "none",
                }}
              />
            )}

            {currentFloorItems.map((item) => {
              const isSelected = item.id === selectedId;
              const isRoom = item.itemType === "room";
              const feature = item.itemType !== "room" ? FEATURE_DEFAULTS[item.itemType] : null;

              return (
                <Rnd
                  key={item.id}
                  size={{ width: item.width, height: item.height }}
                  position={{ x: item.x, y: item.y }}
                  bounds="parent"
                  enableResizing={isSelected}
                  onDragStop={(_e, d) => {
                    updateCurrentFloorItems((items) =>
                      items.map((it) => (it.id === item.id ? { ...it, x: d.x, y: d.y } : it))
                    );
                  }}
                  onResizeStop={(_e, _direction, ref, _delta, position) => {
                    updateCurrentFloorItems((items) =>
                      items.map((it) =>
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
                  data-testid={`building-layout-item-${item.id}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isRoom ? (isSelected ? "#e3f2fd" : "#fff") : `${feature!.color}1a`,
                    border: `${isSelected ? 2 : 1}px solid ${isRoom ? (isSelected ? "#1976d2" : "#999") : feature!.color}`,
                    borderRadius: item.itemType === "corridor" ? 2 : 4,
                    fontSize: isRoom ? 13 : 11,
                    color: isRoom ? "#333" : feature!.color,
                    userSelect: "none",
                    cursor: "move",
                    textAlign: "center",
                    padding: 4,
                  }}
                >
                  {isRoom ? <MeetingRoomIcon fontSize="small" /> : feature!.icon}
                  <span>{item.label}</span>
                </Rnd>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
