"use client";
import { Box, Card, Grid, Typography, Chip, Stack } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

export default function DashboardTab({ reservations = [], userData }: { reservations?: any[], userData?: any }) {
  // Yaklaşan rezervasyonu bul (En yakın tarihli olan)
  const upcomingRes = reservations.find(r => r.status === "approved" || r.status === "pending");

  const QUICK_ACTIONS = [
    { label: "Bugünkü rezervasyon", value: upcomingRes ? "1 oda" : "Yok" },
    { label: "Yaklaşan toplantı", value: upcomingRes ? new Date(upcomingRes.start_time).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'}) : "-" },
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}>
            <Typography sx={{ fontWeight: 700, mb: 2 }}>Bugünkü Planın</Typography>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarTodayIcon color="primary" />
                  <Typography>Sonraki rezervasyon</Typography>
                </Box>
                {upcomingRes ? (
                  <Chip label={`${upcomingRes.space?.name || "Oda"} · ${new Date(upcomingRes.start_time).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}`} color="primary" />
                ) : (
                  <Typography sx={{ color: "text.secondary" }}>Rezervasyon Yok</Typography>
                )}
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}>
            <Typography sx={{ fontWeight: 700, mb: 2 }}>Hızlı İşlemler</Typography>
            <Stack spacing={1.5}>
              {QUICK_ACTIONS.map((item) => (
                <Box key={item.label} sx={{ display: "flex", justifyContent: "space-between", p: 1.5, borderRadius: 2, bgcolor: "#F8FAFC" }}>
                  <Typography sx={{ color: "text.secondary" }}>{item.label}</Typography>
                  <Typography sx={{ fontWeight: 600 }}>{item.value}</Typography>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <EventAvailableIcon color="primary" />
              <Typography sx={{ fontWeight: 700 }}>Rezervasyon geçmişin</Typography>
            </Box>
            <Typography sx={{ color: "text.secondary" }}>
              {reservations.length > 0 ? `Toplam ${reservations.length} rezervasyon geçmişin bulunuyor.` : "Henüz bir rezervasyon geçmişin yok. Yeni bir oda seçerek hemen başlayabilirsin."}
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}