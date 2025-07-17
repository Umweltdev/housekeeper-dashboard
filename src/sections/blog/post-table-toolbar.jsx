/* eslint-disable perfectionist/sort-imports */
import PropTypes from 'prop-types';
import { useCallback } from 'react';

// Material UI Components
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function PostTableToolbar({
  filters,
  onFilters,
  roleOptions,
  onResetFilters,
  canReset,
}) {
  const popover = usePopover();

  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterRole = useCallback(
    (event) => {
      onFilters(
        'role',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );

  const handleFilterStartDate = useCallback(
    (newValue) => {
      onFilters('startDate', newValue);
    },
    [onFilters]
  );

  const handleFilterEndDate = useCallback(
    (newValue) => {
      onFilters('endDate', newValue);
    },
    [onFilters]
  );

  const handleQuickFilter = (days) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    onFilters('startDate', startDate);
    onFilters('endDate', endDate);
  };

  const handleTodayFilter = () => {
    const today = new Date();
    onFilters('startDate', today);
    onFilters('endDate', today);
  };

  const handleClearDates = () => {
    onFilters('startDate', null);
    onFilters('endDate', null);
  };

  return (
    <>
      {/* Quick Filter Buttons */}
      <Stack direction="row" spacing={1} sx={{ p: 2.5, pb: 0 }}>
        <Button
          size="small"
          variant="outlined"
          onClick={handleTodayFilter}
          startIcon={<Iconify icon="material-symbols:today" />}
        >
          Today
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() => handleQuickFilter(7)}
          startIcon={<Iconify icon="ic:round-date-range" />}
        >
          Last 7 Days
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() => handleQuickFilter(30)}
          startIcon={<Iconify icon="ic:round-date-range" />}
        >
          Last 30 Days
        </Button>
        {canReset && (
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={handleClearDates}
            startIcon={<Iconify icon="mdi:close-circle-outline" />}
          >
            Clear Dates
          </Button>
        )}
      </Stack>

      {/* Main Filter Row */}
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >
        {/* Role Filter */}
        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>Role</InputLabel>
          <Select
            multiple
            value={filters.role}
            onChange={handleFilterRole}
            input={<OutlinedInput label="Role" />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 240 },
              },
            }}
          >
            {roleOptions.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox disableRipple size="small" checked={filters.role.includes(option)} />
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Date Range Pickers */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Start Date"
            value={filters.startDate}
            onChange={handleFilterStartDate}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                sx={{
                  maxWidth: { md: 180 },
                }}
              />
            )}
          />
          <DatePicker
            label="End Date"
            value={filters.endDate}
            onChange={handleFilterEndDate}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                sx={{
                  maxWidth: { md: 180 },
                }}
              />
            )}
          />
        </LocalizationProvider>

        {/* Search Field */}
        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={filters.name}
            onChange={handleFilterName}
            placeholder="Search customer or booking..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          {/* More Options Button */}
          <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack>
      </Stack>

      {/* Active Filters Display */}
      {(filters.startDate || filters.endDate || filters.role.length > 0 || filters.name) && (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            px: 2.5,
            pb: 2.5,
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          {filters.startDate && (
            <Chip
              label={`From: ${new Date(filters.startDate).toLocaleDateString()}`}
              onDelete={() => onFilters('startDate', null)}
              variant="outlined"
            />
          )}
          {filters.endDate && (
            <Chip
              label={`To: ${new Date(filters.endDate).toLocaleDateString()}`}
              onDelete={() => onFilters('endDate', null)}
              variant="outlined"
            />
          )}
          {filters.role.length > 0 && (
            <Chip
              label={`Roles: ${filters.role.join(', ')}`}
              onDelete={() => onFilters('role', [])}
              variant="outlined"
            />
          )}
          {filters.name && (
            <Chip
              label={`Search: ${filters.name}`}
              onDelete={() => onFilters('name', '')}
              variant="outlined"
            />
          )}
          {canReset && (
            <Button
              size="small"
              color="error"
              onClick={onResetFilters}
              startIcon={<Iconify icon="mdi:close-circle-outline" />}
            >
              Clear All
            </Button>
          )}
        </Stack>
      )}

      {/* More Options Popover */}
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>
        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:import-bold" />
          Import
        </MenuItem>
        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem>
      </CustomPopover>
    </>
  );
}

PostTableToolbar.propTypes = {
  filters: PropTypes.object.isRequired,
  onFilters: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
  roleOptions: PropTypes.array.isRequired,
  canReset: PropTypes.bool,
};