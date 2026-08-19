"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import {
  CalendarMonthRounded,
  DashboardRounded,
  QrCode2Rounded,
  SecurityRounded,
  SupportAgentRounded,
} from "@mui/icons-material";

const services = [
  {
    title: "Hızlı Rezervasyon",
    description:
      "İstediğiniz oda ve zamanı birkaç tıkla seçin; uygun alanları anında görüntüleyin.",
    icon: <CalendarMonthRounded sx={{ fontSize: 32 }} />,
  },
  {
    title: "QR ile Giriş",
    description:
      "Rezerve ettiğiniz alanlara QR kod ile güvenli ve hızlı bir şekilde erişin.",
    icon: <QrCode2Rounded sx={{ fontSize: 32 }} />,
  },
  {
    title: "Yönetici Paneli",
    description:
      "Kurumsal kullanım için odaları, kullanıcıları ve talepleri tek ekrandan yönetin.",
    icon: <DashboardRounded sx={{ fontSize: 32 }} />,
  },
  {
    title: "7/24 Destek",
    description:
      "İş akışınızı aksatmadan destek almak için uzman ekibimiz her an yanında.",
    icon: <SupportAgentRounded sx={{ fontSize: 32 }} />,
  },
];

const benefits = [
  "Kuruluş içi çalışma alanlarını tek platformda takip edin.",
  "Müsaitlik durumlarını gerçek zamanlı görün.",
  "Güvenli erişim ve kontrollü kullanım sağlayın.",
];

export default function ServicesPage() {
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
    <>
      <Navbar />

      <Box sx={{ pt: { xs: 14, md: 16 }, pb: 8, minHeight: "100vh", bgcolor: "#f8fafc" }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1.1fr 0.9fr" },
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
                SERVİSLERİMİZ
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: "#0f172a" }}>
                Ofis deneyimini daha akıcı, güvenli ve düzenli hale getirelim.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 620 }}>
                DeskHere ile oda bulma, rezervasyon ve giriş süreçlerini tek bir platformda kolaylaştırın.
                Ekibiniz için zaman kazandıran modern servislerle iş akışını iyileştirin.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <Button
                  component={Link}
                  href="/rooms"
                  variant="contained"
                  size="large"
                  sx={{ borderRadius: 999, px: 3, py: 1.2, bgcolor: "#2563eb" }}
                >
                  Oda Keşfet
                </Button>
                <Button
                  component={Link}
                  href="/buildings"
                  variant="outlined"
                  size="large"
                  sx={{ borderRadius: 999, px: 3, py: 1.2, borderColor: "#cbd5e1", color: "#0f172a" }}
                >
                  Binaları Gör
                </Button>
              </Stack>
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
                  <SecurityRounded sx={{ color: "#2563eb" }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Güvenli ve düzenli kullanım
                  </Typography>
                </Box>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Her kullanıcı için açık bir akış sağlarken, yönetim tarafında kontrolü koruyan bir yapı sunuyoruz.
                </Typography>
                <Stack spacing={1.2}>
                  {benefits.map((item) => (
                    <Box key={item} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#2563eb" }} />
                      <Typography variant="body2" color="text.secondary">
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: "#0f172a" }}>
            Ana hizmetlerimiz
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
              gap: 3,
              mb: 6,
            }}
          >
            {services.map((service) => (
              <Card
                key={service.title}
                sx={{
                  borderRadius: 4,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
                  height: "100%",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "#eff6ff",
                      color: "#2563eb",
                      mb: 2,
                    }}
                  >
                    {service.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {service.title}
                  </Typography>
                  <Typography color="text.secondary">{service.description}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

        
        </Container>
      </Box>

      <Footer />
    </>
  );
}