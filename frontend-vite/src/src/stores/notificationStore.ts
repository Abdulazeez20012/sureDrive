import { create } from 'zustand';
import { AlertColor } from '@mui/material';

interface NotificationState {
  open: boolean;
  message: string;
  severity: AlertColor;
  autoHideDuration: number;
  vertical: 'top' | 'bottom';
  horizontal: 'left' | 'center' | 'right';
  
  // Actions
  showNotification: (params: {
    message: string;
    severity?: AlertColor;
    autoHideDuration?: number;
    vertical?: 'top' | 'bottom';
    horizontal?: 'left' | 'center' | 'right';
  }) => void;
  hideNotification: () => void;
  
  // Convenience methods
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

const useNotificationStore = create<NotificationState>((set) => ({
  open: false,
  message: '',
  severity: 'info',
  autoHideDuration: 6000,
  vertical: 'bottom',
  horizontal: 'center',
  
  showNotification: ({ 
    message, 
    severity = 'info', 
    autoHideDuration = 6000,
    vertical = 'bottom',
    horizontal = 'center'
  }) => set({
    open: true,
    message,
    severity,
    autoHideDuration,
    vertical,
    horizontal
  }),
  
  hideNotification: () => set({ open: false }),
  
  showSuccess: (message, duration) => set({
    open: true,
    message,
    severity: 'success',
    autoHideDuration: duration || 6000
  }),
  
  showError: (message, duration) => set({
    open: true,
    message,
    severity: 'error',
    autoHideDuration: duration || 8000 // Longer duration for errors
  }),
  
  showWarning: (message, duration) => set({
    open: true,
    message,
    severity: 'warning',
    autoHideDuration: duration || 6000
  }),
  
  showInfo: (message, duration) => set({
    open: true,
    message,
    severity: 'info',
    autoHideDuration: duration || 6000
  }),
}));

export default useNotificationStore;