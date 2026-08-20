import { createClient } from "@/src/utils/supabase/server";
import { Box, Typography } from "@mui/material";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import InvoiceClient from "./InvoiceClient";

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reservationId = parseInt(id, 10);
  
  if (isNaN(reservationId)) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography variant="h5" color="error">Geçersiz Fatura ID</Typography>
        </Box>
        <Footer />
      </Box>
    );
  }

  const supabase = await createClient();
  const { data: reservation, error } = await supabase
    .from("reservation")
    .select(`
      id, start_time, end_time, total_price, created_at,
      space:space_id (name, price),
      user:user_id (name, surname, email)
    `)
    .eq("id", reservationId)
    .single();

  if (error || !reservation) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography variant="h5" color="error">Fatura bulunamadı.</Typography>
        </Box>
        <Footer />
      </Box>
    );
  }

  return <InvoiceClient reservation={reservation} />;
}
