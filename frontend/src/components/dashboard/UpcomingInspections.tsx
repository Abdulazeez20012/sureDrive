import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  Button,
  SxProps,
  Theme,
  Chip,
} from '@mui/material';
import {
  EventNote as EventIcon,
  DirectionsCar as CarIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { formatDate } from '../../utils/helpers';
import { Link } from 'react-router-dom';

export interface UpcomingInspection {
  id: string;
  date: string;
  vehicle: {
    id: string;
    name: string;
    licensePlate: string;
  };
  daysUntil: number;
}

interface UpcomingInspectionsProps {
  inspections: UpcomingInspection[];
  title?: string;
  maxItems?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
  loading?: boolean;
  sx?: SxProps<Theme>;
}

const UpcomingInspections: React.FC<UpcomingInspectionsProps> = ({
  inspections,
  title = 'Upcoming Inspections',
  maxItems = 5,
  showViewAll = true,
  onViewAll,
  loading = false,
  sx,
}) => {
  const displayedInspections = inspections.slice(0, maxItems);

  const getDaysLabel = (days: number) => {
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `In ${days} days`;
  };

  const getUrgencyColor = (days: number) => {
    if (days === 0) return 'error';
    if (days <= 2) return 'warning';
    return 'default';
  };

  if (loading) {
    return (
      <Paper elevation={0} variant="outlined" sx={{ p: 3, ...sx }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Loading inspections...
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
        {displayedInspections.length > 0 ? (
          displayedInspections.map((inspection, index) => (
            <React.Fragment key={inspection.id}>
              {index > 0 && <Divider component="li" />}
              <ListItem
                component={Link}
                to={`/inspections/${inspection.id}`}
                sx={{
                  textDecoration: 'none',
                  color: 'inherit',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
                secondaryAction={
                  <Chip 
                    label={getDaysLabel(inspection.daysUntil)} 
                    size="small" 
                    color={getUrgencyColor(inspection.daysUntil)}
                    variant="outlined"
                  />
                }
              >
                <ListItemIcon>
                  <EventIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" noWrap>
                      Inspection #{inspection.id.slice(-5)}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ mt: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <CarIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          component={Link}
                          to={`/vehicles/${inspection.vehicle.id}`}
                          onClick={(e) => e.stopPropagation()}
                          sx={{ 
                            color: 'primary.main',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                        >
                          {inspection.vehicle.name}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(inspection.date)}
                        </Typography>
                      </Box>
                    </Box>
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
                  No upcoming inspections
                </Typography>
              }
            />
          </ListItem>
        )}
      </List>
      
      {showViewAll && inspections.length > maxItems && (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Button 
            component={Link} 
            to="/inspections"
            onClick={onViewAll} 
            size="small"
          >
            View All Inspections
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default UpcomingInspections;