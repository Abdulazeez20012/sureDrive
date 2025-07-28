import React, { useContext } from 'react';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import { Brightness4 as DarkModeIcon, Brightness7 as LightModeIcon } from '@mui/icons-material';
import { ColorModeContext } from '../../theme/ThemeProvider';

interface ThemeToggleProps {
  /**
   * Optional tooltip text to display when hovering over the toggle button
   */
  tooltipText?: string;
}

/**
 * A component that provides a toggle button to switch between light and dark themes
 */
const ThemeToggle: React.FC<ThemeToggleProps> = ({ tooltipText = 'Toggle light/dark theme' }) => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  
  return (
    <Tooltip title={tooltipText}>
      <IconButton onClick={colorMode.toggleColorMode} color="inherit">
        {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;