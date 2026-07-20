"use client";

import { Box, Card, Grid, Typography, Chip, Stack } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import StarIcon from "@mui/icons-material/Star";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

const USER_SUMMARY = {
  nextReservation: "A-102",
  reservationTime: "14:30",
  favoriteRoom: "Güneş Salonu",
  points: 240,
};

const QUICK_ACTIONS = [
  { label: "Bugünkü rezervasyon", value: "3 oda" },
  { label: "Yaklaşan toplantı", value: "09:30" },
  { label: "Tercih edilen alan", value: "Sessiz çalışma" },
];

export default function DashboardTab() {
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
                <Chip label={`${USER_SUMMARY.nextReservation} · ${USER_SUMMARY.reservationTime}`} color="primary" />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <MeetingRoomIcon color="action" />
                  <Typography>Favori oda</Typography>
                </Box>
                <Typography sx={{ fontWeight: 600 }}>{USER_SUMMARY.favoriteRoom}</Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <StarIcon sx={{ color: "#F59E0B" }} />
                  <Typography>Biriktirdiğin puan</Typography>
                </Box>
                <Typography sx={{ fontWeight: 600 }}>{USER_SUMMARY.points} puan</Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}>
            <Typography sx={{ fontWeight: 700, mb: 2 }}>Hızlı İşlemler</Typography>
            <Stack spacing={1.5}>
              {QUICK_ACTIONS.map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "#F8FAFC",
                  }}
                >
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
              Henüz bir rezervasyon geçmişin yok. Yeni bir oda seçerek hemen başlayabilirsin.
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
