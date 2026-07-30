// src/components/rooms/FilterBar.tsx
"use client";

import { useState } from 'react';
import { Box, TextField, InputAdornment, IconButton, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import type { Dayjs } from 'dayjs';

import SpaceTypePopover from './filters/SpaceTypePopover';
import CapacityPopover from './filters/CapacityPopover';
import DateTimePopover from './filters/DateTimePopover';
import PropertiesPopover from './filters/PropertiesPopover';

const pillSx = {
  borderRadius: '999px',
  textTransform: 'none',
  fontWeight: 600,
  px: 2,
  py: 1,
  borderColor: 'divider',
  whiteSpace: 'nowrap',
  flexShrink: 0, // Mobilde butonların sıkışmasını önler
};

export default function FilterBar() {
  const [search, setSearch] = useState('');

  const [spaceType, setSpaceType] = useState('private');
  const [spaceAnchor, setSpaceAnchor] = useState<null | HTMLElement>(null);

  const [capacity, setCapacity] = useState(0);
  const [capacityAnchor, setCapacityAnchor] = useState<null | HTMLElement>(null);

  const [moveInDate, setMoveInDate] = useState<Dayjs | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [dateAnchor, setDateAnchor] = useState<null | HTMLElement>(null);

  const [amenities, setAmenities] = useState<string[]>([]);
  const [amenitiesAnchor, setAmenitiesAnchor] = useState<null | HTMLElement>(null);

  const toggleAmenity = (item: string) => {
    setAmenities((prev) => (prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]));
  };

  const spaceTypeLabel: Record<string, string> = {
    private: 'Özel Ofisler',
    coworking: 'Coworking',
    meeting: 'Toplantı Odaları',
  };

  const dateTimeLabel = (() => {
    if (!moveInDate) return 'Tarih & Saat';
    const dateStr = moveInDate.format('D MMM');
    if (startTime && endTime) {
      return `${dateStr}, ${startTime}-${endTime}`;
    }
    return dateStr;
  })();

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        alignItems: 'center', 
        gap: 2, 
        width: '100%',
        p: { xs: 1, sm: 2 }
      }}
    >
      {/* Arama Inputu: Mobilde %100 Genişlik */}
      <TextField
        placeholder="Toplantı odası ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        sx={{ 
          width: { xs: '100%', md: 'auto' }, 
          minWidth: { xs: '100%', md: 280 },
          flexGrow: { md: 1 },
          '& .MuiOutlinedInput-root': { borderRadius: '999px' } 
        }}
        slotProps={{
          input: {
            startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" color="action" /></InputAdornment>,
            endAdornment: search && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearch('')}><ClearIcon fontSize="small" /></IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      {/* Filtre Butonları Kapsayıcısı */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5, 
          width: { xs: '100%', md: 'auto' },
          overflowX: 'auto', // Mobilde sağa kaydırılabilir buton akışı
          pb: { xs: 1, md: 0 },
          '::-webkit-scrollbar': { display: 'none' }, // Scrollbar gizleme
          scrollbarWidth: 'none'
        }}
      >
        <Button
          variant="outlined" 
          disableElevation 
          endIcon={<KeyboardArrowDownIcon />}
          onClick={(e) => setSpaceAnchor(e.currentTarget)}
          sx={{ ...pillSx, bgcolor: 'primary.50', color: 'primary.main', '&:hover': { bgcolor: 'primary.50' } }}
        >
          {spaceTypeLabel[spaceType]}
        </Button>
        <SpaceTypePopover anchorEl={spaceAnchor} onClose={() => setSpaceAnchor(null)} value={spaceType} onSelect={setSpaceType} />

        <Button variant="outlined" endIcon={<KeyboardArrowDownIcon />} onClick={(e) => setCapacityAnchor(e.currentTarget)} sx={pillSx}>
          {capacity > 0 ? `${capacity}+ kişi` : 'Kapasite'}
        </Button>
        <CapacityPopover
          anchorEl={capacityAnchor} onClose={() => setCapacityAnchor(null)}
          value={capacity} onChange={setCapacity} onApply={() => {}}
        />

        <Button variant="outlined" endIcon={<KeyboardArrowDownIcon />} onClick={(e) => setDateAnchor(e.currentTarget)} sx={pillSx}>
          {dateTimeLabel}
        </Button>
        <DateTimePopover
          anchorEl={dateAnchor}
          onClose={() => setDateAnchor(null)}
          date={moveInDate}
          onDateChange={setMoveInDate}
          startTime={startTime}
          onStartTimeChange={setStartTime}
          endTime={endTime}
          onEndTimeChange={setEndTime}
          onApply={() => {}}
        />

        <Button variant="outlined" endIcon={<KeyboardArrowDownIcon />} onClick={(e) => setAmenitiesAnchor(e.currentTarget)} sx={pillSx}>
          {amenities.length > 0 ? `Özellikler (${amenities.length})` : 'Özellikler'}
        </Button>
        <PropertiesPopover
          anchorEl={amenitiesAnchor} onClose={() => setAmenitiesAnchor(null)}
          selected={amenities} onToggle={toggleAmenity}
          onClear={() => setAmenities([])} onApply={() => {}}
        />
      </Box>
    </Box>
  );
}