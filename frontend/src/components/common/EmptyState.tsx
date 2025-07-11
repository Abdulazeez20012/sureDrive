import React from 'react';
import { Box, Typography, Button, Paper, SxProps, Theme } from '@mui/material';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  sx?: SxProps<Theme>;
  fullPage?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText,
  onAction,
  sx,
  fullPage = false,
}) => {
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 4,
        ...sx,
      }}
    >
      {icon && <Box sx={{ mb: 2, color: 'text.secondary' }}>{icon}</Box>}
      
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
          {description}
        </Typography>
      )}
      
      {actionText && onAction && (
        <Button variant="contained" onClick={onAction}>
          {actionText}
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
        <Paper elevation={0} sx={{ maxWidth: 500, width: '100%' }}>
          {content}
        </Paper>
      </Box>
    );
  }

  return <Paper elevation={0}>{content}</Paper>;
};

export default EmptyState;