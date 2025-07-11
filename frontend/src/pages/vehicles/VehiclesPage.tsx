import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  DirectionsCar as CarIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
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

const VehiclesPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newVehicle, setNewVehicle] = useState<Omit<Vehicle, 'id' | 'status'>>({ 
    make: '',
    model: '',
    year: new Date().getFullYear(),
    registrationNumber: '',
    color: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
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
          color: 'Silver',
          lastInspectionDate: '2023-01-15',
          status: 'Passed',
        },
        {
          id: '2',
          make: 'Honda',
          model: 'Civic',
          year: 2019,
          registrationNumber: 'XYZ789',
          color: 'Blue',
          lastInspectionDate: '2023-03-10',
          status: 'Failed',
        },
        {
          id: '3',
          make: 'Ford',
          model: 'Focus',
          year: 2021,
          registrationNumber: 'DEF456',
          color: 'Red',
          status: 'Not Inspected',
        },
        {
          id: '4',
          make: 'Nissan',
          model: 'Altima',
          year: 2018,
          registrationNumber: 'GHI789',
          color: 'Black',
          lastInspectionDate: '2023-05-05',
          status: 'Pending',
        },
      ];
      
      setVehicles(mockData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setFormErrors({});
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewVehicle({ 
      make: '',
      model: '',
      year: new Date().getFullYear(),
      registrationNumber: '',
      color: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewVehicle(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (!newVehicle.make.trim()) {
      errors.make = 'Make is required';
      isValid = false;
    }

    if (!newVehicle.model.trim()) {
      errors.model = 'Model is required';
      isValid = false;
    }

    if (!newVehicle.registrationNumber.trim()) {
      errors.registrationNumber = 'Registration number is required';
      isValid = false;
    }

    const yearNum = Number(newVehicle.year);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
      errors.year = 'Please enter a valid year';
      isValid = false;
    }

    if (!newVehicle.color.trim()) {
      errors.color = 'Color is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleAddVehicle = async () => {
    if (!validateForm()) return;

    try {
      // In a real application, this would be an API call
      // await axios.post('http://localhost:5000/api/vehicles', newVehicle);
      
      // For now, we'll just add it to our state
      const newId = (vehicles.length + 1).toString();
      const addedVehicle: Vehicle = {
        ...newVehicle,
        id: newId,
        status: 'Not Inspected',
      };
      
      setVehicles([...vehicles, addedVehicle]);
      handleCloseDialog();
    } catch (err: any) {
      setError(err.message || 'Failed to add vehicle');
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;

    try {
      // In a real application, this would be an API call
      // await axios.delete(`http://localhost:5000/api/vehicles/${id}`);
      
      // For now, we'll just remove it from our state
      setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete vehicle');
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const searchLower = searchTerm.toLowerCase();
    return (
      vehicle.make.toLowerCase().includes(searchLower) ||
      vehicle.model.toLowerCase().includes(searchLower) ||
      vehicle.registrationNumber.toLowerCase().includes(searchLower)
    );
  });

  const getStatusColor = (status: Vehicle['status']) => {
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          My Vehicles
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add Vehicle
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        margin="normal"
        placeholder="Search vehicles by make, model, or registration number"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {filteredVehicles.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <CarIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            {searchTerm ? 'No vehicles match your search' : 'No vehicles added yet'}
          </Typography>
          {!searchTerm && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
              sx={{ mt: 2 }}
            >
              Add Your First Vehicle
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredVehicles.map((vehicle) => (
            <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-5px)',
                    transition: 'all 0.3s',
                  },
                }}
              >
                <CardMedia
                  component="div"
                  sx={{
                    pt: '56.25%', // 16:9 aspect ratio
                    bgcolor: 'grey.200',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CarIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
                </CardMedia>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {vehicle.make} {vehicle.model}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Year: {vehicle.year}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Registration: {vehicle.registrationNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Color: {vehicle.color}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {vehicle.lastInspectionDate ? (
                        `Last Inspection: ${new Date(vehicle.lastInspectionDate).toLocaleDateString()}`
                      ) : (
                        'No inspection history'
                      )}
                    </Typography>
                    <Chip
                      label={vehicle.status}
                      color={getStatusColor(vehicle.status) as any}
                      size="small"
                    />
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => navigate(`/dashboard/vehicles/${vehicle.id}`)}
                  >
                    View Details
                  </Button>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/dashboard/vehicles/${vehicle.id}`)}
                  >
                    Edit
                  </Button>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                    sx={{ ml: 'auto' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Vehicle Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Vehicle</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Make"
                name="make"
                value={newVehicle.make}
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
                value={newVehicle.model}
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
                value={newVehicle.year}
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
                value={newVehicle.color}
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
                value={newVehicle.registrationNumber}
                onChange={handleInputChange}
                error={!!formErrors.registrationNumber}
                helperText={formErrors.registrationNumber}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddVehicle} variant="contained" color="primary">
            Add Vehicle
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VehiclesPage;