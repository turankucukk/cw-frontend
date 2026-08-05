// src/components/rooms/FilterBar.tsx
"use client";

import { useState } from 'react';
import { Box, TextField, InputAdornment, IconButton, Button, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import type { Dayjs } from 'dayjs';
import type { Building } from '@/src/lib/api/building';
import BuildingPopover from './filters/BuildingPopover';
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

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  buildings: Building[];
  selectedBuildingId: number | null;
  onBuildingChange: (id: number | null) => void;
  minCapacity: number;
  onCapacityChange: (value: number) => void;
  selectedFeatures: string[];
  onFeaturesChange: (features: string[]) => void;
}

export default function FilterBar({
  search, onSearchChange,
  buildings, selectedBuildingId, onBuildingChange,
  minCapacity, onCapacityChange,
  selectedFeatures, onFeaturesChange,
}: FilterBarProps) {
  const [buildingAnchor, setBuildingAnchor] = useState<null | HTMLElement>(null);
  const [capacityAnchor, setCapacityAnchor] = useState<null | HTMLElement>(null);
  const [dateAnchor, setDateAnchor] = useState<null | HTMLElement>(null);
  const [amenitiesAnchor, setAmenitiesAnchor] = useState<null | HTMLElement>(null);

  // Tarih/saat, oda listesini filtrelemiyor - şimdilik sadece görsel, kendi state'inde kalıyor
  const [moveInDate, setMoveInDate] = useState<Dayjs | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);

  const toggleFeature = (item: string) => {
    onFeaturesChange(
      selectedFeatures.includes(item)
        ? selectedFeatures.filter((f) => f !== item)
        : [...selectedFeatures, item]
    );
  };

  const selectedBuilding = buildings.find((b) => b.id === selectedBuildingId);
  const buildingLabel = selectedBuilding ? selectedBuilding.name : 'Binalar';

  const dateTimeLabel = (() => {
    if (!moveInDate) return 'Tarih & Saat';
    const dateStr = moveInDate.format('D MMM');
    if (startTime && endTime) {
      return `${dateStr}, ${startTime}-${endTime}`;
    }
    return dateStr;
  })();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 3, flexWrap: 'nowrap', width: '100%', overflowX: 'auto', px: { xs: 2, md: 4 } }}>
      <TextField
        placeholder="Toplantı odası ara..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        size="small"
        sx={{ minWidth: 400,alignItems: 'left', justifyContent: 'left', '& .MuiOutlinedInput-root': { borderRadius: '999px' } }}
        slotProps={{
          input: {
            startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" color="action" /></InputAdornment>,
            endAdornment: search && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => onSearchChange('')}><ClearIcon fontSize="small" /></IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <Divider orientation="vertical" flexItem sx={{  }} />
      <Button
        variant="outlined" disableElevation endIcon={<KeyboardArrowDownIcon />}
        onClick={(e) => setBuildingAnchor(e.currentTarget)}
        sx={pillSx}
      >
        
        {buildingLabel}
      </Button>

        <BuildingPopover
        anchorEl={buildingAnchor} onClose={() => setBuildingAnchor(null)}
        buildings={buildings} value={selectedBuildingId} onSelect={onBuildingChange}
      />

      <Button variant="outlined" endIcon={<KeyboardArrowDownIcon />} onClick={(e) => setCapacityAnchor(e.currentTarget)} sx={pillSx}>
        {minCapacity > 0 ? `${minCapacity}+ kişi` : 'Kapasite'}
      </Button>
      <CapacityPopover
        anchorEl={capacityAnchor} onClose={() => setCapacityAnchor(null)}
        value={minCapacity} onChange={onCapacityChange} onApply={() => {}}
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
        anchorEl={amenitiesAnchor} onClose={() => setAmenitiesAnchor(null)}
        selected={selectedFeatures} onToggle={toggleFeature}
        onClear={() => onFeaturesChange([])} onApply={() => {}}
      />
    </Box>
  );
}