import { Box, Button, Typography } from "@mui/material";

export default function CTASection() {
  return (
    <Box
      sx={{
        py: 10,
        px: 4,
        textAlign: "center",
        background: "linear-gradient(135deg, #0052CC, #00B4D8)",
        color: "white",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          mb: 2,
        }}
      >
        Çalışma Alanınızı Daha Verimli Yönetin
      </Typography>

      <Typography
        sx={{
          maxWidth: 700,
          mx: "auto",
          mb: 5,
          opacity: 0.95,
          fontSize: "1.1rem",
        }}
      >
        DeskHere ile toplantı odalarını kolayca rezerve edin, QR kod ile
        hızlı giriş yapın ve çalışma alanlarınızı tek platform üzerinden
        yönetin.
      </Typography>

      <Button
  variant="contained"
  size="large"
  sx={{
    bgcolor: "white",
    color: "#0052CC",
    px: 5,
    py: 1.5,
    borderRadius: "30px",
    textTransform: "none",
    fontWeight: 700,
    fontSize: "1rem",
    "&:hover": {
      bgcolor: "#f5f5f5",
    },
  }}
>
  Hemen Başlayın
</Button>
    </Box>
  );
}
