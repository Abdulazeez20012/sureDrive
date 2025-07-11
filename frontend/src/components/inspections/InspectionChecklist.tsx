import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Paper,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  CheckCircle as PassedIcon,
  Cancel as FailedIcon,
  HourglassEmpty as PendingIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';

export interface ChecklistItem {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'pending';
  notes?: string;
}

interface InspectionChecklistProps {
  items: ChecklistItem[];
  title?: string;
}

const InspectionChecklist: React.FC<InspectionChecklistProps> = ({
  items,
  title = 'Inspection Checklist',
}) => {
  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <PassedIcon color="success" />;
      case 'failed':
        return <FailedIcon color="error" />;
      case 'pending':
      default:
        return <PendingIcon color="warning" />;
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'passed':
        return (
          <Chip
            label="Passed"
            size="small"
            color="success"
            variant="outlined"
          />
        );
      case 'failed':
        return (
          <Chip
            label="Failed"
            size="small"
            color="error"
            variant="outlined"
          />
        );
      case 'pending':
      default:
        return (
          <Chip
            label="Pending"
            size="small"
            color="warning"
            variant="outlined"
          />
        );
    }
  };

  return (
    <Paper elevation={0} variant="outlined" sx={{ p: 2 }}>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}

      <List disablePadding>
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 && <Divider component="li" />}
            <ListItem
              alignItems="flex-start"
              secondaryAction={
                item.notes ? (
                  <IconButton
                    edge="end"
                    onClick={() => toggleItem(item.id)}
                    size="small"
                  >
                    {expandedItems[item.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                ) : (
                  getStatusChip(item.status)
                )
              }
            >
              <ListItemIcon>{getStatusIcon(item.status)}</ListItemIcon>
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{
                  fontWeight: item.status === 'failed' ? 'medium' : 'regular',
                }}
                secondary={
                  item.notes && expandedItems[item.id] ? null : item.notes ? 'Click to view notes' : null
                }
              />
              {item.notes && item.status !== 'pending' && (
                <Box sx={{ display: { xs: 'none', sm: 'block' }, ml: 2 }}>
                  {getStatusChip(item.status)}
                </Box>
              )}
            </ListItem>

            {item.notes && (
              <Collapse in={expandedItems[item.id]} timeout="auto" unmountOnExit>
                <Box sx={{ pl: 9, pr: 2, pb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {item.notes}
                  </Typography>
                </Box>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>

      {items.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
          No checklist items available
        </Typography>
      )}
    </Paper>
  );
};

export default InspectionChecklist;