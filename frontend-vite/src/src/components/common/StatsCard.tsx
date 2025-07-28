import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Skeleton,
  useTheme,
  alpha,
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';

interface StatsCardProps {
  /**
   * Title of the stats card
   */
  title: string;
  
  /**
   * The main value to display
   */
  value: string | number;
  
  /**
   * Optional subtitle or description
   */
  subtitle?: string;
  
  /**
   * Optional icon to display
   */
  icon?: React.ReactNode;
  
  /**
   * Color for the icon background
   * @default 'primary'
   */
  iconColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  
  /**
   * Optional percentage change to display
   */
  change?: number;
  
  /**
   * Whether the change is positive (up) or negative (down)
   * If not provided, it will be determined by the sign of the change value
   */
  trend?: 'up' | 'down' | 'neutral';
  
  /**
   * Optional tooltip text to display when hovering over the info icon
   */
  tooltip?: string;
  
  /**
   * Whether the card is in a loading state
   * @default false
   */
  loading?: boolean;
  
  /**
   * Function to call when the card is clicked
   */
  onClick?: () => void;
  
  /**
   * Additional styles for the card
   */
  sx?: React.ComponentProps<typeof Card>['sx'];
}

/**
 * A reusable stats card component for displaying key metrics and statistics
 */
const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconColor = 'primary',
  change,
  trend,
  tooltip,
  loading = false,
  onClick,
  sx,
}) => {
  const theme = useTheme();
  
  // Determine trend based on change if not explicitly provided
  const determinedTrend = trend || (change && change > 0 ? 'up' : change && change < 0 ? 'down' : 'neutral');
  
  // Get color based on trend
  const getTrendColor = () => {
    switch (determinedTrend) {
      case 'up':
        return theme.palette.success.main;
      case 'down':
        return theme.palette.error.main;
      default:
        return theme.palette.text.secondary;
    }
  };
  
  // Get icon color from theme
  const getIconColor = () => {
    switch (iconColor) {
      case 'primary':
        return theme.palette.primary.main;
      case 'secondary':
        return theme.palette.secondary.main;
      case 'error':
        return theme.palette.error.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'info':
        return theme.palette.info.main;
      case 'success':
        return theme.palette.success.main;
      default:
        return theme.palette.primary.main;
    }
  };
  
  return (
    <Card
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        } : {},
        ...sx,
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {loading ? <Skeleton width={80} /> : title}
            </Typography>
            <Typography variant="h4" component="div">
              {loading ? <Skeleton width={100} height={40} /> : value}
            </Typography>
          </Box>
          
          {icon && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: loading ? theme.palette.action.disabledBackground : alpha(getIconColor(), 0.1),
                borderRadius: '50%',
                width: 48,
                height: 48,
                color: loading ? 'transparent' : getIconColor(),
              }}
            >
              {loading ? <Skeleton variant="circular" width={48} height={48} /> : icon}
            </Box>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {loading ? <Skeleton width={120} /> : subtitle}
            </Typography>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {change !== undefined && (
              <Typography 
                variant="body2" 
                sx={{ 
                  color: loading ? 'transparent' : getTrendColor(),
                  fontWeight: 'medium',
                  mr: 1,
                }}
              >
                {loading ? (
                  <Skeleton width={60} />
                ) : (
                  <>
                    {determinedTrend === 'up' && '+'}
                    {Math.abs(change).toFixed(1)}%
                  </>
                )}
              </Typography>
            )}
            
            {tooltip && (
              <Tooltip title={tooltip}>
                <IconButton size="small" sx={{ ml: 'auto' }}>
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard;