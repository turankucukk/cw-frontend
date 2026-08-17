import { Box, Typography, Card, CardContent } from "@mui/material";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Alanını keşfet",
      description:
        "İhtiyacınıza uygun toplantı odasını veya çalışma alanını kolayca bulun.",
      image:"/images/ofis2.webp",

    },
    {
      number: "02",
      title: "Rezervasyon yap",
      description:
        "Uygun zamanı seçerek çalışma alanınızı hızlıca rezerve edin.",
        image:"/images/booking.avif",
    },
    {
      number: "03",
      title: "QR ile giriş yap",
      description:
        "QR kod teknolojisi sayesinde güvenli ve hızlı erişim sağlayın.",
        image:"/images/qr-access.jpg",
    },
  ];

  return (
    <Box
      sx={{
        px: { xs: 3, md: 10 },
        py: { xs: 6, md: 10 },
        backgroundColor: "#f8fafc",
      }}
    >
      <Typography
        variant="h3"
        align="center"
        sx={{
          fontWeight: 700,
          mb: 5,
        }}
      >
        Nasıl çalışır?
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {steps.map((step) => (
          <Card
            key={step.number}
            sx={{
              width: 300,
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                component="img"
                src={step.image}
                alt={step.title}
                sx={{
                  width:"100%",
                  height:180,
                  objectFit:"cover",
                  borderRadius:2,
                  mb:2,
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#0052CC",
                  mb: 2,
                }}
              >
                {step.number}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                {step.title}
              </Typography>

              <Typography color="text.secondary">
                {step.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}