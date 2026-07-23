"use client";

import { Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from "@mui/material";

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
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

export default function PaymentsTab({ payments = [] }: { payments?: any[] }) {
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
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3, color: "text.secondary" }}>
                  Ödeme geçmişiniz bulunmamaktadır.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow
                  key={payment.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {formatDate(payment.paid_at || payment.created_at)}
                  </TableCell>
                  <TableCell>{payment.reservation?.space?.name || "-"}</TableCell>
                  <TableCell>{payment.payment_method || "-"}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {(payment.amount || 0).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
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
