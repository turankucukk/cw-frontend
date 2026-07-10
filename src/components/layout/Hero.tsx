
"use client";
import { Box, Typography, Button, Stack } from '@mui/material';

export default function Hero() {
  return (
    <Box
      sx={{
        position: 'relative',
        backgroundImage: 'url(/hero1.webp)', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: 500,
        display: 'flex',
        alignItems: 'center',
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.35)', 
          zIndex: 1,
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 4,
          px: { xs: 3, md: 8 },
          py: { xs: 4, md: 8 },
          width: '100%',
          color: 'white', 
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }} gutterBottom>
            Toplantı Odalarını Keşfet
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, maxWidth: 480, opacity: 0.9 }}>
            Öğrenciler ve mühendisler için tasarlanmış, uygun toplantı odalarını
            gör, uygun saatleri kontrol et ve hemen rezerve et.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" size="large">
              Odaları Gör
            </Button>
            <Button variant="outlined" size="large" sx={{ color: 'white', borderColor: 'white' }}>
              Nasıl Çalışır?
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}