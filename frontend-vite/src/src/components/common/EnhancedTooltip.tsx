import React from 'react';
import {
  Tooltip,
  TooltipProps,
  styled,
  tooltipClasses,
  Typography,
  Box,
  IconButton,
  useTheme,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

// Styled tooltip with arrow and custom styling
const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.mode === 'dark' 
      ? theme.palette.grey[800] 
      : theme.palette.grey[700],
    color: theme.palette.common.white,
    maxWidth: 300,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid',
    borderColor: theme.palette.mode === 'dark' 
      ? theme.palette.grey[700] 
      : theme.palette.grey[600],
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1.5),
    boxShadow: theme.shadows[2],
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.mode === 'dark' 
      ? theme.palette.grey[800] 
      : theme.palette.grey[700],
    '&:before': {
      border: '1px solid',
      borderColor: theme.palette.mode === 'dark' 
        ? theme.palette.grey[700] 
        : theme.palette.grey[600],
      backgroundColor: theme.palette.mode === 'dark' 
        ? theme.palette.grey[800] 
        : theme.palette.grey[700],
    },
  },
}));

export interface EnhancedTooltipProps extends Omit<TooltipProps, 'title'> {
  /**
   * The tooltip title. Can be a string or a React node.
   */
  title: React.ReactNode;
  
  /**
   * Optional subtitle for additional context
   */
  subtitle?: React.ReactNode;
  
  /**
   * Whether to show an info icon that triggers the tooltip
   * @default false
   */
  showInfoIcon?: boolean;
  
  /**
   * The type of icon to show when showInfoIcon is true
   * @default 'info'
   */
  iconType?: 'info' | 'help';
  
  /**
   * The size of the icon when showInfoIcon is true
   * @default 'small'
   */
  iconSize?: 'small' | 'medium' | 'large';
  
  /**
   * The color of the icon when showInfoIcon is true
   * @default 'info'
   */
  iconColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'inherit';
  
  /**
   * Whether to show the tooltip with a styled appearance
   * @default true
   */
  styled?: boolean;
}

/**
 * An enhanced tooltip component that extends Material UI's Tooltip with additional features
 */
const EnhancedTooltip: React.FC<EnhancedTooltipProps> = ({
  children,
  title,
  subtitle,
  showInfoIcon = false,
  iconType = 'info',
  iconSize = 'small',
  iconColor = 'info',
  styled: isStyled = true,
  placement = 'top',
  arrow = true,
  ...tooltipProps
}) => {
  const theme = useTheme();
  
  // Format the tooltip content with title and optional subtitle
  const tooltipContent = (
    <Box>
      <Typography variant="body2" fontWeight={500}>
        {title}
      </Typography>
      {subtitle && (
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block', 
            mt: 0.5,
            opacity: 0.9,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
  
  // Choose the appropriate icon based on iconType
  const getIcon = () => {
    switch (iconType) {
      case 'help':
        return <HelpOutlineIcon fontSize={iconSize} />;
      case 'info':
      default:
        return <InfoOutlinedIcon fontSize={iconSize} />;
    }
  };
  
  // If showInfoIcon is true, render just the icon with the tooltip
  if (showInfoIcon) {
    const TooltipComponent = isStyled ? StyledTooltip : Tooltip;
    
    return (
      <TooltipComponent
        title={tooltipContent}
        placement={placement}
        arrow={arrow}
        {...tooltipProps}
      >
        <IconButton 
          size="small" 
          color={iconColor}
          sx={{ 
            p: 0.5,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          {getIcon()}
        </IconButton>
      </TooltipComponent>
    );
  }
  
  // Otherwise, wrap the children with the tooltip
  const TooltipComponent = isStyled ? StyledTooltip : Tooltip;
  
  return (
    <TooltipComponent
      title={tooltipContent}
      placement={placement}
      arrow={arrow}
      {...tooltipProps}
    >
      {/* Ensure the children can receive focus and mouse events */}
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<any>, {
            // Ensure the element can be focused for keyboard users
            tabIndex: (children.props as any).tabIndex || 0,
          })
        : <span>{children}</span>}
    </TooltipComponent>
  );
};

export default EnhancedTooltip;