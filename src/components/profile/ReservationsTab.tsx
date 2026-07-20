"use client";

import { Box, Typography, Card, Chip, Button, Stack, Divider } from "@mui/material";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";

// Mock data based on the Supabase schema
const ACTIVE_RESERVATIONS = [
  {
    id: 1,
    space: { name: "Toplantı Odası A", building: { name: "Ana Bina" } },
    start_time: "2026-07-16T15:00:00Z",
    end_time: "2026-07-16T16:00:00Z",
    status: "approved",
  },
];

const PAST_RESERVATIONS = [
  {
    id: 2,
    space: { name: "Açık Çalışma Alanı 1", building: { name: "Ana Bina" } },
    start_time: "2026-07-10T09:00:00Z",
    end_time: "2026-07-10T12:00:00Z",
    status: "completed",
  },
  {
    id: 3,
    space: { name: "Toplantı Odası B", building: { name: "Ek Bina" } },
    start_time: "2026-07-12T14:00:00Z",
    end_time: "2026-07-12T15:00:00Z",
    status: "cancelled",
  },
];

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
};

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
};

const getStatusChip = (status: string) => {
  switch (status) {
    case "approved":
      return <Chip label="Onaylandı" color="primary" size="small" />;
    case "pending":
      return <Chip label="Bekliyor" color="warning" size="small" />;
    case "completed":
      return <Chip label="Tamamlandı" color="success" size="small" />;
    case "cancelled":
      return <Chip label="İptal Edildi" color="error" size="small" />;
    default:
      return <Chip label={status} size="small" />;
  }
};

export default function ReservationsTab() {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
        Aktif Rezervasyonlarım
      </Typography>

      <Stack spacing={2} sx={{ mb: 5 }}>
        {ACTIVE_RESERVATIONS.length === 0 ? (
          <Typography color="text.secondary">Aktif rezervasyonunuz bulunmamaktadır.</Typography>
        ) : (
          ACTIVE_RESERVATIONS.map((res) => (
            <Card key={res.id} variant="outlined" sx={{ p: 2, borderRadius: 2, borderColor: "primary.light" }}>
              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 2 }}>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                    <MeetingRoomIcon color="action" fontSize="small" />
                    <Typography sx={{ fontWeight: 600 }}>{res.space.name}</Typography>
                    <Typography variant="body2" color="text.secondary">({res.space.building.name})</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AccessTimeIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(res.start_time)} | {formatTime(res.start_time)} - {formatTime(res.end_time)}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, alignSelf: { xs: "flex-end", sm: "center" } }}>
                  {getStatusChip(res.status)}
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<QrCodeScannerIcon />}
                    size="small"
                    sx={{ textTransform: "none", borderRadius: 2 }}
                    onClick={() => alert("Kamera açılarak kapıdaki QR kodu okutulacak.")}
                  >
                    Check-in (QR Tara)
                  </Button>
                </Box>
              </Box>
            </Card>
          ))
        )}
      </Stack>

      <Divider sx={{ mb: 4 }} />

      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
        Geçmiş Rezervasyonlarım
      </Typography>

      <Stack spacing={2}>
        {PAST_RESERVATIONS.length === 0 ? (
          <Typography color="text.secondary">Geçmiş rezervasyonunuz bulunmamaktadır.</Typography>
        ) : (
          PAST_RESERVATIONS.map((res) => (
            <Card key={res.id} variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: "#F8FAFC" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography sx={{ fontWeight: 600, mb: 0.5 }}>{res.space.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(res.start_time)} | {formatTime(res.start_time)} - {formatTime(res.end_time)}
                  </Typography>
                </Box>
                <Box>
                  {getStatusChip(res.status)}
                </Box>
              </Box>
            </Card>
          ))
        )}
      </Stack>
    </Box>
  );
}
