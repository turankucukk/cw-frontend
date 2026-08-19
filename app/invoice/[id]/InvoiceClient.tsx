"use client";

import { Box, Typography, Button, Container, Divider, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";

export default function InvoiceClient({ reservation }: { reservation: any }) {
  const user = Array.isArray(reservation.user) ? reservation.user[0] : reservation.user;
  const space = Array.isArray(reservation.space) ? reservation.space[0] : reservation.space;

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
  const formatTime = (dateStr: string) => new Date(dateStr).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

  const invoiceDate = formatDate(reservation.created_at || new Date().toISOString());
  const invoiceNumber = `INV-${new Date(reservation.created_at || new Date()).getFullYear()}${(reservation.id).toString().padStart(5, '0')}`;
  
  const fullName = `${user?.name || ""} ${user?.surname || ""}`.trim() || user?.email || "Bilinmeyen Müşteri";

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "#f1f5f9" }}>
      <Box sx={{ "@media print": { display: "none" } }}>
        <Navbar />
      </Box>
      
      <Box sx={{ flexGrow: 1, pt: { xs: 10, md: 12 }, pb: { xs: 2, md: 4 }, px: 2 }}>
        <Container maxWidth="md">
          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, "@media print": { display: "none" } }}>
            <Button component={Link} href="/user/profile?tab=payments" startIcon={<ArrowBackIcon />} sx={{ color: "text.secondary" }}>
              Ödemelere Dön
            </Button>
            <Button variant="contained" startIcon={<PrintIcon />} onClick={() => window.print()} sx={{ borderRadius: 2 }}>
              Faturayı Yazdır / PDF İndir
            </Button>
          </Box>

          <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #e2e8f0", pb: 2, mb: 3, flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b", letterSpacing: "-0.5px" }}>DeskHere</Typography>
                <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>Şht. Mustafa Ahmet Ruso Cd. No:159<br/>Lefkoşa, KKTC</Typography>
                <Typography variant="body2" sx={{ color: "#64748b" }}>iletisim@deskhere.com</Typography>
              </Box>
              <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "1px" }}>FATURA</Typography>
                <Typography variant="body2" sx={{ color: "#475569", mt: 0.5 }}><strong>Fatura No:</strong> {invoiceNumber}</Typography>
                <Typography variant="body2" sx={{ color: "#475569" }}><strong>Tarih:</strong> {invoiceDate}</Typography>
              </Box>
            </Box>

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid xs={12} sm={6}>
                <Typography variant="overline" sx={{ color: "#94a3b8", fontWeight: 600, lineHeight: 1 }}>Kime (Müşteri):</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: "#0f172a", mt: 0.5 }}>{fullName}</Typography>
                {user?.email && <Typography variant="body2" sx={{ color: "#64748b" }}>{user.email}</Typography>}
              </Grid>
              <Grid xs={12} sm={6} sx={{ textAlign: { xs: "left", sm: "right" } }}>
                <Typography variant="overline" sx={{ color: "#94a3b8", fontWeight: 600, lineHeight: 1 }}>Ödeme Durumu:</Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Typography variant="body2" sx={{ display: "inline-block", px: 1.5, py: 0.5, bgcolor: "#dcfce7", color: "#166534", borderRadius: 1, fontWeight: 600 }}>
                    ÖDENDİ
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <TableContainer sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f8fafc" }}>
                    <TableCell sx={{ fontWeight: 600, color: "#475569" }}>Açıklama</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#475569", textAlign: "center" }}>Süre</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#475569", textAlign: "right" }}>Tutar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: "#1e293b" }}>{space?.name || "Oda Kiralama"}</Typography>
                      <Typography variant="body2" sx={{ color: "#64748b" }}>
                        {formatDate(reservation.start_time)}<br/>
                        {formatTime(reservation.start_time)} - {formatTime(reservation.end_time)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", py: 2 }}>
                      {Math.max(1, Math.round((new Date(reservation.end_time).getTime() - new Date(reservation.start_time).getTime()) / 3600000))} Saat
                    </TableCell>
                    <TableCell sx={{ textAlign: "right", py: 2, fontWeight: 500, color: "#1e293b" }}>
                      ₺{reservation.total_price}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Box sx={{ width: { xs: "100%", sm: "50%" } }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography sx={{ color: "#64748b" }}>Ara Toplam:</Typography>
                  <Typography sx={{ fontWeight: 500 }}>₺{(reservation.total_price / 1.2).toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography sx={{ color: "#64748b" }}>KDV (%20):</Typography>
                  <Typography sx={{ fontWeight: 500 }}>₺{(reservation.total_price - (reservation.total_price / 1.2)).toFixed(2)}</Typography>
                </Box>
                <Divider sx={{ my: 1.5 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a" }}>Genel Toplam:</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a" }}>₺{reservation.total_price}</Typography>
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ mt: 4, pt: 2, borderTop: "1px solid #e2e8f0", textAlign: "center" }}>
              <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                Bizi tercih ettiğiniz için teşekkür ederiz. Bu fatura sistem tarafından otomatik olarak oluşturulmuştur ve resmi belge yerine geçerlidir.
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>

      <Box sx={{ "@media print": { display: "none" } }}>
        <Footer />
      </Box>
    </Box>
  );
}
