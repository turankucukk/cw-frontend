import {
  Avatar,
  Box,
  Card,
  CardContent,
  Rating,
  Typography,
} from "@mui/material";

const testimonials = [
  {
    name: "Ayşe Yılmaz",
    role: "Yazılım Geliştirici",
    comment:
      "DeskHere sayesinde toplantı odası rezervasyonu artık çok daha hızlı ve pratik hale geldi. Kullanımı gerçekten çok kolay.",
  },
  {
    name: "Mehmet Kaya",
    role: "Proje Yöneticisi",
    comment:
      "QR kod ile giriş özelliği sayesinde zamandan tasarruf ediyoruz. Ekip olarak sistemden oldukça memnunuz.",
  },
  {
    name: "Zeynep Demir",
    role: "UI/UX Tasarımcısı",
    comment:
      "Modern tasarımı ve kullanıcı dostu arayüzü sayesinde çalışma alanlarını yönetmek hiç bu kadar kolay olmamıştı.",
  },
];

export default function TestimonialsSection() {
  return (
    <Box
      sx={{
        py: 10,
        px: 4,
        bgcolor: "#f8fafc",
      }}
    >
      <Typography
        variant="h3"
        align="center"
        sx={{
          fontWeight: 700,
          mb: 2,
        }}
      >
        Kullanıcılarımız Ne Diyor?
      </Typography>

      <Typography
        align="center"
        color="text.secondary"
        sx={{
          mb: 6,
          maxWidth: 700,
          mx: "auto",
        }}
      >
        DeskHere'i kullanan ekiplerin deneyimlerini keşfedin.
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 4,
          flexWrap: "wrap",
        }}
      >
        {testimonials.map((item) => (
          <Card
            key={item.name}
            sx={{
              width: 340,
              borderRadius: 4,
              boxShadow: 3,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Rating value={5} readOnly sx={{ mb: 2 }} />

              <Typography
                sx={{
                  fontStyle: "italic",
                  color: "text.secondary",
                  mb: 3,
                }}
              >
                "{item.comment}"
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Avatar sx={{ bgcolor: "#0052CC" }}>
                  {item.name.charAt(0)}
                </Avatar>

                <Box>
                  <Typography sx={{ fontWeight:700}}>
                    {item.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {item.role}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}