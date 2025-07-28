import React from 'react';
import {
  Badge,
  BadgeProps,
  styled,
  useTheme,
  Tooltip,
  Box,
} from '@mui/material';

// Styled badge with pulse animation option
const StyledBadge = styled(Badge)<{ pulse?: string }>(({ theme, pulse }) => ({
  '& .MuiBadge-badge': {
    ...(pulse === 'true' && {
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    }),
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

export interface EnhancedBadgeProps extends Omit<BadgeProps, 'variant'> {
  /**
   * The variant of the badge
   * @default 'standard'
   */
  variant?: 'dot' | 'standard' | 'rounded' | 'pill';
  
  /**
   * Whether to show a pulse animation around the badge
   * @default false
   */
  pulse?: boolean;
  
  /**
   * Text to display in a tooltip when hovering over the badge
   */
  tooltipText?: React.ReactNode;
  
  /**
   * Whether to show the badge even if badgeContent is zero
   * @default false
   */
  showZero?: boolean;
  
  /**
   * Maximum value to display. If badgeContent exceeds this number, 
   * '{max}+' will be displayed
   * @default 99
   */
  max?: number;
  
  /**
   * Custom styles for the badge
   */
  badgeStyle?: React.CSSProperties;
}

/**
 * An enhanced badge component that extends Material UI's Badge with additional features
 */
const EnhancedBadge: React.FC<EnhancedBadgeProps> = ({
  children,
  badgeContent,
  variant = 'standard',
  pulse = false,
  tooltipText,
  showZero = false,
  max = 99,
  badgeStyle,
  color = 'primary',
  invisible,
  overlap = 'rectangular',
  anchorOrigin = { vertical: 'top', horizontal: 'right' },
  ...badgeProps
}) => {
  const theme = useTheme();
  
  // Determine if the badge should be invisible
  const isInvisible = invisible || (!showZero && badgeContent === 0);
  
  // Determine the variant styling
  const getVariantStyling = () => {
    switch (variant) {
      case 'rounded':
        return {
          borderRadius: theme.shape.borderRadius,
          padding: '0 6px',
          height: 'auto',
          minWidth: 20,
        };
      case 'pill':
        return {
          borderRadius: 12,
          padding: '0 8px',
          height: 24,
          minWidth: 24,
        };
      case 'dot':
        return {}; // Use default dot styling
      case 'standard':
      default:
        return {}; // Use default badge styling
    }
  };
  
  const badge = (
    <StyledBadge
      badgeContent={badgeContent}
      color={color}
      invisible={isInvisible}
      overlap={overlap}
      anchorOrigin={anchorOrigin}
      max={max}
      pulse={pulse ? 'true' : 'false'}
      componentsProps={{
        badge: {
          style: {
            ...getVariantStyling(),
            ...badgeStyle,
          },
        },
      }}
      {...badgeProps}
    >
      {children}
    </StyledBadge>
  );
  
  // Wrap with tooltip if tooltipText is provided
  if (tooltipText && !isInvisible) {
    return (
      <Tooltip title={tooltipText} arrow placement="top">
        <Box sx={{ display: 'inline-flex' }}>
          {badge}
        </Box>
      </Tooltip>
    );
  }
  
  return badge;
};

export default EnhancedBadge;