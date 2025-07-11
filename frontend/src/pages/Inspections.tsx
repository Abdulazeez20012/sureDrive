import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import { Add as AddIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import SearchBar from '../components/common/SearchBar';
import InspectionCard from '../components/inspections/InspectionCard';
import EmptyState from '../components/common/EmptyState';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useInspectionStore } from '../stores/inspectionStore';
import { useVehicleStore } from '../stores/vehicleStore';
import { useNotificationStore } from '../stores/notificationStore';
import { formatDate } from '../utils/helpers';

const Inspections: React.FC = () => {
  const navigate = useNavigate();
  const { inspections, bookings, cancelBooking } = useInspectionStore();
  const { vehicles } = useVehicleStore();
  const { showSuccess, showError } = useNotificationStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleStatusFilterChange = (_event: React.SyntheticEvent, newValue: string) => {
    setStatusFilter(newValue);
  };

  const handleBookInspection = () => {
    navigate('/inspections/book');
  };

  const handleViewInspection = (id: string) => {
    navigate(`/inspections/${id}`);
  };

  const handleCancelInspection = (id: string) => {
    setSelectedBookingId(id);
    setOpenCancelDialog(true);
  };

  const handlePrintReport = (id: string) => {
    // In a real app, this would generate and download a PDF report
    showSuccess('Inspection report is being generated...');
  };

  const handleCloseDialog = () => {
    setOpenCancelDialog(false);
    setSelectedBookingId(null);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBookingId) return;

    setSubmitting(true);

    try {
      cancelBooking(selectedBookingId);
      showSuccess('Inspection booking cancelled successfully');
      handleCloseDialog();
    } catch (err) {
      showError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Combine inspections and bookings data
  const allInspections = [
    // Completed or in-progress inspections
    ...inspections.map(inspection => {
      const booking = bookings.find(b => b.id === inspection.bookingId);
      const vehicle = booking ? vehicles.find(v => v.id === booking.vehicleId) : null;
      
      return {
        id: inspection.id,
        bookingId: inspection.bookingId,
        date: booking?.date || '',
        vehicleId: booking?.vehicleId || '',
        vehicleName: vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Unknown Vehicle',
        licensePlate: vehicle?.licensePlate || '',
        status: inspection.status,
        inspectorName: inspection.inspectorName || 'Not assigned',
        completedDate: inspection.completedDate,
        notes: inspection.notes,
        isCompleted: !!inspection.completedDate,
      };
    }),
    // Upcoming bookings (not yet inspected)
    ...bookings
      .filter(booking => !inspections.some(i => i.bookingId === booking.id))
      .map(booking => {
        const vehicle = vehicles.find(v => v.id === booking.vehicleId);
        
        return {
          id: `booking-${booking.id}`,
          bookingId: booking.id,
          date: booking.date,
          vehicleId: booking.vehicleId,
          vehicleName: vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Unknown Vehicle',
          licensePlate: vehicle?.licensePlate || '',
          status: 'scheduled',
          inspectorName: booking.inspectorName || 'Not assigned',
          isCompleted: false,
        };
      }),
  ];

  // Filter inspections based on search query and status filter
  const filteredInspections = allInspections.filter(inspection => {
    const matchesSearch = 
      searchQuery === '' ||
      inspection.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspection.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspection.inspectorName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || inspection.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort inspections by date (most recent first)
  const sortedInspections = [...filteredInspections].sort((a, b) => {
    const dateA = a.completedDate || a.date;
    const dateB = b.completedDate || b.date;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  if (error) {
    return (
      <Container maxWidth="xl">
        <PageHeader 
          title="Inspections" 
          subtitle="Manage vehicle inspections"
          action={<Button startIcon={<AddIcon />} variant="contained" onClick={handleBookInspection}>Book Inspection</Button>}
        />
        <ErrorState 
          message={error} 
          onRetry={() => window.location.reload()} 
          fullPage 
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <PageHeader 
        title="Inspections" 
        subtitle="Manage vehicle inspections"
        action={<Button startIcon={<AddIcon />} variant="contained" onClick={handleBookInspection}>Book Inspection</Button>}
      />
      
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2 }}>
            <SearchBar 
              placeholder="Search inspections..." 
              value={searchQuery} 
              onChange={handleSearchChange} 
              sx={{ flexGrow: 1, maxWidth: { sm: 400 } }}
            />
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FilterIcon sx={{ mr: 1, color: 'action.active' }} />
              <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                Filter by status:
              </Typography>
              <Tabs 
                value={statusFilter} 
                onChange={handleStatusFilterChange}
                aria-label="inspection status filter"
                sx={{ minHeight: 'unset' }}
              >
                <Tab label="All" value="all" sx={{ minHeight: 'unset', py: 1 }} />
                <Tab label="Scheduled" value="scheduled" sx={{ minHeight: 'unset', py: 1 }} />
                <Tab label="Pending" value="pending" sx={{ minHeight: 'unset', py: 1 }} />
                <Tab label="Passed" value="passed" sx={{ minHeight: 'unset', py: 1 }} />
                <Tab label="Failed" value="failed" sx={{ minHeight: 'unset', py: 1 }} />
              </Tabs>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      {loading ? (
        <LoadingState message="Loading inspections..." />
      ) : sortedInspections.length > 0 ? (
        <Grid container spacing={3}>
          {sortedInspections.map(inspection => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={inspection.id}>
              <InspectionCard
                id={inspection.id.toString()}
                vehicleName={inspection.vehicleName}
                date={inspection.date}
                status={inspection.status}
                inspectorName={inspection.inspectorName}
                onView={() => handleViewInspection(inspection.id.toString())}
                onCancel={!inspection.isCompleted ? () => handleCancelInspection(inspection.bookingId) : undefined}
                onPrintReport={inspection.isCompleted ? () => handlePrintReport(inspection.id.toString()) : undefined}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <EmptyState
          title="No inspections found"
          description={searchQuery || statusFilter !== 'all' ? 
            "Try adjusting your search or filters" : 
            "Book your first inspection to get started"}
          actionText="Book Inspection"
          onAction={handleBookInspection}
        />
      )}
      
      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        open={openCancelDialog}
        title="Cancel Inspection Booking"
        message="Are you sure you want to cancel this inspection booking? This action cannot be undone."
        confirmText="Cancel Booking"
        cancelText="Keep Booking"
        severity="warning"
        loading={submitting}
        onConfirm={handleConfirmCancel}
        onCancel={handleCloseDialog}
      />
    </Container>
  );
};

export default Inspections;