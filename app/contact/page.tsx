"use client";

import Link from "next/link";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import {
  EmailRounded,
  LocationOnRounded,
  PhoneRounded,
  SupportAgentRounded,
} from "@mui/icons-material";

const contactCards = [
  {
    title: "E-posta",
    value: "destek@deskhere.com",
    icon: <EmailRounded sx={{ fontSize: 30 }} />,
  },
  {
    title: "Telefon",
    value: "+90 212 555 12 34",
    icon: <PhoneRounded sx={{ fontSize: 30 }} />,
  },
  {
    title: "Adres",
    value: "İstanbul, Türkiye",
    icon: <LocationOnRounded sx={{ fontSize: 30 }} />,
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <Box sx={{ pt: { xs: 14, md: 16 }, pb: 8, minHeight: "100vh", bgcolor: "#f8fafc" }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1.05fr 0.95fr" },
              gap: 4,
              alignItems: "center",
              mb: 6,
            }}
          >
            <Box>
              <Typography
                variant="overline"
                sx={{ color: "#2563eb", fontWeight: 700, letterSpacing: 1.5 }}
              >
                İLETİŞİM
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: "#0f172a" }}>
                Sorularınız mı var? Bize her zaman ulaşabilirsiniz.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 640 }}>
                DeskHere ekibi olarak rezervasyon, destek veya kurumsal kullanım konularında size yardımcı olmak için buradayız.
                İletişim bilgileri aşağıda yer alıyor.
              </Typography>
              
            </Box>

            <Card
              sx={{
                borderRadius: 4,
                p: 1,
                boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)",
                border: "1px solid #e2e8f0",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <SupportAgentRounded sx={{ color: "#2563eb" }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Hızlı destek
                  </Typography>
                </Box>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Teknik destek, kullanıcı soruları veya kurumsal talepler için doğrudan bizimle iletişime geçebilirsiniz.
                </Typography>
                <Stack spacing={1.2}>
                  {contactCards.map((item) => (
                    <Box key={item.title} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box sx={{ color: "#2563eb" }}>{item.icon}</Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.value}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>

      <Footer />
    </>
  );
}