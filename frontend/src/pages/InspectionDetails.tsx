import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Print as PrintIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import InspectionSummary from '../components/inspections/InspectionSummary';
import InspectionChecklist from '../components/inspections/InspectionChecklist';
import VehicleSummary from '../components/vehicles/VehicleSummary';
import { useInspectionStore } from '../stores/inspectionStore';
import { useVehicleStore } from '../stores/vehicleStore';
import { useNotificationStore } from '../stores/notificationStore';

const InspectionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { inspections, bookings, cancelBooking, updateInspection } = useInspectionStore();
  const { vehicles } = useVehicleStore();
  const { showSuccess, showError } = useNotificationStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notes, setNotes] = useState('');

  // Find the inspection by ID
  const inspection = id ? inspections.find(i => i.id === id || `booking-${i.bookingId}` === id) : null;
  
  // If not found in inspections, check if it's a booking ID
  const isBooking = id?.startsWith('booking-');
  const bookingId = isBooking ? id.replace('booking-', '') : inspection?.bookingId;
  const booking = bookingId ? bookings.find(b => b.id === bookingId) : null;
  
  // Get vehicle details
  const vehicleId = booking?.vehicleId;
  const vehicle = vehicleId ? vehicles.find(v => v.id === vehicleId) : null;

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
      
      // Check if inspection exists
      if (!loading && !inspection && !isBooking) {
        setError('Inspection not found');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [id, inspection, isBooking, loading]);

  useEffect(() => {
    // Set initial notes from inspection
    if (inspection) {
      setNotes(inspection.notes || '');
    }
  }, [inspection]);

  const handleCancelClick = () => {
    setOpenCancelDialog(true);
  };

  const handleEditClick = () => {
    setOpenEditDialog(true);
  };

  const handlePrintClick = () => {
    // In a real app, this would generate and download a PDF report
    showSuccess('Inspection report is being generated...');
  };

  const handleCloseDialog = () => {
    setOpenCancelDialog(false);
    setOpenEditDialog(false);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(e.target.value);
  };

  const handleSaveNotes = async () => {
    if (!inspection) return;

    setSubmitting(true);

    try {
      updateInspection(inspection.id, { notes });
      showSuccess('Inspection notes updated successfully');
      handleCloseDialog();
    } catch (err) {
      showError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!bookingId) return;

    setSubmitting(true);

    try {
      cancelBooking(bookingId);
      showSuccess('Inspection booking cancelled successfully');
      navigate('/inspections');
    } catch (err) {
      showError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <PageHeader 
          title="Inspection Details" 
          breadcrumbs={[
            { label: 'Inspections', href: '/inspections' },
            { label: 'Inspection Details', href: `/inspections/${id}` },
          ]}
        />
        <LoadingState message="Loading inspection details..." />
      </Container>
    );
  }

  if (error || (!inspection && !booking)) {
    return (
      <Container maxWidth="lg">
        <PageHeader 
          title="Inspection Details" 
          breadcrumbs={[
            { label: 'Inspections', href: '/inspections' },
            { label: 'Inspection Details', href: `/inspections/${id}` },
          ]}
        />
        <ErrorState 
          message={error || 'Inspection not found'} 
          onRetry={() => navigate('/inspections')} 
          fullPage 
          actionText="Back to Inspections"
        />
      </Container>
    );
  }

  // Determine if this is a scheduled booking or a completed/in-progress inspection
  const isScheduled = isBooking || !inspection.completedDate;
  
  // Prepare inspection data for display
  const inspectionData = {
    id: inspection?.id || `booking-${booking?.id}`,
    status: inspection?.status || 'scheduled',
    date: booking?.date || '',
    completedDate: inspection?.completedDate,
    inspectorName: inspection?.inspectorName || booking?.inspectorName || 'Not assigned',
    notes: inspection?.notes || booking?.notes || '',
    items: inspection?.items || [],
    vehicle: vehicle ? {
      id: vehicle.id,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      licensePlate: vehicle.licensePlate,
      vin: vehicle.vin || 'N/A',
      color: vehicle.color || 'N/A',
      status: vehicle.status,
      fuelType: vehicle.fuelType || 'N/A',
      mileage: vehicle.mileage || 0,
      registrationDate: vehicle.registrationDate || 'N/A',
      lastInspectionDate: vehicle.lastInspectionDate || 'N/A',
    } : null,
  };

  return (
    <Container maxWidth="lg">
      <PageHeader 
        title={isScheduled ? 'Scheduled Inspection' : 'Inspection Report'} 
        breadcrumbs={[
          { label: 'Inspections', href: '/inspections' },
          { label: isScheduled ? 'Scheduled Inspection' : 'Inspection Report', href: `/inspections/${id}` },
        ]}
        action={
          <Box sx={{ display: 'flex', gap: 2 }}>
            {isScheduled ? (
              <Button 
                startIcon={<CancelIcon />} 
                variant="outlined" 
                color="error"
                onClick={handleCancelClick}
              >
                Cancel Booking
              </Button>
            ) : (
              <>
                <Button 
                  startIcon={<EditIcon />} 
                  variant="outlined"
                  onClick={handleEditClick}
                >
                  Edit Notes
                </Button>
                <Button 
                  startIcon={<PrintIcon />} 
                  variant="contained"
                  onClick={handlePrintClick}
                >
                  Print Report
                </Button>
              </>
            )}
          </Box>
        }
      />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Inspection Summary
              </Typography>
              <InspectionSummary
                id={inspectionData.id}
                status={inspectionData.status}
                date={inspectionData.date}
                completedDate={inspectionData.completedDate}
                inspectorName={inspectionData.inspectorName}
                vehicleName={inspectionData.vehicle ? 
                  `${inspectionData.vehicle.year} ${inspectionData.vehicle.make} ${inspectionData.vehicle.model}` : 
                  'Unknown Vehicle'
                }
                licensePlate={inspectionData.vehicle?.licensePlate || ''}
                passedItems={inspectionData.items.filter(item => item.status === 'passed').length}
                failedItems={inspectionData.items.filter(item => item.status === 'failed').length}
                pendingItems={inspectionData.items.filter(item => item.status === 'pending').length}
                hideActions
              />
            </CardContent>
          </Card>
          
          {inspectionData.vehicle && (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Vehicle Details
                </Typography>
                <VehicleSummary
                  vehicle={inspectionData.vehicle}
                  hideActions
                />
              </CardContent>
            </Card>
          )}
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  {isScheduled ? 'Scheduled Inspection Items' : 'Inspection Checklist'}
                </Typography>
                <Chip 
                  label={inspectionData.status.toUpperCase()} 
                  color={
                    inspectionData.status === 'passed' ? 'success' :
                    inspectionData.status === 'failed' ? 'error' :
                    inspectionData.status === 'pending' ? 'warning' : 'default'
                  }
                  variant="outlined"
                />
              </Box>
              
              {isScheduled ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                  This inspection is scheduled for {new Date(inspectionData.date).toLocaleDateString()} at {new Date(inspectionData.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.
                  <br />
                  The checklist will be available after the inspection begins.
                </Typography>
              ) : (
                <InspectionChecklist items={inspectionData.items} />
              )}
              
              <Divider sx={{ my: 3 }} />
              
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Notes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {inspectionData.notes || 'No notes available for this inspection.'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
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
      
      {/* Edit Notes Dialog */}
      <Dialog 
        open={openEditDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Inspection Notes</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Inspection Notes"
            multiline
            rows={6}
            value={notes}
            onChange={handleNotesChange}
            fullWidth
            placeholder="Enter notes about the inspection findings, recommendations, etc."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            startIcon={<SaveIcon />}
            onClick={handleSaveNotes} 
            variant="contained" 
            disabled={submitting}
          >
            {submitting ? 'Saving...' : 'Save Notes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InspectionDetails;