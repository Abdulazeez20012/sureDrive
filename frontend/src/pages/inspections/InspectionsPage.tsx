import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Inspection {
  id: string;
  vehicleId: string;
  vehicleName: string;
  date: string;
  status: 'Passed' | 'Failed' | 'Pending';
  notes?: string;
}

const InspectionsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real application, this would be an API call
      // const response = await axios.get('http://localhost:5000/api/inspections');
      // const data = response.data;
      
      // For now, we'll use mock data
      const mockData: Inspection[] = [
        {
          id: '1',
          vehicleId: '1',
          vehicleName: 'Toyota Camry',
          date: '2023-06-15',
          status: 'Pending',
          notes: 'Scheduled inspection for regular maintenance check.',
        },
        {
          id: '2',
          vehicleId: '2',
          vehicleName: 'Honda Civic',
          date: '2023-05-10',
          status: 'Passed',
          notes: 'Vehicle passed all inspection points. No issues found.',
        },
        {
          id: '3',
          vehicleId: '3',
          vehicleName: 'Ford Focus',
          date: '2023-04-22',
          status: 'Failed',
          notes: 'Brake system needs repair. Tail light not functioning.',
        },
        {
          id: '4',
          vehicleId: '1',
          vehicleName: 'Toyota Camry',
          date: '2023-01-15',
          status: 'Passed',
          notes: 'Vehicle is in excellent condition. All systems functioning properly.',
        },
        {
          id: '5',
          vehicleId: '4',
          vehicleName: 'Nissan Altima',
          date: '2023-06-20',
          status: 'Pending',
          notes: 'Scheduled for comprehensive inspection.',
        },
      ];
      
      setInspections(mockData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch inspections');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: Inspection['status']) => {
    switch (status) {
      case 'Passed': return 'success';
      case 'Failed': return 'error';
      case 'Pending': return 'warning';
      default: return 'default';
    }
  };

  const filteredInspections = inspections.filter(inspection => {
    // Filter by tab value (status)
    if (tabValue === 1 && inspection.status !== 'Pending') return false;
    if (tabValue === 2 && inspection.status !== 'Passed') return false;
    if (tabValue === 3 && inspection.status !== 'Failed') return false;
    
    // Filter by search term
    const searchLower = searchTerm.toLowerCase();
    return (
      inspection.vehicleName.toLowerCase().includes(searchLower) ||
      new Date(inspection.date).toLocaleDateString().toLowerCase().includes(searchLower) ||
      (inspection.notes && inspection.notes.toLowerCase().includes(searchLower))
    );
  });

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
          Inspections
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/dashboard/book-inspection')}
        >
          Book New Inspection
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
        placeholder="Search inspections by vehicle name, date, or notes"
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

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="All" />
          <Tab label="Pending" />
          <Tab label="Passed" />
          <Tab label="Failed" />
        </Tabs>

        {filteredInspections.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <AssignmentIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              {searchTerm
                ? 'No inspections match your search'
                : tabValue === 0
                ? 'No inspections found'
                : `No ${tabValue === 1 ? 'pending' : tabValue === 2 ? 'passed' : 'failed'} inspections`}
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/dashboard/book-inspection')}
              sx={{ mt: 2 }}
            >
              Book New Inspection
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Vehicle</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInspections.map((inspection) => (
                  <TableRow key={inspection.id} hover>
                    <TableCell>
                      <Button
                        color="primary"
                        onClick={() => navigate(`/dashboard/vehicles/${inspection.vehicleId}`)}
                      >
                        {inspection.vehicleName}
                      </Button>
                    </TableCell>
                    <TableCell>{new Date(inspection.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={inspection.status}
                        color={getStatusColor(inspection.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {inspection.notes ? (
                        inspection.notes.length > 50
                          ? `${inspection.notes.substring(0, 50)}...`
                          : inspection.notes
                      ) : (
                        'No notes'
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate(`/dashboard/inspections/${inspection.id}`)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default InspectionsPage;