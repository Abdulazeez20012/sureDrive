import React from 'react';
import { Box, Typography, Button, Paper, SxProps, Theme } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

interface ErrorStateProps {
  message?: string;
  fullPage?: boolean;
  onRetry?: () => void;
  sx?: SxProps<Theme>;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Something went wrong. Please try again.',
  fullPage = false,
  onRetry,
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
      <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
      <Typography variant="h6" align="center" gutterBottom>
        Error
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
        {message}
      </Typography>
      {onRetry && (
        <Button variant="contained" onClick={onRetry}>
          Try Again
        </Button>
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
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, maxWidth: 500 }}>
          {content}
        </Paper>
      </Box>
    );
  }

  return content;
};

export default ErrorState;