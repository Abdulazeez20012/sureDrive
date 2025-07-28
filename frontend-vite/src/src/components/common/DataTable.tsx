import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  SxProps,
  Theme,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';

type Order = 'asc' | 'desc';

interface Column<T> {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  getRowId: (row: T) => string | number;
  defaultSortColumn?: string;
  defaultSortDirection?: Order;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (searchTerm: string) => void;
  searchField?: string;
  pagination?: boolean;
  rowsPerPageOptions?: number[];
  sx?: SxProps<Theme>;
  emptyMessage?: string;
}

function DataTable<T>({ 
  columns, 
  rows, 
  loading = false,
  error,
  onRetry,
  getRowId,
  defaultSortColumn,
  defaultSortDirection = 'asc',
  searchable = false,
  searchPlaceholder = 'Search...',
  onSearch,
  searchField,
  pagination = true,
  rowsPerPageOptions = [5, 10, 25],
  sx,
  emptyMessage = 'No data available'
}: DataTableProps<T>) {
  // State for sorting
  const [order, setOrder] = useState<Order>(defaultSortDirection);
  const [orderBy, setOrderBy] = useState<string | undefined>(defaultSortColumn);
  
  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  
  // State for search
  const [searchTerm, setSearchTerm] = useState('');

  // Handle sort request
  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Handle page change
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    setPage(0);
    if (onSearch) {
      onSearch(value);
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  // Filter rows based on search term if no external search handler
  const filteredRows = onSearch
    ? rows
    : searchTerm && searchField
    ? rows.filter((row: any) => {
        const value = row[searchField];
        return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    : rows;

  // Sort rows if orderBy is defined
  const sortedRows = orderBy
    ? [...filteredRows].sort((a: any, b: any) => {
        const aValue = a[orderBy];
        const bValue = b[orderBy];
        
        if (aValue === bValue) return 0;
        
        if (aValue === null || aValue === undefined) return order === 'asc' ? -1 : 1;
        if (bValue === null || bValue === undefined) return order === 'asc' ? 1 : -1;
        
        if (order === 'asc') {
          return aValue < bValue ? -1 : 1;
        } else {
          return bValue < aValue ? -1 : 1;
        }
      })
    : filteredRows;

  // Paginate rows
  const paginatedRows = pagination
    ? sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : sortedRows;

  // Show loading state
  if (loading) {
    return <LoadingState message="Loading data..." />;
  }

  // Show error state
  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', ...sx }}>
      {searchable && (
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleClearSearch}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}
      
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  style={{ minWidth: column.minWidth || 100 }}
                >
                  {column.sortable !== false && orderBy !== undefined ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row: T) => {
                return (
                  <TableRow hover tabIndex={-1} key={getRowId(row)}>
                    {columns.map((column) => {
                      const value = (row as any)[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format ? column.format(value, row) : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography variant="body2" sx={{ py: 2 }}>
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {pagination && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={sortedRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
}

export default DataTable;