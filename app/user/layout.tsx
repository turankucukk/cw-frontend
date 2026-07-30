// app/user/layout.tsx
"use client";

import { Box, Container } from "@mui/material";
import Navbar from "@/src/components/layout/Navbar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box 
      sx={{ 
        minHeight: "100vh", 
        display: "flex", 
        flexDirection: "column",
        bgcolor: "#F9FAFB" 
      }}
    >
      <Navbar />

      <Container 
        maxWidth="lg" 
        component="main" 
        sx={{ 
          flexGrow: 1,
          // Fixed Navbar'ın altından başlaması için güvenli üst boşluk (Navbar + ekstra mesafe)
          pt: { xs: "80px", sm: "96px" }, 
          pb: { xs: 4, sm: 6 },
          px: { xs: 2, sm: 3 },
          width: "100%",
        }}
      >
        {children}
      </Container>
    </Box>
  );
}