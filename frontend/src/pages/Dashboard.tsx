import React, { useState, useEffect } from 'react';
import { Container, Grid, Box } from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import StatsGrid from '../components/dashboard/StatsGrid';
import RecentActivity from '../components/dashboard/RecentActivity';
import UpcomingInspections from '../components/dashboard/UpcomingInspections';
import RecentVehicles from '../components/dashboard/RecentVehicles';
import InspectionStats from '../components/dashboard/InspectionStats';
import VehicleStats from '../components/dashboard/VehicleStats';
import { useVehicleStore } from '../stores/vehicleStore';
import { useInspectionStore } from '../stores/inspectionStore';
import { formatDate } from '../utils/helpers';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { vehicles } = useVehicleStore();
  const { inspections, bookings } = useInspectionStore();

  // Calculate days until inspection
  const calculateDaysUntil = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inspectionDate = new Date(dateString);
    inspectionDate.setHours(0, 0, 0, 0);
    const diffTime = inspectionDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Prepare upcoming inspections data
  const upcomingInspections = bookings
    .filter(booking => {
      const daysUntil = calculateDaysUntil(booking.date);
      return daysUntil >= 0; // Only future and today's inspections
    })
    .map(booking => {
      const vehicle = vehicles.find(v => v.id === booking.vehicleId);
      return {
        id: booking.id,
        date: booking.date,
        vehicle: {
          id: booking.vehicleId,
          name: vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Unknown Vehicle',
          licensePlate: vehicle?.licensePlate || 'Unknown'
        },
        daysUntil: calculateDaysUntil(booking.date)
      };
    })
    .sort((a, b) => a.daysUntil - b.daysUntil); // Sort by closest date first

  // Prepare recent vehicles data
  const recentVehicles = vehicles
    .slice(0, 8)
    .map(vehicle => ({
      id: vehicle.id,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      licensePlate: vehicle.licensePlate,
      status: vehicle.status,
      lastInspection: vehicle.lastInspectionDate,
      imageUrl: vehicle.imageUrl
    }));

  // Prepare inspection statistics
  const inspectionStats = {
    passed: inspections.filter(i => i.status === 'passed').length,
    failed: inspections.filter(i => i.status === 'failed').length,
    pending: inspections.filter(i => i.status === 'pending').length,
    scheduled: bookings.filter(b => !inspections.some(i => i.bookingId === b.id)).length,
    passRate: inspections.length > 0 
      ? Math.round((inspections.filter(i => i.status === 'passed').length / inspections.length) * 100) 
      : 0
  };

  // Prepare vehicle statistics
  const vehicleStats = {
    total: vehicles.length,
    active: vehicles.filter(v => v.status === 'active').length,
    maintenance: vehicles.filter(v => v.status === 'maintenance').length,
    inactive: vehicles.filter(v => v.status === 'inactive').length,
    byMake: Array.from(
      vehicles.reduce((acc, vehicle) => {
        const count = acc.get(vehicle.make) || 0;
        acc.set(vehicle.make, count + 1);
        return acc;
      }, new Map<string, number>())
    ).map(([make, count]) => ({ make, count }))
  };

  // Prepare recent activity data
  const recentActivity = [
    ...vehicles.map(vehicle => ({
      id: `vehicle-${vehicle.id}`,
      type: 'vehicle_added' as const,
      title: `Vehicle Added`,
      description: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      timestamp: new Date().toISOString(), // In a real app, this would come from the vehicle data
      entityId: vehicle.id,
      entityType: 'vehicle' as const
    })),
    ...bookings.map(booking => {
      const vehicle = vehicles.find(v => v.id === booking.vehicleId);
      return {
        id: `booking-${booking.id}`,
        type: 'inspection_booked' as const,
        title: `Inspection Booked`,
        description: vehicle 
          ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` 
          : `Vehicle #${booking.vehicleId}`,
        timestamp: booking.date,
        entityId: booking.id,
        entityType: 'inspection' as const
      };
    }),
    ...inspections.map(inspection => {
      const booking = bookings.find(b => b.id === inspection.bookingId);
      const vehicle = booking ? vehicles.find(v => v.id === booking.vehicleId) : null;
      return {
        id: `inspection-${inspection.id}`,
        type: inspection.status === 'passed' 
          ? 'inspection_passed' as const 
          : inspection.status === 'failed' 
            ? 'inspection_failed' as const 
            : 'inspection_pending' as const,
        title: `Inspection ${inspection.status.charAt(0).toUpperCase() + inspection.status.slice(1)}`,
        description: vehicle 
          ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` 
          : `Unknown Vehicle`,
        timestamp: inspection.completedDate || booking?.date || new Date().toISOString(),
        entityId: inspection.id,
        entityType: 'inspection' as const
      };
    })
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Container maxWidth="xl">
      <PageHeader 
        title="Dashboard" 
        subtitle="Overview of your fleet and inspection activities"
      />
      
      <Box sx={{ mb: 4 }}>
        <StatsGrid loading={loading} />
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <RecentVehicles 
                vehicles={recentVehicles} 
                loading={loading}
                maxItems={4}
              />
            </Grid>
            <Grid item xs={12}>
              <RecentActivity 
                activities={recentActivity} 
                loading={loading}
                maxItems={5}
              />
            </Grid>
          </Grid>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <UpcomingInspections 
                inspections={upcomingInspections} 
                loading={loading}
                maxItems={5}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={12}>
              <InspectionStats 
                stats={inspectionStats} 
                loading={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={12}>
              <VehicleStats 
                stats={vehicleStats} 
                loading={loading}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;