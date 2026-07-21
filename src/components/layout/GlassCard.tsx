// src/components/layout/GlassCard.tsx
"use client";

import { Box, type BoxProps } from '@mui/material';

interface GlassCardProps extends BoxProps {
  children: React.ReactNode;
}

export default function GlassCard({ children, sx, ...rest }: GlassCardProps) {
  return (
    <Box
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.55)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        borderRadius: 4,
        // Çok katmanlı gölge - "havada asılı" hissi için
        boxShadow: `
          0 1px 2px rgba(0, 0, 0, 0.04),
          0 8px 24px rgba(0, 0, 0, 0.08),
          0 24px 48px rgba(0, 0, 0, 0.10)
        `,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          boxShadow: `
            0 2px 4px rgba(0, 0, 0, 0.05),
            0 12px 32px rgba(0, 0, 0, 0.10),
            0 32px 64px rgba(0, 0, 0, 0.12)
          `,
        },
        p: { xs: 2, md: 3 },
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
}