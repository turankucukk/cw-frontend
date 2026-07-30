// src/components/rooms/filters/BuildingPopover.tsx
"use client";

import { Popover, Box, Typography, IconButton, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ApartmentIcon from '@mui/icons-material/Apartment';
import type { Building } from '@/src/lib/api/building';

interface Props {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  buildings: Building[];
  value: number | null;
  onSelect: (id: number | null) => void;
}

export default function BuildingPopover({ anchorEl, onClose, buildings, value, onSelect }: Props) {
  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      slotProps={{ paper: { sx: { width: 320, p: 3, mt: 1, borderRadius: 2 } } }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Bina</Typography>
        <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
      </Box>

      <Stack spacing={1}>
        <Box
          onClick={() => { onSelect(null); onClose(); }}
          sx={{
            display: 'flex', alignItems: 'center', gap: 2, p: 1.5, borderRadius: 2, cursor: 'pointer',
            bgcolor: value === null ? 'primary.50' : 'transparent',
            '&:hover': { bgcolor: value === null ? 'primary.50' : 'action.hover' },
          }}
        >
          <ApartmentIcon sx={{ fontSize: 24 }} />
          <Typography sx={{ fontWeight: 600 }}>Tüm Binalar</Typography>
        </Box>

        {buildings.map((building) => (
          <Box
            key={building.id ?? building.name}
            onClick={() => { onSelect(building.id ?? null); onClose(); }}
            sx={{
              display: 'flex', alignItems: 'center', gap: 2, p: 1.5, borderRadius: 2, cursor: 'pointer',
              bgcolor: value === building.id ? 'primary.50' : 'transparent',
              '&:hover': { bgcolor: value === building.id ? 'primary.50' : 'action.hover' },
            }}
          >
            <ApartmentIcon sx={{ fontSize: 24 }} />
            <Typography sx={{ fontWeight: 600 }}>{building.name}</Typography>
          </Box>
        ))}
      </Stack>
    </Popover>
  );
}