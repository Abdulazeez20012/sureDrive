import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Assignment as AssignmentIcon,
  DirectionsCar as CarIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import axios from 'axios';

interface Inspection {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehicleDetails: {
    make: string;
    model: string;
    year: number;
    registrationNumber: string;
  };
  date: string;
  status: 'Passed' | 'Failed' | 'Pending';
  notes?: string;
  inspectorName?: string;
  inspectionItems?: {
    name: string;
    status: 'Passed' | 'Failed' | 'Not Checked';
    notes?: string;
  }[];
}

const InspectionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchInspectionDetails(id);
    }
  }, [id]);

  const fetchInspectionDetails = async (inspectionId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real application, this would be an API call
      // const response = await axios.get(`http://localhost:5000/api/inspections/${inspectionId}`);
      // const data = response.data;
      
      // For now, we'll use mock data
      const mockData: Inspection = {
        id: inspectionId,
        vehicleId: '1',
        vehicleName: 'Toyota Camry',
        vehicleDetails: {
          make: 'Toyota',
          model: 'Camry',
          year: 2020,
          registrationNumber: 'ABC123',
        },
        date: '2023-01-15',
        status: 'Passed',
        notes: 'Vehicle is in excellent condition. All systems functioning properly.',
        inspectorName: 'John Smith',
        inspectionItems: [
          {
            name: 'Brakes',
            status: 'Passed',
            notes: 'Brake pads in good condition. Brake fluid at proper level.',
          },
          {
            name: 'Lights',
            status: 'Passed',
            notes: 'All lights functioning properly.',
          },
          {
            name: 'Tires',
            status: 'Passed',
            notes: 'Tread depth good. Proper inflation.',
          },
          {
            name: 'Suspension',
            status: 'Passed',
            notes: 'No issues detected.',
          },
          {
            name: 'Engine',
            status: 'Passed',
            notes: 'Engine running smoothly. No leaks detected.',
          },
        ],
      };
      
      // If the ID is 3, let's make it a failed inspection for variety
      if (inspectionId === '3') {
        mockData.status = 'Failed';
        mockData.notes = 'Vehicle requires repairs before it can pass inspection.';
        mockData.inspectionItems = [
          {
            name: 'Brakes',
            status: 'Failed',
            notes: 'Brake pads worn below minimum thickness. Recommend replacement.',
          },
          {
            name: 'Lights',
            status: 'Failed',
            notes: 'Rear tail light not functioning.',
          },
          {
            name: 'Tires',
            status: 'Passed',
            notes: 'Tread depth good. Proper inflation.',
          },
          {
            name: 'Suspension',
            status: 'Passed',
            notes: 'No issues detected.',
          },
          {
            name: 'Engine',
            status: 'Passed',
            notes: 'Engine running smoothly. No leaks detected.',
          },
        ];
      }
      
      // If the ID is 5, let's make it a pending inspection
      if (inspectionId === '5') {
        mockData.status = 'Pending';
        mockData.notes = 'Scheduled for inspection.';
        mockData.inspectionItems = [];
        mockData.inspectorName = undefined;
      }
      
      setInspection(mockData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch inspection details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: 'Passed' | 'Failed' | 'Pending' | 'Not Checked') => {
    switch (status) {
      case 'Passed': return 'success';
      case 'Failed': return 'error';
      case 'Pending': return 'warning';
      case 'Not Checked': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: 'Passed' | 'Failed' | 'Pending' | 'Not Checked') => {
    switch (status) {
      case 'Passed': return <CheckIcon color="success" />;
      case 'Failed': return <CloseIcon color="error" />;
      case 'Pending': return <ScheduleIcon color="warning" />;
      case 'Not Checked': return null;
      default: return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !inspection) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography color="error" variant="h6">
          {error || 'Inspection not found'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard/inspections')}
          sx={{ mt: 2 }}
        >
          Back to Inspections
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard/inspections')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          Inspection Details
        </Typography>
        <Chip
          label={inspection.status}
          color={getStatusColor(inspection.status) as any}
          sx={{ ml: 2 }}
        />
      </Box>

      {/* Inspection Summary */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AssignmentIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Inspection Information</Typography>
            </Box>
            <Typography variant="body1">
              <strong>Date:</strong> {new Date(inspection.date).toLocaleDateString()}
            </Typography>
            {inspection.inspectorName && (
              <Typography variant="body1">
                <strong>Inspector:</strong> {inspection.inspectorName}
              </Typography>
            )}
            <Typography variant="body1">
              <strong>Status:</strong> {inspection.status}
            </Typography>
            {inspection.notes && (
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Notes:</strong> {inspection.notes}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CarIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Vehicle Information</Typography>
            </Box>
            <Typography variant="body1">
              <strong>Vehicle:</strong> {inspection.vehicleName}
            </Typography>
            <Typography variant="body1">
              <strong>Make:</strong> {inspection.vehicleDetails.make}
            </Typography>
            <Typography variant="body1">
              <strong>Model:</strong> {inspection.vehicleDetails.model}
            </Typography>
            <Typography variant="body1">
              <strong>Year:</strong> {inspection.vehicleDetails.year}
            </Typography>
            <Typography variant="body1">
              <strong>Registration:</strong> {inspection.vehicleDetails.registrationNumber}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(`/dashboard/vehicles/${inspection.vehicleId}`)}
              sx={{ mt: 2 }}
            >
              View Vehicle Details
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Inspection Items */}
      {inspection.status !== 'Pending' && (
        <Card>
          <CardHeader title="Inspection Checklist" />
          <Divider />
          <CardContent>
            {inspection.inspectionItems && inspection.inspectionItems.length > 0 ? (
              <List>
                {inspection.inspectionItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {getStatusIcon(item.status)}
                            <Typography variant="body1" sx={{ ml: 1 }}>
                              {item.name}
                            </Typography>
                            <Chip
                              label={item.status}
                              color={getStatusColor(item.status) as any}
                              size="small"
                              sx={{ ml: 2 }}
                            />
                          </Box>
                        }
                        secondary={item.notes}
                      />
                    </ListItem>
                    {index < inspection.inspectionItems.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No inspection items available.
              </Typography>
            )}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
        {inspection.status === 'Failed' && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/dashboard/book-inspection')}
          >
            Book Re-inspection
          </Button>
        )}
        <Button
          variant="outlined"
          onClick={() => navigate(`/dashboard/vehicles/${inspection.vehicleId}`)}
        >
          View Vehicle
        </Button>
      </Box>
    </Box>
  );
};

export default InspectionDetailPage;