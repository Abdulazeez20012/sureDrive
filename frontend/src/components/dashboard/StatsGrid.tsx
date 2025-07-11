import React from 'react';
import { Grid, Box, SxProps, Theme } from '@mui/material';
import StatCard from './StatCard';
import {
  DirectionsCar as CarIcon,
  EventNote as EventIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

interface StatsGridProps {
  stats: {
    totalVehicles: number;
    activeVehicles: number;
    pendingInspections: number;
    completedInspections: number;
    passedInspections: number;
    failedInspections: number;
    upcomingInspections: number;
  };
  loading?: boolean;
  sx?: SxProps<Theme>;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats, loading = false, sx }) => {
  return (
    <Box sx={sx}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Vehicles"
            value={loading ? '...' : stats.totalVehicles}
            icon={<CarIcon />}
            subtitle={`${stats.activeVehicles} active vehicles`}
            iconColor="primary.main"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Pending Inspections"
            value={loading ? '...' : stats.pendingInspections}
            icon={<EventIcon />}
            subtitle="Awaiting completion"
            iconColor="warning.main"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Completed Inspections"
            value={loading ? '...' : stats.completedInspections}
            icon={<CheckIcon />}
            subtitle={`${stats.passedInspections} passed, ${stats.failedInspections} failed`}
            iconColor="success.main"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={6}>
          <StatCard
            title="Upcoming Inspections"
            value={loading ? '...' : stats.upcomingInspections}
            icon={<ScheduleIcon />}
            subtitle="Scheduled for the next 7 days"
            iconColor="info.main"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={6}>
          <StatCard
            title="Inspection Pass Rate"
            value={
              loading
                ? '...'
                : stats.completedInspections > 0
                ? `${Math.round((stats.passedInspections / stats.completedInspections) * 100)}%`
                : '0%'
            }
            icon={<CheckIcon />}
            change={
              stats.completedInspections > 0
                ? {
                    value: 5, // This would be calculated from historical data
                    isPositive: true,
                  }
                : undefined
            }
            iconColor="success.main"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatsGrid;