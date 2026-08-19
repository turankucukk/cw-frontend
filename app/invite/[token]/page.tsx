import { decodeInviteToken } from "@/src/actions/invite";
import { createClient } from "@/src/utils/supabase/server";
import { Box, Typography, Card, Chip, Button, Divider, Stack, Container } from "@mui/material";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventIcon from "@mui/icons-material/Event";
import PlaceIcon from "@mui/icons-material/Place";
import InfoIcon from "@mui/icons-material/Info";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const reservationId = await decodeInviteToken(token);

  if (!reservationId) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography variant="h5" color="error">Geçersiz veya bozuk davet linki.</Typography>
        </Box>
        <Footer />
      </Box>
    );
  }

  const supabase = await createClient();
  const { data: reservation, error } = await supabase
    .from("reservation")
    .select(`
      id, start_time, end_time, status,
      space:space_id (
        name, floor,
        building:building_id (name)
      )
    `)
    .eq("id", reservationId)
    .single();

  if (error || !reservation) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography variant="h5" color="error">Rezervasyon bulunamadı.</Typography>
        </Box>
        <Footer />
      </Box>
    );
  }

  const space = (Array.isArray(reservation.space) ? reservation.space[0] : reservation.space) as any;
  const building = (space && Array.isArray(space.building) ? space.building[0] : space?.building) as any;

  const startDate = new Date(reservation.start_time);
  const endDate = new Date(reservation.end_time);

  const formatDate = (d: Date) => d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
  const formatTime = (d: Date) => d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

  const text = encodeURIComponent(`Toplantı: ${space?.name || "Oda"}`);
  const details = encodeURIComponent(`DeskHere üzerinden bu toplantıya davet edildiniz.\n\nOda: ${space?.name || "Bilinmiyor"}\nBina: ${building?.name || "Bilinmiyor"}`);
  const location = encodeURIComponent(`${building?.name || "Belirtilmemiş"}`);
  const formatGoogleDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
  const dates = `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`;
  
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`;
  const outlookCalendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${text}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}&body=${details}&location=${location}`;

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "#f8fafc" }}>
      <Navbar />
      <Box sx={{ flexGrow: 1, py: { xs: 8, md: 12 }, px: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Card sx={{ maxWidth: 600, width: "100%", borderRadius: 4, p: { xs: 3, md: 5 }, boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
          
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box sx={{ 
              width: 60, height: 60, borderRadius: "50%", bgcolor: "#e0e7ff", 
              display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2
            }}>
              <EventIcon sx={{ fontSize: 30, color: "#4f46e5" }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#1e293b", mb: 1 }}>Toplantı Daveti</Typography>
            <Typography color="text.secondary">Bir toplantıya katılmak üzere davet edildiniz.</Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          <Stack spacing={3}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              <MeetingRoomIcon sx={{ color: "#64748b", mt: 0.5 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ color: "#64748b", textTransform: "uppercase", fontSize: 12 }}>Oda</Typography>
                <Typography variant="h6" sx={{ color: "#0f172a", fontWeight: 600 }}>{space?.name || "Belirtilmemiş"}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              <AccessTimeIcon sx={{ color: "#64748b", mt: 0.5 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ color: "#64748b", textTransform: "uppercase", fontSize: 12 }}>Zaman</Typography>
                <Typography variant="body1" sx={{ color: "#0f172a", fontWeight: 500 }}>{formatDate(startDate)}</Typography>
                <Typography variant="body2" sx={{ color: "#475569" }}>{formatTime(startDate)} - {formatTime(endDate)}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              <PlaceIcon sx={{ color: "#64748b", mt: 0.5 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ color: "#64748b", textTransform: "uppercase", fontSize: 12 }}>Konum</Typography>
                <Typography variant="body1" sx={{ color: "#0f172a", fontWeight: 500 }}>{building?.name || "Belirtilmemiş"}</Typography>
                {space?.floor && <Typography variant="body2" sx={{ color: "#475569" }}>Kat: {space.floor}</Typography>}
              </Box>
            </Box>
            
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              <InfoIcon sx={{ color: "#64748b", mt: 0.5 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ color: "#64748b", textTransform: "uppercase", fontSize: 12 }}>Durum</Typography>
                <Chip 
                  label={reservation.status === "approved" || reservation.status === "confirmed" ? "Onaylandı" : reservation.status} 
                  color={reservation.status === "approved" || reservation.status === "confirmed" ? "success" : "default"} 
                  size="small" 
                  sx={{ mt: 0.5, fontWeight: 500 }} 
                />
              </Box>
            </Box>
          </Stack>

          <Box sx={{ mt: 5, p: 3, bgcolor: "#f1f5f9", borderRadius: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, textAlign: "center", color: "#334155" }}>Takvimine Ekle</Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "center" }}>
              <Button 
                variant="contained" 
                href={googleCalendarUrl} 
                target="_blank"
                rel="noopener noreferrer"
                sx={{ bgcolor: "#ea4335", "&:hover": { bgcolor: "#d33426" }, textTransform: "none", borderRadius: 2 }}
              >
                Google Takvim
              </Button>
              <Button 
                variant="contained" 
                href={outlookCalendarUrl} 
                target="_blank"
                rel="noopener noreferrer"
                sx={{ bgcolor: "#0078d4", "&:hover": { bgcolor: "#0067b8" }, textTransform: "none", borderRadius: 2 }}
              >
                Outlook Takvim
              </Button>
            </Stack>
          </Box>
        </Card>
      </Box>
      <Footer />
    </Box>
  );
}
