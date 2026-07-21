import { Box, Typography } from "@mui/material";

const companies = [
  "Creditwest",
  "Your Company",
  "Your Company",
  "Your Company",
  "Your Company",
];

export default function TrustedSection() {
  return (
    <Box
      sx={{
        py: 8,
        px: 4,
        bgcolor: "#ffffff",
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
        Bize Güvenen Ekipler
      </Typography>

      <Typography
        align="center"
        color="text.secondary"
        sx={{
          mb: 6,
          maxWidth: 650,
          mx: "auto",
        }}
      >
        DeskHere, modern çalışma alanlarını daha verimli yönetmek isteyen ekipler
        için tasarlanmıştır.
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 6,
          flexWrap: "wrap",
        }}
      >
        {companies.map((company, index) => (
          <Typography
            key={index}
            sx={{
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "#9CA3AF",
              letterSpacing: 1,
            }}
          >
            {company}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}