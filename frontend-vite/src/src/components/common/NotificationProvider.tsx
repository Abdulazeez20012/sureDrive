import React from 'react';
import Notification from './Notification';
import useNotificationStore from '../../stores/notificationStore';

/**
 * Global notification provider that connects the notification store to the Notification component
 * This component should be placed near the root of your application
 */
const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    open, 
    message, 
    severity, 
    autoHideDuration, 
    hideNotification,
    vertical,
    horizontal
  } = useNotificationStore();

  return (
    <>
      {children}
      <Notification
        open={open}
        message={message}
        severity={severity}
        autoHideDuration={autoHideDuration}
        onClose={hideNotification}
        vertical={vertical}
        horizontal={horizontal}
      />
    </>
  );
};

export default NotificationProvider;