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
import type { Building } from '@/src/lib/api/building';

const pillSx = {
  borderRadius: '999px',
  textTransform: 'none',
  fontWeight: 600,
  px: 2,
  py: 1,
  borderColor: 'divider',
  whiteSpace: 'nowrap',
  flexShrink: 0,
};

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  buildings?: Building[];
  selectedBuildingId?: number | null;
  onBuildingChange?: (id: number | null) => void;
  minCapacity: number;
  onCapacityChange: (capacity: number) => void;
  selectedFeatures: string[];
  onFeaturesChange: (features: string[]) => void;
}

export default function FilterBar({
  search,
  onSearchChange,
  minCapacity,
  onCapacityChange,
  selectedFeatures,
  onFeaturesChange,
}: FilterBarProps) {
  const [spaceType, setSpaceType] = useState('private');
  const [spaceAnchor, setSpaceAnchor] = useState<null | HTMLElement>(null);

  const [capacityAnchor, setCapacityAnchor] = useState<null | HTMLElement>(null);

  const [moveInDate, setMoveInDate] = useState<Dayjs | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [dateAnchor, setDateAnchor] = useState<null | HTMLElement>(null);

  const [amenitiesAnchor, setAmenitiesAnchor] = useState<null | HTMLElement>(null);

  const toggleAmenity = (item: string) => {
    const updated = selectedFeatures.includes(item)
      ? selectedFeatures.filter((a) => a !== item)
      : [...selectedFeatures, item];
    onFeaturesChange(updated);
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
        alignItems: 'stretch', 
        gap: 2, 
        width: '100%',
        p: { xs: 1.5, sm: 2 }
      }}
    >
      <TextField
        placeholder="Toplantı odası ara..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        size="small"
        sx={{ 
          display: 'block',
          width: '100%',
          minWidth: 0,
          flexGrow: { md: 1 },
          '& .MuiOutlinedInput-root': { borderRadius: '999px' } 
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
            endAdornment: search ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => onSearchChange('')}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          },
        }}
      />

      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5, 
          width: '100%',
          overflowX: 'auto',
          py: 0.5,
          px: 0.5,
          '::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
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
          {minCapacity > 0 ? `${minCapacity}+ kişi` : 'Kapasite'}
        </Button>
        <CapacityPopover
          anchorEl={capacityAnchor} 
          onClose={() => setCapacityAnchor(null)}
          value={minCapacity} 
          onChange={onCapacityChange} 
          onApply={() => {}}
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
          {selectedFeatures.length > 0 ? `Özellikler (${selectedFeatures.length})` : 'Özellikler'}
        </Button>
        <PropertiesPopover
          anchorEl={amenitiesAnchor} 
          onClose={() => setAmenitiesAnchor(null)}
          selected={selectedFeatures} 
          onToggle={toggleAmenity}
          onClear={() => onFeaturesChange([])} 
          onApply={() => {}}
        />
      </Box>
    </Box>
  );
}