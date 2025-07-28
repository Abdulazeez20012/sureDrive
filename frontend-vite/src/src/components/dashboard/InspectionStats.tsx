import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  LinearProgress,
  SxProps,
  Theme,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  CheckCircle as PassedIcon,
  Cancel as FailedIcon,
  Pending as PendingIcon,
  Schedule as ScheduledIcon,
} from '@mui/icons-material';

export interface InspectionStatsData {
  passed: number;
  failed: number;
  pending: number;
  scheduled: number;
  passRate: number;
}

interface InspectionStatsProps {
  stats: InspectionStatsData;
  title?: string;
  loading?: boolean;
  sx?: SxProps<Theme>;
}

const InspectionStats: React.FC<InspectionStatsProps> = ({
  stats,
  title = 'Inspection Statistics',
  loading = false,
  sx,
}) => {
  const getPassRateColor = (rate: number) => {
    if (rate >= 90) return 'success.main';
    if (rate >= 70) return 'warning.main';
    return 'error.main';
  };

  const statItems = [
    {
      label: 'Passed',
      value: stats.passed,
      icon: <PassedIcon sx={{ color: 'success.main' }} />,
      color: 'success.main',
    },
    {
      label: 'Failed',
      value: stats.failed,
      icon: <FailedIcon sx={{ color: 'error.main' }} />,
      color: 'error.main',
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: <PendingIcon sx={{ color: 'warning.main' }} />,
      color: 'warning.main',
    },
    {
      label: 'Scheduled',
      value: stats.scheduled,
      icon: <ScheduledIcon sx={{ color: 'info.main' }} />,
      color: 'info.main',
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

  const totalInspections = stats.passed + stats.failed + stats.pending + stats.scheduled;

  return (
    <Paper elevation={0} variant="outlined" sx={{ p: 3, ...sx }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Pass Rate
          </Typography>
          <Typography 
            variant="body2" 
            fontWeight="bold" 
            sx={{ color: getPassRateColor(stats.passRate) }}
          >
            {stats.passRate}%
          </Typography>
        </Box>
        <Tooltip title={`${stats.passRate}% pass rate`} arrow placement="top">
          <LinearProgress 
            variant="determinate" 
            value={stats.passRate} 
            sx={{ 
              height: 8, 
              borderRadius: 1,
              bgcolor: 'background.default',
              '& .MuiLinearProgress-bar': {
                bgcolor: getPassRateColor(stats.passRate),
              }
            }} 
          />
        </Tooltip>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        {statItems.map((item) => (
          <Grid item xs={6} key={item.label}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ mr: 1 }}>{item.icon}</Box>
              <Typography variant="body2">{item.label}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
              <Typography variant="h4" fontWeight="medium" sx={{ mr: 1 }}>
                {item.value}
              </Typography>
              {totalInspections > 0 && (
                <Typography variant="caption" color="text.secondary">
                  {Math.round((item.value / totalInspections) * 100)}%
                </Typography>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default InspectionStats;