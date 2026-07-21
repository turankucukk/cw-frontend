"use client";

import { Popover, Box, Typography, IconButton, FormControlLabel, Checkbox, Grid, Button, Link } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const properties = ['Wifi', 'TV', 'Projeksiyon', 'Beyaz Tahta', 'Ses Sistemi'];

interface Props {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  selected: string[];
  onToggle: (item: string) => void;
  onClear: () => void;
  onApply: () => void;
}

export default function PropertiesPopover({ anchorEl, onClose, selected, onToggle, onClear, onApply }: Props) {
  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      slotProps={{ paper: { sx: { width: 420, p: 3, mt: 1, borderRadius: 2 } } }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Oda Özellikleri</Typography>
        <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
      </Box>

      <Grid container spacing={1}>
        {properties.map((item) => (
          <Grid size={{ xs: 6 }} key={item}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selected.includes(item)}
                  onChange={() => onToggle(item)}
                />
              }
              label={item}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
        <Link component="button" underline="always" onClick={onClear} color="text.primary">
          Clear
        </Link>
        <Button variant="contained" disableElevation onClick={() => { onApply(); onClose(); }}>
          Apply
        </Button>
      </Box>
    </Popover>
  );
}