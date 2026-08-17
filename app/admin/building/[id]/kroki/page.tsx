"use client";
import { useState, useRef } from "react";
import { Stage, Layer, Rect, Text, Group, Circle, Ellipse } from "react-konva";
import { Box, Button, TextField, Typography, Divider } from "@mui/material";
import type Konva from "konva";

type RoomShape = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
};

type FurnitureShape = {
  id: string;
  presetType: "roundTable4" | "roundTable6" | "rectTable4" | "singleChair" | "loveseat" | "tv" | "klima";
  x: number;
  y: number;
};

export default function KrokiEditorPage() {
  const [rooms, setRooms] = useState<RoomShape[]>([]);
  const [furniture, setFurniture] = useState<FurnitureShape[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<"room" | "furniture" | null>(null);
  const [drawing, setDrawing] = useState(false);
  const startPoint = useRef({ x: 0, y: 0 });

  const CANVAS_WIDTH = 900;
  const CANVAS_HEIGHT = 600;

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
      setSelectedType(null);
      const pos = e.target.getStage()!.getPointerPosition()!;
      startPoint.current = pos;
      setDrawing(true);

      const newRoom: RoomShape = {
        id: `room_${Date.now()}`,
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        label: "Yeni Oda",
      };
      setRooms((prev) => [...prev, newRoom]);
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!drawing) return;
    const pos = e.target.getStage()!.getPointerPosition()!;
    setRooms((prev) => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      last.width = pos.x - startPoint.current.x;
      last.height = pos.y - startPoint.current.y;
      return updated;
    });
  };

 const handleMouseUp = () => {
  setDrawing(false);
  setRooms((prev) => {
    const last = prev[prev.length - 1];
    if (last && (Math.abs(last.width) < 20 || Math.abs(last.height) < 20)) {
      return prev.slice(0, -1);
    }
    return prev;
  });
};

  const updateRoomLabel = (id: string, label: string) => {
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, label } : r)));
  };

  const deleteSelected = () => {
    if (selectedType === "room") {
      setRooms((prev) => prev.filter((r) => r.id !== selectedId));
    } else if (selectedType === "furniture") {
      setFurniture((prev) => prev.filter((f) => f.id !== selectedId));
    }
    setSelectedId(null);
    setSelectedType(null);
  };

const addFurniture = (presetType: FurnitureShape["presetType"]) => {
  const newItem: FurnitureShape = {
    id: `${presetType}_${Date.now()}`,
    presetType,
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
  };
  setFurniture((prev) => [...prev, newItem]);
};

  const selectedRoom = selectedType === "room" ? rooms.find((r) => r.id === selectedId) : null;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 1 }}>Kroki Düzenleyici</Typography>
      <Typography sx={{ color: "text.secondary", mb: 2 }}>
        Boş alana tıklayıp sürükleyerek yeni oda çiz. Sandalye/masa eklemek için sağdaki butonları kullan.
      </Typography>

      <Box sx={{ display: "flex", gap: 3 }}>
        <Box sx={{ border: "1px solid #E2E8F0", borderRadius: 2, overflow: "hidden" }}>
          <Stage
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <Layer>
              {rooms.map((room) => (
                <Group key={room.id}>
                  <Rect
                    x={room.x}
                    y={room.y}
                    width={room.width}
                    height={room.height}
                    fill={selectedId === room.id ? "#DBEAFE" : "#F1F5F9"}
                    stroke={selectedId === room.id ? "#2563EB" : "#94A3B8"}
                    strokeWidth={2}
                    draggable
                    onClick={() => {
                      setSelectedId(room.id);
                      setSelectedType("room");
                    }}
                    onDragEnd={(e) => {
                      const { x, y } = e.target.position();
                      setRooms((prev) =>
                        prev.map((r) => (r.id === room.id ? { ...r, x, y } : r))
                      );
                    }}
                  />
                  <Text
                    x={room.x + 8}
                    y={room.y + 8}
                    text={room.label}
                    fontSize={14}
                    fill="#1E293B"
                  />
                </Group>
              ))}

