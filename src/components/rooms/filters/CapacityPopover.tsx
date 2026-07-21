// src/components/rooms/filters/CapacityPopover.tsx
"use client";

import { Popover, Box, Typography, IconButton, TextField, Button, Link } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface Props {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  value: number;
  onChange: (value: number) => void;
  onApply: () => void;
}

export default function CapacityPopover({ anchorEl, onClose, value, onChange, onApply }: Props) {
  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      slotProps={{ paper: { sx: { width: 320, p: 3, mt: 1, borderRadius: 2 } } }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Capacity</Typography>
        <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <IconButton
          onClick={() => onChange(Math.max(0, value - 1))}
          sx={{ border: 1, borderColor: 'divider' }}
        >
          <RemoveIcon />
        </IconButton>
        <TextField
          value={value === 0 ? '0+' : `${value}+`}
          size="small"
          sx={{ width: 100 }}
          slotProps={{ htmlInput: { style: { textAlign: 'center' }, readOnly: true } }}
        />
        <IconButton
          onClick={() => onChange(value + 1)}
          sx={{ border: 1, borderColor: 'divider' }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link component="button" underline="always" onClick={() => onChange(0)} color="text.primary">
          Reset
        </Link>
        <Button variant="contained" disableElevation onClick={() => { onApply(); onClose(); }}>
          Apply
        </Button>
      </Box>
    </Popover>
  );
}