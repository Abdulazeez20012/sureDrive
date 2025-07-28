import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CardActionArea
} from '@mui/material';
import { 
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DirectionsCar as CarIcon,
  EventNote as EventNoteIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface VehicleCardProps {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  status: 'active' | 'maintenance' | 'inactive';
  lastInspection?: string;
  imageUrl?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onBookInspection?: (id: string) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  id,
  make,
  model,
  year,
  licensePlate,
  status,
  lastInspection,
  imageUrl,
  onEdit,
  onDelete,
  onBookInspection
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
  
  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleClose();
    if (onEdit) onEdit(id);
    else navigate(`/vehicles/${id}`);
  };
  
  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleClose();
    if (onDelete) onDelete(id);
  };
  
  const handleBookInspection = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleClose();
    if (onBookInspection) onBookInspection(id);
    else navigate(`/inspections/book?vehicleId=${id}`);
  };
  
  const handleCardClick = () => {
    navigate(`/vehicles/${id}`);
  };
  
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'success';
      case 'maintenance':
        return 'warning';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea onClick={handleCardClick}>
        <CardMedia
          component="div"
          sx={{
            height: 140,
            bgcolor: 'grey.200',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          image={imageUrl}
        >
          {!imageUrl && <CarIcon sx={{ fontSize: 60, color: 'grey.400' }} />}
        </CardMedia>
      </CardActionArea>
      
      <CardContent sx={{ flexGrow: 1, position: 'relative', pt: 2 }}>
        <IconButton
          aria-label="more"
          id={`vehicle-menu-${id}`}
          aria-controls={open ? `vehicle-menu-${id}` : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <MoreVertIcon />
        </IconButton>
        
        <Menu
          id={`vehicle-menu-${id}`}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': `vehicle-menu-${id}`,
          }}
        >
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleBookInspection}>
            <ListItemIcon>
              <EventNoteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Book Inspection</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText sx={{ color: 'error.main' }}>Delete</ListItemText>
          </MenuItem>
        </Menu>
        
        <CardActionArea onClick={handleCardClick}>
          <Typography variant="h6" component="div" gutterBottom noWrap>
            {make} {model}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {year} • {licensePlate}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Chip 
              label={status.charAt(0).toUpperCase() + status.slice(1)} 
              color={getStatusColor()} 
              size="small" 
              variant="outlined"
            />
            
            {lastInspection && (
              <Typography variant="caption" color="text.secondary">
                Last inspection: {lastInspection}
              </Typography>
            )}
          </Box>
        </CardActionArea>
      </CardContent>
    </Card>
  );
};

export default VehicleCard;