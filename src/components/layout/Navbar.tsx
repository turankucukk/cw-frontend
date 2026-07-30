"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
<<<<<<< HEAD
import {
  Box,
  AppBar,
  Button,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  Divider,
=======
import { 
  Box, 
  AppBar, 
  Button, 
  Avatar, 
  Menu, 
  MenuItem, 
  IconButton, 
  ListItemIcon, 
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText
>>>>>>> AliBranch
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { createClient } from "@/src/utils/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { translatePage } from "../../services/translateService";
import { useUserRole } from "@/src/hooks/useUserRole";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createClient();
  const { role, loading } = useUserRole();

  // Mobil Yan Menü (Drawer) State'i
  const [mobileOpen, setMobileOpen] = useState(false);

  // Profil Menüsü State'i
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, newSession) => setSession(newSession),
    );

    return () => subscription.subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    handleMenuClose();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

<<<<<<< HEAD
  // Kullanıcının e-posta adresinden ilk harfini alarak geçici bir avatar oluşturmak için:
  const userInitial = session?.user?.email
    ? session.user.email[0].toUpperCase()
    : "U";
=======
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const userInitial = session?.user?.email ? session.user.email[0].toUpperCase() : "U";
>>>>>>> AliBranch
  const userAvatarUrl = session?.user?.user_metadata?.avatar_url || "";

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `transition-colors text-sm font-semibold whitespace-nowrap ${
      isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
    }`;
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #e5e7eb",
          color: "#111827",
          height: "72px",
          justifyContent: "center",
          px: 2,
        }}
      >
<<<<<<< HEAD
        <Box className="flex items-center justify-between w-full max-w-7xl mx-auto px-4">
          {/* LOGO */}
          <Link
            href="/"
            style={{ textDecoration: "none", color: "#111827" }}
            className="text-xl font-bold tracking-tight"
          >
            Desk<span style={{ color: "#2563eb" }}>Here</span>
          </Link>

          {/* DİNAMİK AKTİF LİNKLER */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              ml: 6,
              gap: 4,
            }}
          >
            <Link href="/buildings" className={getLinkClass("/locations")}>
              Binalar
            </Link>
            <Link href="/rooms" className={getLinkClass("/rooms")}>
              Odalar
            </Link>

            <Link href="/services" className={getLinkClass("/services")}>
              Servislerimiz
            </Link>
            <Link href="/workspaces" className={getLinkClass("/workspaces")}>
              Çalışma Alanlarımız
            </Link>
            <Link href="/resources" className={getLinkClass("/resources")}>
              Kaynaklar
            </Link>
=======
        <Box className="flex items-center justify-between w-full max-w-7xl mx-auto px-2 sm:px-4 relative">
          
          {/* SOL TARAFLI ALAN: MOBİL HAMBURGER + EN SOLA ÇEKİLMİŞ BÜYÜK LOGO */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: { xs: 0, md: -2 } }}>
            {/* Mobilde Çıkan Hamburger Butonu */}
            <IconButton
              onClick={handleDrawerToggle}
              sx={{ display: { xs: "flex", md: "none" }, color: "#111827", mr: 1 }}
            >
              <MenuIcon />
            </IconButton>

            {/* BÜYÜTÜLMÜŞ LOGO */}
            <Link 
              href="/" 
              style={{ textDecoration: "none", color: "#111827" }} 
              className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center select-none"
            >
              Desk<span style={{ color: "#2563eb" }}>Here</span>
            </Link>
          </Box>

          {/* MASAÜSTÜ: EKRANI TAM ORTALAYAN VE ARALARI GENİŞLETİLMİŞ LİNKLER */}
          <Box 
            sx={{ 
              display: { xs: "none", md: "flex" }, 
              alignItems: "center", 
              gap: 6, // Linkler arası geniş boşluk
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)"
            }}
          >
            <Link href="/" className={getLinkClass("/")}>Anasayfa</Link>
            <Link href="/buildings" className={getLinkClass("/buildings")}>Binalar</Link>
            <Link href="/workspaces" className={getLinkClass("/workspaces")}>Çalışma Alanlarımız</Link>
            <Link href="/resources" className={getLinkClass("/resources")}>Kaynaklar</Link>
>>>>>>> AliBranch
            {!loading && role === "superadmin" && (
              <Link href="/admin" className={getLinkClass("/admin")}>
                Admin
              </Link>
            )}
          </Box>

<<<<<<< HEAD
          {/* SAĞ TARAF (DİL SEÇİCİ + GİRİŞ/PROFİL) */}
          <Box
            sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 2.5 }}
          >
