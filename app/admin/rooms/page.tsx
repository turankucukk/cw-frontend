"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Container, Grid, Card, CardMedia, CardContent, CardActions,
  Typography, Button, Box, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, FormControl, InputLabel,
  Select, CircularProgress, Alert, Checkbox, FormControlLabel,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PeopleIcon from "@mui/icons-material/People";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { getRooms, createRoom, updateRoom, deleteRoom, type Room } from "@/src/lib/api/rooms";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80";
const roomTypes = ["DESK", "ROOM", "MEETING_ROOM"]; // Table Editor'da gördüğün gerçek değerlere göre güncelle
const availableFeatures = ["Wifi", "TV", "Projeksiyon", "Beyaz Tahta", "Ses Sistemi"];
const DEFAULT_BUILDING_ID = 1; // Şimdilik sabit - Supabase'deki building tablosunda gerçekten var olan bir id olmalı

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  const [roomForm, setRoomForm] = useState({
    name: "",
    capacity: "",
    type: "",
    image: "",
    features: [] as string[],
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const roomsData = await getRooms();
      setRooms(roomsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setMode("add");
    setRoomForm({ name: "", capacity: "", type: "", image: "", features: [] });
    setOpen(true);
  };

  const handleOpenEdit = (room: Room) => {
    setMode("edit");
    setSelectedRoomId(room.id);
    setRoomForm({
      name: room.name,
      capacity: String(room.capacity),
      type: room.type,
      image: room.image ?? "",
      features: room.features ?? [],
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRoomId(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setRoomForm({ ...roomForm, [name]: value });
  };

  const toggleFeature = (feature: string) => {
    setRoomForm((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setRoomForm({ ...roomForm, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomForm.name || !roomForm.capacity || !roomForm.type) return;

    setSubmitting(true);
    setError("");

    try {
      if (mode === "add") {
        await createRoom({
          name: roomForm.name,
          capacity: Number(roomForm.capacity),
          type: roomForm.type,
          features: roomForm.features,
          buildingId: DEFAULT_BUILDING_ID,
          image: roomForm.image || DEFAULT_IMAGE,
        });
      } else if (mode === "edit" && selectedRoomId !== null) {
        await updateRoom(selectedRoomId, {
          name: roomForm.name,
          capacity: Number(roomForm.capacity),
          type: roomForm.type,
          features: roomForm.features,
          image: roomForm.image || DEFAULT_IMAGE,
        });
      }
      await loadData();
      handleClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRoom = async (id: number) => {
    try {
      await deleteRoom(id);
      await loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          Toplantı Odaları ({rooms.length})
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenAdd}>
          Oda Ekle
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {rooms.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8, bgcolor: "action.hover", borderRadius: 2, border: "2px dashed #ccc" }}>
          <MeetingRoomIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Sistemde kayıtlı toplantı odası bulunamadı.
          </Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenAdd} sx={{ mt: 1 }}>
            İlk Odayı Ekle
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {rooms.map((room) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={room.id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column", boxShadow: 3, borderRadius: 2 }}>
                <CardMedia component="img" height="200" image={room.image ?? DEFAULT_IMAGE} alt={room.name} sx={{ objectFit: "cover" }} />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{room.name}</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary", mb: 1 }}>
                    <PeopleIcon fontSize="small" />
                    <Typography variant="body2">Kapasite: {room.capacity} Kişilik · {room.type}</Typography>
                  </Box>
                  {room.features.length > 0 && (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {room.features.map((f) => (
                        <Box key={f} sx={{ bgcolor: "grey.100", px: 1, py: 0.25, borderRadius: 1, fontSize: 12 }}>
                          {f}
                        </Box>
                      ))}
                    </Box>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2, pt: 0 }}>
                  <Button size="small" variant="outlined" color="info" startIcon={<EditIcon />} onClick={() => handleOpenEdit(room)}>
                    Düzenle
                  </Button>
                  <Button size="small" variant="contained" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteRoom(room.id)}>
                    Sil
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {mode === "add" ? "Yeni Toplantı Odası Ekle" : "Oda Bilgilerini Düzenle"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField required fullWidth label="Oda Adı" name="name" value={roomForm.name} onChange={handleChange} />

            <TextField
              required fullWidth type="number" label="Kapasite (Kişi Sayısı)" name="capacity"
              slotProps={{ htmlInput: { min: 1 } }}
              value={roomForm.capacity} onChange={handleChange}
            />

            <FormControl fullWidth required>
              <InputLabel id="type-select-label">Oda Tipi</InputLabel>
              <Select
                labelId="type-select-label"
                name="type"
                value={roomForm.type}
                label="Oda Tipi"
                onChange={handleChange}
              >
                {roomTypes.map((t) => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Oda Özellikleri</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {availableFeatures.map((feature) => (
                  <FormControlLabel
                    key={feature}
                    control={
                      <Checkbox
                        checked={roomForm.features.includes(feature)}
                        onChange={() => toggleFeature(feature)}
                      />
                    }
                    label={feature}
                  />
                ))}
              </Box>
            </Box>

            <Box sx={{ border: "1px dashed #ccc", borderRadius: 1, p: 2, textAlign: "center" }}>
              <input type="file" accept="image/*" style={{ display: "none" }} ref={fileInputRef} onChange={handleFileChange} />
              {roomForm.image ? (
                <Box>
                  <img src={roomForm.image} alt="Önizleme" style={{ width: "100%", maxHeight: "150px", objectFit: "cover", borderRadius: "4px", marginBottom: "8px" }} />
                  <Button size="small" variant="outlined" color="secondary" onClick={() => fileInputRef.current?.click()}>
                    Resmi Değiştir
                  </Button>
                </Box>
              ) : (
                <Button variant="outlined" startIcon={<CloudUploadIcon />} onClick={() => fileInputRef.current?.click()} sx={{ width: "100%", py: 2 }}>
                  Cihazdan Oda Resmi Seç
                </Button>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={handleClose} color="inherit" disabled={submitting}>İptal</Button>
            <Button type="submit" variant="contained" color="primary" disabled={submitting}>
              {submitting ? <CircularProgress size={20} /> : mode === "add" ? "Odayı Ekle" : "Değişiklikleri Kaydet"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}