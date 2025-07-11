import React from 'react';
import { Alert, AlertTitle, Button, Box, Typography } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

interface ErrorDisplayProps {
  /**
   * The error message to display
   */
  message: string;
  
  /**
   * Optional error title
   * @default 'Error'
   */
  title?: string;
  
  /**
   * Optional retry function to call when the retry button is clicked
   */
  onRetry?: () => void;
  
  /**
   * Whether to show a retry button
   * @default false
   */
  showRetry?: boolean;
  
  /**
   * Optional additional details about the error
   */
  details?: string;
  
  /**
   * Whether to show the error in a more prominent way
   * @default false
   */
  prominent?: boolean;
}

/**
 * A reusable error display component that can be used throughout the application
 */
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message,
  title = 'Error',
  onRetry,
  showRetry = false,
  details,
  prominent = false,
}) => {
  if (prominent) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          p: 3,
          my: 2,
        }}
      >
        <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h5" color="error" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" paragraph>
          {message}
        </Typography>
        {details && (
          <Typography variant="body2" color="text.secondary" paragraph>
            {details}
          </Typography>
        )}
        {showRetry && onRetry && (
          <Button
            variant="contained"
            color="primary"
            onClick={onRetry}
            sx={{ mt: 2 }}
          >
            Try Again
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Alert
      severity="error"
      sx={{ mb: 2 }}
      action={
        showRetry && onRetry ? (
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        ) : undefined
      }
    >
      <AlertTitle>{title}</AlertTitle>
      {message}
      {details && (
        <Typography variant="body2" sx={{ mt: 1, fontSize: '0.875rem' }}>
          {details}
        </Typography>
      )}
    </Alert>
  );
};

export default ErrorDisplay;