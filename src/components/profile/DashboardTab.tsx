"use client";
import { Box, Card, Grid, Typography, Chip, Stack } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

export default function DashboardTab({ reservations = [], userData }: { reservations?: any[], userData?: any }) {
  // Yaklaşan rezervasyonu bul (En yakın tarihli olan)
  const activeStatuses = ["approved", "pending", "confirmed", "checked_in"];
  const activeReservations = reservations.filter(r => activeStatuses.includes(r.status));
  const upcomingRes = activeReservations.length > 0 ? activeReservations[0] : null;

  const formatUpcomingTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    const isToday = d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    const timeStr = d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    if (isToday) return timeStr; // Eğer bugünse sadece saati göster
    const dateFormatted = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    return `${dateFormatted} · ${timeStr}`; // Bugün değilse tarihi de göster
  };

  const QUICK_ACTIONS = [
    { label: "Aktif rezervasyon", value: activeReservations.length > 0 ? `${activeReservations.length} oda` : "Yok" },
    { label: "Yaklaşan toplantı", value: upcomingRes ? formatUpcomingTime(upcomingRes.start_time) : "-" },
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}>
            <Typography sx={{ fontWeight: 700, mb: 2 }}>Yaklaşan Planın</Typography>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarTodayIcon color="primary" />
                  <Typography sx={{ whiteSpace: "nowrap" }}>Sonraki rezervasyon</Typography>
                </Box>
                {upcomingRes ? (
                  <Chip label={`${upcomingRes.space?.name || "Oda"} · ${formatUpcomingTime(upcomingRes.start_time)}`} color="primary" />
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