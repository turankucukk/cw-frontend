"use client";
<<<<<<< HEAD
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, Typography, AppBar, Avatar,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import BarChartIcon from "@mui/icons-material/BarChart";
import PeopleIcon from "@mui/icons-material/People";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { can, isAdmin, type Role } from "@/src/lib/permissions";

const DRAWER_WIDTH = 260;

const NAV_ITEMS = [
  { label: "Genel Bakış", href: "/admin", icon: <DashboardIcon />, permission: "rooms.view" },
  { label: "Odalar", href: "/admin/rooms", icon: <MeetingRoomIcon />, permission: "rooms.view" },
  { label: "Raporlar", href: "/admin/reports", icon: <BarChartIcon />, permission: "reports.view" },
  { label: "Kullanıcılar", href: "/admin/users", icon: <PeopleIcon />, permission: "users.view" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // TODO: gerçek oturumdan gelecek (Supabase). Şimdilik sabit.
  const role: Role = "superadmin";

  if (!isAdmin(role)) return null;

  const visibleItems = NAV_ITEMS.filter((item) => can(role, item.permission));

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F9FAFB" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            borderRight: "1px dashed #E5E7EB",
            bgcolor: "#fff",
          },
        }}
      >
        <Toolbar sx={{ px: 3 }}>
          <Typography sx={{ fontWeight: 800, fontSize: 20, color: "#1E293B" }}>
            Desk
            <Box component="span" sx={{ color: "#0052CC", fontWeight: 400 }}>
              Here
            </Box>
          </Typography>
        </Toolbar>

        <List sx={{ px: 2 }}>
          {visibleItems.map((item) => (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={pathname === item.href}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                "&.Mui-selected": {
                  bgcolor: "rgba(0, 82, 204, 0.08)",
                  color: "#0052CC",
                  "& .MuiListItemIcon-root": { color: "#0052CC" },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(6px)",
            borderBottom: "1px solid #F1F5F9",
          }}
        >
          <Toolbar sx={{ justifyContent: "flex-end", gap: 2 }}>
            <Typography sx={{ color: "#64748B", fontSize: 14 }}>
              {role === "superadmin" ? "Süper Yönetici" : "Yönetici"}
            </Typography>
            <Avatar sx={{ width: 36, height: 36, bgcolor: "#0052CC" }}>T</Avatar>
            </Toolbar>
        </AppBar>

        <Box component="main" sx={{ p: { xs: 2, md: 4 } }}>
          {children}
        </Box>
      </Box>
    </Box>
=======

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "@/src/components/layout/Navbar"; // Sitenin orijinal Navbar'ı
import DashboardIcon from "@mui/icons-material/Dashboard";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PeopleIcon from "@mui/icons-material/People";
import HomeIcon from "@mui/icons-material/Home";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { text: "Genel Bakış", icon: <DashboardIcon style={{ fontSize: "22px" }} />, path: "/admin" },
    { text: "Odalar", icon: <MeetingRoomIcon style={{ fontSize: "22px" }} />, path: "/admin/rooms" },
    { text: "Raporlar", icon: <AssessmentIcon style={{ fontSize: "22px" }} />, path: "/admin/reports" },
    { text: "Kullanıcılar", icon: <PeopleIcon style={{ fontSize: "22px" }} />, path: "/admin/users" },
  ];

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column",
      minHeight: "100vh", 
      backgroundColor: "#f4f5f7", 
      fontFamily: "'Inter', sans-serif"
    }}>
      
      {/* ─── 1. KATMAN: SİTENİN ORİJİNAL NAVBAR'I ─── */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 1100 }}>
        <Navbar />
      </div>

      {/* ─── NAVBAR SPACER ─── */}
      <div style={{ height: "72px", width: "100%" }} />

      {/* ─── 2. KATMAN: FLOATING DASHBOARD GÖVDESİ ─── */}
      <div style={{ 
        display: "flex", 
        flexGrow: 1, 
        padding: "16px", 
        gap: "16px",
        height: "calc(100vh - 72px)", 
        boxSizing: "border-box"
      }}>
        
        {/* SOL FLOATING SIDEBAR */}
        <aside style={{
          width: "100px",
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "32px 0",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
          boxSizing: "border-box",
          height: "100%"
        }}>
          {/* Logo / Ev Simgesi */}
          <div 
            onClick={() => router.push("/")}
            style={{ 
              width: "50px", 
              height: "50px", 
              borderRadius: "16px", 
              backgroundColor: "#f3f4f6", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              cursor: "pointer",
              marginBottom: "48px",
              color: "#111827",
              transition: "transform 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            title="Anasayfaya Dön"
          >
            <HomeIcon style={{ fontSize: "24px" }} />
          </div>

          {/* Menü İkonları */}
          <nav style={{ flexGrow: 1, width: "100%" }}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <li key={item.text}>
                    <button
                      onClick={() => router.push(item.path)}
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
                        // Aktif buton rengi ve gölgesi mavi olarak güncellendi
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
        </aside>

        {/* SAĞ DİNAMİK İÇERİK KARTI */}
        <main style={{ 
          flexGrow: 1, 
          padding: "28px", 
          backgroundColor: "#ffffff", 
          borderRadius: "24px", 
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
          boxSizing: "border-box",
          overflowY: "auto",
          height: "100%"
        }}>
          {children}
        </main>

      </div>
    </div>
>>>>>>> d47765eab71ab0e4891f60a2e0fd0c3be90f3d01
  );
}