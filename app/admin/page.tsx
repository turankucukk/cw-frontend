"use client";
<<<<<<< HEAD
import { Box, Card, Grid, Typography, LinearProgress, Chip } from "@mui/material";
=======

import { useEffect } from "react";
import { useRouter } from "next/navigation";
>>>>>>> d47765eab71ab0e4891f60a2e0fd0c3be90f3d01
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
<<<<<<< HEAD

// TODO: backend hazır olunca GET /api/admin/stats ile gelecek
=======
import { useUserRole } from "@/src/hooks/useUserRole";

>>>>>>> d47765eab71ab0e4891f60a2e0fd0c3be90f3d01
const MOCK_STATS = {
  totalUsers: 137,
  activeUsers: 42,
  totalRooms: 8,
  occupiedNow: 3,
  todayBookings: 19,
  occupancyRate: 0.68,
};

const KPI_CARDS = [
<<<<<<< HEAD
  { label: "Toplam Kullanıcı", value: MOCK_STATS.totalUsers, icon: <PeopleIcon />, color: "#0052CC" },
  { label: "Aktif Kullanıcı", value: MOCK_STATS.activeUsers, icon: <PersonIcon />, color: "#00B4D8" },
  { label: "Toplam Oda", value: MOCK_STATS.totalRooms, icon: <MeetingRoomIcon />, color: "#11998E" },
  { label: "Bugünkü Rezervasyon", value: MOCK_STATS.todayBookings, icon: <EventAvailableIcon />, color: "#F59E0B" },
];

export default function AdminDashboardPage() {
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
=======
  { label: "Toplam Kullanıcı", value: MOCK_STATS.totalUsers, icon: <PeopleIcon />, color: "#2563eb" },
  { label: "Aktif Kullanıcı", value: MOCK_STATS.activeUsers, icon: <PersonIcon />, color: "#06b6d4" },
  { label: "Toplam Oda", value: MOCK_STATS.totalRooms, icon: <MeetingRoomIcon />, color: "#10b981" },
  { label: "Bugünkü Rezervasyon", value: MOCK_STATS.todayBookings, icon: <EventAvailableIcon />, color: "#f59e0b" },
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
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div style={{
          width: "40px",
          height: "40px",
          border: "3px solid #f3f3f3",
          borderTop: "3px solid #2563eb",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }} />
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (role !== "superadmin") {
    return null;
  }

  return (
    <div>
      {/* Başlık Alanı */}
      <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#111827", margin: "0 0 4px 0" }}>
        Genel Bakış
      </h1>
      <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 32px 0" }}>
        DeskHere yönetim paneline hoş geldin.
      </p>

      {/* KPI Kartları Grid */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
        gap: "24px", 
        marginBottom: "32px" 
      }}>
        {KPI_CARDS.map((card) => (
          <div 
            key={card.label} 
            style={{ 
              backgroundColor: "#ffffff", 
              padding: "24px", 
              borderRadius: "12px", 
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: "28px", fontWeight: 700, color: "#111827", marginBottom: "4px" }}>
                  {card.value}
                </div>
                <div style={{ color: "#6b7280", fontSize: "13px", fontWeight: 500 }}>
                  {card.label}
                </div>
              </div>
              <div style={{
                width: "42px",
                height: "42px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: `${card.color}12`,
                color: card.color
              }}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alt Grafik ve İlerleme Çubukları */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", 
        gap: "24px" 
      }}>
        
        {/* Anlık Doluluk */}
        <div style={{ 
          backgroundColor: "#ffffff", 
          padding: "28px", 
          borderRadius: "12px", 
          border: "1px solid #e5e7eb"
        }}>
          <h3 style={{ fontSize: "15px", fontWeight: 600, margin: "0 0 20px 0", color: "#111827" }}>
            Anlık Doluluk oranı
          </h3>
          <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "20px" }}>
            <span style={{ fontSize: "36px", fontWeight: 700, color: "#111827" }}>
              %{Math.round(MOCK_STATS.occupancyRate * 100)}
            </span>
            <span style={{ 
              fontSize: "12px", 
              padding: "4px 10px", 
              borderRadius: "6px", 
              backgroundColor: "#eff6ff", 
              color: "#2563eb", 
              fontWeight: 600 
            }}>
              {MOCK_STATS.occupiedNow} / {MOCK_STATS.totalRooms} oda dolu
            </span>
          </div>
          
          {/* Progress Bar */}
          <div style={{ width: "100%", height: "8px", backgroundColor: "#f3f4f6", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{ 
              width: `${MOCK_STATS.occupancyRate * 100}%`, 
              height: "100%", 
              backgroundColor: "#2563eb",
              borderRadius: "4px"
            }} />
          </div>
        </div>

        {/* Doluluk Grafiği */}
        <div style={{ 
          backgroundColor: "#ffffff", 
          padding: "28px", 
          borderRadius: "12px", 
          border: "1px solid #e5e7eb",
          minHeight: "180px" 
        }}>
          <h3 style={{ fontSize: "15px", fontWeight: 600, margin: "0 0 16px 0", color: "#111827" }}>
            Doluluk Grafiği
          </h3>
          <p style={{ color: "#6b7280", fontSize: "13px", margin: 0 }}>
            Grafik burada yer alacak — Recharts veya mui-charts entegrasyonu için alan hazırlandı.
          </p>
        </div>

      </div>
    </div>
>>>>>>> d47765eab71ab0e4891f60a2e0fd0c3be90f3d01
  );
}