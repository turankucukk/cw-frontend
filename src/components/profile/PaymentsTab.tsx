"use client";

import { Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from "@mui/material";

// Mock data based on the Supabase payment table
const PAYMENTS = [
  {
    id: 1,
    reservation: { space: { name: "Toplantı Odası A" } },
    amount: 150.0,
    status: "paid",
    paid_at: "2026-07-15T10:30:00Z",
    payment_method: "Kredi Kartı (...1234)",
  },
  {
    id: 2,
    reservation: { space: { name: "Açık Çalışma Alanı 1" } },
    amount: 50.0,
    status: "paid",
    paid_at: "2026-07-09T08:15:00Z",
    payment_method: "Kredi Kartı (...1234)",
  },
  {
    id: 3,
    reservation: { space: { name: "Toplantı Odası B" } },
    amount: 200.0,
    status: "refunded",
    paid_at: "2026-07-11T13:00:00Z",
    payment_method: "Kredi Kartı (...9876)",
  },
];

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const getStatusChip = (status: string) => {
  switch (status) {
    case "paid":
      return <Chip label="Ödendi" color="success" size="small" />;
    case "refunded":
      return <Chip label="İade Edildi" color="default" size="small" />;
    case "pending":
      return <Chip label="Bekliyor" color="warning" size="small" />;
    default:
      return <Chip label={status} size="small" />;
  }
};

export default function PaymentsTab() {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
        Ödeme Geçmişi
      </Typography>

      <TableContainer component={Card} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="payments table">
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Tarih</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Alan</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Ödeme Yöntemi</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Tutar</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Durum</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {PAYMENTS.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3, color: "text.secondary" }}>
                  Ödeme geçmişiniz bulunmamaktadır.
                </TableCell>
              </TableRow>
            ) : (
              PAYMENTS.map((payment) => (
                <TableRow
                  key={payment.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {formatDate(payment.paid_at)}
                  </TableCell>
                  <TableCell>{payment.reservation.space.name}</TableCell>
                  <TableCell>{payment.payment_method}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {payment.amount.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                  </TableCell>
                  <TableCell align="center">
                    {getStatusChip(payment.status)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
