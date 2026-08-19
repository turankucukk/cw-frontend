"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { useUserRole } from "@/src/hooks/useUserRole";
import { Box, Typography, Card, CircularProgress } from "@mui/material";
import { createClient } from "@/src/utils/supabase/client";
import dayjs from "dayjs";
import { BarChart } from "@mui/x-charts/BarChart";

type Stats = {
  totalUsers: number;
  activeUsers: number;
  totalRooms: number;
  occupiedNow: number;
  todayBookings: number;
  occupancyRate: number;
  weeklyData: { day: string; count: number }[];
};

export default function AdminDashboardPage() {
  const { role, loading } = useUserRole();
  const router = useRouter();

  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!loading && role !== "superadmin" && role !== "manager") {
      router.push("/");
    }
  }, [role, loading, router]);

  useEffect(() => {
    if (loading || (role !== "superadmin" && role !== "manager")) return;

    const fetchStats = async () => {
      setStatsLoading(true);
      const supabase = createClient();
      const now = dayjs();
      const todayStart = now.startOf("day").toISOString();
      const todayEnd = now.endOf("day").toISOString();
      const thirtyDaysAgo = now.subtract(30, "day").toISOString();
      const sevenDaysAgo = now.subtract(6, "day").startOf("day").toISOString();
      const nowIso = now.toISOString();

      const [
        { count: totalUsers },
        { count: totalRooms },
        { data: recentReservations },
        { count: todayBookings },
        { data: occupiedRows },
        { data: weeklyRows },
      ] = await Promise.all([
        supabase.from("user").select("id", { count: "exact", head: true }),
        supabase.from("space").select("id", { count: "exact", head: true }).eq("isActive", true),
        supabase
          .from("reservation")
          .select("user_id")
          .eq("status", "confirmed")
          .gte("start_time", thirtyDaysAgo),
        supabase
          .from("reservation")
          .select("id", { count: "exact", head: true })
          .eq("status", "confirmed")
          .gte("start_time", todayStart)
          .lte("start_time", todayEnd),
        supabase
          .from("reservation")
          .select("id")
          .eq("status", "confirmed")
          .lte("start_time", nowIso)
          .gte("end_time", nowIso),
        supabase
          .from("reservation")
          .select("start_time")
          .eq("status", "confirmed")
          .gte("start_time", sevenDaysAgo),
      ]);

      const activeUsers = new Set((recentReservations ?? []).map((r) => r.user_id)).size;
      const occupiedNow = occupiedRows?.length ?? 0;
      const roomCount = totalRooms ?? 0;
      const occupancyRate = roomCount > 0 ? occupiedNow / roomCount : 0;

      const dayCounts: Record<string, number> = {};
      for (let i = 0; i < 7; i++) {
        const label = now.subtract(6 - i, "day").format("DD.MM");
        dayCounts[label] = 0;
      }
      (weeklyRows ?? []).forEach((r) => {
        const label = dayjs(r.start_time).format("DD.MM");
        if (dayCounts[label] !== undefined) {
          dayCounts[label] += 1;
        }
      });
      const weeklyData = Object.entries(dayCounts).map(([day, count]) => ({ day, count }));

      setStats({
        totalUsers: totalUsers ?? 0,
        activeUsers,
        totalRooms: roomCount,
        occupiedNow,
        todayBookings: todayBookings ?? 0,
        occupancyRate,
        weeklyData,
      });
      setStatsLoading(false);
    };

    fetchStats();
  }, [loading, role]);

  if (loading || statsLoading || !stats) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress size={40} sx={{ color: "#2563eb" }} />
      </Box>
    );
  }

  if (role !== "superadmin" && role !== "manager") {
    return null;
  }

  const KPI_CARDS = [
    { label: "Toplam Kullanıcı", value: stats.totalUsers, icon: <PeopleIcon />, color: "#2563eb" },
    { label: "Aktif Kullanıcı", value: stats.activeUsers, icon: <PersonIcon />, color: "#06b6d4" },
    { label: "Toplam Oda", value: stats.totalRooms, icon: <MeetingRoomIcon />, color: "#10b981" },
    { label: "Bugünkü Rezervasyon", value: stats.todayBookings, icon: <EventAvailableIcon />, color: "#f59e0b" },
  ];

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
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)"
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
              %{Math.round(stats.occupancyRate * 100)}
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
              {stats.occupiedNow} / {stats.totalRooms} oda dolu
            </Box>
          </Box>
          
          {/* Progress Bar */}
          <Box sx={{ width: "100%", height: "8px", backgroundColor: "#f3f4f6", borderRadius: "4px", overflow: "hidden" }}>
            <Box sx={{ 
              width: `${stats.occupancyRate * 100}%`, 
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
            Son 7 Gün Rezervasyon
          </Typography>

          <BarChart
            dataset={stats.weeklyData}
            xAxis={[{ dataKey: "day", scaleType: "band", disableLine: true, disableTicks: true }]}
            yAxis={[{ disableLine: true, disableTicks: true }]}
            series={[{ dataKey: "count", label: "Rezervasyon", color: "#2563eb" }]}
            height={140}
            borderRadius={6}
            margin={{ left: 10, right: 10, top: 10, bottom: 20 }}
            hideLegend
          />
        </Card>

      </Box>
    </Box>
  );
}