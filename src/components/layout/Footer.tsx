import { Box, Container, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#0F172A",
        color: "white",
        py: 6,
        mt: 0,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: 700,
            mb: 2,
          }}
        >
          Desk
          <Box
            component="span"
            sx={{
              color: "#00B4D8",
            }}
          >
            Here
          </Box>
        </Typography>

        <Typography
          align="center"
          sx={{
            color: "#CBD5E1",
            maxWidth: 700,
            mx: "auto",
            mb: 4,
          }}
        >
          DeskHere ile toplantı odalarını kolayca rezerve edin,
          çalışma alanlarınızı yönetin ve QR teknolojisi ile hızlı giriş yapın.
        </Typography>



        <Typography
          align="center"
          sx={{
            color: "#94A3B8",
            fontSize: "0.9rem",
          }}
        >
          © 2026 DeskHere. Tüm hakları saklıdır.
        </Typography>
      </Container>
    </Box>
  );
}