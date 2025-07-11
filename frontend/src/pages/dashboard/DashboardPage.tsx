import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  CircularProgress,
} from '@mui/material';
import { DirectionsCar, Assignment, CalendarToday, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../../stores/authStore';

interface DashboardStats {
  totalVehicles: number;
  pendingInspections: number;
  completedInspections: number;
  upcomingInspections: { id: string; vehicleName: string; date: string }[];
  recentVehicles: { id: string; name: string; registrationNumber: string }[];
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalVehicles: 0,
    pendingInspections: 0,
    completedInspections: 0,
    upcomingInspections: [],
    recentVehicles: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real application, this would be an API call
        // const response = await axios.get('http://localhost:5000/api/dashboard');
        // const data = response.data;
        
        // For now, we'll use mock data
        const mockData: DashboardStats = {
          totalVehicles: 5,
          pendingInspections: 2,
          completedInspections: 3,
          upcomingInspections: [
            { id: '1', vehicleName: 'Toyota Camry', date: '2023-06-15' },
            { id: '2', vehicleName: 'Honda Civic', date: '2023-06-20' },
          ],
          recentVehicles: [
            { id: '1', name: 'Toyota Camry', registrationNumber: 'ABC123' },
            { id: '2', name: 'Honda Civic', registrationNumber: 'XYZ789' },
            { id: '3', name: 'Ford Focus', registrationNumber: 'DEF456' },
          ],
        };
        
        setStats(mockData);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography color="error" variant="h6">
          Error: {error}
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Welcome back, {user?.name || 'User'}! Here's an overview of your vehicle inspections.
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'primary.light',
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography component="h2" variant="h6" gutterBottom>
                Total Vehicles
              </Typography>
              <DirectionsCar fontSize="large" />
            </Box>
            <Typography component="p" variant="h3">
              {stats.totalVehicles}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <Button
                size="small"
                color="inherit"
                onClick={() => navigate('/dashboard/vehicles')}
                endIcon={<ArrowForward />}
                sx={{ color: 'white', p: 0 }}
              >
                View all vehicles
              </Button>
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'secondary.light',
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography component="h2" variant="h6" gutterBottom>
                Pending Inspections
              </Typography>
              <Assignment fontSize="large" />
            </Box>
            <Typography component="p" variant="h3">
              {stats.pendingInspections}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <Button
                size="small"
                color="inherit"
                onClick={() => navigate('/dashboard/inspections')}
                endIcon={<ArrowForward />}
                sx={{ color: 'white', p: 0 }}
              >
                View all inspections
              </Button>
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'success.light',
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography component="h2" variant="h6" gutterBottom>
                Completed Inspections
              </Typography>
              <CalendarToday fontSize="large" />
            </Box>
            <Typography component="p" variant="h3">
              {stats.completedInspections}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <Button
                size="small"
                color="inherit"
                onClick={() => navigate('/dashboard/inspections')}
                endIcon={<ArrowForward />}
                sx={{ color: 'white', p: 0 }}
              >
                View inspection history
              </Button>
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Upcoming Inspections" />
            <Divider />
            <CardContent>
              {stats.upcomingInspections.length > 0 ? (
                <List>
                  {stats.upcomingInspections.map((inspection) => (
                    <React.Fragment key={inspection.id}>
                      <ListItem
                        button
                        onClick={() => navigate(`/dashboard/inspections/${inspection.id}`)}
                      >
                        <ListItemText
                          primary={inspection.vehicleName}
                          secondary={`Scheduled for: ${new Date(inspection.date).toLocaleDateString()}`}
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No upcoming inspections scheduled.
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
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Recent Vehicles" />
            <Divider />
            <CardContent>
              {stats.recentVehicles.length > 0 ? (
                <List>
                  {stats.recentVehicles.map((vehicle) => (
                    <React.Fragment key={vehicle.id}>
                      <ListItem
                        button
                        onClick={() => navigate(`/dashboard/vehicles/${vehicle.id}`)}
                      >
                        <ListItemText
                          primary={vehicle.name}
                          secondary={`Registration: ${vehicle.registrationNumber}`}
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No vehicles added yet.
                </Typography>
              )}
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/dashboard/vehicles')}
                >
                  View All Vehicles
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;