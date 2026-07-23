// src/components/rooms/RoomCard.tsx
"use client";

import { Card, CardMedia, CardContent, Typography, Chip, Stack, Box } from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import type { Room } from '../../lib/api/rooms';

export default function RoomCard({ room }: { room: Room }) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
        overflow: 'hidden',
        bgcolor: 'rgba(255, 255, 255, 0.7)',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        height: 420, 
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
        },
      }}
    >
      {room.image ? (
        <CardMedia
          component="img"
          image={room.image}
          alt={room.name}
          sx={{ height: 180, flexShrink: 0, objectFit: 'cover' }}
        />
      ) : (
        <Box
          sx={{
            height: 180,
            flexShrink: 0,
            bgcolor: 'grey.100',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body2" color="text.disabled"> Görsel yok</Typography>
        </Box>
      )}

      <CardContent
        sx={{
          p: 2.5,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden', 
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }} noWrap>
            {room.name}
          </Typography>
          <Chip label={room.type} size="small" sx={{ bgcolor: 'primary.50', color: 'primary.main', fontWeight: 600, flexShrink: 0, ml: 1 }} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', mb: 1 }}>
          <PeopleAltOutlinedIcon sx={{ fontSize: 18 }} />
          <Typography variant="body2">{room.capacity} kişi</Typography>
        </Box>

        {room.price > 0 && (
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
            {room.price} ₺ / saat
          </Typography>
        )}

        <Box sx={{  }}>
          {room.features.length > 0 && (
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
              {room.features.map((feature) => (
                <Chip key={feature} label={feature} size="small" sx={{ bgcolor: 'grey.100', fontWeight: 500 }} />
              ))}
            </Stack>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}