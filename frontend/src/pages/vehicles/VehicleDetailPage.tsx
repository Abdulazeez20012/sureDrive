import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import axios from 'axios';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  registrationNumber: string;
  color: string;
  lastInspectionDate?: string;
  status: 'Passed' | 'Failed' | 'Pending' | 'Not Inspected';
}

interface Inspection {
  id: string;
  date: string;
  status: 'Passed' | 'Failed' | 'Pending';
  notes?: string;
}

const VehicleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedVehicle, setEditedVehicle] = useState<Omit<Vehicle, 'id' | 'status'>>({ 
    make: '',
    model: '',
    year: 0,
    registrationNumber: '',
    color: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchVehicleDetails(id);
      fetchVehicleInspections(id);
    }
  }, [id]);

  const fetchVehicleDetails = async (vehicleId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real application, this would be an API call
      // const response = await axios.get(`http://localhost:5000/api/vehicles/${vehicleId}`);
      // const data = response.data;
      
      // For now, we'll use mock data
      const mockData: Vehicle = {
        id: vehicleId,
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        registrationNumber: 'ABC123',
        color: 'Silver',
        lastInspectionDate: '2023-01-15',
        status: 'Passed',
      };
      
      setVehicle(mockData);
      setEditedVehicle({
        make: mockData.make,
        model: mockData.model,
        year: mockData.year,
        registrationNumber: mockData.registrationNumber,
        color: mockData.color,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch vehicle details');
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicleInspections = async (vehicleId: string) => {
    try {
      // In a real application, this would be an API call
      // const response = await axios.get(`http://localhost:5000/api/vehicles/${vehicleId}/inspections`);
      // const data = response.data;
      
      // For now, we'll use mock data
      const mockData: Inspection[] = [
        {
          id: '1',
          date: '2023-01-15',
          status: 'Passed',
          notes: 'Vehicle is in excellent condition. All systems functioning properly.',
        },
        {
          id: '2',
          date: '2022-07-10',
          status: 'Failed',
          notes: 'Brake system needs repair. Tail light not functioning.',
        },
        {
          id: '3',
          date: '2022-01-05',
          status: 'Passed',
          notes: 'Minor issues fixed. Vehicle is road-worthy.',
        },
      ];
      
      setInspections(mockData);
    } catch (err: any) {
      console.error('Failed to fetch vehicle inspections:', err);
      // We don't set the error state here to avoid blocking the whole page
      // if only the inspections fail to load
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedVehicle(prev => ({ ...prev, [name]: name === 'year' ? Number(value) : value }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (!editedVehicle.make.trim()) {
      errors.make = 'Make is required';
      isValid = false;
    }

    if (!editedVehicle.model.trim()) {
      errors.model = 'Model is required';
      isValid = false;
    }

    if (!editedVehicle.registrationNumber.trim()) {
      errors.registrationNumber = 'Registration number is required';
      isValid = false;
    }

    const yearNum = Number(editedVehicle.year);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
      errors.year = 'Please enter a valid year';
      isValid = false;
    }

    if (!editedVehicle.color.trim()) {
      errors.color = 'Color is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) return;

    try {
      // In a real application, this would be an API call
      // await axios.put(`http://localhost:5000/api/vehicles/${id}`, editedVehicle);
      
      // For now, we'll just update our state
      if (vehicle) {
        const updatedVehicle: Vehicle = {
          ...vehicle,
          ...editedVehicle,
        };
        setVehicle(updatedVehicle);
        setIsEditing(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update vehicle');
    }
  };

  const handleDeleteVehicle = async () => {
    try {
      // In a real application, this would be an API call
      // await axios.delete(`http://localhost:5000/api/vehicles/${id}`);
      
      // Navigate back to vehicles list
      navigate('/dashboard/vehicles');
    } catch (err: any) {
      setError(err.message || 'Failed to delete vehicle');
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const getStatusColor = (status: 'Passed' | 'Failed' | 'Pending' | 'Not Inspected') => {
    switch (status) {
      case 'Passed': return 'success';
      case 'Failed': return 'error';
      case 'Pending': return 'warning';
      case 'Not Inspected': return 'default';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !vehicle) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography color="error" variant="h6">
          {error || 'Vehicle not found'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard/vehicles')}
          sx={{ mt: 2 }}
        >
          Back to Vehicles
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard/vehicles')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          {isEditing ? 'Edit Vehicle' : `${vehicle.make} ${vehicle.model}`}
        </Typography>
        {!isEditing && (
          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete
            </Button>
          </Box>
        )}
      </Box>

      {/* Vehicle Details */}
      <Paper sx={{ p: 3, mb: 4 }}>
        {isEditing ? (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Make"
                name="make"
                value={editedVehicle.make}
                onChange={handleInputChange}
                error={!!formErrors.make}
                helperText={formErrors.make}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Model"
                name="model"
                value={editedVehicle.model}
                onChange={handleInputChange}
                error={!!formErrors.model}
                helperText={formErrors.model}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Year"
                name="year"
                type="number"
                value={editedVehicle.year}
                onChange={handleInputChange}
                error={!!formErrors.year}
                helperText={formErrors.year}
                required
                inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Color"
                name="color"
                value={editedVehicle.color}
                onChange={handleInputChange}
                error={!!formErrors.color}
                helperText={formErrors.color}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Registration Number"
                name="registrationNumber"
                value={editedVehicle.registrationNumber}
                onChange={handleInputChange}
                error={!!formErrors.registrationNumber}
                helperText={formErrors.registrationNumber}
                required
              />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => {
                  setIsEditing(false);
                  setFormErrors({});
                  // Reset to original values
                  if (vehicle) {
                    setEditedVehicle({
                      make: vehicle.make,
                      model: vehicle.model,
                      year: vehicle.year,
                      registrationNumber: vehicle.registrationNumber,
                      color: vehicle.color,
                    });
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSaveChanges}
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CarIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Vehicle Information</Typography>
              </Box>
              <Typography variant="body1">
                <strong>Make:</strong> {vehicle.make}
              </Typography>
              <Typography variant="body1">
                <strong>Model:</strong> {vehicle.model}
              </Typography>
              <Typography variant="body1">
                <strong>Year:</strong> {vehicle.year}
              </Typography>
              <Typography variant="body1">
                <strong>Color:</strong> {vehicle.color}
              </Typography>
              <Typography variant="body1">
                <strong>Registration:</strong> {vehicle.registrationNumber}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Inspection Status</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body1" sx={{ mr: 1 }}>
                  <strong>Current Status:</strong>
                </Typography>
                <Chip
                  label={vehicle.status}
                  color={getStatusColor(vehicle.status) as any}
                  size="small"
                />
              </Box>
              <Typography variant="body1">
                <strong>Last Inspection:</strong>{' '}
                {vehicle.lastInspectionDate
                  ? new Date(vehicle.lastInspectionDate).toLocaleDateString()
                  : 'No inspection yet'}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/dashboard/book-inspection')}
                sx={{ mt: 2 }}
              >
                Book New Inspection
              </Button>
            </Grid>
          </Grid>
        )}
      </Paper>

      {/* Inspection History */}
      {!isEditing && (
        <Card>
          <CardHeader title="Inspection History" />
          <Divider />
          <CardContent>
            {inspections.length > 0 ? (
              <List>
                {inspections.map((inspection) => (
                  <React.Fragment key={inspection.id}>
                    <ListItem
                      button
                      onClick={() => navigate(`/dashboard/inspections/${inspection.id}`)}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body1">
                              {new Date(inspection.date).toLocaleDateString()}
                            </Typography>
                            <Chip
                              label={inspection.status}
                              color={getStatusColor(inspection.status) as any}
                              size="small"
                              sx={{ ml: 2 }}
                            />
                          </Box>
                        }
                        secondary={inspection.notes}
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No inspection history available for this vehicle.
              </Typography>
            )}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/dashboard/book-inspection')}
              >
                Book New Inspection
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Vehicle</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this vehicle? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteVehicle} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VehicleDetailPage;