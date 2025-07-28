import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  SxProps,
  Theme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export interface EnhancedAccordionProps {
  /**
   * Unique identifier for the accordion
   */
  id: string;
  
  /**
   * Title of the accordion
   */
  title: React.ReactNode;
  
  /**
   * Subtitle to display under the title
   */
  subtitle?: React.ReactNode;
  
  /**
   * Content to display when the accordion is expanded
   */
  children: React.ReactNode;
  
  /**
   * Whether the accordion is expanded by default
   * @default false
   */
  defaultExpanded?: boolean;
  
  /**
   * Whether the accordion is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Whether to show a divider between the summary and details
   * @default true
   */
  showDivider?: boolean;
  
  /**
   * Icon to display before the title
   */
  icon?: React.ReactNode;
  
  /**
   * Badge or chip to display next to the title
   */
  badge?: React.ReactNode;
  
  /**
   * Text to display as a chip next to the title
   */
  chipLabel?: string;
  
  /**
   * Color of the chip
   * @default 'default'
   */
  chipColor?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  
  /**
   * Whether to show the info button
   * @default false
   */
  showInfoButton?: boolean;
  
  /**
   * Tooltip text for the info button
   */
  infoTooltip?: string;
  
  /**
   * Function to call when the info button is clicked
   */
  onInfoClick?: () => void;
  
  /**
   * Whether to show the edit button
   * @default false
   */
  showEditButton?: boolean;
  
  /**
   * Tooltip text for the edit button
   * @default 'Edit'
   */
  editTooltip?: string;
  
  /**
   * Function to call when the edit button is clicked
   */
  onEditClick?: () => void;
  
  /**
   * Whether to show the delete button
   * @default false
   */
  showDeleteButton?: boolean;
  
  /**
   * Tooltip text for the delete button
   * @default 'Delete'
   */
  deleteTooltip?: string;
  
  /**
   * Function to call when the delete button is clicked
   */
  onDeleteClick?: () => void;
  
  /**
   * Function to call when the accordion is expanded or collapsed
   */
  onChange?: (event: React.SyntheticEvent, expanded: boolean) => void;
  
  /**
   * Additional styles for the accordion
   */
  sx?: SxProps<Theme>;
  
  /**
   * Additional styles for the accordion summary
   */
  summarySx?: SxProps<Theme>;
  
  /**
   * Additional styles for the accordion details
   */
  detailsSx?: SxProps<Theme>;
}

/**
 * An enhanced accordion component that extends Material UI's Accordion with additional features
 */
const EnhancedAccordion: React.FC<EnhancedAccordionProps> = ({
  id,
  title,
  subtitle,
  children,
  defaultExpanded = false,
  disabled = false,
  showDivider = true,
  icon,
  badge,
  chipLabel,
  chipColor = 'default',
  showInfoButton = false,
  infoTooltip = 'More information',
  onInfoClick,
  showEditButton = false,
  editTooltip = 'Edit',
  onEditClick,
  showDeleteButton = false,
  deleteTooltip = 'Delete',
  onDeleteClick,
  onChange,
  sx,
  summarySx,
  detailsSx,
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded);
  
  // Handle accordion expansion change
  const handleChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
    if (onChange) {
      onChange(event, isExpanded);
    }
  };
  
  // Handle action button clicks without triggering accordion expansion
  const handleActionClick = (callback?: () => void) => (event: React.MouseEvent) => {
    event.stopPropagation();
    if (callback) {
      callback();
    }
  };
  
  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange}
      disabled={disabled}
      disableGutters
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: `${theme.shape.borderRadius}px !important`,
        '&:before': {
          display: 'none',
        },
        mb: 2,
        ...sx,
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${id}-content`}
        id={`${id}-header`}
        sx={{
          padding: theme.spacing(1, 2),
          '&.Mui-expanded': {
            minHeight: 48,
          },
          '& .MuiAccordionSummary-content': {
            margin: theme.spacing(1, 0),
            '&.Mui-expanded': {
              margin: theme.spacing(1, 0),
            },
          },
          backgroundColor: expanded
            ? alpha(theme.palette.primary.main, 0.04)
            : 'transparent',
          ...summarySx,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          {icon && (
            <Box
              sx={{
                mr: 2,
                color: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {icon}
            </Box>
          )}
          
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="subtitle1" component="div">
                {title}
              </Typography>
              
              {chipLabel && (
                <Chip
                  label={chipLabel}
                  size="small"
                  color={chipColor}
                  sx={{ ml: 1 }}
                />
              )}
              
              {badge && (
                <Box sx={{ ml: 1 }}>
                  {badge}
                </Box>
              )}
            </Box>
            
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            {showInfoButton && (
              <Tooltip title={infoTooltip} arrow>
                <IconButton
                  size="small"
                  onClick={handleActionClick(onInfoClick)}
                  sx={{ ml: 0.5 }}
                >
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            
            {showEditButton && (
              <Tooltip title={editTooltip} arrow>
                <IconButton
                  size="small"
                  onClick={handleActionClick(onEditClick)}
                  sx={{ ml: 0.5 }}
                >
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            
            {showDeleteButton && (
              <Tooltip title={deleteTooltip} arrow>
                <IconButton
                  size="small"
                  onClick={handleActionClick(onDeleteClick)}
                  color="error"
                  sx={{ ml: 0.5 }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </AccordionSummary>
      
      {showDivider && expanded && <Divider />}
      
      <AccordionDetails
        sx={{
          padding: theme.spacing(2),
          ...detailsSx,
        }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
};

export default EnhancedAccordion;