{furniture.map((item) => {
  const isSelected = selectedId === item.id;
  const handleClick = () => {
    setSelectedId(item.id);
    setSelectedType("furniture" as const);
  };
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const { x, y } = e.target.position();
    setFurniture((prev) =>
      prev.map((f) => (f.id === item.id ? { ...f, x, y } : f))
    );
  };

  const chairColor = isSelected ? "#2563EB" : "#94A3B8";
  const tableColor = isSelected ? "#DBEAFE" : "#F8FAFC";
  const strokeColor = isSelected ? "#2563EB" : "#94A3B8";

  const renderChairsAround = (count: number, radius: number, chairRadius = 9) => {
    const chairs = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      chairs.push(
        <Circle
          key={i}
          x={Math.cos(angle) * radius}
          y={Math.sin(angle) * radius}
          radius={chairRadius}
          fill={chairColor}
        />
      );
    }
    return chairs;
  };

  switch (item.presetType) {
    case "roundTable4":
      return (
        <Group key={item.id} x={item.x} y={item.y} draggable onClick={handleClick} onDragEnd={handleDragEnd}>
          {renderChairsAround(4, 42)}
          <Circle radius={26} fill={tableColor} stroke={strokeColor} strokeWidth={2} />
        </Group>
      );
    case "roundTable6":
      return (
        <Group key={item.id} x={item.x} y={item.y} draggable onClick={handleClick} onDragEnd={handleDragEnd}>
          {renderChairsAround(6, 50)}
          <Circle radius={32} fill={tableColor} stroke={strokeColor} strokeWidth={2} />
        </Group>
      );
    case "rectTable4":
      return (
        <Group key={item.id} x={item.x} y={item.y} draggable onClick={handleClick} onDragEnd={handleDragEnd}>
          <Circle x={-25} y={-32} radius={9} fill={chairColor} />
          <Circle x={25} y={-32} radius={9} fill={chairColor} />
          <Circle x={-25} y={32} radius={9} fill={chairColor} />
          <Circle x={25} y={32} radius={9} fill={chairColor} />
          <Rect
            width={80}
            height={40}
            offsetX={40}
            offsetY={20}
            cornerRadius={6}
            fill={tableColor}
            stroke={strokeColor}
            strokeWidth={2}
          />
        </Group>
      );
    case "singleChair":
      return (
        <Group key={item.id} x={item.x} y={item.y} draggable onClick={handleClick} onDragEnd={handleDragEnd}>
          <Circle radius={16} fill={tableColor} stroke={strokeColor} strokeWidth={2} />
          <Circle radius={9} fill={chairColor} />
        </Group>
      );
    case "loveseat":
      return (
        <Group key={item.id} x={item.x} y={item.y} draggable onClick={handleClick} onDragEnd={handleDragEnd}>
          <Rect
            width={70}
            height={34}
            offsetX={35}
            offsetY={17}
            cornerRadius={10}
            fill={isSelected ? "#FEF3C7" : "#FDE68A"}
            stroke={isSelected ? "#2563EB" : "#D97706"}
            strokeWidth={2}
          />
          <Rect
            width={2}
            height={30}
            offsetX={1}
            offsetY={15}
            fill={isSelected ? "#D97706" : "#B45309"}
          />
        </Group>
      );
    case "tv":
      return (
        <Group key={item.id} x={item.x} y={item.y} draggable onClick={handleClick} onDragEnd={handleDragEnd}>
          <Rect
            width={55}
            height={32}
            offsetX={27}
            offsetY={16}
            cornerRadius={4}
            fill={isSelected ? "#DBEAFE" : "#1E293B"}
            stroke={isSelected ? "#2563EB" : "#0F172A"}
            strokeWidth={2}
          />
          <Text text="TV" fontSize={11} fill="#fff" offsetX={9} offsetY={-6} listening={false} />
        </Group>
      );
    case "klima":
      return (
        <Group key={item.id} x={item.x} y={item.y} draggable onClick={handleClick} onDragEnd={handleDragEnd}>
          <Rect
            width={45}
            height={20}
            offsetX={22}
            offsetY={10}
            cornerRadius={4}
            fill={isSelected ? "#DBEAFE" : "#F0F9FF"}
            stroke={isSelected ? "#2563EB" : "#0EA5E9"}
            strokeWidth={2}
          />
        </Group>
      );
    default:
      return null;
  }
})}
            </Layer>
          </Stage>
        </Box>

        <Box sx={{ minWidth: 260 }}>
<Typography sx={{ fontWeight: 600, mb: 1 }}>Masa / Oturma Grubu</Typography>
<Button variant="outlined" fullWidth sx={{ mb: 1 }} onClick={() => addFurniture("roundTable4")}>
  Yuvarlak Masa (4 Kişi)
</Button>
<Button variant="outlined" fullWidth sx={{ mb: 1 }} onClick={() => addFurniture("roundTable6")}>
  Yuvarlak Masa (6 Kişi)
</Button>
<Button variant="outlined" fullWidth sx={{ mb: 1 }} onClick={() => addFurniture("rectTable4")}>
  Dikdörtgen Masa (4 Kişi)
</Button>

<Typography sx={{ fontWeight: 600, mb: 1, mt: 2 }}>Koltuk</Typography>
<Button variant="outlined" fullWidth sx={{ mb: 1 }} onClick={() => addFurniture("singleChair")}>
  Tekli Koltuk
</Button>
<Button variant="outlined" fullWidth sx={{ mb: 1 }} onClick={() => addFurniture("loveseat")}>
  İkili Koltuk
</Button>

<Typography sx={{ fontWeight: 600, mb: 1, mt: 2 }}>Ekipman</Typography>
<Button variant="outlined" fullWidth sx={{ mb: 1 }} onClick={() => addFurniture("tv")}>
  + TV Ekle
</Button>
<Button variant="outlined" fullWidth onClick={() => addFurniture("klima")}>
  + Klima Ekle
</Button>

          <Divider sx={{ my: 2 }} />
<Button
  variant="text"
  color="error"
  size="small"
  fullWidth
  onClick={() => {
    if (confirm("Tüm odalar ve nesneler silinecek, emin misin?")) {
      setRooms([]);
      setFurniture([]);
      setSelectedId(null);
      setSelectedType(null);
    }
  }}
  sx={{ mb: 2 }}
>
  Tümünü Temizle
</Button>

          {selectedType === "room" && selectedRoom ? (
            <Box>
              <Typography sx={{ fontWeight: 600, mb: 1 }}>Seçili Oda</Typography>
              <TextField
                fullWidth
                size="small"
                label="Oda Adı"
                value={selectedRoom.label}
                onChange={(e) => updateRoomLabel(selectedRoom.id, e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button variant="outlined" color="error" onClick={deleteSelected} fullWidth>
                Odayı Sil
              </Button>
            </Box>
          ) : selectedType === "furniture" ? (
            <Box>
              <Typography sx={{ fontWeight: 600, mb: 1 }}>Seçili Nesne</Typography>
              <Button variant="outlined" color="error" onClick={deleteSelected} fullWidth>
                Nesneyi Sil
              </Button>
            </Box>
          ) : (
            <Typography sx={{ color: "text.secondary" }}>
              Bir oda ya da nesne seçmek için üzerine tıklayın.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}