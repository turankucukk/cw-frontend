import { Box, Typography } from "@mui/material";

const stats = [
  { number: "100+", label: "Aktif Kullanıcı" },
  { number: "20+", label: "Toplantı Odası" },
  { number: "80%", label: "Memnuniyet Oranı" },
  { number: "24/7", label: "Kesintisiz Erişim" },
];

export default function StatisticsSection() {
  return (
    <Box
      sx={{
        py: 10,
        px: 4,
        background: "linear-gradient(135deg, #0052CC, #0077FF)",
        color: "white",
      }}
    >
      <Typography
        variant="h3"
        align="center"
        sx={{
          fontWeight: 700,
          mb: 7,
        }}
      >
        Rakamlarla DeskHere
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        {stats.map((item) => (
          <Box
            key={item.label}
            sx={{
              textAlign: "center",
              minWidth: 180,
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
              }}
            >
              {item.number}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                mt: 1,
              }}
            >
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}