=======
          {/* EN SAĞ: DİL SEÇİCİ VE PROFİL / GİRİŞ BUTONLARI */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
            
>>>>>>> AliBranch
            {/* Dil Seçici */}
            <select
              onChange={(e) => translatePage(e.target.value)}
              defaultValue="tr"
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm bg-white font-medium text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="en">EN</option>
              <option value="tr">TR</option>
            </select>

            {/* Giriş Durumuna Göre Değişen Alan */}
            {session ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
<<<<<<< HEAD
                {/* Profil Resmi Butonu */}
                <IconButton
                  onClick={handleMenuOpen}
                  size="small"
                  sx={{
=======
                <IconButton 
                  onClick={handleMenuOpen} 
                  size="small" 
                  sx={{ 
>>>>>>> AliBranch
                    padding: 0.5,
                    border: "2px solid #e5e7eb",
                    "&:hover": { borderColor: "#2563eb" },
                    transition: "border-color 0.2s",
                  }}
                >
                  <Avatar
                    src={userAvatarUrl}
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: "#2563eb",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    {userInitial}
                  </Avatar>
                </IconButton>

                {/* Profil Açılır Menüsü */}
                <Menu
                  anchorEl={anchorEl}
                  open={isMenuOpen}
                  onClose={handleMenuClose}
                  onClick={handleMenuClose}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  slotProps={{
                    paper: {
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 4px 20px rgba(0,0,0,0.08))",
                        mt: 1.5,
                        borderRadius: "16px",
                        width: "220px",
                        border: "1px solid #f3f4f6",
                        padding: "4px",
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                      },
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#111827",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {session.user.email}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#6b7280",
                        marginTop: "2px",
                      }}
                    >
                      {role === "superadmin" ? "Süper Yönetici" : "Kullanıcı"}
                    </div>
                  </Box>

                  <Divider sx={{ my: 1, borderColor: "#f3f4f6" }} />

                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      router.push("/user/profile");
                    }}
                    sx={{
                      py: 1.5,
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                  >
                    <ListItemIcon>
                      <PersonIcon fontSize="small" sx={{ color: "#4b5563" }} />
                    </ListItemIcon>
                    Profilim
                  </MenuItem>

<<<<<<< HEAD
                  {/* Çıkış Yap Butonu */}
                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      py: 1.5,
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#ef4444",
                    }}
                  >
=======
                  <MenuItem onClick={handleLogout} sx={{ py: 1.5, borderRadius: "8px", fontSize: "14px", fontWeight: 500, color: "#ef4444" }}>
>>>>>>> AliBranch
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" sx={{ color: "#ef4444" }} />
                    </ListItemIcon>
                    Çıkış Yap
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Button
                  component={Link}
                  href="/login"
                  variant="text"
                  sx={{
                    color: "#4b5563",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "14px",
                    "&:hover": {
                      color: "#2563eb",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  Giriş
                </Button>
                <Button
                  component={Link}
                  href="/register"
                  variant="contained"
                  disableElevation
                  sx={{
                    backgroundColor: "#2563eb",
                    color: "#ffffff",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "14px",
                    borderRadius: "10px",
                    px: 3,
                    py: 1,
                    "&:hover": { backgroundColor: "#1d4ed8" },
                  }}
                >
                  Kayıt ol
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </AppBar>

      {/* MOBİL İÇİN KANATTAN AÇILAN YAN MENÜ (DRAWER) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 280, padding: 2 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Link href="/" onClick={handleDrawerToggle} style={{ textDecoration: "none", color: "#111827" }} className="text-2xl font-extrabold">
            Desk<span style={{ color: "#2563eb" }}>Here</span>
          </Link>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/" onClick={handleDrawerToggle} sx={{ borderRadius: "8px" }}>
              <ListItemText primary="Anasayfa" className={pathname === "/" ? "text-blue-600 font-bold" : ""} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/buildings" onClick={handleDrawerToggle} sx={{ borderRadius: "8px" }}>
              <ListItemText primary="Binalar" className={pathname === "/buildings" ? "text-blue-600 font-bold" : ""} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/workspaces" onClick={handleDrawerToggle} sx={{ borderRadius: "8px" }}>
              <ListItemText primary="Çalışma Alanlarımız" className={pathname === "/workspaces" ? "text-blue-600 font-bold" : ""} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/resources" onClick={handleDrawerToggle} sx={{ borderRadius: "8px" }}>
              <ListItemText primary="Kaynaklar" className={pathname === "/resources" ? "text-blue-600 font-bold" : ""} />
            </ListItemButton>
          </ListItem>
          {!loading && role === "superadmin" && (
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/admin" onClick={handleDrawerToggle} sx={{ borderRadius: "8px" }}>
                <ListItemText primary="Admin" className={pathname === "/admin" ? "text-blue-600 font-bold" : ""} />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Drawer>
    </>
  );
}