import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Stepper,
  Step,
  StepLabel,
  Paper,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import DatePicker from '../components/common/DatePicker';
import VehicleSummary from '../components/vehicles/VehicleSummary';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import { useVehicleStore } from '../stores/vehicleStore';
import { useInspectionStore } from '../stores/inspectionStore';
import { useNotificationStore } from '../stores/notificationStore';

const BookInspection: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { vehicles } = useVehicleStore();
  const { bookInspection } = useInspectionStore();
  const { showSuccess, showError } = useNotificationStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  
  // Form data
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [inspectionDate, setInspectionDate] = useState<Date | null>(null);
  const [inspectionTime, setInspectionTime] = useState<string>('');
  const [inspectorName, setInspectorName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  // Form errors
  const [formErrors, setFormErrors] = useState({
    vehicleId: '',
    date: '',
    time: '',
    inspectorName: '',
  });

  // Available time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  // Available inspectors
  const inspectors = [
    'John Smith',
    'Maria Rodriguez',
    'David Johnson',
    'Sarah Williams',
    'Michael Brown'
  ];

  useEffect(() => {
    // Check if there's a vehicle ID in the URL query params
    const queryParams = new URLSearchParams(location.search);
    const vehicleId = queryParams.get('vehicleId');
    if (vehicleId) {
      setSelectedVehicleId(vehicleId);
      // If a vehicle is pre-selected, start at step 1
      setActiveStep(1);
    }

    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.search]);

  const handleVehicleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedVehicleId(event.target.value as string);
    setFormErrors(prev => ({ ...prev, vehicleId: '' }));
  };

  const handleDateChange = (date: Date | null) => {
    setInspectionDate(date);
    setFormErrors(prev => ({ ...prev, date: '' }));
  };

  const handleTimeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setInspectionTime(event.target.value as string);
    setFormErrors(prev => ({ ...prev, time: '' }));
  };

  const handleInspectorChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setInspectorName(event.target.value as string);
    setFormErrors(prev => ({ ...prev, inspectorName: '' }));
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(event.target.value);
  };

  const validateStep = (step: number) => {
    let isValid = true;
    const newErrors = { ...formErrors };

    if (step === 0) {
      if (!selectedVehicleId) {
        newErrors.vehicleId = 'Please select a vehicle';
        isValid = false;
      } else {
        newErrors.vehicleId = '';
      }
    } else if (step === 1) {
      if (!inspectionDate) {
        newErrors.date = 'Please select a date';
        isValid = false;
      } else {
        newErrors.date = '';
      }

      if (!inspectionTime) {
        newErrors.time = 'Please select a time';
        isValid = false;
      } else {
        newErrors.time = '';
      }
    } else if (step === 2) {
      if (!inspectorName) {
        newErrors.inspectorName = 'Please select an inspector';
        isValid = false;
      } else {
        newErrors.inspectorName = '';
      }
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prevStep => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;

    if (!inspectionDate || !inspectionTime || !selectedVehicleId || !inspectorName) {
      showError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      // Combine date and time
      const dateTime = new Date(inspectionDate);
      const [hours, minutes] = inspectionTime.split(':').map(Number);
      dateTime.setHours(hours, minutes, 0, 0);

      // Book the inspection
      bookInspection({
        vehicleId: selectedVehicleId,
        date: dateTime.toISOString(),
        inspectorName,
        notes,
      });

      showSuccess('Inspection booked successfully');
      navigate('/inspections');
    } catch (err) {
      showError('An error occurred. Please try again.');
      console.error(err);
      setSubmitting(false);
    }
  };

  const steps = ['Select Vehicle', 'Choose Date & Time', 'Select Inspector', 'Review & Confirm'];

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

  if (error) {
    return (
      <Container maxWidth="md">
        <PageHeader 
          title="Book Inspection" 
          subtitle="Schedule a new vehicle inspection"
          breadcrumbs={[
            { label: 'Inspections', href: '/inspections' },
            { label: 'Book Inspection', href: '/inspections/book' },
          ]}
        />
        <ErrorState 
          message={error} 
          onRetry={() => window.location.reload()} 
          fullPage 
        />
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="md">
        <PageHeader 
          title="Book Inspection" 
          subtitle="Schedule a new vehicle inspection"
          breadcrumbs={[
            { label: 'Inspections', href: '/inspections' },
            { label: 'Book Inspection', href: '/inspections/book' },
          ]}
        />
        <LoadingState message="Loading..." />
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <PageHeader 
        title="Book Inspection" 
        subtitle="Schedule a new vehicle inspection"
        breadcrumbs={[
          { label: 'Inspections', href: '/inspections' },
          { label: 'Book Inspection', href: '/inspections/book' },
        ]}
      />
      
      <Paper elevation={0} variant="outlined" sx={{ mb: 4, p: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select a Vehicle for Inspection
            </Typography>
            <FormControl fullWidth error={!!formErrors.vehicleId}>
              <InputLabel id="vehicle-select-label">Vehicle</InputLabel>
              <Select
                labelId="vehicle-select-label"
                value={selectedVehicleId}
                onChange={handleVehicleChange}
                label="Vehicle"
              >
                {vehicles.map((vehicle) => (
                  <MenuItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.year} {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.vehicleId && (
                <FormHelperText>{formErrors.vehicleId}</FormHelperText>
              )}
            </FormControl>
            {vehicles.length === 0 && (
              <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                No vehicles found. Please add a vehicle first.
              </Typography>
            )}
          </Box>
        )}
        
        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Choose Date & Time
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Inspection Date"
                  value={inspectionDate}
                  onChange={handleDateChange}
                  minDate={new Date()}
                  error={!!formErrors.date}
                  helperText={formErrors.date}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!formErrors.time}>
                  <InputLabel id="time-select-label">Time Slot</InputLabel>
                  <Select
                    labelId="time-select-label"
                    value={inspectionTime}
                    onChange={handleTimeChange}
                    label="Time Slot"
                  >
                    {timeSlots.map((slot) => (
                      <MenuItem key={slot} value={slot}>
                        {slot}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.time && (
                    <FormHelperText>{formErrors.time}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select Inspector
            </Typography>
            <FormControl fullWidth error={!!formErrors.inspectorName}>
              <InputLabel id="inspector-select-label">Inspector</InputLabel>
              <Select
                labelId="inspector-select-label"
                value={inspectorName}
                onChange={handleInspectorChange}
                label="Inspector"
              >
                {inspectors.map((inspector) => (
                  <MenuItem key={inspector} value={inspector}>
                    {inspector}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.inspectorName && (
                <FormHelperText>{formErrors.inspectorName}</FormHelperText>
              )}
            </FormControl>
            <TextField
              label="Additional Notes"
              multiline
              rows={4}
              value={notes}
              onChange={handleNotesChange}
              fullWidth
              margin="normal"
              placeholder="Enter any special instructions or notes for the inspector"
            />
          </Box>
        )}
        
        {activeStep === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review & Confirm
            </Typography>
            
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Vehicle Details
                </Typography>
                {selectedVehicle ? (
                  <VehicleSummary
                    vehicle={{
                      id: selectedVehicle.id,
                      make: selectedVehicle.make,
                      model: selectedVehicle.model,
                      year: selectedVehicle.year,
                      licensePlate: selectedVehicle.licensePlate,
                      vin: selectedVehicle.vin || 'N/A',
                      color: selectedVehicle.color || 'N/A',
                      status: selectedVehicle.status,
                      fuelType: selectedVehicle.fuelType || 'N/A',
                      mileage: selectedVehicle.mileage || 0,
                      registrationDate: selectedVehicle.registrationDate || 'N/A',
                      lastInspectionDate: selectedVehicle.lastInspectionDate || 'N/A',
                    }}
                    hideActions
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No vehicle selected
                  </Typography>
                )}
              </CardContent>
            </Card>
            
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Inspection Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      Date
                    </Typography>
                    <Typography variant="body1">
                      {inspectionDate ? inspectionDate.toLocaleDateString() : 'Not selected'}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      Time
                    </Typography>
                    <Typography variant="body1">
                      {inspectionTime || 'Not selected'}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      Inspector
                    </Typography>
                    <Typography variant="body1">
                      {inspectorName || 'Not selected'}
                    </Typography>
                  </Grid>
                  {notes && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Notes
                      </Typography>
                      <Typography variant="body1">
                        {notes}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            onClick={activeStep === 0 ? () => navigate('/inspections') : handleBack}
            disabled={submitting}
          >
            {activeStep === 0 ? 'Cancel' : 'Back'}
          </Button>
          <Button
            variant="contained"
            onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
            disabled={submitting || (activeStep === 0 && vehicles.length === 0)}
          >
            {activeStep === steps.length - 1 ? (submitting ? 'Booking...' : 'Book Inspection') : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default BookInspection;