import React from 'react';
import Notification from '../common/Notification';
import useNotificationStore from '../../stores/notificationStore';

interface NotificationProviderProps {
  children: React.ReactNode;
}

const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { open, message, severity, autoHideDuration, vertical, horizontal, hideNotification } = 
    useNotificationStore();

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