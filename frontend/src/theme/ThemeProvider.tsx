import React from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, Theme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

declare module '@mui/material/styles' {
  interface Palette {
    customColors?: {
      lightBlue: string;
      darkBlue: string;
      lightGray: string;
    };
  }
  interface PaletteOptions {
    customColors?: {
      lightBlue: string;
      darkBlue: string;
      lightGray: string;
    };
  }
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
      },
      secondary: {
        main: '#dc004e',
        light: '#ff4081',
        dark: '#c51162',
      },
      background: {
        default: '#f5f5f5',
        paper: '#ffffff',
      },
      customColors: {
        lightBlue: '#e3f2fd',
        darkBlue: '#0d47a1',
        lightGray: '#f0f0f0',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 500,
        fontSize: '2.5rem',
      },
      h2: {
        fontWeight: 500,
        fontSize: '2rem',
      },
      h3: {
        fontWeight: 500,
        fontSize: '1.75rem',
      },
      h4: {
        fontWeight: 500,
        fontSize: '1.5rem',
      },
      h5: {
        fontWeight: 500,
        fontSize: '1.25rem',
      },
      h6: {
        fontWeight: 500,
        fontSize: '1rem',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
    },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
