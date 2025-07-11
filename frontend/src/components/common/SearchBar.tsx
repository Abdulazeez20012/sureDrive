import React, { useState, useEffect } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  SxProps,
  Theme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { debounce } from '../../utils/helpers';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  initialValue?: string;
  debounceMs?: number;
  sx?: SxProps<Theme>;
  fullWidth?: boolean;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium';
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  onSearch,
  initialValue = '',
  debounceMs = 300,
  sx,
  fullWidth = true,
  variant = 'outlined',
  size = 'small',
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  // Create a debounced search function
  const debouncedSearch = React.useMemo(
    () => debounce((value: string) => onSearch(value), debounceMs),
    [onSearch, debounceMs]
  );

  // Handle input change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // Handle clear button click
  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  // Update search term if initialValue changes
  useEffect(() => {
    if (initialValue !== searchTerm) {
      setSearchTerm(initialValue);
    }
  }, [initialValue]);

  return (
    <Paper 
      elevation={0} 
      sx={{
        display: 'flex',
        alignItems: 'center',
        ...sx,
      }}
    >
      <TextField
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: searchTerm ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="clear search"
                onClick={handleClear}
                edge="end"
                size="small"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          },
        }}
      />
    </Paper>
  );
};

export default SearchBar;