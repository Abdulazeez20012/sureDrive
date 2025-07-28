import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  /**
   * Optional message to display below the spinner
   */
  message?: string;
  
  /**
   * Size of the spinner in pixels
   * @default 40
   */
  size?: number;
  
  /**
   * Height of the container
   * @default '100%'
   */
  height?: string | number;
  
  /**
   * Whether to show the spinner with a full-page overlay
   * @default false
   */
  fullPage?: boolean;
}

/**
 * A reusable loading spinner component that can be used throughout the application
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 40,
  height = '100%',
  fullPage = false,
}) => {
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: height,
      }}
    >
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullPage) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
};

export default LoadingSpinner;