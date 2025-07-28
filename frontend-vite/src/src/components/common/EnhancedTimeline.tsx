import React from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  Typography,
  Box,
  Paper,
  useTheme,
  alpha,
  Chip,
  IconButton,
  Tooltip,
  SxProps,
  Theme,
} from '@mui/material';
import {
  InfoOutlined as InfoIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';

export interface TimelineItemData {
  /**
   * Unique identifier for the timeline item
   */
  id: string | number;
  
  /**
   * Title of the timeline item
   */
  title: string;
  
  /**
   * Description or content of the timeline item
   */
  content?: React.ReactNode;
  
  /**
   * Date or time to display
   */
  date?: string | Date;
  
  /**
   * Icon to display in the timeline dot
   */
  icon?: React.ReactNode;
  
  /**
   * Color of the timeline dot
   * @default 'primary'
   */
  dotColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'grey' | string;
  
  /**
   * Variant of the timeline dot
   * @default 'filled'
   */
  dotVariant?: 'filled' | 'outlined';
  
  /**
   * Whether the timeline item is active
   * @default false
   */
  active?: boolean;
  
  /**
   * Whether the timeline item is completed
   * @default false
   */
  completed?: boolean;
  
  /**
   * Status text to display as a chip
   */
  status?: string;
  
  /**
   * Color of the status chip
   * @default 'default'
   */
  statusColor?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  
  /**
   * Additional information or metadata
   */
  metadata?: Record<string, any>;
  
  /**
   * Whether to show the info button
   * @default false
   */
  showInfoButton?: boolean;
  
  /**
   * Function to call when the info button is clicked
   */
  onInfoClick?: () => void;
  
  /**
   * Whether to show the more options button
   * @default false
   */
  showMoreButton?: boolean;
  
  /**
   * Function to call when the more options button is clicked
   */
  onMoreClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface EnhancedTimelineProps {
  /**
   * Array of timeline items
   */
  items: TimelineItemData[];
  
  /**
   * Position of the timeline content
   * @default 'right'
   */
  position?: 'right' | 'left' | 'alternate';
  
  /**
   * Whether to show the opposite content (usually date/time)
   * @default true
   */
  showOppositeContent?: boolean;
  
  /**
   * Whether to use a paper container for each timeline item
   * @default true
   */
  usePaper?: boolean;
  
  /**
   * Whether to show connectors between timeline items
   * @default true
   */
  showConnectors?: boolean;
  
  /**
   * Format function for dates
   */
  dateFormatter?: (date: string | Date) => string;
  
  /**
   * Function to call when a timeline item is clicked
   */
  onItemClick?: (item: TimelineItemData) => void;
  
  /**
   * Additional styles for the timeline container
   */
  sx?: SxProps<Theme>;
}

/**
 * An enhanced timeline component that extends Material UI's Timeline with additional features
 */
const EnhancedTimeline: React.FC<EnhancedTimelineProps> = ({
  items,
  position = 'right',
  showOppositeContent = true,
  usePaper = true,
  showConnectors = true,
  dateFormatter,
  onItemClick,
  sx,
}) => {
  const theme = useTheme();
  
  // Format date using the provided formatter or default format
  const formatDate = (date: string | Date | undefined): string => {
    if (!date) return '';
    
    if (dateFormatter) {
      return dateFormatter(date);
    }
    
    // Default date formatting
    if (typeof date === 'string') {
      return date;
    }
    
    return new Date(date).toLocaleString();
  };
  
  // Get color for the timeline dot
  const getDotColor = (item: TimelineItemData): string => {
    if (!item.dotColor || item.dotColor === 'grey') {
      return theme.palette.grey[500];
    }

    const color = theme.palette[item.dotColor as keyof typeof theme.palette];

    if (color && typeof color === 'object' && 'main' in color) {
      return (color as { main: string }).main;
    }

    return item.dotColor;
  };
  
  return (
    <Timeline
      position={position}
      sx={{
        p: 0,
        m: 0,
        ...sx,
      } as any}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <TimelineItem key={item.id}>
            {showOppositeContent && (
              <TimelineOppositeContent
                sx={{
                  m: 'auto 0',
                  flex: 0.2,
                  padding: theme.spacing(1),
                  textAlign: position === 'alternate' ? (index % 2 === 0 ? 'right' : 'left') : position === 'left' ? 'right' : 'left',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {formatDate(item.date)}
                </Typography>
              </TimelineOppositeContent>
            )}
            
            <TimelineSeparator>
              <TimelineDot
                color={item.dotColor as any}
                variant={item.dotVariant}
                sx={{
                  backgroundColor: item.dotVariant === 'outlined' ? 'transparent' : getDotColor(item),
                  borderColor: getDotColor(item),
                  ...(item.active && {
                    boxShadow: `0 0 0 3px ${alpha(getDotColor(item), 0.2)}`,
                  }),
                }}
              >
                {item.icon}
              </TimelineDot>
              
              {!isLast && showConnectors && <TimelineConnector />}
            </TimelineSeparator>
            
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <Box
                onClick={() => onItemClick && onItemClick(item)}
                sx={{
                  cursor: onItemClick ? 'pointer' : 'default',
                }}
              >
                {usePaper ? (
                  <Paper
                    elevation={0}
                    variant="outlined"
                    sx={{
                      p: 2,
                      backgroundColor: item.active
                        ? alpha(theme.palette.primary.main, 0.04)
                        : undefined,
                      borderColor: item.active
                        ? theme.palette.primary.main
                        : undefined,
                    }}
                  >
                    {renderTimelineContent(item)}
                  </Paper>
                ) : (
                  renderTimelineContent(item)
                )}
              </Box>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
  
  // Helper function to render the content of a timeline item
  function renderTimelineContent(item: TimelineItemData) {
    return (
      <>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: item.content ? 1 : 0,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" component="div">
              {item.title}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            {item.status && (
              <Chip
                label={item.status}
                size="small"
                color={item.statusColor}
                sx={{ mr: 1 }}
              />
            )}
            
            {item.showInfoButton && (
              <Tooltip title="More information" arrow>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.onInfoClick) item.onInfoClick();
                  }}
                >
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            
            {item.showMoreButton && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.onMoreClick) item.onMoreClick(e);
                }}
              >
                <MoreIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>
        
        {item.content && (
          <Typography variant="body2" color="text.secondary">
            {item.content}
          </Typography>
        )}
      </>
    );
  }
};

export default EnhancedTimeline;