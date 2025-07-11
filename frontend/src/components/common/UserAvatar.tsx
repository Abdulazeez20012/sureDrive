import React from 'react';
import {
  Avatar,
  Badge,
  Tooltip,
  Box,
  AvatarProps,
  useTheme,
} from '@mui/material';

interface UserAvatarProps extends Omit<AvatarProps, 'src'> {
  /**
   * User's name (used for generating initials and tooltip)
   */
  name?: string;
  
  /**
   * URL of the user's avatar image
   */
  src?: string;
  
  /**
   * Whether to show the user's status
   * @default false
   */
  showStatus?: boolean;
  
  /**
   * User's status
   * @default 'offline'
   */
  status?: 'online' | 'away' | 'busy' | 'offline';
  
  /**
   * Whether to show the user's name as a tooltip
   * @default true
   */
  showTooltip?: boolean;
  
  /**
   * Custom tooltip text (defaults to user's name)
   */
  tooltipText?: string;
  
  /**
   * Whether to use a random color based on the user's name
   * @default true
   */
  useRandomColor?: boolean;
  
  /**
   * Function to generate initials from the user's name
   * @default Takes first letter of first and last name
   */
  initialsGenerator?: (name: string) => string;
}

/**
 * A reusable avatar component for displaying user avatars with initials fallback
 */
const UserAvatar: React.FC<UserAvatarProps> = ({
  name = '',
  src,
  showStatus = false,
  status = 'offline',
  showTooltip = true,
  tooltipText,
  useRandomColor = true,
  initialsGenerator,
  sx,
  ...avatarProps
}) => {
  const theme = useTheme();
  
  // Generate initials from name
  const getInitials = (name: string): string => {
    if (!name) return '';
    if (initialsGenerator) return initialsGenerator(name);
    
    return name
      .split(' ')
      .map((part) => part[0])
      .filter((char) => char && /[A-Za-z]/.test(char))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };
  
  // Generate a deterministic color based on the name
  const getAvatarColor = (name: string): string => {
    if (!useRandomColor || !name) return theme.palette.primary.main;
    
    // Simple hash function to generate a number from a string
    const hash = name.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    // List of colors to choose from
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.success.main,
      '#9c27b0', // purple
      '#009688', // teal
      '#ff5722', // deep orange
      '#607d8b', // blue grey
    ];
    
    return colors[hash % colors.length];
  };
  
  // Get status color
  const getStatusColor = (): string => {
    switch (status) {
      case 'online':
        return theme.palette.success.main;
      case 'away':
        return theme.palette.warning.main;
      case 'busy':
        return theme.palette.error.main;
      case 'offline':
      default:
        return theme.palette.grey[500];
    }
  };
  
  const initials = getInitials(name);
  const avatarColor = getAvatarColor(name);
  
  const avatar = (
    <Avatar
      src={src}
      alt={name}
      sx={{
        bgcolor: !src ? avatarColor : undefined,
        ...sx,
      }}
      {...avatarProps}
    >
      {!src && initials}
    </Avatar>
  );
  
  const avatarWithStatus = showStatus ? (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant="dot"
      sx={{
        '& .MuiBadge-badge': {
          backgroundColor: getStatusColor(),
          boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
          width: 10,
          height: 10,
          borderRadius: '50%',
        },
      }}
    >
      {avatar}
    </Badge>
  ) : (
    avatar
  );
  
  return showTooltip ? (
    <Tooltip title={tooltipText || name} arrow>
      <Box sx={{ display: 'inline-block' }}>
        {avatarWithStatus}
      </Box>
    </Tooltip>
  ) : (
    avatarWithStatus
  );
};

export default UserAvatar;