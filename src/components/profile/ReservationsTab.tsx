"use client";
import { useEffect, useState } from "react";
import { Box, Typography, Card, Chip, Button, Stack, Divider } from "@mui/material";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { cancelExpiredReservations } from "@/src/utils/reservationUtils";
import { createClient } from "@/src/utils/supabase/client";

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
};
const formatTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
};

const getStatusChip = (status: string) => {
  switch (status) {
    case "approved": return <Chip label="Onaylandı" color="primary" size="small" />;
    case "confirmed": return <Chip label="Onaylandı" color="primary" size="small" />;
    case "pending": return <Chip label="Bekliyor" color="warning" size="small" />;
    case "completed": return <Chip label="Tamamlandı" color="success" size="small" />;
    case "cancelled": return <Chip label="İptal Edildi" color="error" size="small" />;
    case "checked_in": return <Chip label="Check-in Yapıldı" color="info" size="small" />;
    default: return <Chip label={status} size="small" />;
  }
};

export default function ReservationsTab({ reservations = [] }: { reservations?: any[] }) {
  const [localReservations, setLocalReservations] = useState(reservations);

  useEffect(() => {
    setLocalReservations(reservations);
    
    // Tembel iptal (lazy cancellation) kontrolü
    cancelExpiredReservations(reservations).then((updated) => {
      if (updated) {
        // Eğer veritabanında süresi geçmiş bir rezervasyon iptal edildiyse sayfayı yenile
        window.location.reload();
      }
    });
  }, [reservations]);

  const handleCheckIn = async (resId: string) => {
    // Demo QR okutma işlemi: durumu "checked_in" yapar.
    const supabase = createClient();
    const { error } = await supabase.from("reservation").update({ status: "checked_in" }).eq("id", resId);
    
    if (!error) {
      alert("QR Başarıyla Okutuldu! Odaya giriş yapabilirsiniz.");
      window.location.reload();
    } else {
      alert("Check-in sırasında bir hata oluştu.");
    }
  };

  // Statülere göre rezervasyonları ayırıyoruz ("checked_in" olanlar da aktif kalır)
  const activeReservations = localReservations.filter(r => r.status === "approved" || r.status === "pending" || r.status === "confirmed" || r.status === "checked_in");
  const pastReservations = localReservations.filter(r => r.status === "completed" || r.status === "cancelled");

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Aktif Rezervasyonlarım</Typography>
      <Stack spacing={2} sx={{ mb: 5 }}>
        {activeReservations.length === 0 ? (
          <Typography color="text.secondary">Aktif rezervasyonunuz bulunmamaktadır.</Typography>
        ) : (
          activeReservations.map((res) => (
            <Card key={res.id} variant="outlined" sx={{ p: 2, borderRadius: 2, borderColor: "primary.light" }}>
              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 2 }}>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                    <MeetingRoomIcon color="action" fontSize="small" />
                    <Typography sx={{ fontWeight: 600 }}>{res.space?.name || "Bilinmeyen Oda"}</Typography>
                    <Typography variant="body2" color="text.secondary">({res.space?.building?.name || "Bilinmeyen Bina"})</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AccessTimeIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(res.start_time)} | {formatTime(res.start_time)} - {formatTime(res.end_time)}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {getStatusChip(res.status)}
                  {res.status !== "checked_in" && (
                    <Button variant="contained" size="small" startIcon={<QrCodeScannerIcon />} onClick={() => handleCheckIn(res.id)}>
                      Check-in (QR)
                    </Button>
                  )}
                </Box>
              </Box>
            </Card>
          ))
        )}
      </Stack>

      <Divider sx={{ mb: 4 }} />
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Geçmiş Rezervasyonlarım</Typography>
      <Stack spacing={2}>
        {pastReservations.length === 0 ? (
          <Typography color="text.secondary">Geçmiş rezervasyonunuz bulunmamaktadır.</Typography>
        ) : (
          pastReservations.map((res) => (
            <Card key={res.id} variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: "#F8FAFC" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography sx={{ fontWeight: 600, mb: 0.5 }}>{res.space?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(res.start_time)} | {formatTime(res.start_time)} - {formatTime(res.end_time)}
                  </Typography>
                </Box>
                <Box>{getStatusChip(res.status)}</Box>
              </Box>
            </Card>
          ))
        )}
      </Stack>
    </Box>
  );
}
