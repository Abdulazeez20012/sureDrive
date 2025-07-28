import React from 'react';
import { Alert, Snackbar, AlertColor } from '@mui/material';

interface NotificationProps {
  open: boolean;
  message: string;
  severity?: AlertColor;
  autoHideDuration?: number;
  onClose: () => void;
  vertical?: 'top' | 'bottom';
  horizontal?: 'left' | 'center' | 'right';
}

const Notification: React.FC<NotificationProps> = ({
  open,
  message,
  severity = 'success',
  autoHideDuration = 6000,
  onClose,
  vertical = 'bottom',
  horizontal = 'center',
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical, horizontal }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;