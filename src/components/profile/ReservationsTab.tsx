"use client";
import { Box, Typography, Card, Chip, Button, Stack, Divider } from "@mui/material";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useRef } from "react";

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
};
const formatTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
};

  const getStatusChip = (status: string) => {
  switch (status) {
    case "approved": return <Chip label="Onaylandı" color="primary" size="small" />;
    case "confirmed": return <Chip label="Onaylandı" color="primary" size="small" />;
    case "pending": return <Chip label="Bekliyor" color="warning" size="small" />;
    case "completed": return <Chip label="Tamamlandı" color="success" size="small" />;
    case "cancelled": return <Chip label="İptal Edildi" color="error" size="small" />;
    default: return <Chip label={status} size="small" />;
  }
};

export default function ReservationsTab({ reservations = [] }: { reservations?: any[] }) {
  // Statülere göre rezervasyonları ayırıyoruz
  const activeReservations = reservations.filter(r => r.status === "approved" || r.status === "pending" || r.status === "confirmed");
  const pastReservations = reservations.filter(r => r.status === "completed" || r.status === "cancelled");
  const [scannerOpen, setScannerOpen] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const handleOpenScanner = () => {
    setScannerOpen(true);
  };

  const handleCloseScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(() => {});
      scannerRef.current = null;
    }
    setScannerOpen(false);
  };

useEffect(() => {
  if (!scannerOpen) return;

  const timer = setTimeout(() => {
    const el = document.getElementById("qr-reader");
    if (!el) return;

    const scanner = new Html5QrcodeScanner(
  "qr-reader",
  {
    fps: 10,
    qrbox: { width: 250, height: 250 },
    videoConstraints: {
      facingMode: { exact: "environment" },
    },
  },
  false
);

    scanner.render(
      (decodedText) => {
        scanner.clear().catch(() => {});
        scannerRef.current = null;
        setScannerOpen(false);
        window.location.href = decodedText;
      },
      () => {}
    );

    scannerRef.current = scanner;
  }, 150);

  return () => {
    clearTimeout(timer);
    if (scannerRef.current) {
      scannerRef.current.clear().catch(() => {});
      scannerRef.current = null;
    }
  };
}, [scannerOpen]);

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Aktif Rezervasyonlarım</Typography>
      <Stack spacing={2} sx={{ mb: 5 }}>
        {activeReservations.length === 0 ? (
          <Typography color="text.secondary">Aktif rezervasyonunuz bulunmamaktadır.</Typography>
        ) : (
          activeReservations.map((res) => (
            <Card key={res.id} variant="outlined" sx={{ p: 2, borderRadius: 2, borderColor: "primary.light" }}>
              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 2 }}>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                    <MeetingRoomIcon color="action" fontSize="small" />
                    <Typography sx={{ fontWeight: 600 }}>{res.space?.name || "Bilinmeyen Oda"}</Typography>
                    <Typography variant="body2" color="text.secondary">({res.space?.building?.name || "Bilinmeyen Bina"})</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AccessTimeIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(res.start_time)} | {formatTime(res.start_time)} - {formatTime(res.end_time)}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {getStatusChip(res.status)}
                  <Button variant="contained" size="small" startIcon={<QrCodeScannerIcon />} onClick={handleOpenScanner}>
                    Check-in (QR)
                  </Button>
                </Box>
              </Box>
            </Card>
          ))
        )}
      </Stack>

      <Divider sx={{ mb: 4 }} />
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Geçmiş Rezervasyonlarım</Typography>
      <Stack spacing={2}>
        {pastReservations.length === 0 ? (
          <Typography color="text.secondary">Geçmiş rezervasyonunuz bulunmamaktadır.</Typography>
        ) : (
          pastReservations.map((res) => (
            <Card key={res.id} variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: "#F8FAFC" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography sx={{ fontWeight: 600, mb: 0.5 }}>{res.space?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(res.start_time)} | {formatTime(res.start_time)} - {formatTime(res.end_time)}
                  </Typography>
                </Box>
                <Box>{getStatusChip(res.status)}</Box>
              </Box>
            </Card>
          ))
        )}
      </Stack>
    <Dialog open={scannerOpen} onClose={handleCloseScanner} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          QR Kodu Okutun
          <IconButton onClick={handleCloseScanner} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div id="qr-reader" style={{ width: "100%" }} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
