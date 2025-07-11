import React, { useState, useEffect } from 'react';
import {
  Box,
  Chip,
  IconButton,
  Button,
  Divider,
  Popover,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Typography,
  InputAdornment,
  Tooltip,
  Paper,
  useTheme,
  alpha,
  SxProps,
  Theme,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

export interface FilterOption {
  /**
   * Unique identifier for the filter option
   */
  id: string;
  
  /**
   * Label to display for the filter option
   */
  label: string;
  
  /**
   * Type of filter input
   */
  type: 'text' | 'select' | 'multiselect' | 'checkbox' | 'date' | 'daterange' | 'number' | 'numberrange';
  
  /**
   * Current value of the filter
   */
  value?: any;
  
  /**
   * Options for select and multiselect filters
   */
  options?: Array<{ value: string | number; label: string }>;
  
  /**
   * Placeholder text for the filter input
   */
  placeholder?: string;
  
  /**
   * Whether the filter is active
   */
  active?: boolean;
  
  /**
   * Whether the filter is disabled
   */
  disabled?: boolean;
  
  /**
   * Custom render function for the filter input
   */
  renderInput?: (option: FilterOption, onChange: (value: any) => void) => React.ReactNode;
}

export interface FilterBarProps {
  /**
   * Array of filter options
   */
  filters: FilterOption[];
  
  /**
   * Function to call when filters change
   */
  onFilterChange: (filters: FilterOption[]) => void;
  
  /**
   * Whether to show a search input
   * @default true
   */
  showSearch?: boolean;
  
  /**
   * Initial search query
   */
  initialSearchQuery?: string;
  
  /**
   * Function to call when search query changes
   */
  onSearchChange?: (query: string) => void;
  
  /**
   * Placeholder text for the search input
   * @default 'Search...'
   */
  searchPlaceholder?: string;
  
  /**
   * Whether to show active filters as chips
   * @default true
   */
  showActiveFilters?: boolean;
  
  /**
   * Whether to show a clear all filters button
   * @default true
   */
  showClearFilters?: boolean;
  
  /**
   * Text for the clear all filters button
   * @default 'Clear All'
   */
  clearFiltersText?: string;
  
  /**
   * Text for the apply filters button
   * @default 'Apply'
   */
  applyFiltersText?: string;
  
  /**
   * Text for the filter button
   * @default 'Filter'
   */
  filterButtonText?: string;
  
  /**
   * Whether to show the filter button as an icon only
   * @default false
   */
  iconOnly?: boolean;
  
  /**
   * Additional styles for the filter bar container
   */
  sx?: SxProps<Theme>;
}

/**
 * A reusable filter bar component for filtering data in tables and lists
 */
const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  showSearch = true,
  initialSearchQuery = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  showActiveFilters = true,
  showClearFilters = true,
  clearFiltersText = 'Clear All',
  applyFiltersText = 'Apply',
  filterButtonText = 'Filter',
  iconOnly = false,
  sx,
}) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const [tempFilters, setTempFilters] = useState<FilterOption[]>(filters);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  
  // Update tempFilters when filters prop changes
  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);
  
  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    
    if (onSearchChange) {
      onSearchChange(query);
    }
  };
  
  // Clear search input
  const handleClearSearch = () => {
    setSearchQuery('');
    
    if (onSearchChange) {
      onSearchChange('');
    }
  };
  
  // Open filter popover
  const handleOpenFilters = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  // Close filter popover
  const handleCloseFilters = () => {
    setAnchorEl(null);
  };
  
  // Apply filters
  const handleApplyFilters = () => {
    onFilterChange(tempFilters);
    handleCloseFilters();
  };
  
  // Update a single filter
  const handleFilterChange = (id: string, value: any) => {
    setTempFilters((prev) =>
      prev.map((filter) =>
        filter.id === id
          ? { ...filter, value, active: value !== undefined && value !== '' && value !== null }
          : filter
      )
    );
  };
  
  // Clear all filters
  const handleClearAllFilters = () => {
    const clearedFilters = tempFilters.map((filter) => ({
      ...filter,
      value: undefined,
      active: false,
    }));
    
    setTempFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };
  
  // Remove a single filter
  const handleRemoveFilter = (id: string) => {
    const updatedFilters = filters.map((filter) =>
      filter.id === id ? { ...filter, value: undefined, active: false } : filter
    );
    
    onFilterChange(updatedFilters);
  };
  
  // Count active filters
  const activeFilterCount = filters.filter((filter) => filter.active).length;
  
  // Check if popover is open
  const open = Boolean(anchorEl);
  const popoverId = open ? 'filter-popover' : undefined;
  
  // Render filter input based on type
  const renderFilterInput = (filter: FilterOption) => {
    if (filter.renderInput) {
      return filter.renderInput(filter, (value) => handleFilterChange(filter.id, value));
    }
    
    switch (filter.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            size="small"
            placeholder={filter.placeholder}
            value={filter.value || ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            disabled={filter.disabled}
          />
        );
      
      case 'select':
        return (
          <TextField
            select
            fullWidth
            size="small"
            value={filter.value || ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            disabled={filter.disabled}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {filter.options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        );
      
      case 'multiselect':
        return (
          <TextField
            select
            fullWidth
            size="small"
            value={filter.value || []}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            disabled={filter.disabled}
            SelectProps={{
              multiple: true,
              renderValue: (selected: any) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((value) => {
                    const option = filter.options?.find((opt) => opt.value === value);
                    return (
                      <Chip
                        key={value}
                        label={option?.label || value}
                        size="small"
                        onDelete={(e) => {
                          e.stopPropagation();
                          const newValue = (filter.value as string[]).filter((v) => v !== value);
                          handleFilterChange(filter.id, newValue.length ? newValue : undefined);
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                      />
                    );
                  })}
                </Box>
              ),
            }}
          >
            {filter.options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox
                  checked={(filter.value || []).indexOf(option.value) > -1}
                  size="small"
                />
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        );
      
      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={!!filter.value}
                onChange={(e) => handleFilterChange(filter.id, e.target.checked)}
                disabled={filter.disabled}
                size="small"
              />
            }
            label={filter.placeholder || filter.label}
          />
        );
      
      case 'number':
        return (
          <TextField
            fullWidth
            size="small"
            type="number"
            placeholder={filter.placeholder}
            value={filter.value || ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            disabled={filter.disabled}
          />
        );
      
      case 'numberrange':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              size="small"
              type="number"
              placeholder="Min"
              value={filter.value?.min || ''}
              onChange={(e) =>
                handleFilterChange(filter.id, {
                  ...filter.value,
                  min: e.target.value,
                })
              }
              disabled={filter.disabled}
              sx={{ flex: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              to
            </Typography>
            <TextField
              size="small"
              type="number"
              placeholder="Max"
              value={filter.value?.max || ''}
              onChange={(e) =>
                handleFilterChange(filter.id, {
                  ...filter.value,
                  max: e.target.value,
                })
              }
              disabled={filter.disabled}
              sx={{ flex: 1 }}
            />
          </Box>
        );
      
      case 'date':
        return (
          <TextField
            fullWidth
            size="small"
            type="date"
            value={filter.value || ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            disabled={filter.disabled}
            InputLabelProps={{ shrink: true }}
          />
        );
      
      case 'daterange':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              size="small"
              type="date"
              label="From"
              value={filter.value?.from || ''}
              onChange={(e) =>
                handleFilterChange(filter.id, {
                  ...filter.value,
                  from: e.target.value,
                })
              }
              disabled={filter.disabled}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
            />
            <TextField
              size="small"
              type="date"
              label="To"
              value={filter.value?.to || ''}
              onChange={(e) =>
                handleFilterChange(filter.id, {
                  ...filter.value,
                  to: e.target.value,
                })
              }
              disabled={filter.disabled}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
            />
          </Box>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        p: 1.5,
        mb: 2,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: 1,
        ...sx,
      }}
    >
      {/* Search input */}
      {showSearch && (
        <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: 200 } }}>
          <TextField
            fullWidth
            size="small"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: searchQuery ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={handleClearSearch}
                    edge="end"
                    aria-label="clear search"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
          />
        </Box>
      )}
      
      {/* Filter button */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {iconOnly ? (
          <Tooltip title={filterButtonText}>
            <IconButton
              onClick={handleOpenFilters}
              color={activeFilterCount > 0 ? 'primary' : 'default'}
              aria-describedby={popoverId}
            >
              <FilterIcon />
              {activeFilterCount > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {activeFilterCount}
                </Box>
              )}
            </IconButton>
          </Tooltip>
        ) : (
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            endIcon={<ExpandMoreIcon />}
            onClick={handleOpenFilters}
            aria-describedby={popoverId}
            color={activeFilterCount > 0 ? 'primary' : 'inherit'}
            sx={{
              borderColor: activeFilterCount > 0 ? undefined : theme.palette.divider,
              '&:hover': {
                borderColor: activeFilterCount > 0 ? undefined : theme.palette.divider,
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
              },
            }}
          >
            {filterButtonText}
            {activeFilterCount > 0 && (
              <Box
                component="span"
                sx={{
                  ml: 1,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {activeFilterCount}
              </Box>
            )}
          </Button>
        )}
        
        {/* Clear filters button */}
        {showClearFilters && activeFilterCount > 0 && (
          <Button
            variant="text"
            size="small"
            onClick={handleClearAllFilters}
            sx={{ ml: 1 }}
          >
            {clearFiltersText}
          </Button>
        )}
      </Box>
      
      {/* Filter popover */}
      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseFilters}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 300,
            maxHeight: 500,
            overflow: 'auto',
            mt: 1,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">Filters</Typography>
            {activeFilterCount > 0 && (
              <Button size="small" onClick={handleClearAllFilters}>
                {clearFiltersText}
              </Button>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {tempFilters.map((filter) => (
              <Box key={filter.id}>
                <Typography variant="body2" fontWeight={500} gutterBottom>
                  {filter.label}
                </Typography>
                {renderFilterInput(filter)}
              </Box>
            ))}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={handleCloseFilters} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleApplyFilters}>
              {applyFiltersText}
            </Button>
          </Box>
        </Box>
      </Popover>
      
      {/* Active filters */}
      {showActiveFilters && activeFilterCount > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            mt: { xs: 1, sm: 0 },
            width: '100%',
          }}
        >
          {filters
            .filter((filter) => filter.active)
            .map((filter) => {
              let chipLabel = filter.label;
              
              // Format the value for display
              if (filter.type === 'select' && filter.options) {
                const option = filter.options.find((opt) => opt.value === filter.value);
                if (option) {
                  chipLabel = `${filter.label}: ${option.label}`;
                }
              } else if (filter.type === 'multiselect' && filter.options && Array.isArray(filter.value)) {
                chipLabel = `${filter.label} (${filter.value.length})`;
              } else if (filter.type === 'checkbox') {
                chipLabel = filter.label;
              } else if (filter.type === 'daterange' && filter.value) {
                const { from, to } = filter.value;
                if (from && to) {
                  chipLabel = `${filter.label}: ${from} to ${to}`;
                } else if (from) {
                  chipLabel = `${filter.label}: From ${from}`;
                } else if (to) {
                  chipLabel = `${filter.label}: Until ${to}`;
                }
              } else if (filter.type === 'numberrange' && filter.value) {
                const { min, max } = filter.value;
                if (min !== undefined && max !== undefined) {
                  chipLabel = `${filter.label}: ${min} to ${max}`;
                } else if (min !== undefined) {
                  chipLabel = `${filter.label}: ≥ ${min}`;
                } else if (max !== undefined) {
                  chipLabel = `${filter.label}: ≤ ${max}`;
                }
              } else if (filter.value !== undefined && filter.value !== '') {
                chipLabel = `${filter.label}: ${filter.value}`;
              }
              
              return (
                <Chip
                  key={filter.id}
                  label={chipLabel}
                  onDelete={() => handleRemoveFilter(filter.id)}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              );
            })}
        </Box>
      )}
    </Paper>
  );
};

export default FilterBar;