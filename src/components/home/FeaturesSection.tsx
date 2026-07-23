import { Box, Typography, Card, CardContent } from "@mui/material";
import {
  EventAvailable,
  QrCode2,
  AccessTime,
  Security,
} from "@mui/icons-material";

export default function FeaturesSection() {
  const features = [
    {
      icon: <EventAvailable fontSize="large" />,
      title: "Kolay Rezervasyon",
      description:
        "Toplantı odalarını hızlıca bulun ve uygun zamanınızı kolayca ayarlayın.",
    },
    {
      icon: <QrCode2 fontSize="large" />,
      title: "QR Kod ile Giriş",
      description:
        "QR teknolojisi sayesinde hızlı ve güvenli şekilde çalışma alanınıza erişin.",
    },
    {
      icon: <AccessTime fontSize="large" />,
      title: "Gerçek Zamanlı Takip",
      description:
        "Müsaitlik durumlarını anlık olarak görüntüleyin ve zaman kaybetmeyin.",
    },
    {
      icon: <Security fontSize="large" />,
      title: "Güvenli Kullanım",
      description:
        "Çalışma alanlarınızı güvenli ve kontrollü şekilde yönetin.",
    },
  ];

  return (
    <Box
      sx={{
        px: { xs: 3, md: 10 },
        py: { xs: 6, md: 10 },
      }}
    >
      <Typography
        variant="h4"
        align="center"
        sx={{
          fontWeight: 700,
          mb: 2,
        }}
      >
         Neden{" "}
        <Box component="span" sx={{ color: "#1E293B" }}>
         Desk
        </Box>
        <Box component="span" sx={{ color: "#0052CC" }}>
             Here
        </Box>
        ?
        </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 3,
          flexWrap: "wrap",
        }}
      >
        {features.map((feature) => (
          <Card
            key={feature.title}
            sx={{
              width: 260,
              borderRadius: 3,
              textAlign: "center",
              boxShadow: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  color: "#0052CC",
                  mb: 2,
                }}
              >
                {feature.icon}
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                {feature.title}
              </Typography>

              <Typography color="text.secondary">
                {feature.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}