"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
  );
}