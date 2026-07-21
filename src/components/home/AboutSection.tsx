import { Box, Typography, Button } from "@mui/material";

export default function AboutSection() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 6,
        px: { xs: 3, md: 10 },
        py: { xs: 6, md: 10 },
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      {/* Yazı kısmı */}
      <Box sx={{ maxWidth: 600 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 2,
          }}
        >
          Çalışma alanınızı daha akıllı yönetin
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontSize: "1.1rem",
            lineHeight: 1.8,
            mb: 3,
          }}
        >
          DeskHere ile toplantı odalarınızı kolayca keşfedin,
          rezervasyon yapın ve QR kod teknolojisi sayesinde hızlı
          bir şekilde çalışma alanınıza erişin.
        </Typography>
        <Typography
  variant="body1"
  color="text.secondary"
  sx={{
    fontSize: "1.05rem",
    lineHeight: 1.8,
  }}
>
  İster bireysel ister ekip olarak çalışın, DeskHere modern çalışma
  alanı yönetimini tek bir platformda bir araya getirir. Kullanıcı
  dostu arayüzü sayesinde rezervasyonlarınızı saniyeler içinde
  oluşturabilir, çalışma alanlarını verimli şekilde yönetebilir ve
  QR tabanlı erişim sistemiyle güvenli giriş sağlayabilirsiniz.
</Typography>
        
      </Box>

      {/* Görsel alanı */}
      <Box
        sx={{
          width: { xs: "100%", md: 450 },
          height: 320,
          borderRadius: 4,
          objectFit: "cover",
          boxShadow: 4,
          transition:"0.4s",
          "&:hover":{transform: "scale(1.03)",},
          backgroundColor: "#f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography color="text.secondary">
          Workspace Image
        </Typography>
      </Box>
    </Box>
  );
}
