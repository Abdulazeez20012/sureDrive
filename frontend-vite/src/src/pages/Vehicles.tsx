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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from '@mui/material';
import { Add as AddIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import SearchBar from '../components/common/SearchBar';
import VehicleCard from '../components/vehicles/VehicleCard';
import EmptyState from '../components/common/EmptyState';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import FileUpload from '../components/common/FileUpload';
import { useVehicleStore } from '../stores/vehicleStore';
import { useNotificationStore } from '../stores/notificationStore';
import { useInspectionStore } from '../stores/inspectionStore';

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

const initialFormData: VehicleFormData = {
  make: '',
  model: '',
  year: new Date().getFullYear(),
  licensePlate: '',
  vin: '',
  color: '',
  status: 'active',
  fuelType: 'gasoline',
  mileage: 0,
  registrationDate: '',
  notes: '',
  imageFile: null,
  imageUrl: '',
};

const Vehicles: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useVehicleStore();
  const { bookInspection } = useInspectionStore();
  const { showSuccess, showError } = useNotificationStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formData, setFormData] = useState<VehicleFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof VehicleFormData, string>>>({});
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Check if the URL has a query parameter to open the add dialog
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('add') === 'true') {
      setOpenAddDialog(true);
      // Clean up the URL
      navigate('/vehicles', { replace: true });
    }

    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location, navigate]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleStatusFilterChange = (_event: React.SyntheticEvent, newValue: string) => {
    setStatusFilter(newValue);
  };

  const handleAddClick = () => {
    setFormData(initialFormData);
    setFormErrors({});
    setOpenAddDialog(true);
  };

  const handleEditClick = (id: string) => {
    const vehicle = vehicles.find(v => v.id === id);
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
      setFormErrors({});
      setSelectedVehicleId(id);
      setOpenEditDialog(true);
    }
  };

  const handleDeleteClick = (id: string) => {
    setSelectedVehicleId(id);
    setOpenDeleteDialog(true);
  };

  const handleBookInspection = (id: string) => {
    navigate(`/inspections/book?vehicleId=${id}`);
  };

  const handleCloseDialog = () => {
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
    setSelectedVehicleId(null);
  };

  const validateForm = () => {
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
    if (name) {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = (file: File | null) => {
    setFormData(prev => ({
      ...prev,
      imageFile: file,
      // In a real app, we would upload the file to a server and get a URL back
      // For now, we'll create a temporary URL
      imageUrl: file ? URL.createObjectURL(file) : '',
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      // In a real app, we would upload the image file to a server here
      // and get back a URL to store with the vehicle data

      if (openAddDialog) {
        // Add new vehicle
        const newVehicle = {
          ...formData,
          id: `v-${Date.now()}`, // In a real app, this would be generated by the server
        };
        addVehicle(newVehicle);
        showSuccess('Vehicle added successfully');
      } else if (openEditDialog && selectedVehicleId) {
        // Update existing vehicle
        updateVehicle(selectedVehicleId, formData);
        showSuccess('Vehicle updated successfully');
      }

      handleCloseDialog();
    } catch (err) {
      showError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedVehicleId) return;

    setSubmitting(true);

    try {
      deleteVehicle(selectedVehicleId);
      showSuccess('Vehicle deleted successfully');
      handleCloseDialog();
    } catch (err) {
      showError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter vehicles based on search query and status filter
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      searchQuery === '' ||
      vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.year.toString().includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (error) {
    return (
      <Container maxWidth="xl">
        <PageHeader 
          title="Vehicles" 
          subtitle="Manage your fleet"
          action={<Button startIcon={<AddIcon />} variant="contained" onClick={handleAddClick}>Add Vehicle</Button>}
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
        title="Vehicles" 
        subtitle="Manage your fleet"
        action={<Button startIcon={<AddIcon />} variant="contained" onClick={handleAddClick}>Add Vehicle</Button>}
      />
      
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2 }}>
            <SearchBar 
              placeholder="Search vehicles..." 
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
                aria-label="vehicle status filter"
                sx={{ minHeight: 'unset' }}
              >
                <Tab label="All" value="all" sx={{ minHeight: 'unset', py: 1 }} />
                <Tab label="Active" value="active" sx={{ minHeight: 'unset', py: 1 }} />
                <Tab label="Maintenance" value="maintenance" sx={{ minHeight: 'unset', py: 1 }} />
                <Tab label="Inactive" value="inactive" sx={{ minHeight: 'unset', py: 1 }} />
              </Tabs>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      {loading ? (
        <LoadingState message="Loading vehicles..." />
      ) : filteredVehicles.length > 0 ? (
        <Grid container spacing={3}>
          {filteredVehicles.map(vehicle => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={vehicle.id}>
              <VehicleCard
                id={vehicle.id}
                make={vehicle.make}
                model={vehicle.model}
                year={vehicle.year}
                licensePlate={vehicle.licensePlate}
                status={vehicle.status}
                lastInspection={vehicle.lastInspectionDate}
                imageUrl={vehicle.imageUrl}
                onEdit={() => handleEditClick(vehicle.id)}
                onDelete={() => handleDeleteClick(vehicle.id)}
                onBookInspection={() => handleBookInspection(vehicle.id)}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <EmptyState
          title="No vehicles found"
          description={searchQuery || statusFilter !== 'all' ? 
            "Try adjusting your search or filters" : 
            "Add your first vehicle to get started"}
          actionText="Add Vehicle"
          onAction={handleAddClick}
        />
      )}
      
      {/* Add Vehicle Dialog */}
      <Dialog 
        open={openAddDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Vehicle</DialogTitle>
        <DialogContent dividers>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={submitting}
          >
            {submitting ? 'Saving...' : 'Save Vehicle'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Vehicle Dialog - Reuses the same form as Add */}
      <Dialog 
        open={openEditDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Vehicle</DialogTitle>
        <DialogContent dividers>
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

export default Vehicles;