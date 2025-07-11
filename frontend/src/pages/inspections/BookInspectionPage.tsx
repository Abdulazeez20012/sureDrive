import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import axios from 'axios';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  registrationNumber: string;
}

interface BookingFormData {
  vehicleId: string;
  date: Date | null;
  notes: string;
}

const BookInspectionPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<BookingFormData>({
    vehicleId: '',
    date: null,
    notes: '',
  });
  const [formErrors, setFormErrors] = useState<{
    vehicleId?: string;
    date?: string;
    notes?: string;
  }>({});
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real application, this would be an API call
      // const response = await axios.get('http://localhost:5000/api/vehicles');
      // const data = response.data;
      
      // For now, we'll use mock data
      const mockData: Vehicle[] = [
        {
          id: '1',
          make: 'Toyota',
          model: 'Camry',
          year: 2020,
          registrationNumber: 'ABC123',
        },
        {
          id: '2',
          make: 'Honda',
          model: 'Civic',
          year: 2019,
          registrationNumber: 'XYZ789',
        },
        {
          id: '3',
          make: 'Ford',
          model: 'Focus',
          year: 2021,
          registrationNumber: 'DEF456',
        },
        {
          id: '4',
          make: 'Nissan',
          model: 'Altima',
          year: 2018,
          registrationNumber: 'GHI789',
        },
      ];
      
      setVehicles(mockData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({ ...prev, date }));
  };

  const handleVehicleChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setFormData(prev => ({ ...prev, vehicleId: e.target.value as string }));
  };

  const validateStep = () => {
    const errors: {
      vehicleId?: string;
      date?: string;
      notes?: string;
    } = {};
    let isValid = true;

    if (activeStep === 0) {
      if (!formData.vehicleId) {
        errors.vehicleId = 'Please select a vehicle';
        isValid = false;
      }
    } else if (activeStep === 1) {
      if (!formData.date) {
        errors.date = 'Please select a date';
        isValid = false;
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(formData.date);
        selectedDate.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
          errors.date = 'Please select a future date';
          isValid = false;
        }
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep(prevStep => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      
      // In a real application, this would be an API call
      // const response = await axios.post('http://localhost:5000/api/inspections/book', formData);
      // const data = response.data;
      
      // For now, we'll just simulate a successful booking
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      setBookingId('INS-' + Math.floor(1000 + Math.random() * 9000));
      setBookingSuccess(true);
      setActiveStep(3);
    } catch (err: any) {
      setError(err.message || 'Failed to book inspection');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = ['Select Vehicle', 'Choose Date', 'Review & Confirm'];

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select a Vehicle for Inspection
            </Typography>
            <FormControl fullWidth error={!!formErrors.vehicleId}>
              <InputLabel id="vehicle-select-label">Vehicle</InputLabel>
              <Select
                labelId="vehicle-select-label"
                id="vehicle-select"
                value={formData.vehicleId}
                label="Vehicle"
                onChange={handleVehicleChange}
              >
                {vehicles.map((vehicle) => (
                  <MenuItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.make} {vehicle.model} ({vehicle.year}) - {vehicle.registrationNumber}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.vehicleId && (
                <FormHelperText>{formErrors.vehicleId}</FormHelperText>
              )}
            </FormControl>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/dashboard/vehicles')}
              >
                Manage Vehicles
              </Button>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select Preferred Inspection Date
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Inspection Date"
                value={formData.date}
                onChange={handleDateChange}
                disablePast
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!formErrors.date,
                    helperText: formErrors.date,
                  },
                }}
              />
            </LocalizationProvider>
            <TextField
              margin="normal"
              fullWidth
              id="notes"
              name="notes"
              label="Additional Notes (Optional)"
              multiline
              rows={4}
              value={formData.notes}
              onChange={handleInputChange}
              error={!!formErrors.notes}
              helperText={formErrors.notes}
            />
          </Box>
        );
      case 2:
        const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Booking Details
            </Typography>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Vehicle:</strong>
                </Typography>
                <Typography variant="body1">
                  {selectedVehicle
                    ? `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.year})`
                    : 'No vehicle selected'}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {selectedVehicle?.registrationNumber}
                </Typography>
                
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  <strong>Inspection Date:</strong>
                </Typography>
                <Typography variant="body1">
                  {formData.date
                    ? new Date(formData.date).toLocaleDateString()
                    : 'No date selected'}
                </Typography>
                
                {formData.notes && (
                  <>
                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                      <strong>Additional Notes:</strong>
                    </Typography>
                    <Typography variant="body1">
                      {formData.notes}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
            <Alert severity="info" sx={{ mb: 2 }}>
              By confirming this booking, you agree to have your vehicle available for inspection on the selected date.
            </Alert>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom color="primary">
              Inspection Booked Successfully!
            </Typography>
            <Typography variant="body1" paragraph>
              Your booking reference number is: <strong>{bookingId}</strong>
            </Typography>
            <Typography variant="body1" paragraph>
              We will contact you to confirm the exact time for your inspection.
            </Typography>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="contained"
                onClick={() => navigate('/dashboard/inspections')}
              >
                View All Inspections
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/dashboard')}
              >
                Return to Dashboard
              </Button>
            </Box>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (vehicles.length === 0 && !error) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Book Inspection
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          You need to add a vehicle before booking an inspection.
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/dashboard/vehicles')}
        >
          Add Vehicle
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          Book Inspection
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 2, mb: 4 }}>
          {getStepContent(activeStep)}
        </Box>

        {!bookingSuccess && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {activeStep > 0 && (
              <Button
                onClick={handleBack}
                sx={{ mr: 1 }}
                disabled={submitting}
              >
                Back
              </Button>
            )}
            {activeStep < steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={submitting}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? <CircularProgress size={24} /> : 'Confirm Booking'}
              </Button>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default BookInspectionPage;