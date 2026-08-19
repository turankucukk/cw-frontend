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
  Groups2Rounded,
  InsightsRounded,
  RocketLaunchRounded,
  VerifiedRounded,
} from "@mui/icons-material";

const stats = [
  { value: "500+", label: "Aktif kullanıcı" },
  { value: "24/7", label: "Destek erişimi" },
  { value: "98%", label: "Memnun kullanıcı" },
];

const values = [
  {
    title: "Hızlı ve basit",
    description: "Rezervasyon ve erişim adımlarını mümkün olduğunca kısa ve anlaşılır hale getiriyoruz.",
    icon: <RocketLaunchRounded sx={{ fontSize: 30 }} />,
  },
  {
    title: "Güvenilir deneyim",
    description: "Tüm süreçlerde güvenlik ve doğruluk odaklı bir yapı sunuyoruz.",
    icon: <VerifiedRounded sx={{ fontSize: 30 }} />,
  },
  {
    title: "İş birliği odaklı",
    description: "Takım ve yönetim süreçlerini birlikte daha iyi yürütebilecek bir ortam sağlıyoruz.",
    icon: <Groups2Rounded sx={{ fontSize: 30 }} />,
  },
];

export default function AboutPage() {
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
                HAKKIMIZDA
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: "#0f172a" }}>
                Çalışma alanlarını daha akıllı ve düzenli hale getiren bir platformuz.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 640 }}>
                DeskHere, ofislerde oda bulma, rezervasyon ve kullanıcı yönetimini tek bir sistemde kolaylaştıran modern bir çözüm olarak kurulmuştur.
                Ekibinizin zamanını koruyup iş akışını kolaylaştırmak için tasarlandık.
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
                  <InsightsRounded sx={{ color: "#2563eb" }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Misyonumuz
                  </Typography>
                </Box>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  İş yerlerinde zaman kaybını azaltan, erişimi kolaylaştıran ve bireysel ihtiyaçlara uygun bir deneyim sunan araçlar üretmek.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Her işletme, farklı çalışma modellerine uyum sağlayan bir sistemin parçası olmayı hak eder.
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 3,
              mb: 6,
            }}
          >
            {stats.map((stat) => (
              <Card key={stat.label} sx={{ borderRadius: 4, border: "1px solid #e2e8f0" }}>
                <CardContent sx={{ textAlign: "center", py: 3 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: "#2563eb" }}>
                    {stat.value}
                  </Typography>
                  <Typography color="text.secondary">{stat.label}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: "#0f172a" }}>
            Neden bizi tercih ediyorsunuz?
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 3,
            }}
          >
            {values.map((value) => (
              <Card key={value.title} sx={{ borderRadius: 4, border: "1px solid #e2e8f0" }}>
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
                    {value.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {value.title}
                  </Typography>
                  <Typography color="text.secondary">{value.description}</Typography>
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