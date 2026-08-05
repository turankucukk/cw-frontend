"use client";

import React, { useState, useRef, useEffect } from "react";
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
  Select,
  CircularProgress,
  Stack
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PeopleIcon from "@mui/icons-material/People";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// Supabase API servis fonksiyonları
import { 
  getRooms, 
  addRoom, 
  updateRoom, 
  deleteRoom, 
  getBuildings, 
  Room, 
  Building 
} from "../../../src/lib/api/rooms";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  
  // Mod kontrolü: "add" mi "edit" mi?
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [featureInput, setFeatureInput] = useState<string>("");
  const [featuresList, setFeaturesList] = useState<string[]>([]);

  const [roomForm, setRoomForm] = useState({
    name: "",
    capacity: "",
    type: "Room",
    price: "0",
    building_id: "",
    floor: "",
    description: ""
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Verileri Supabase'den Çek
  const fetchData = async () => {
    setLoading(true);
    const [roomsData, buildingsData] = await Promise.all([getRooms(), getBuildings()]);
    setRooms(roomsData);
    setBuildings(buildingsData);
    if (buildingsData.length > 0 && !roomForm.building_id) {
      setRoomForm((prev) => ({ ...prev, building_id: String(buildingsData[0].id) }));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // YENİ EKLE MODALINI AÇ
  const handleOpenAdd = () => {
    setMode("add");
    setSelectedRoomId(null);
    setRoomForm({
      name: "",
      capacity: "",
      type: "Room",
      price: "0",
      building_id: buildings.length > 0 ? String(buildings[0].id) : "1",
      floor: "",
      description: ""
    });
    setSelectedFiles([]);
    setExistingImageUrl(null);
    setFeaturesList([]);
    setOpen(true);
  };

  // DÜZENLE MODALINI AÇ
  const handleOpenEdit = (room: Room) => {
    setMode("edit");
    setSelectedRoomId(room.id ?? null);
    setRoomForm({
      name: room.name || "",
      capacity: String(room.capacity || ""),
      type: room.type || "Room",
      price: String(room.price || 0),
      building_id: String(room.building_id || (buildings[0]?.id ?? 1)),
      floor: room.floor || "",
      description: room.description || ""
    });
    setFeaturesList(room.features || []);
    setExistingImageUrl(room.image || null);
    setSelectedFiles([]);
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

  // Dinamik Özellik Çipleri
  const handleAddFeature = () => {
    if (featureInput.trim() && !featuresList.includes(featureInput.trim())) {
      setFeaturesList([...featuresList, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const handleDeleteFeature = (featureToDelete: string) => {
    setFeaturesList(featuresList.filter((f) => f !== featureToDelete));
  };

  // Dosya Seçimi
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
    }
  };

  // ODA SİLME İŞLEMİ
  const handleDeleteRoom = async (id?: number) => {
    if (!id) return;
    if (confirm("Bu mekan kayıtını tamamen silmek istediğinize emin misiniz?")) {
      setLoading(true);
      const res = await deleteRoom(id);
      if (res.success) {
        alert("Oda başarıyla silindi.");
        await fetchData();
      } else {
        alert("Silme hatası: " + res.error);
        setLoading(false);
      }
    }
  };

  // FORM GÖNDERİMİ (EKLE VEYA GÜNCELLE)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Yeni Ekleme Modundaysak Fotoğraf Yüklemek Zorunludur
    if (mode === "add" && selectedFiles.length === 0) {
      alert("Lütfen en az bir oda fotoğrafı yükleyiniz!");
      return;
    }

    if (!roomForm.name || !roomForm.capacity || !roomForm.building_id) return;

    setSubmitLoading(true);

    const roomData = {
      name: roomForm.name,
      capacity: Number(roomForm.capacity),
      type: roomForm.type,
      price: Number(roomForm.price),
      building_id: Number(roomForm.building_id),
      floor: roomForm.floor,
      description: roomForm.description,
      features: featuresList,
      isActive: true,
      needsApproval: false
    };

    let result;

    if (mode === "add") {
      result = await addRoom(roomData, selectedFiles);
    } else {
      if (!selectedRoomId) return;
      result = await updateRoom(selectedRoomId, roomData, selectedFiles.length > 0 ? selectedFiles : undefined);
    }

    if (result.success) {
      alert(mode === "add" ? "Mekan eklendi!" : "Mekan bilgileri güncellendi!");
      await fetchData();
      handleClose();
    } else {
      alert("İşlem hatası: " + result.error);
    }

    setSubmitLoading(false);
  };

  return (
    <Container maxWidth="lg" disableGutters sx={{ px: { xs: 1, sm: 2, md: 3 }, py: { xs: 2, sm: 4 } }}>
      {/* Üst Başlık */}
      <Box 
        sx={{ 
          mb: 4, 
          display: "flex", 
          flexDirection: { xs: "column", sm: "row" }, 
          justifyContent: "space-between", 
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2 
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", fontSize: { xs: "1.5rem", sm: "2.125rem" } }}>
          Mekan Yönetimi ({rooms.length})
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />} 
          onClick={handleOpenAdd}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          Mekan Ekle
        </Button>
      </Box>

      {/* Yükleniyor veya Liste */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : rooms.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8, px: 2, bgcolor: "action.hover", borderRadius: 2, border: "2px dashed #ccc" }}>
          <MeetingRoomIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Sistemde kayıtlı mekan bulunamadı.
          </Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenAdd} sx={{ mt: 1 }}>
            İlk Mekanı Ekle
          </Button>
        </Box>
      ) : (
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {rooms.map((room) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={room.id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column", boxShadow: 3, borderRadius: 2 }}>
                
                {/* Görsel varsa göster */}
                {room.image && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={room.image}
                    alt={room.name}
                    sx={{ objectFit: "cover" }}
                  />
                )}
                
                <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 2.5 } }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: "1.1rem", sm: "1.25rem" } }}>{room.name}</Typography>
                    <Chip label={room.isActive ? "Aktif" : "Pasif"} color={room.isActive ? "success" : "default"} size="small" />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Kat: {room.floor || "Belirtilmedi"} | Tip: {room.type}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary", mb: 1 }}>
                    <PeopleIcon fontSize="small" />
                    <Typography variant="body2">Kapasite: {room.capacity} Kişilik</Typography>
                  </Box>

                  {room.description && (
                    <Typography variant="body2" sx={{ color: "text.secondary", mb: 1.5 }}>
                      {room.description}
                    </Typography>
                  )}

                  <Stack direction="row" spacing={0.5} useFlexGap sx={{ gap: 0.5, flexWrap: "wrap" }}>
                    {(room.features || []).map((feat, idx) => (
                      <Chip key={idx} label={feat} size="small" variant="outlined" />
                    ))}
                  </Stack>
                </CardContent>

                {/* AKSİYON BUTONLARI (DÜZENLE VE SİL) */}
                <CardActions 
                  sx={{ 
                    display: "flex", 
                    flexDirection: { xs: "column", sm: "row" }, 
                    justifyContent: "space-between", 
                    alignItems: { xs: "stretch", sm: "center" },
                    px: 2, 
                    pb: 2, 
                    pt: 0,
                    gap: 1.5
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", textAlign: { xs: "center", sm: "left" } }} color="primary">
                    {room.price ?? 0} TL
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, width: { xs: "100%", sm: "auto" } }}>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      color="info" 
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenEdit(room)}
                      fullWidth
                    >
                      Düzenle
                    </Button>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      color="error" 
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteRoom(room.id)}
                      fullWidth
                    >
                      Sil
                    </Button>
                  </Box>
                </CardActions>

              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* MODAL FORM (EKLE / DÜZENLE) */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        fullWidth 
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: { borderRadius: { xs: 2, sm: 3 }, m: { xs: 2, sm: "auto" } }
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", fontSize: { xs: "1.1rem", sm: "1.25rem" } }}>
          {mode === "add" ? "Yeni Mekan Kaydı" : "Mekan Bilgilerini Düzenle"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2, p: { xs: 2, sm: 3 } }}>
            
            {/* Bina Seçimi */}
            <FormControl fullWidth required>
              <InputLabel id="building-label">Ait Olduğu Bina</InputLabel>
              <Select
                labelId="building-label"
                name="building_id"
                value={roomForm.building_id}
                label="Ait Olduğu Bina"
                onChange={handleChange}
              >
                {buildings.map((b) => (
                  <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField required fullWidth label="Mekan / Oda Adı" name="name" value={roomForm.name} onChange={handleChange} />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField required fullWidth type="number" label="Kapasite" name="capacity" value={roomForm.capacity} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField required fullWidth type="number" label="Fiyat (TL)" name="price" value={roomForm.price} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField fullWidth label="Kat (Örn: Kat 2)" name="floor" value={roomForm.floor} onChange={handleChange} />
              </Grid>
            </Grid>

            <FormControl fullWidth>
              <InputLabel id="type-select">Mekan Tipi</InputLabel>
              <Select labelId="type-select" name="type" value={roomForm.type} label="Mekan Tipi" onChange={handleChange}>
                <MenuItem value="Room">Toplantı Odası (Room)</MenuItem>
                <MenuItem value="DESK">Çalışma Masası (DESK)</MenuItem>
              </Select>
            </FormControl>

            <TextField fullWidth multiline rows={2} label="Açıklama" name="description" value={roomForm.description} onChange={handleChange} />

            {/* Özellik Ekleyici */}
            <Box>
              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1, mb: 1 }}>
                <TextField fullWidth size="small" label="Özellik Ekle (Projeksiyon, Wifi vb.)" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} />
                <Button variant="outlined" onClick={handleAddFeature} sx={{ width: { xs: "100%", sm: "auto" } }}>Ekle</Button>
              </Box>
              <Stack direction="row" spacing={1} useFlexGap sx={{ gap: 0.5, flexWrap: "wrap" }}>
                {featuresList.map((feat, idx) => (
                  <Chip key={idx} label={feat} onDelete={() => handleDeleteFeature(feat)} size="small" color="primary" variant="outlined" />
                ))}
              </Stack>
            </Box>

            {/* Görsel Yükleyici */}
            <Box sx={{ border: "1px dashed #ccc", borderRadius: 1, p: 2, textAlign: "center" }}>
              <input type="file" multiple accept="image/*" style={{ display: "none" }} ref={fileInputRef} onChange={handleFileChange} />
              
              {mode === "edit" && existingImageUrl && selectedFiles.length === 0 && (
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="caption" sx={{ display: "block", mb: 0.5 }}>Mevcut Görsel:</Typography>
                  <img src={existingImageUrl} alt="Mevcut" style={{ width: "100%", maxHeight: "120px", objectFit: "cover", borderRadius: "4px" }} />
                </Box>
              )}

              <Button 
                variant="outlined" 
                color={mode === "add" && selectedFiles.length === 0 ? "error" : "primary"}
                startIcon={<CloudUploadIcon />} 
                onClick={() => fileInputRef.current?.click()} 
                sx={{ width: "100%", py: 1.5 }}
              >
                {mode === "add" 
                  ? `Fotoğraf Seç * (${selectedFiles.length} Dosya Seçildi)` 
                  : `Fotoğrafı Değiştir (${selectedFiles.length} Yeni Dosya)`}
              </Button>

              {mode === "add" && selectedFiles.length === 0 ? (
                <Typography variant="caption" color="error" sx={{ display: "block", mt: 1 }}>
                  * En az 1 görsel yüklemek zorunludur.
                </Typography>
              ) : selectedFiles.length > 0 ? (
                <Typography variant="caption" sx={{ display: "block", mt: 1, color: "text.secondary", wordBreak: "break-all" }}>
                  Seçilenler: {selectedFiles.map((f) => f.name).join(", ")}
                </Typography>
              ) : null}
            </Box>

          </DialogContent>
          <DialogActions sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Button onClick={handleClose} color="inherit" disabled={submitLoading}>İptal</Button>
            <Button type="submit" variant="contained" color="primary" disabled={submitLoading}>
              {submitLoading ? "Kaydediliyor..." : mode === "add" ? "Mekanı Kaydet" : "Değişiklikleri Kaydet"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}