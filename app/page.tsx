"use client";

import { useEffect, useState } from "react";
import Navbar from "@/src/components/layout/Navbar";
import Anasayfa from "@/src/components/home/Home";
import { Box, CircularProgress } from "@mui/material";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Gelecekte Supabase'den veri çekme işlemi buraya eklenecek
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <main>
      <Navbar />
       <Box sx={{ pt: '64px' }}> {/* navbar'ın yüksekliği kadar */}
      <Anasayfa />
  </Box>

    </main>
  );
}
   
