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
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  EventNote as EventIcon,
  History as HistoryIcon,
  DirectionsCar as CarIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import VehicleSummary from '../components/vehicles/VehicleSummary';
import InspectionCard from '../components/inspections/InspectionCard';
import EmptyState from '../components/common/EmptyState';
import FileUpload from '../components/common/FileUpload';
import { useVehicleStore } from '../stores/vehicleStore';
import { useInspectionStore } from '../stores/inspectionStore';
import { useNotificationStore } from '../stores/notificationStore';
import { formatDate } from '../utils/helpers';

interface VehicleFormData {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  color: string;
  status: 'active' | 'maintenance' | 'inactive';
  fuelType: string;
  mileage: number;
  registrationDate: string;
  notes: string;
  imageFile?: File | null;
  imageUrl?: string;
}

const VehicleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { vehicles, updateVehicle, deleteVehicle } = useVehicleStore();
  const { inspections, bookings } = useInspectionStore();
  const { showSuccess, showError } = useNotificationStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formData, setFormData] = useState<VehicleFormData | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof VehicleFormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  // Find the vehicle by ID
  const vehicle = id ? vehicles.find(v => v.id === id) : null;

  // Get vehicle inspections
  const vehicleInspections = vehicle ? [
    // Completed or in-progress inspections
    ...inspections
      .filter(inspection => {
        const booking = bookings.find(b => b.id === inspection.bookingId);
        return booking && booking.vehicleId === id;
      })
      .map(inspection => {
        const booking = bookings.find(b => b.id === inspection.bookingId);
        
        return {
          id: inspection.id,
          bookingId: inspection.bookingId,
          date: booking?.date || '',
          status: inspection.status,
          inspectorName: inspection.inspectorName || 'Not assigned',
          completedDate: inspection.completedDate,
          isCompleted: !!inspection.completedDate,
        };
      }),
    // Upcoming bookings (not yet inspected)
    ...bookings
      .filter(booking => 
        booking.vehicleId === id && 
        !inspections.some(i => i.bookingId === booking.id)
      )
      .map(booking => ({
        id: `booking-${booking.id}`,
        bookingId: booking.id,
        date: booking.date,
        status: 'scheduled',
        inspectorName: booking.inspectorName || 'Not assigned',
        isCompleted: false,
      })),
  ] : [];

  // Sort inspections by date (most recent first)
  const sortedInspections = [...vehicleInspections].sort((a, b) => {
    const dateA = a.completedDate || a.date;
    const dateB = b.completedDate || b.date;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
      
      // Check if vehicle exists
      if (!loading && !vehicle) {
        setError('Vehicle not found');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [id, vehicle, loading]);

  useEffect(() => {
    // Initialize form data when vehicle is loaded
    if (vehicle) {
      setFormData({
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        licensePlate: vehicle.licensePlate,
        vin: vehicle.vin || '',
        color: vehicle.color || '',
        status: vehicle.status,
        fuelType: vehicle.fuelType || 'gasoline',
        mileage: vehicle.mileage || 0,
        registrationDate: vehicle.registrationDate || '',
        notes: vehicle.notes || '',
        imageUrl: vehicle.imageUrl || '',
      });
    }
  }, [vehicle]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditClick = () => {
    setFormErrors({});
    setOpenEditDialog(true);
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleBookInspection = () => {
    navigate(`/inspections/book?vehicleId=${id}`);
  };

  const handleViewInspection = (inspectionId: string) => {
    navigate(`/inspections/${inspectionId}`);
  };

  const handleCancelInspection = (bookingId: string) => {
    // This would typically open a confirmation dialog
    // For simplicity, we'll navigate to the inspection details page
    navigate(`/inspections/booking-${bookingId}`);
  };

  const handlePrintReport = (inspectionId: string) => {
    // In a real app, this would generate and download a PDF report
    showSuccess('Inspection report is being generated...');
  };

  const handleCloseDialog = () => {
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
  };

  const validateForm = () => {
    if (!formData) return false;
    
    const errors: Partial<Record<keyof VehicleFormData, string>> = {};
    
    if (!formData.make) errors.make = 'Make is required';
    if (!formData.model) errors.model = 'Model is required';
    if (!formData.licensePlate) errors.licensePlate = 'License plate is required';
    if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      errors.year = 'Please enter a valid year';
    }
    if (formData.mileage < 0) errors.mileage = 'Mileage cannot be negative';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name && formData) {
      setFormData(prev => prev ? {
        ...prev,
        [name]: value,
      } : null);
    }
  };

  const handleImageUpload = (file: File | null) => {
    if (formData) {
      setFormData(prev => prev ? {
        ...prev,
        imageFile: file,
        // In a real app, we would upload the file to a server and get a URL back
        // For now, we'll create a temporary URL
        imageUrl: file ? URL.createObjectURL(file) : '',
      } : null);
    }
  };

  const handleSubmit = async () => {
    if (!formData || !validateForm() || !id) return;

    setSubmitting(true);

    try {
      // In a real app, we would upload the image file to a server here
      // and get back a URL to store with the vehicle data

      updateVehicle(id, formData);
      showSuccess('Vehicle updated successfully');
      handleCloseDialog();
    } catch (err) {
      showError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    setSubmitting(true);

    try {
      deleteVehicle(id);
      showSuccess('Vehicle deleted successfully');
      navigate('/vehicles');
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
          title="Vehicle Details" 
          breadcrumbs={[
            { label: 'Vehicles', href: '/vehicles' },
            { label: 'Vehicle Details', href: `/vehicles/${id}` },
          ]}
        />
        <LoadingState message="Loading vehicle details..." />
      </Container>
    );
  }

  if (error || !vehicle) {
    return (
      <Container maxWidth="lg">
        <PageHeader 
          title="Vehicle Details" 
          breadcrumbs={[
            { label: 'Vehicles', href: '/vehicles' },
            { label: 'Vehicle Details', href: `/vehicles/${id}` },
          ]}
        />
        <ErrorState 
          message={error || 'Vehicle not found'} 
          onRetry={() => navigate('/vehicles')} 
          fullPage 
          actionText="Back to Vehicles"
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <PageHeader 
        title={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
        subtitle={`License Plate: ${vehicle.licensePlate}`}
        breadcrumbs={[
          { label: 'Vehicles', href: '/vehicles' },
          { label: `${vehicle.make} ${vehicle.model}`, href: `/vehicles/${id}` },
        ]}
        action={
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              startIcon={<EditIcon />} 
              variant="outlined"
              onClick={handleEditClick}
            >
              Edit Vehicle
            </Button>
            <Button 
              startIcon={<DeleteIcon />} 
              variant="outlined"
              color="error"
              onClick={handleDeleteClick}
            >
              Delete
            </Button>
            <Button 
              startIcon={<EventIcon />} 
              variant="contained"
              onClick={handleBookInspection}
            >
              Book Inspection
            </Button>
          </Box>
        }
      />
      
      <Box sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="vehicle details tabs">
          <Tab label="Vehicle Information" icon={<CarIcon />} iconPosition="start" />
          <Tab 
            label="Inspection History" 
            icon={<HistoryIcon />} 
            iconPosition="start" 
            disabled={sortedInspections.length === 0}
          />
        </Tabs>
      </Box>
      
      {tabValue === 0 && (
        <Card variant="outlined">
          <CardContent>
            <VehicleSummary
              vehicle={{
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
                notes: vehicle.notes,
                imageUrl: vehicle.imageUrl,
              }}
              hideActions
            />
          </CardContent>
        </Card>
      )}
      
      {tabValue === 1 && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Inspection History
            </Typography>
            
            {sortedInspections.length > 0 ? (
              <Grid container spacing={3}>
                {sortedInspections.map(inspection => (
                  <Grid item xs={12} sm={6} md={4} key={inspection.id}>
                    <InspectionCard
                      id={inspection.id.toString()}
                      vehicleName={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
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
                title="No inspection history"
                description="This vehicle has not been inspected yet"
                actionText="Book Inspection"
                onAction={handleBookInspection}
              />
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Edit Vehicle Dialog */}
      <Dialog 
        open={openEditDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Vehicle</DialogTitle>
        <DialogContent dividers>
          {formData && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FileUpload
                  label="Vehicle Image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  value={formData.imageFile}
                  previewUrl={formData.imageUrl}
                  maxSize={5 * 1024 * 1024} // 5MB
                />
              </Grid>
              
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="make"
                      label="Make"
                      value={formData.make}
                      onChange={handleFormChange}
                      fullWidth
                      required
                      error={!!formErrors.make}
                      helperText={formErrors.make}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="model"
                      label="Model"
                      value={formData.model}
                      onChange={handleFormChange}
                      fullWidth
                      required
                      error={!!formErrors.model}
                      helperText={formErrors.model}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="year"
                      label="Year"
                      type="number"
                      value={formData.year}
                      onChange={handleFormChange}
                      fullWidth
                      required
                      inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
                      error={!!formErrors.year}
                      helperText={formErrors.year}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="licensePlate"
                      label="License Plate"
                      value={formData.licensePlate}
                      onChange={handleFormChange}
                      fullWidth
                      required
                      error={!!formErrors.licensePlate}
                      helperText={formErrors.licensePlate}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="vin"
                      label="VIN"
                      value={formData.vin}
                      onChange={handleFormChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="color"
                      label="Color"
                      value={formData.color}
                      onChange={handleFormChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="status-label">Status</InputLabel>
                      <Select
                        labelId="status-label"
                        name="status"
                        value={formData.status}
                        onChange={handleFormChange}
                        label="Status"
                      >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="maintenance">Maintenance</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="fuel-type-label">Fuel Type</InputLabel>
                      <Select
                        labelId="fuel-type-label"
                        name="fuelType"
                        value={formData.fuelType}
                        onChange={handleFormChange}
                        label="Fuel Type"
                      >
                        <MenuItem value="gasoline">Gasoline</MenuItem>
                        <MenuItem value="diesel">Diesel</MenuItem>
                        <MenuItem value="electric">Electric</MenuItem>
                        <MenuItem value="hybrid">Hybrid</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="mileage"
                      label="Mileage"
                      type="number"
                      value={formData.mileage}
                      onChange={handleFormChange}
                      fullWidth
                      inputProps={{ min: 0 }}
                      error={!!formErrors.mileage}
                      helperText={formErrors.mileage}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="registrationDate"
                      label="Registration Date"
                      type="date"
                      value={formData.registrationDate}
                      onChange={handleFormChange}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="notes"
                      label="Notes"
                      value={formData.notes}
                      onChange={handleFormChange}
                      fullWidth
                      multiline
                      rows={3}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={submitting}
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={openDeleteDialog}
        title="Delete Vehicle"
        message="Are you sure you want to delete this vehicle? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        severity="error"
        loading={submitting}
        onConfirm={handleDelete}
        onCancel={handleCloseDialog}
      />
    </Container>
  );
};

export default VehicleDetails;