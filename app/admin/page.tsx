"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Card, Grid, Typography, LinearProgress, Chip, CircularProgress } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { useUserRole } from "@/src/hooks/useUserRole";

const MOCK_STATS = {
  totalUsers: 137,
  activeUsers: 42,
  totalRooms: 8,
  occupiedNow: 3,
  todayBookings: 19,
  occupancyRate: 0.68,
};

const KPI_CARDS = [
  { label: "Toplam Kullanıcı", value: MOCK_STATS.totalUsers, icon: <PeopleIcon />, color: "#0052CC" },
  { label: "Aktif Kullanıcı", value: MOCK_STATS.activeUsers, icon: <PersonIcon />, color: "#00B4D8" },
  { label: "Toplam Oda", value: MOCK_STATS.totalRooms, icon: <MeetingRoomIcon />, color: "#11998E" },
  { label: "Bugünkü Rezervasyon", value: MOCK_STATS.todayBookings, icon: <EventAvailableIcon />, color: "#F59E0B" },
];

export default function AdminDashboardPage() {
  const { role, loading } = useUserRole();
  const router = useRouter();

  useEffect(() => {
    if (!loading && role !== "superadmin") {
      router.push("/");
    }
  }, [role, loading, router]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (role !== "superadmin") {
    return null;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Genel Bakış
      </Typography>
      <Typography sx={{ color: "text.secondary", mb: 4 }}>
        DeskHere yönetim paneline hoş geldin.
      </Typography>

      <Grid container spacing={3}>
        {KPI_CARDS.map((card) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.label}>
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: `${card.color}1A`,
                  color: card.color,
                  mb: 2,
                }}
              >
                {card.icon}
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {card.value}
              </Typography>
              <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
                {card.label}
              </Typography>
            </Card>
          </Grid>
        ))}

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}>
            <Typography sx={{ fontWeight: 600, mb: 2 }}>Anlık Doluluk</Typography>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 2 }}>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                %{Math.round(MOCK_STATS.occupancyRate * 100)}
              </Typography>
              <Chip
                size="small"
                label={`${MOCK_STATS.occupiedNow} / ${MOCK_STATS.totalRooms} oda dolu`}
                sx={{ bgcolor: "rgba(0,82,204,0.08)", color: "#0052CC", fontWeight: 600 }}
              />
            </Box>
            <LinearProgress
              variant="determinate"
              value={MOCK_STATS.occupancyRate * 100}
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: "#F1F5F9",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 5,
                  background: "linear-gradient(135deg, #0052CC 0%, #00B4D8 100%)",
                },
              }}
            />
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 1px 2px rgba(0,0,0,0.06)", minHeight: 180 }}>
            <Typography sx={{ fontWeight: 600, mb: 2 }}>Doluluk Grafiği</Typography>
            <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
              Grafik burada olacak — @mui/x-charts eklenecek.
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}