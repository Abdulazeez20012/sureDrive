import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  Button,
  SxProps,
  Theme,
} from '@mui/material';
import {
  EventNote as EventIcon,
  Person as PersonIcon,
  Notes as NotesIcon,
  DirectionsCar as CarIcon,
} from '@mui/icons-material';
import { formatDate, formatDateTime } from '../../utils/helpers';
import { Link } from 'react-router-dom';

interface InspectionSummaryProps {
  inspection: {
    id: string;
    date: string;
    status: 'pending' | 'passed' | 'failed' | 'cancelled';
    vehicle: {
      id: string;
      name: string;
      licensePlate: string;
    };
    inspector?: {
      id: string;
      name: string;
    };
    notes?: string;
    completedAt?: string;
    totalItems?: number;
    passedItems?: number;
    failedItems?: number;
  };
  onPrint?: () => void;
  onCancel?: () => void;
  sx?: SxProps<Theme>;
  showActions?: boolean;
}

const InspectionSummary: React.FC<InspectionSummaryProps> = ({
  inspection,
  onPrint,
  onCancel,
  sx,
  showActions = true,
}) => {
  const getStatusColor = () => {
    switch (inspection.status) {
      case 'passed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      case 'cancelled':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusLabel = () => {
    return inspection.status.charAt(0).toUpperCase() + inspection.status.slice(1);
  };

  return (
    <Paper elevation={0} variant="outlined" sx={{ p: 3, ...sx }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="h5" component="h2">
            Inspection #{inspection.id.slice(-5)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Created on {formatDateTime(inspection.date)}
          </Typography>
        </Box>
        <Chip
          label={getStatusLabel()}
          color={getStatusColor()}
          variant="outlined"
          sx={{ fontWeight: 'medium' }}
        />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Vehicle Information
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <CarIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography 
                variant="body1" 
                component={Link} 
                to={`/vehicles/${inspection.vehicle.id}`}
                sx={{ 
                  color: 'primary.main', 
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' } 
                }}
              >
                {inspection.vehicle.name}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              License Plate: {inspection.vehicle.licensePlate}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Inspection Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EventIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  Scheduled for {formatDate(inspection.date)}
                </Typography>
              </Box>
              
              {inspection.inspector && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    Inspector: {inspection.inspector.name}
                  </Typography>
                </Box>
              )}
              
              {inspection.completedAt && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EventIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    Completed on {formatDateTime(inspection.completedAt)}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      {(inspection.status === 'passed' || inspection.status === 'failed') && inspection.totalItems && (
        <>
          <Divider sx={{ my: 2 }} />
          
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Results Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 1.5, 
                    textAlign: 'center',
                    borderColor: 'divider' 
                  }}
                >
                  <Typography variant="h6">{inspection.totalItems}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Items</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 1.5, 
                    textAlign: 'center',
                    borderColor: inspection.passedItems ? 'success.main' : 'divider',
                    bgcolor: inspection.passedItems ? 'success.lighter' : 'transparent'
                  }}
                >
                  <Typography variant="h6" color="success.main">
                    {inspection.passedItems}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Passed</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 1.5, 
                    textAlign: 'center',
                    borderColor: inspection.failedItems ? 'error.main' : 'divider',
                    bgcolor: inspection.failedItems ? 'error.lighter' : 'transparent'
                  }}
                >
                  <Typography variant="h6" color="error.main">
                    {inspection.failedItems}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Failed</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </>
      )}

      {inspection.notes && (
        <>
          <Divider sx={{ my: 2 }} />
          
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <NotesIcon sx={{ mr: 1, fontSize: 20 }} />
              Notes
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {inspection.notes}
            </Typography>
          </Box>
        </>
      )}

      {showActions && (
        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {inspection.status === 'pending' && onCancel && (
            <Button variant="outlined" color="error" onClick={onCancel}>
              Cancel Inspection
            </Button>
          )}
          {(inspection.status === 'passed' || inspection.status === 'failed') && onPrint && (
            <Button variant="contained" onClick={onPrint}>
              Print Report
            </Button>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default InspectionSummary;