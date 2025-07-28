import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  SxProps,
  Theme,
  Divider,
  Chip,
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  Build as MaintenanceIcon,
  Block as InactiveIcon,
  CheckCircle as ActiveIcon,
} from '@mui/icons-material';

export interface VehicleStatsData {
  total: number;
  active: number;
  maintenance: number;
  inactive: number;
  byMake: Array<{ make: string; count: number }>;
}

interface VehicleStatsProps {
  stats: VehicleStatsData;
  title?: string;
  loading?: boolean;
  sx?: SxProps<Theme>;
}

const VehicleStats: React.FC<VehicleStatsProps> = ({
  stats,
  title = 'Vehicle Statistics',
  loading = false,
  sx,
}) => {
  const statusItems = [
    {
      label: 'Active',
      value: stats.active,
      icon: <ActiveIcon sx={{ color: 'success.main' }} />,
      color: 'success',
    },
    {
      label: 'Maintenance',
      value: stats.maintenance,
      icon: <MaintenanceIcon sx={{ color: 'warning.main' }} />,
      color: 'warning',
    },
    {
      label: 'Inactive',
      value: stats.inactive,
      icon: <InactiveIcon sx={{ color: 'error.main' }} />,
      color: 'error',
    },
  ];

  if (loading) {
    return (
      <Paper elevation={0} variant="outlined" sx={{ p: 3, ...sx }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Loading statistics...
          </Typography>
        </Box>
      </Paper>
    );
  }

  // Sort makes by count (descending)
  const sortedMakes = [...stats.byMake].sort((a, b) => b.count - a.count);
  // Take top 5 makes
  const topMakes = sortedMakes.slice(0, 5);

  return (
    <Paper elevation={0} variant="outlined" sx={{ p: 3, ...sx }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <CarIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6">{title}</Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" fontWeight="medium" gutterBottom>
          {stats.total}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total Vehicles
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle2" gutterBottom>
        Status Breakdown
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statusItems.map((item) => (
          <Grid item xs={4} key={item.label}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Chip 
                icon={item.icon} 
                label={item.label} 
                color={item.color} 
                size="small" 
                variant="outlined" 
                sx={{ mb: 1 }} 
              />
              <Typography variant="h5" fontWeight="medium">
                {item.value}
              </Typography>
              {stats.total > 0 && (
                <Typography variant="caption" color="text.secondary">
                  {Math.round((item.value / stats.total) * 100)}%
                </Typography>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      {topMakes.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle2" gutterBottom>
            Top Makes
          </Typography>
          <Box>
            {topMakes.map((make, index) => (
              <Box 
                key={make.make} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  py: 0.75,
                  ...(index < topMakes.length - 1 && { 
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  })
                }}
              >
                <Typography variant="body2">{make.make}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" fontWeight="medium" sx={{ mr: 1 }}>
                    {make.count}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {Math.round((make.count / stats.total) * 100)}%
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Paper>
  );
};

export default VehicleStats;