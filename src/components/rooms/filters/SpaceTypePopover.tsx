// src/components/rooms/filters/SpaceTypePopover.tsx
"use client";

import { Popover, Box, Typography, IconButton, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import PeopleIcon from '@mui/icons-material/People';

const spaceTypes = [
  { id: 'private', label: 'Private Office', desc: 'Furnished offices for teams of all sizes', icon: PersonIcon },
  { id: 'coworking', label: 'Coworking', desc: 'Shared workspace for individuals', icon: GroupsIcon },
  { id: 'meeting', label: 'Meeting Rooms', desc: 'Fully equipped spaces for meetings', icon: PeopleIcon },
];

interface Props {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  value: string;
  onSelect: (id: string) => void;
}

export default function SpaceTypePopover({ anchorEl, onClose, value, onSelect }: Props) {
  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      slotProps={{ paper: { sx: { width: 340, p: 3, mt: 1, borderRadius: 2 } } }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Space Type</Typography>
        <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
      </Box>

      <Stack spacing={1.5}>
        {spaceTypes.map(({ id, label, desc, icon: Icon }) => (
          <Box
            key={id}
            onClick={() => { onSelect(id); onClose(); }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 1.5,
              borderRadius: 2,
              cursor: 'pointer',
              bgcolor: value === id ? 'primary.50' : 'transparent',
              '&:hover': { bgcolor: value === id ? 'primary.50' : 'action.hover' },
            }}
          >
            <Icon sx={{ fontSize: 28 }} />
            <Box>
              <Typography sx={{ fontWeight: 'bold' }}>{label}</Typography>
              <Typography variant="body2" color="text.secondary">{desc}</Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </Popover>
  );
}