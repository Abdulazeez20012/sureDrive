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
  DirectionsCar as CarIcon,
  Speed as SpeedIcon,
  EventNote as EventIcon,
  LocalGasStation as FuelIcon,
  ColorLens as ColorIcon,
  Straighten as DimensionIcon,
} from '@mui/icons-material';
import { formatDate } from '../../utils/helpers';

interface VehicleSummaryProps {
  vehicle: {
    id: string;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    vin?: string;
    color?: string;
    fuelType?: string;
    mileage?: number;
    status: 'active' | 'maintenance' | 'inactive';
    lastInspectionDate?: string;
    nextInspectionDate?: string;
    imageUrl?: string;
  };
  onEdit?: () => void;
  onBookInspection?: () => void;
  sx?: SxProps<Theme>;
  showActions?: boolean;
}

const VehicleSummary: React.FC<VehicleSummaryProps> = ({
  vehicle,
  onEdit,
  onBookInspection,
  sx,
  showActions = true,
}) => {
  const getStatusColor = () => {
    switch (vehicle.status) {
      case 'active':
        return 'success';
      case 'maintenance':
        return 'warning';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Paper elevation={0} variant="outlined" sx={{ p: 3, ...sx }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CarIcon color="primary" sx={{ fontSize: 28, mr: 1.5 }} />
          <Typography variant="h5" component="h2">
            {vehicle.make} {vehicle.model}
          </Typography>
        </Box>
        <Chip
          label={vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
          color={getStatusColor()}
          variant="outlined"
        />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Basic Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
                  Year:
                </Typography>
                <Typography variant="body2">{vehicle.year}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
                  License Plate:
                </Typography>
                <Typography variant="body2">{vehicle.licensePlate}</Typography>
              </Box>
              {vehicle.vin && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
                    VIN:
                  </Typography>
                  <Typography variant="body2">{vehicle.vin}</Typography>
                </Box>
              )}
              {vehicle.color && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
                    Color:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ColorIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2">{vehicle.color}</Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Technical Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {vehicle.mileage !== undefined && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
                    Mileage:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SpeedIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2">{vehicle.mileage.toLocaleString()} km</Typography>
                  </Box>
                </Box>
              )}
              {vehicle.fuelType && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
                    Fuel Type:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FuelIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2">{vehicle.fuelType}</Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Inspection Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {vehicle.lastInspectionDate ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
                    Last Inspection:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EventIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2">{formatDate(vehicle.lastInspectionDate)}</Typography>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No previous inspections
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {vehicle.nextInspectionDate && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
                    Next Inspection:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EventIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2">{formatDate(vehicle.nextInspectionDate)}</Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {showActions && (
        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {onEdit && (
            <Button variant="outlined" onClick={onEdit}>
              Edit Vehicle
            </Button>
          )}
          {onBookInspection && (
            <Button variant="contained" onClick={onBookInspection}>
              Book Inspection
            </Button>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default VehicleSummary;