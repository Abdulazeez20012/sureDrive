import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  Divider,
  Paper,
  Chip,
  Button,
  SxProps,
  Theme,
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  EventNote as EventIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { formatDate, formatDateTime } from '../../utils/helpers';
import { Link } from 'react-router-dom';

export interface ActivityItem {
  id: string;
  type: 'vehicle_added' | 'vehicle_updated' | 'inspection_booked' | 'inspection_completed' | 'inspection_cancelled';
  timestamp: string;
  data: {
    vehicleId?: string;
    vehicleName?: string;
    inspectionId?: string;
    inspectionStatus?: 'passed' | 'failed' | 'cancelled';
    userName?: string;
  };
}

interface RecentActivityProps {
  activities: ActivityItem[];
  title?: string;
  maxItems?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
  loading?: boolean;
  sx?: SxProps<Theme>;
}

const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  title = 'Recent Activity',
  maxItems = 5,
  showViewAll = true,
  onViewAll,
  loading = false,
  sx,
}) => {
  const displayedActivities = activities.slice(0, maxItems);

  const getActivityIcon = (type: string, status?: string) => {
    switch (type) {
      case 'vehicle_added':
        return <CarIcon color="primary" />;
      case 'vehicle_updated':
        return <CarIcon color="info" />;
      case 'inspection_booked':
        return <ScheduleIcon color="warning" />;
      case 'inspection_completed':
        if (status === 'passed') return <CheckIcon color="success" />;
        if (status === 'failed') return <ErrorIcon color="error" />;
        return <EventIcon color="primary" />;
      case 'inspection_cancelled':
        return <CancelIcon color="error" />;
      default:
        return <EventIcon />;
    }
  };

  const getActivityText = (activity: ActivityItem) => {
    const { type, data } = activity;
    
    switch (type) {
      case 'vehicle_added':
        return (
          <>
            New vehicle added: 
            <Link 
              to={`/vehicles/${data.vehicleId}`}
              style={{ color: 'inherit', textDecoration: 'underline' }}
            >
              {data.vehicleName}
            </Link>
          </>
        );
      case 'vehicle_updated':
        return (
          <>
            Vehicle updated: 
            <Link 
              to={`/vehicles/${data.vehicleId}`}
              style={{ color: 'inherit', textDecoration: 'underline' }}
            >
              {data.vehicleName}
            </Link>
          </>
        );
      case 'inspection_booked':
        return (
          <>
            Inspection booked for 
            <Link 
              to={`/vehicles/${data.vehicleId}`}
              style={{ color: 'inherit', textDecoration: 'underline' }}
            >
              {data.vehicleName}
            </Link>
          </>
        );
      case 'inspection_completed':
        return (
          <>
            Inspection 
            <Link 
              to={`/inspections/${data.inspectionId}`}
              style={{ color: 'inherit', textDecoration: 'underline' }}
            >
              #{data.inspectionId?.slice(-5)}
            </Link> 
            {data.inspectionStatus === 'passed' ? ' passed' : ' failed'} for 
            <Link 
              to={`/vehicles/${data.vehicleId}`}
              style={{ color: 'inherit', textDecoration: 'underline' }}
            >
              {data.vehicleName}
            </Link>
          </>
        );
      case 'inspection_cancelled':
        return (
          <>
            Inspection cancelled for 
            <Link 
              to={`/vehicles/${data.vehicleId}`}
              style={{ color: 'inherit', textDecoration: 'underline' }}
            >
              {data.vehicleName}
            </Link>
          </>
        );
      default:
        return 'Unknown activity';
    }
  };

  const getStatusChip = (type: string, status?: string) => {
    if (type === 'inspection_completed' && status) {
      switch (status) {
        case 'passed':
          return <Chip label="Passed" size="small" color="success" variant="outlined" />;
        case 'failed':
          return <Chip label="Failed" size="small" color="error" variant="outlined" />;
        default:
          return null;
      }
    }
    return null;
  };

  if (loading) {
    return (
      <Paper elevation={0} variant="outlined" sx={{ p: 3, ...sx }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Loading activities...
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} variant="outlined" sx={{ ...sx }}>
      <Box sx={{ p: 2, pb: 0 }}>
        <Typography variant="h6">{title}</Typography>
      </Box>
      
      <List disablePadding>
        {displayedActivities.length > 0 ? (
          displayedActivities.map((activity, index) => (
            <React.Fragment key={activity.id}>
              {index > 0 && <Divider component="li" />}
              <ListItem
                alignItems="flex-start"
                secondaryAction={
                  getStatusChip(activity.type, activity.data.inspectionStatus)
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'background.default' }}>
                    {getActivityIcon(activity.type, activity.data.inspectionStatus)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={getActivityText(activity)}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        {formatDateTime(activity.timestamp)}
                      </Typography>
                      {activity.data.userName && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <PersonIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {activity.data.userName}
                          </Typography>
                        </Box>
                      )}
                    </React.Fragment>
                  }
                />
              </ListItem>
            </React.Fragment>
          ))
        ) : (
          <ListItem>
            <ListItemText
              primary={
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  No recent activity
                </Typography>
              }
            />
          </ListItem>
        )}
      </List>
      
      {showViewAll && activities.length > maxItems && (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Button onClick={onViewAll} size="small">
            View All Activity
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default RecentActivity;