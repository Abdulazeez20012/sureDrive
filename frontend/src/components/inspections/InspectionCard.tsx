import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CardActionArea,
  Divider
} from '@mui/material';
import { 
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Cancel as CancelIcon,
  Print as PrintIcon,
  DirectionsCar as CarIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/helpers';

interface InspectionCardProps {
  id: string;
  vehicleName: string;
  vehicleId: string;
  date: string;
  status: 'pending' | 'passed' | 'failed' | 'cancelled';
  inspectorName?: string;
  notes?: string;
  onCancel?: (id: string) => void;
  onPrint?: (id: string) => void;
}

const InspectionCard: React.FC<InspectionCardProps> = ({
  id,
  vehicleName,
  vehicleId,
  date,
  status,
  inspectorName,
  notes,
  onCancel,
  onPrint
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleView = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleClose();
    navigate(`/inspections/${id}`);
  };
  
  const handleCancel = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleClose();
    if (onCancel) onCancel(id);
  };
  
  const handlePrint = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleClose();
    if (onPrint) onPrint(id);
  };
  
  const handleCardClick = () => {
    navigate(`/inspections/${id}`);
  };
  
  const handleVehicleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/vehicles/${vehicleId}`);
  };
  
  const getStatusColor = () => {
    switch (status) {
      case 'passed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      case 'cancelled':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusLabel = () => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea onClick={handleCardClick}>
        <Box sx={{ 
          p: 2, 
          bgcolor: 'primary.main', 
          color: 'primary.contrastText',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="subtitle1" fontWeight="medium">
            Inspection #{id.slice(-5)}
          </Typography>
          <Chip 
            label={getStatusLabel()} 
            color={getStatusColor()} 
            size="small" 
            sx={{ 
              fontWeight: 'medium',
              '& .MuiChip-label': { px: 1 }
            }}
          />
        </Box>
      </CardActionArea>
      
      <CardContent sx={{ flexGrow: 1, position: 'relative', pt: 2 }}>
        <IconButton
          aria-label="more"
          id={`inspection-menu-${id}`}
          aria-controls={open ? `inspection-menu-${id}` : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <MoreVertIcon />
        </IconButton>
        
        <Menu
          id={`inspection-menu-${id}`}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': `inspection-menu-${id}`,
          }}
        >
          <MenuItem onClick={handleView}>
            <ListItemIcon>
              <VisibilityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Details</ListItemText>
          </MenuItem>
          {status !== 'cancelled' && status === 'pending' && (
            <MenuItem onClick={handleCancel}>
              <ListItemIcon>
                <CancelIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText sx={{ color: 'error.main' }}>Cancel</ListItemText>
            </MenuItem>
          )}
          {(status === 'passed' || status === 'failed') && (
            <MenuItem onClick={handlePrint}>
              <ListItemIcon>
                <PrintIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Print Report</ListItemText>
            </MenuItem>
          )}
        </Menu>
        
        <CardActionArea onClick={handleCardClick}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CarIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />
            <Typography 
              variant="body1" 
              component="div" 
              sx={{ 
                fontWeight: 'medium',
                textDecoration: 'underline',
                cursor: 'pointer',
                '&:hover': { color: 'primary.main' }
              }}
              onClick={handleVehicleClick}
            >
              {vehicleName}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CalendarIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {formatDate(date)}
            </Typography>
          </Box>
          
          {inspectorName && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Inspector: {inspectorName}
              </Typography>
            </Box>
          )}
          
          {notes && (
            <>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="text.secondary" sx={{ 
                mt: 1,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {notes}
              </Typography>
            </>
          )}
        </CardActionArea>
      </CardContent>
    </Card>
  );
};

export default InspectionCard;