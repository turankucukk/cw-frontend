"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "@/src/components/layout/Navbar"; // Sitenin orijinal Navbar'ı
import DashboardIcon from "@mui/icons-material/Dashboard";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PeopleIcon from "@mui/icons-material/People";
import AparthmentIcon from "@mui/icons-material/Apartment";
import { Box, Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Mobil yan menünün (Drawer) açık/kapalı durumunu tutan state
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { text: "Genel Bakış", icon: <DashboardIcon style={{ fontSize: "22px" }} />, path: "/admin" },
    { text: "Odalar", icon: <MeetingRoomIcon style={{ fontSize: "22px" }} />, path: "/admin/rooms" },
    { text: "Binalar" , icon: <AparthmentIcon style={{ fontSize:"22px"}}/>, path: "/admin/building"},
    { text: "Raporlar", icon: <AssessmentIcon style={{ fontSize: "22px" }} />, path: "/admin/reports" },
    { text: "Kullanıcılar", icon: <PeopleIcon style={{ fontSize: "22px" }} />, path: "/admin/users" },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Hem masaüstü hem de mobil Drawer içinde kullanılacak ortak menü yapısı
  const sidebarContent = (
    <Box sx={{
      width: "100px",
      backgroundColor: "#ffffff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "32px 0",
      height: "100%",
      boxSizing: "border-box"
    }}>
      {/* İSTEK ÜZERİNE EV SİMGESİ KALDIRILDI */}

      {/* Menü İkonları */}
      <nav style={{ flexGrow: 1, width: "100%" }}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.text}>
                <button
                  onClick={() => {
                    router.push(item.path);
                    setMobileOpen(false); // Mobilde linke tıklayınca menü kapansın
                  }}
                  title={item.text}
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "18px",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    backgroundColor: isActive ? "#2563eb" : "transparent", 
                    color: isActive ? "#ffffff" : "#9ca3af",
                    transition: "all 0.2s ease",
                    boxShadow: isActive ? "0 8px 16px rgba(37, 99, 235, 0.25)" : "none"
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "#f9fafb";
                      e.currentTarget.style.color = "#1f2937";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#9ca3af";
                    }
                  }}
                >
                  {item.icon}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </Box>
  );

  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column",
      minHeight: "100vh", 
      backgroundColor: "#f4f5f7", 
      fontFamily: "'Inter', sans-serif"
    }}>
      
      {/* ─── 1. KATMAN: SİTENİN ORİJİNAL NAVBAR'I ─── */}
      <Box sx={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 1100 }}>
        <Navbar />
      </Box>

      {/* ─── NAVBAR SPACER ─── */}
      <Box sx={{ height: "72px", width: "100%" }} />

      {/* ─── 2. KATMAN: FLOATING DASHBOARD GÖVDESİ ─── */}
      <Box sx={{ 
        display: "flex", 
        flexGrow: 1, 
        padding: { xs: "12px", md: "16px" }, // Mobilde dış boşluğu biraz daralttık
        gap: { xs: 0, md: "16px" }, // Mobilde yan menü gizlendiği için aradaki gap'i sıfırladık
        height: "calc(100vh - 72px)", 
        boxSizing: "border-box"
      }}>
        
        {/* MASAÜSTÜ SIDEBAR (Mobilde gizlenir) */}
        <Box 
          component="aside"
          sx={{
            display: { xs: "none", md: "block" }, // Mobilde gizle, tablet ve üstünde göster
            width: "100px",
            borderRadius: "24px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
            overflow: "hidden",
            height: "100%"
          }}
        >
          {sidebarContent}
        </Box>

        {/* SAĞ DİNAMİK İÇERİK KARTI */}
        <Box 
          component="main"
          sx={{ 
            flexGrow: 1, 
            padding: { xs: "16px", md: "28px" }, 
            backgroundColor: "#ffffff", 
            borderRadius: "24px", 
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
            boxSizing: "border-box",
            overflowY: "auto",
            height: "100%",
            display: "flex",
            flexDirection: "column"
          }}
        >
          {/* SADECE MOBİLDE GÖZÜKEN MENÜ AÇMA BUTONU */}
          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", mb: 2, gap: 1 }}>
            <IconButton 
              onClick={handleDrawerToggle} 
              sx={{ backgroundColor: "#f3f4f6", borderRadius: "12px" }}
            >
              <MenuIcon />
            </IconButton>
            <span style={{ fontWeight: 600, color: "#111827", fontSize: "16px" }}>Admin Menü</span>
          </Box>

          {children}
        </Box>

      </Box>

      {/* MOBİL YAN MENÜ (DRAWER) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Performans artışı sağlar
        }}
        sx={{
          display: { xs: "block", md: "none" }, // Sadece mobilde aktif
          "& .MuiDrawer-paper": { 
            boxSizing: "border-box", 
            width: "100px", 
            borderTopRightRadius: "24px", 
            borderBottomRightRadius: "24px",
            border: "none" // Kenar çizgisini kaldırmak için
          },
        }}
      >
        {sidebarContent}
      </Drawer>

    </Box>
  );
}