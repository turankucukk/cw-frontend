// src/components/rooms/filters/DateTimePopover.tsx
"use client";

import { useState } from 'react';
import { Popover, Box, Typography, IconButton, Link, Stack, Select, MenuItem, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import 'dayjs/locale/tr';
import type { Dayjs } from 'dayjs';

const timeOptions: string[] = [];
for (let hour = 9; hour <= 21; hour++) {
  timeOptions.push(`${String(hour).padStart(2, '0')}:00`);
  if (hour !== 21) timeOptions.push(`${String(hour).padStart(2, '0')}:30`);
}

interface Props {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  date: Dayjs | null;
  onDateChange: (date: Dayjs | null) => void;
  startTime: string | null;
  onStartTimeChange: (time: string | null) => void;
  endTime: string | null;
  onEndTimeChange: (time: string | null) => void;
  onApply: () => void;
}

export default function DateTimePopover({
  anchorEl,
  onClose,
  date,
  onDateChange,
  startTime,
  onStartTimeChange,
  endTime,
  onEndTimeChange,
  onApply,
}: Props) {
  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      slotProps={{ paper: { sx: { width: 320, p: 2, mt: 1, borderRadius: 2 } } }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Tarih ve Saat</Typography>
        <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
      </Box>

      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
        <DateCalendar
          value={date}
          onChange={onDateChange}
          sx={{
            width: '100%',
            maxHeight: 280,
            '& .MuiPickersCalendarHeader-root': { px: 1 },
            '& .MuiDayCalendar-weekDayLabel': { fontSize: 12 },
            '& .MuiPickersDay-root': { fontSize: 13, width: 32, height: 32 },
          }}
        />
      </LocalizationProvider>

      <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 0.5, mb: 1, px: 1 }}>
        Saat aralığı
      </Typography>

      <Stack direction="row" spacing={1.5} sx={{ px: 1, mb: 2 }}>
        <Select
          value={startTime ?? '09:00'}
          onChange={(e) => onStartTimeChange(e.target.value)}
          size="small"
          fullWidth
          MenuProps={{ slotProps: { paper: { sx: { maxHeight: 240 } } } }}
        >
          {timeOptions.map((t) => (
            <MenuItem key={t} value={t}>{t}</MenuItem>
          ))}
        </Select>

        <Select
          value={endTime ?? '10:00'}
          onChange={(e) => onEndTimeChange(e.target.value)}
          size="small"
          fullWidth
          MenuProps={{ slotProps: { paper: { sx: { maxHeight: 240 } } } }}
        >
          {timeOptions.map((t) => (
            <MenuItem key={t} value={t}>{t}</MenuItem>
          ))}
        </Select>
      </Stack>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1 }}>
        <Link
          component="button"
          underline="always"
          onClick={() => { onDateChange(null); onStartTimeChange(null); onEndTimeChange(null); }}
          color="text.primary"
          sx={{ fontSize: 13 }}
        >
          Temizle
        </Link>
        <Button variant="contained" disableElevation size="small" onClick={() => { onApply(); onClose(); }}>
          Uygula
        </Button>
      </Box>
    </Popover>
  );
}