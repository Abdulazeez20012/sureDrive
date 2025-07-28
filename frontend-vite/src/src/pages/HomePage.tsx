import React from 'react';
import { Box, Button, Container, Grid, Typography, Card, CardContent, CardMedia } from '@mui/material';
import { DirectionsCar, Security, Speed, CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const features = [
    {
      icon: <DirectionsCar fontSize="large" color="primary" />,
      title: 'Vehicle Management',
      description: 'Easily manage all your vehicles in one place. Add, update, and track vehicle information.',
    },
    {
      icon: <Security fontSize="large" color="primary" />,
      title: 'Safety First',
      description: 'Ensure your vehicles meet safety standards with regular inspections and maintenance tracking.',
    },
    {
      icon: <Speed fontSize="large" color="primary" />,
      title: 'Efficient Booking',
      description: 'Book vehicle inspections quickly and easily with our streamlined booking system.',
    },
    {
      icon: <CheckCircle fontSize="large" color="primary" />,
      title: 'Inspection Reports',
      description: 'Access detailed inspection reports and history for all your vehicles.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                SureDrive
              </Typography>
              <Typography variant="h5" paragraph>
                Vehicle Inspection Management System
              </Typography>
              <Typography variant="body1" paragraph>
                Streamline your vehicle inspection process with our comprehensive management system.
                Book inspections, track maintenance, and ensure your vehicles are always road-ready.
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  color="secondary"
                  onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth/login')}
                  sx={{ mr: 2, mb: { xs: 2, sm: 0 } }}
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Login'}
                </Button>
                {!isAuthenticated && (
                  <Button
                    variant="outlined"
                    size="large"
                    color="inherit"
                    onClick={() => navigate('/auth/register')}
                  >
                    Register
                  </Button>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/car-inspection.svg"
                alt="Vehicle Inspection"
                sx={{
                  width: '100%',
                  maxHeight: 400,
                  objectFit: 'contain',
                  display: { xs: 'none', md: 'block' },
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Features
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          Everything you need to manage your vehicle inspections efficiently
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
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
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    pt: 3,
                  }}
                >
                  {feature.icon}
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h3" align="center">
                    {feature.title}
                  </Typography>
                  <Typography align="center">{feature.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h4" align="center" gutterBottom>
            Ready to get started?
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" paragraph>
            Join SureDrive today and take control of your vehicle inspection process.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth/register')}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} SureDrive. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;