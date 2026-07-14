"use client";

import React, { useState, useRef } from "react";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from "@mui/material";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PeopleIcon from "@mui/icons-material/People";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// Temsili başlangıç odaları
const initialRooms = [
  {
    id: 1,
    name: "Açık Çalışma Alanı - A",
    capacity: 10,
    status: "Müsait",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
  },
];

export default function RoomsPage() {
  const [rooms, setRooms] = useState(initialRooms);
  const [open, setOpen] = useState(false);
  
  // Şu anki işlem modunu tutuyoruz: "add" (Ekleme) veya "edit" (Düzenleme)
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  // Form durumları
  const [roomForm, setRoomForm] = useState({
    name: "",
    capacity: "",
    status: "Müsait",
    image: "" // Cihazdan yüklenen resmin base64 hali burada tutulacak
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ekleme modunda pop-up açma
  const handleOpenAdd = () => {
    setMode("add");
    setRoomForm({ name: "", capacity: "", status: "Müsait", image: "" });
    setOpen(true);
  };

  // Düzenleme modunda pop-up açma
  const handleOpenEdit = (room: any) => {
    setMode("edit");
    setSelectedRoomId(room.id);
    setRoomForm({
      name: room.name,
      capacity: String(room.capacity),
      status: room.status,
      image: room.image
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRoomId(null);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setRoomForm({ ...roomForm, [name]: value });
  };

  // Cihazdan resim seçildiğinde tetiklenen fonksiyon (Base64'e çevirir)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRoomForm({ ...roomForm, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Form gönderildiğinde (Hem ekleme hem düzenleme ortak yönetilir)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomForm.name || !roomForm.capacity) return;

    const defaultImage = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80";

    if (mode === "add") {
      // Yeni Oda Ekleme
      const newRoomId = rooms.length > 0 ? Math.max(...rooms.map(r => r.id)) + 1 : 1;
      const newRoom = {
        id: newRoomId,
        name: roomForm.name,
        capacity: Number(roomForm.capacity),
        status: roomForm.status,
        image: roomForm.image || defaultImage,
      };
      setRooms([...rooms, newRoom]);
    } else if (mode === "edit" && selectedRoomId !== null) {
      // Var Olan Odayı Güncelleme
      const updatedRooms = rooms.map((room) =>
        room.id === selectedRoomId
          ? {
              ...room,
              name: roomForm.name,
              capacity: Number(roomForm.capacity),
              status: roomForm.status,
              image: roomForm.image || defaultImage,
            }
          : room
      );
      setRooms(updatedRooms);
    }

    handleClose();
  };

  const handleDeleteRoom = (id: number) => {
    setRooms(rooms.filter((room) => room.id !== id));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Üst Başlık */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Toplantı Odaları ({rooms.length})
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenAdd}>
          Oda Ekle
        </Button>
      </Box>

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
            <Grid item xs={12} sm={6} md={4} key={room.id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column", boxShadow: 3, borderRadius: 2 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={room.image}
                  alt={room.name}
                  sx={{ objectFit: "cover" }}
                />
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                    <Typography variant="h6" fontWeight="600" sx={{ lineHeight: 1.2 }}>
                      {room.name}
                    </Typography>
                    <Chip label={room.status} color={room.status === "Müsait" ? "success" : "error"} size="small" />
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
                    <PeopleIcon fontSize="small" />
                    <Typography variant="body2">Kapasite: {room.capacity} Kişilik</Typography>
                  </Box>
                </CardContent>

                {/* Aksiyon Butonları: Düzenle ve Sil */}
                <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2, pt: 0 }}>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color="info" 
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenEdit(room)}
                  >
                    Düzenle
                  </Button>
                  <Button 
                    size="small" 
                    variant="contained" 
                    color="error" 
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteRoom(room.id)}
                  >
                    Sil
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* ─── DİNAMİK POP-UP FORM (EKLEME & DÜZENLEME) ─── */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {mode === "add" ? "Yeni Toplantı Odası Ekle" : "Oda Bilgilerini Düzenle"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            
            <TextField
              required
              fullWidth
              label="Oda Adı"
              name="name"
              value={roomForm.name}
              onChange={handleChange}
            />

            <TextField
              required
              fullWidth
              type="number"
              label="Kapasite (Kişi Sayısı)"
              name="capacity"
              inputProps={{ min: 1 }}
              value={roomForm.capacity}
              onChange={handleChange}
            />

            <FormControl fullWidth>
              <InputLabel id="status-select-label">Oda Durumu</InputLabel>
              <Select
                labelId="status-select-label"
                name="status"
                value={roomForm.status}
                label="Oda Durumu"
                onChange={handleChange}
              >
                <MenuItem value="Müsait">Müsait</MenuItem>
                <MenuItem value="Dolu">Dolu</MenuItem>
              </Select>
            </FormControl>

            {/* Cihazdan Görsel Yükleme Alanı */}
            <Box sx={{ border: "1px dashed #ccc", borderRadius: 1, p: 2, textAlign: "center", position: "relative" }}>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              {roomForm.image ? (
                <Box>
                  <img 
                    src={roomForm.image} 
                    alt="Önizleme" 
                    style={{ width: "100%", maxHeight: "150px", objectFit: "cover", borderRadius: "4px", marginBottom: "8px" }} 
                  />
                  <Button size="small" variant="outlined" color="secondary" onClick={() => fileInputRef.current?.click()}>
                    Resmi Değiştir
                  </Button>
                </Box>
              ) : (
                <Button 
                  variant="outlined" 
                  component="span" 
                  startIcon={<CloudUploadIcon />} 
                  onClick={() => fileInputRef.current?.click()}
                  sx={{ width: "100%", py: 2 }}
                >
                  Cihazdan Oda Resmi Seç
                </Button>
              )}
            </Box>

          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={handleClose} color="inherit">İptal</Button>
            <Button type="submit" variant="contained" color="primary">
              {mode === "add" ? "Odayı Ekle" : "Değişiklikleri Kaydet"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}