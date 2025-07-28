import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  SxProps,
  Theme,
} from '@mui/material';
import { Link } from 'react-router-dom';
import VehicleCard from '../vehicles/VehicleCard';
import EmptyState from '../common/EmptyState';
import { DirectionsCar as CarIcon } from '@mui/icons-material';

export interface RecentVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  status: 'active' | 'maintenance' | 'inactive';
  lastInspection?: string;
  imageUrl?: string;
}

interface RecentVehiclesProps {
  vehicles: RecentVehicle[];
  title?: string;
  maxItems?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
  loading?: boolean;
  sx?: SxProps<Theme>;
}

const RecentVehicles: React.FC<RecentVehiclesProps> = ({
  vehicles,
  title = 'Recent Vehicles',
  maxItems = 4,
  showViewAll = true,
  onViewAll,
  loading = false,
  sx,
}) => {
  const displayedVehicles = vehicles.slice(0, maxItems);

  const handleBookInspection = (id: string) => {
    window.location.href = `/inspections/book?vehicleId=${id}`;
  };

  if (loading) {
    return (
      <Paper elevation={0} variant="outlined" sx={{ p: 3, ...sx }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Loading vehicles...
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} variant="outlined" sx={{ p: 3, ...sx }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{title}</Typography>
        {showViewAll && vehicles.length > maxItems && (
          <Button 
            component={Link} 
            to="/vehicles"
            onClick={onViewAll} 
            size="small"
          >
            View All
          </Button>
        )}
      </Box>
      
      {displayedVehicles.length > 0 ? (
        <Grid container spacing={3}>
          {displayedVehicles.map((vehicle) => (
            <Grid item xs={12} sm={6} md={6} lg={3} key={vehicle.id}>
              <VehicleCard
                id={vehicle.id}
                make={vehicle.make}
                model={vehicle.model}
                year={vehicle.year}
                licensePlate={vehicle.licensePlate}
                status={vehicle.status}
                lastInspection={vehicle.lastInspection}
                imageUrl={vehicle.imageUrl}
                onBookInspection={() => handleBookInspection(vehicle.id)}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <EmptyState
          title="No vehicles yet"
          description="Add your first vehicle to get started with inspections"
          icon={<CarIcon sx={{ fontSize: 60 }} />}
          actionText="Add Vehicle"
          onAction={() => window.location.href = '/vehicles?add=true'}
        />
      )}
    </Paper>
  );
};

export default RecentVehicles;