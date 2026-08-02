"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { useUserRole } from "@/src/hooks/useUserRole";
import { Box, Typography, Card, CircularProgress } from "@mui/material";

const MOCK_STATS = {
  totalUsers: 137,
  activeUsers: 42,
  totalRooms: 8,
  occupiedNow: 3,
  todayBookings: 19,
  occupancyRate: 0.68,
};

const KPI_CARDS = [
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
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress size={40} sx={{ color: "#2563eb" }} />
      </Box>
    );
  }

  if (role !== "superadmin") {
    return null;
  }

  return (
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
      {/* BAŞLIK ALANI */}
      <Typography 
        variant="h1" 
        sx={{ 
          fontSize: { xs: "20px", sm: "24px" }, 
          fontWeight: 700, 
          color: "#111827", 
          mb: 0.5 
        }}
      >
        Genel Bakış
      </Typography>

      <Typography 
        variant="body2" 
        sx={{ 
          color: "#6b7280", 
          fontSize: { xs: "13px", sm: "14px" }, 
          mb: { xs: 2.5, sm: 3 } 
        }}
      >
        DeskHere yönetim paneline hoş geldin.
      </Typography>

      {/* KPI KARTLARI GRID */}
      <Box 
        sx={{ 
          display: "grid", 
          gridTemplateColumns: {
            xs: "1fr", // Mobilde tek kolon
            sm: "repeat(2, 1fr)", // Tabletlerde 2 kolon
            lg: "repeat(4, 1fr)" // Masaüstünde 4 kolon
          }, 
          gap: { xs: 2, sm: 2.5 }, 
          mb: { xs: 2.5, sm: 3 } 
        }}
      >
        {KPI_CARDS.map((card) => (
          <Card 
            key={card.label} 
            elevation={0}
            sx={{ 
              backgroundColor: "#ffffff", 
              padding: { xs: "16px", sm: "20px" }, 
              borderRadius: "16px", 
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Box>
                <Typography 
                  sx={{ 
                    fontSize: { xs: "22px", sm: "26px" }, 
                    fontWeight: 700, 
                    color: "#111827", 
                    lineHeight: 1.2,
                    mb: 0.5 
                  }}
                >
                  {card.value}
                </Typography>

                <Typography 
                  sx={{ 
                    color: "#6b7280", 
                    fontSize: { xs: "12px", sm: "13px" }, 
                    fontWeight: 500 
                  }}
                >
                  {card.label}
                </Typography>
              </Box>

              <Box sx={{
                width: { xs: "36px", sm: "40px" },
                height: { xs: "36px", sm: "40px" },
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: `${card.color}12`,
                color: card.color,
                flexShrink: 0
              }}>
                {card.icon}
              </Box>
            </Box>
          </Card>
        ))}
      </Box>

      {/* ALT GRAFİK VE İLERLEME ÇUBUKLARI */}
      <Box 
        sx={{ 
          display: "grid", 
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, 
          gap: { xs: 2, sm: 2.5 } 
        }}
      >
        {/* Anlık Doluluk */}
        <Card 
          elevation={0}
          sx={{ 
            backgroundColor: "#ffffff", 
            padding: { xs: "16px", sm: "20px" }, 
            borderRadius: "16px", 
            border: "1px solid #e5e7eb"
          }}
        >
          <Typography 
            variant="h3" 
            sx={{ fontSize: "15px", fontWeight: 600, mb: 2, color: "#111827" }}
          >
            Anlık Doluluk Oranı
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1.5, mb: 2 }}>
            <Typography sx={{ fontSize: { xs: "28px", sm: "32px" }, fontWeight: 700, color: "#111827" }}>
              %{Math.round(MOCK_STATS.occupancyRate * 100)}
            </Typography>

            <Box 
              component="span"
              sx={{ 
                fontSize: "12px", 
                px: 1.25, 
                py: 0.5, 
                borderRadius: "6px", 
                backgroundColor: "#eff6ff", 
                color: "#2563eb", 
                fontWeight: 600 
              }}
            >
              {MOCK_STATS.occupiedNow} / {MOCK_STATS.totalRooms} oda dolu
            </Box>
          </Box>
          
          {/* Progress Bar */}
          <Box sx={{ width: "100%", height: "8px", backgroundColor: "#f3f4f6", borderRadius: "4px", overflow: "hidden" }}>
            <Box sx={{ 
              width: `${MOCK_STATS.occupancyRate * 100}%`, 
              height: "100%", 
              backgroundColor: "#2563eb",
              borderRadius: "4px",
              transition: "width 0.4s ease"
            }} />
          </Box>
        </Card>

        {/* Doluluk Grafiği Kartı */}
        <Card 
          elevation={0}
          sx={{ 
            backgroundColor: "#ffffff", 
            padding: { xs: "16px", sm: "20px" }, 
            borderRadius: "16px", 
            border: "1px solid #e5e7eb",
            minHeight: "160px" 
          }}
        >
          <Typography 
            variant="h3" 
            sx={{ fontSize: "15px", fontWeight: 600, mb: 1.5, color: "#111827" }}
          >
            Doluluk Grafiği
          </Typography>

          <Typography sx={{ color: "#6b7280", fontSize: "13px" }}>
            Grafik burada yer alacak — Recharts veya mui-charts entegrasyonu için alan hazırlandı.
          </Typography>
        </Card>

      </Box>
    </Box>
  );
}