// src/components/rooms/RoomCard.tsx
"use client";

import { Card, CardMedia, CardContent, CardActions, Typography, Chip, Stack, Box, Button } from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import BuildRoundedIcon from '@mui/icons-material/BuildRounded';
import type { Room } from '../../lib/api/rooms';
import { useRouter } from 'next/navigation';  

export default function RoomCard({ room }: { room: Room }) {
  const router = useRouter();
  const isUnderMaintenance = !room.isActive;

  const goToRoom = () => {
    if (isUnderMaintenance) return;
    router.push(`/rooms/${room.id}`);
  };

  return (
    <Card
      onClick={goToRoom}
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
        overflow: 'hidden',
        bgcolor: 'rgba(255, 255, 255, 0.7)',
        transition: 'all 0.2s ease',
        height: 480,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: isUnderMaintenance ? 'default' : 'pointer',
        ...(isUnderMaintenance && {
          opacity: 0.65,
          filter: 'grayscale(0.4)',
        }),
        '&:hover': isUnderMaintenance
          ? {}
          : {
              transform: 'translateY(-3px)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
            },
      }}
    >
      {room.room_images && room.room_images.length > 0 ? (
        <CardMedia
          component="img"
          image={room.room_images[0].image_url}
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
          <Typography variant="body2" color="text.disabled">Görsel yok</Typography>
        </Box>
      )}

      <CardContent sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }} noWrap>
            {room.name}
          </Typography>
          <Chip
            icon={isUnderMaintenance ? <BuildRoundedIcon sx={{ fontSize: 16 }} /> : undefined}
            label={isUnderMaintenance ? 'Bakımda' : 'Aktif'}
            size="small"
            color={isUnderMaintenance ? 'warning' : 'success'}
            sx={{ flexShrink: 0, ml: 1 }}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Kat: {room.floor || 'Belirtilmedi'} | Tip: {room.type}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', mb: 1.5 }}>
          <PeopleAltOutlinedIcon sx={{ fontSize: 18 }} />
          <Typography variant="body2">{room.capacity} Kişilik</Typography>
        </Box>

        <Box sx={{ mb: 1.5 }}>
          {(room.features ?? []).length > 0 && (
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
              {(room.features ?? []).map((feature) => (
                <Chip key={feature} label={feature} size="small" variant="outlined" />
              ))}
            </Stack>
          )}
        </Box>

        <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }} color="primary">
            {room.price ?? 0} TL
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          disableElevation
          disabled={isUnderMaintenance}
          startIcon={isUnderMaintenance ? <BuildRoundedIcon /> : <EventAvailableIcon />}
          onClick={(e) => {
            e.stopPropagation(); // kart onClick'i ikinci kez tetiklemesin
            goToRoom();
          }}
        >
          {isUnderMaintenance ? 'Bakımda' : 'Rezerve Et'}
        </Button>
      </CardActions>
    </Card>
  );
}