// src/components/rooms/FilterBar.tsx
"use client";

import { useState } from 'react';
import {
  Box, TextField, InputAdornment, IconButton, Button, Divider,
  useMediaQuery, useTheme, Drawer, Typography, FormControlLabel,
  Checkbox, Select, MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';  
import AddIcon from '@mui/icons-material/Add';
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
  flexShrink: 0,
};

const availableFeatures = ['Wifi', 'TV', 'Projeksiyon', 'Beyaz Tahta', 'Ses Sistemi'];

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [buildingAnchor, setBuildingAnchor] = useState<null | HTMLElement>(null);
  const [capacityAnchor, setCapacityAnchor] = useState<null | HTMLElement>(null);
  const [dateAnchor, setDateAnchor] = useState<null | HTMLElement>(null);
  const [amenitiesAnchor, setAmenitiesAnchor] = useState<null | HTMLElement>(null);
  const [filtersDrawerOpen, setFiltersDrawerOpen] = useState(false);

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

  const activeFilterCount =
    (minCapacity > 0 ? 1 : 0) + (selectedFeatures.length > 0 ? 1 : 0);

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 3, flexWrap: 'nowrap', width: '100%', overflowX: 'auto', px: { xs: 2, md: 4 } }}>
        <TextField
          placeholder="Toplantı odası ara..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          size="small"
          sx={{ minWidth: { xs: 200, md: 400 }, flex: { xs: 1, md: 'none' }, '& .MuiOutlinedInput-root': { borderRadius: '999px' } }}
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

        <Divider orientation="vertical" flexItem />

       
          {isMobile ? (

          <Button
            variant="outlined"
            endIcon={<FilterListIcon />}
            onClick={() => setFiltersDrawerOpen(true)}
            sx={pillSx}
          >
            {activeFilterCount > 0 ? `Filtreler (${activeFilterCount})` : 'Filtreler'}
          </Button>
        ) : (
          <>

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
          </>
        )}
      </Box>

      {/* Mobil filtre paneli - sadece Kapasite ve Özellikler (Bina dışarıda kaldığı için burada yok) */}
      <Drawer
        anchor="bottom"
        open={filtersDrawerOpen}
        onClose={() => setFiltersDrawerOpen(false)}
        slotProps={{
          paper: { sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '85vh' } },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Filtreler</Typography>
            <IconButton onClick={() => setFiltersDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Bina</Typography>
  <Select
    fullWidth
    value={selectedBuildingId ?? ''}
    onChange={(e) => {
      const value = e.target.value as string | number;
      onBuildingChange(value === '' ? null : Number(value));
    }}
    displayEmpty
    size="small"
    sx={{ mb: 3 }}
  >
    <MenuItem value="">Tüm Binalar</MenuItem>
    {buildings.map((b) => (
      <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
    ))}
  </Select>

          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Minimum Kapasite</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <IconButton onClick={() => onCapacityChange(Math.max(0, minCapacity - 1))} sx={{ border: 1, borderColor: 'divider' }}>
              <RemoveIcon />
            </IconButton>
            <TextField
              value={minCapacity === 0 ? '0+' : `${minCapacity}+`}
              size="small"
              sx={{ width: 100 }}
              slotProps={{ htmlInput: { style: { textAlign: 'center' }, readOnly: true } }}
            />
            <IconButton onClick={() => onCapacityChange(minCapacity + 1)} sx={{ border: 1, borderColor: 'divider' }}>
              <AddIcon />
            </IconButton>
          </Box>

          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Özellikler</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {availableFeatures.map((feature) => (
              <FormControlLabel
                key={feature}
                control={
                  <Checkbox
                    checked={selectedFeatures.includes(feature)}
                    onChange={() => toggleFeature(feature)}
                  />
                }
                label={feature}
              />
            ))}
          </Box>

          <Button
            fullWidth
            variant="contained"
            disableElevation
            onClick={() => setFiltersDrawerOpen(false)}
          >
            Uygula
          </Button>
        </Box>
      </Drawer>
    </>
  );
}