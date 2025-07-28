import React from 'react';
import { Box, Typography, Tabs, Tab, useTheme, useMediaQuery } from '@mui/material';

interface TabPanelProps {
  /**
   * The content of the tab panel
   */
  children: React.ReactNode;
  
  /**
   * The index of the current tab
   */
  index: number;
  
  /**
   * The value of the currently selected tab
   */
  value: number;
  
  /**
   * Additional styles for the tab panel
   */
  sx?: React.ComponentProps<typeof Box>['sx'];
  
  /**
   * Whether to disable padding in the tab panel
   * @default false
   */
  disablePadding?: boolean;
}

/**
 * A single tab panel component that shows content when the tab is selected
 */
export const TabPanel: React.FC<TabPanelProps> = ({
  children,
  value,
  index,
  sx,
  disablePadding = false,
  ...other
}) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ ...(disablePadding ? {} : { p: 3 }), ...sx }}>
          {children}
        </Box>
      )}
    </div>
  );
};

interface TabItem {
  /**
   * Label for the tab
   */
  label: string;
  
  /**
   * Icon to display in the tab (optional)
   */
  icon?: React.ReactNode;
  
  /**
   * Content to display when the tab is selected
   */
  content: React.ReactNode;
  
  /**
   * Whether the tab is disabled
   * @default false
   */
  disabled?: boolean;
}

interface TabsContainerProps {
  /**
   * Array of tab items to display
   */
  tabs: TabItem[];
  
  /**
   * Initial selected tab index
   * @default 0
   */
  defaultTab?: number;
  
  /**
   * Function called when the selected tab changes
   */
  onChange?: (newValue: number) => void;
  
  /**
   * Whether to use vertical tabs on larger screens
   * @default false
   */
  vertical?: boolean;
  
  /**
   * Whether to stretch tabs to fill the available width
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Whether to center the tabs
   * @default false
   */
  centered?: boolean;
  
  /**
   * Whether to disable padding in the tab panels
   * @default false
   */
  disablePadding?: boolean;
  
  /**
   * Additional styles for the tabs container
   */
  sx?: React.ComponentProps<typeof Box>['sx'];
}

/**
 * A reusable tabs container component that manages tab state and renders tab panels
 */
const TabsContainer: React.FC<TabsContainerProps> = ({
  tabs,
  defaultTab = 0,
  onChange,
  vertical = false,
  fullWidth = false,
  centered = false,
  disablePadding = false,
  sx,
}) => {
  const [value, setValue] = React.useState(defaultTab);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Force horizontal layout on mobile regardless of vertical prop
  const orientation = vertical && !isMobile ? 'vertical' : 'horizontal';
  
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: orientation === 'vertical' ? 'row' : 'column',
        width: '100%',
        ...sx,
      }}
    >
      <Box
        sx={{
          borderBottom: orientation === 'horizontal' ? 1 : 0,
          borderRight: orientation === 'vertical' ? 1 : 0,
          borderColor: 'divider',
          ...(orientation === 'vertical' && {
            minWidth: { xs: '100%', md: 200 },
            maxWidth: { xs: '100%', md: 300 },
          }),
        }}
      >
        <Tabs
          orientation={orientation}
          value={value}
          onChange={handleChange}
          aria-label="tabs"
          variant={fullWidth ? 'fullWidth' : 'standard'}
          centered={centered && orientation === 'horizontal'}
          sx={{
            ...(orientation === 'vertical' && {
              '& .MuiTabs-indicator': {
                left: 0,
                right: 'auto',
              },
            }),
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
              disabled={tab.disabled}
              id={`tab-${index}`}
              aria-controls={`tabpanel-${index}`}
            />
          ))}
        </Tabs>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        {tabs.map((tab, index) => (
          <TabPanel 
            key={index} 
            value={value} 
            index={index}
            disablePadding={disablePadding}
          >
            {tab.content}
          </TabPanel>
        ))}
      </Box>
    </Box>
  );
};

export default TabsContainer;