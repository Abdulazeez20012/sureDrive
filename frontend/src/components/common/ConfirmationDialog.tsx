import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress,
} from '@mui/material';

interface ConfirmationDialogProps {
  /**
   * Whether the dialog is open
   */
  open: boolean;
  
  /**
   * Title of the dialog
   */
  title: string;
  
  /**
   * Message to display in the dialog
   */
  message: string;
  
  /**
   * Function to call when the confirm button is clicked
   */
  onConfirm: () => void;
  
  /**
   * Function to call when the cancel button is clicked or the dialog is closed
   */
  onCancel: () => void;
  
  /**
   * Text for the confirm button
   * @default 'Confirm'
   */
  confirmText?: string;
  
  /**
   * Text for the cancel button
   * @default 'Cancel'
   */
  cancelText?: string;
  
  /**
   * Whether the confirm action is destructive (will style the button as error)
   * @default false
   */
  isDestructive?: boolean;
  
  /**
   * Whether the confirm action is in progress
   * @default false
   */
  loading?: boolean;
}

/**
 * A reusable confirmation dialog component
 */
const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  loading = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onCancel}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmation-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          color={isDestructive ? 'error' : 'primary'}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : undefined}
          autoFocus
        >
          {loading ? 'Processing...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;