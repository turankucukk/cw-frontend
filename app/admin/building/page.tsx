"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import GridOnIcon from "@mui/icons-material/GridOn";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useToast } from "@/src/contexts/toastcontext";

// Supabase API servis fonksiyonları (Bina için olanlar)
import {
  getBuildings,
  addBuilding,
  updateBuilding,
  deleteBuilding,
  Building,
} from "../../../src/lib/api/building";

export default function BuildingsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  // Mod kontrolü: "add" mi "edit" mi?
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(
    null,
  );

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingFloorPlanUrl, setExistingFloorPlanUrl] = useState<
    string | null
  >(null);

  const [buildingForm, setBuildingForm] = useState({
    name: "",
    location_url: "",
    manager_id: "1", // Varsayılan olarak 1 atandı
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Verileri Supabase'den Çek
  const fetchData = async () => {
    setLoading(true);
    const buildingsData = await getBuildings();
    setBuildings(buildingsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // YENİ BİNA EKLE MODALINI AÇ
  const handleOpenAdd = () => {
    setMode("add");
    setSelectedBuildingId(null);
    setBuildingForm({
      name: "",
      location_url: "",
      manager_id: "1",
    });
    setSelectedFiles([]);
    setExistingFloorPlanUrl(null);
    setOpen(true);
  };

  // DÜZENLE MODALINI AÇ
  const handleOpenEdit = (building: Building) => {
    setMode("edit");
    setSelectedBuildingId(building.id ?? null);
    setBuildingForm({
      name: building.name || "",
      location_url: building.location_url || "",
      manager_id: building.manager_id ? String(building.manager_id) : "1",
    });
    setExistingFloorPlanUrl(building.floor_plan_url || null);
    setSelectedFiles([]);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBuildingId(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setBuildingForm({ ...buildingForm, [name]: value });
  };

  // Kat Planı / Görsel Seçimi
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
    }
  };

  // BİNA SİLME İŞLEMİ
  const handleDeleteBuilding = async (id?: number) => {
    if (!id) return;
    if (
      confirm(
        "Bu binayı silmek istediğinize emin misiniz? Binaya bağlı olan mekanlar da etkilenebilir!",
      )
    ) {
      setLoading(true);
      const res = await deleteBuilding(id);
      if (res.success) {
        showToast("Bina silindi!", "error");
        await fetchData();
      } else {
        showToast("Silme hatası: " + res.error, "error");
        setLoading(false);
      }
    }
  };

  // FORM GÖNDERİMİ (EKLE VEYA GÜNCELLE)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!buildingForm.name) {
      showToast("Lütfen bina adını giriniz!", "warning");
      return;
    }

    setSubmitLoading(true);

    const buildingData = {
      name: buildingForm.name,
      location_url: buildingForm.location_url,
      manager_id: buildingForm.manager_id ? Number(buildingForm.manager_id) : 1,
    };

    let result;

    if (mode === "add") {
      result = await addBuilding(buildingData, selectedFiles);
    } else {
      if (!selectedBuildingId) return;
      result = await updateBuilding(
        selectedBuildingId,
        buildingData,
        selectedFiles.length > 0 ? selectedFiles : undefined,
      );
    }

    if (result.success) {
      showToast(
        mode === "add" ? "Bina eklendi!" : "Bina bilgileri güncellendi!",
        "success",
      );
      await fetchData();
      handleClose();
    } else {
      showToast("İşlem hatası: " + result.error, "error");
    }

    setSubmitLoading(false);
  };

  return (
    <Container
      maxWidth="lg"
      disableGutters
      sx={{ px: { xs: 1, sm: 2, md: 3 }, py: { xs: 2, sm: 4 } }}
    >
      {/* Üst Başlık */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "1.5rem", sm: "2.125rem" },
          }}
        >
          Bina Yönetimi ({buildings.length})
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          Bina Ekle
        </Button>
      </Box>

      {/* Yükleniyor veya Liste */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : buildings.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 2,
            bgcolor: "action.hover",
            borderRadius: 2,
            border: "2px dashed #ccc",
          }}
        >
          <BusinessIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Sistemde kayıtlı bina bulunamadı.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
            sx={{ mt: 1 }}
          >
            İlk Binayı Ekle
          </Button>
        </Box>
      ) : (
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {buildings.map((building) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={building.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: 3,
                  borderRadius: 2,
                }}
              >
                {/* Kat Planı / Görsel varsa göster */}
                {building.floor_plan_url && (
                  <CardMedia
                    component="img"
                    image={building.floor_plan_url}
                    alt={building.name}
                    sx={{
                      width: "100%",
                      height: 180,
                      objectFit: "contain",
                      bgcolor: "action.hover",
                    }}
                  />
                )}

                <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 2.5 } }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      fontSize: { xs: "1.1rem", sm: "1.25rem" },
                    }}
                  >
                    {building.name}
                  </Typography>

                  {building.location_url && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        color: "primary.main",
                        mb: 1,
                      }}
                    >
                      <LocationOnIcon fontSize="small" />
                      <Typography
                        variant="body2"
                        component="a"
                        href={building.location_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          textDecoration: "none",
                          color: "inherit",
                          wordBreak: "break-all",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        Haritada Göster
                      </Typography>
                    </Box>
                  )}

                  {building.manager_id && (
                    <Typography variant="body2" color="text.secondary">
                      Yönetici ID: {building.manager_id}
                    </Typography>
                  )}
                </CardContent>

                {/* DÜZENLE VE SİL BUTONLARI */}
                <CardActions
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "flex-end",
                    px: 2,
                    pb: 2,
                    pt: 0,
                    gap: 1,
                  }}
                >
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<GridOnIcon />}
                    onClick={() =>
                      router.push(`/admin/building/${building.id}/layout`)
                    }
                    fullWidth
                    data-testid={`building-kroki-${building.id}`}
                  >
                    Kroki
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="info"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenEdit(building)}
                    fullWidth
                  >
                    Düzenle
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteBuilding(building.id)}
                    fullWidth
                  >
                    Sil
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* MODAL FORM (BİNA EKLE / DÜZENLE) */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: { borderRadius: { xs: 2, sm: 3 }, m: { xs: 2, sm: "auto" } },
          },
        }}
      >
        <DialogTitle
          sx={{ fontWeight: "bold", fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
        >
          {mode === "add" ? "Yeni Bina Kaydı" : "Bina Bilgilerini Düzenle"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent
            dividers
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              p: { xs: 2, sm: 3 },
            }}
          >
            <TextField
              required
              fullWidth
              label="Bina Adı"
              name="name"
              value={buildingForm.name}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Konum URL (Google Maps Linki)"
              name="location_url"
              value={buildingForm.location_url}
              onChange={handleChange}
            />

            <TextField
              required
              fullWidth
              type="number"
              label="Yönetici Kullanıcı ID"
              name="manager_id"
              value={buildingForm.manager_id}
              onChange={handleChange}
            />

            {/* Kat Planı / Görsel Yükleyici */}
            <Box
              sx={{
                border: "1px dashed #ccc",
                borderRadius: 1,
                p: 2,
                textAlign: "center",
              }}
            >
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />

              {mode === "edit" &&
                existingFloorPlanUrl &&
                selectedFiles.length === 0 && (
                  <Box sx={{ mb: 1.5 }}>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", mb: 0.5 }}
                    >
                      Mevcut Kat Planı / Görsel:
                    </Typography>
                    <img
                      src={existingFloorPlanUrl}
                      alt="Mevcut"
                      style={{
                        width: "100%",
                        maxHeight: "120px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  </Box>
                )}

              <Button
                variant="outlined"
                color="primary"
                startIcon={<CloudUploadIcon />}
                onClick={() => fileInputRef.current?.click()}
                sx={{ width: "100%", py: 1.5 }}
              >
                {selectedFiles.length > 0
                  ? `Seçilen Dosya: ${selectedFiles[0].name}`
                  : existingFloorPlanUrl
                    ? "Kat Planını / Görseli Değiştir"
                    : "Kat Planı / Bina Görseli Yükle"}
              </Button>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Button
              onClick={handleClose}
              color="inherit"
              disabled={submitLoading}
            >
              İptal
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitLoading}
            >
              {submitLoading
                ? "Kaydediliyor..."
                : mode === "add"
                  ? "Binayı Kaydet"
                  : "Değişiklikleri Kaydet"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}
