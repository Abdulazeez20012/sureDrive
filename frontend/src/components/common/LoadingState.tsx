import React from 'react';
import { Box, CircularProgress, Typography, Paper, SxProps, Theme } from '@mui/material';

interface LoadingStateProps {
  message?: string;
  fullPage?: boolean;
  size?: number;
  sx?: SxProps<Theme>;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  fullPage = false,
  size = 40,
  sx,
}) => {
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        ...sx,
      }}
    >
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullPage) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 64px)', // Adjust for app bar height
        }}
      >
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
          {content}
        </Paper>
      </Box>
    );
  }

  return content;
};

export default LoadingState;