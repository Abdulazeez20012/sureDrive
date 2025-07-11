import React from 'react';
import {
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
  Box,
  useTheme,
  Skeleton,
  SxProps,
  Theme,
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export interface BreadcrumbItem {
  /**
   * Label to display for the breadcrumb
   */
  label: string;
  
  /**
   * Path to navigate to when clicked
   * If not provided, the breadcrumb will be rendered as text
   */
  path?: string;
  
  /**
   * Icon to display before the label
   */
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  /**
   * Array of breadcrumb items to display
   * If not provided, breadcrumbs will be generated from the current route
   */
  items?: BreadcrumbItem[];
  
  /**
   * Whether to show the home icon at the beginning
   * @default true
   */
  showHomeIcon?: boolean;
  
  /**
   * Path for the home breadcrumb
   * @default '/'
   */
  homePath?: string;
  
  /**
   * Label for the home breadcrumb
   * @default 'Home'
   */
  homeLabel?: string;
  
  /**
   * Maximum number of breadcrumbs to display
   * If there are more breadcrumbs, they will be collapsed
   * @default 4
   */
  maxItems?: number;
  
  /**
   * Whether to show the breadcrumbs on a single line with ellipsis for overflow
   * @default false
   */
  singleLine?: boolean;
  
  /**
   * Whether to show a loading skeleton
   * @default false
   */
  loading?: boolean;
  
  /**
   * Additional styles for the breadcrumbs container
   */
  sx?: SxProps<Theme>;
}

/**
 * A reusable breadcrumbs component that integrates with React Router
 */
const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  showHomeIcon = true,
  homePath = '/',
  homeLabel = 'Home',
  maxItems = 4,
  singleLine = false,
  loading = false,
  sx,
}) => {
  const theme = useTheme();
  const location = useLocation();
  
  // Generate breadcrumbs from the current route if items are not provided
  const generateBreadcrumbsFromRoute = (): BreadcrumbItem[] => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    
    return pathnames.map((name, index) => {
      const path = `/${pathnames.slice(0, index + 1).join('/')}`;
      const label = name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
      
      return { label, path };
    });
  };
  
  const breadcrumbItems = items || generateBreadcrumbsFromRoute();
  
  // Add home item at the beginning if showHomeIcon is true
  const allItems: BreadcrumbItem[] = showHomeIcon
    ? [{ label: homeLabel, path: homePath, icon: <HomeIcon fontSize="small" /> }, ...breadcrumbItems]
    : breadcrumbItems;
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', ...sx }}>
        <Skeleton width={100} height={24} sx={{ mr: 1 }} />
        <NavigateNextIcon fontSize="small" color="disabled" />
        <Skeleton width={120} height={24} sx={{ mx: 1 }} />
        <NavigateNextIcon fontSize="small" color="disabled" />
        <Skeleton width={80} height={24} sx={{ ml: 1 }} />
      </Box>
    );
  }
  
  return (
    <MuiBreadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
      maxItems={maxItems}
      sx={{
        '& .MuiBreadcrumbs-ol': {
          flexWrap: singleLine ? 'nowrap' : 'wrap',
        },
        '& .MuiBreadcrumbs-li': {
          whiteSpace: singleLine ? 'nowrap' : 'normal',
          overflow: singleLine ? 'hidden' : 'visible',
          textOverflow: singleLine ? 'ellipsis' : 'clip',
          maxWidth: singleLine ? '200px' : 'none',
        },
        ...sx,
      }}
    >
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1;
        
        const content = (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {item.icon && (
              <Box component="span" sx={{ display: 'flex', mr: 0.5, alignItems: 'center' }}>
                {item.icon}
              </Box>
            )}
            {item.label}
          </Box>
        );
        
        if (isLast) {
          return (
            <Typography
              key={item.label}
              color="text.primary"
              sx={{
                display: 'flex',
                alignItems: 'center',
                fontWeight: 500,
              }}
            >
              {content}
            </Typography>
          );
        }
        
        return item.path ? (
          <Link
            key={item.label}
            component={RouterLink}
            to={item.path}
            color="inherit"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {content}
          </Link>
        ) : (
          <Typography
            key={item.label}
            color="text.secondary"
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {content}
          </Typography>
        );
      })}
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;