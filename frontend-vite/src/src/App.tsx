import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

// Theme Provider
import ThemeProvider from './theme/ThemeProvider';

// Notification Provider
import NotificationProvider from './components/providers/NotificationProvider';

// Router
import AppRouter from './router';

// Store
import useAuthStore from './stores/authStore';

function App() {
  const { token } = useAuthStore();

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  return (
    <ThemeProvider>
      <NotificationProvider>
        <Router>
          <AppRouter />
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;