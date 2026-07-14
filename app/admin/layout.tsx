"use client";
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
  );
}