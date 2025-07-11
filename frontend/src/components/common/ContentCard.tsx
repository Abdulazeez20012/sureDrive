import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Divider,
  Box,
  Collapse,
  CardProps,
  Skeleton,
  useTheme,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';

interface ContentCardProps extends Omit<CardProps, 'title'> {
  /**
   * Card title
   */
  title?: React.ReactNode;
  
  /**
   * Card subtitle
   */
  subtitle?: React.ReactNode;
  
  /**
   * Card content
   */
  children: React.ReactNode;
  
  /**
   * Actions to display in the card header
   */
  headerActions?: React.ReactNode;
  
  /**
   * Actions to display in the card footer
   */
  footerActions?: React.ReactNode;
  
  /**
   * Whether the card is loading
   * @default false
   */
  loading?: boolean;
  
  /**
   * Whether the card is collapsible
   * @default false
   */
  collapsible?: boolean;
  
  /**
   * Whether the card is initially expanded (when collapsible)
   * @default true
   */
  defaultExpanded?: boolean;
  
  /**
   * Whether to show a divider between header and content
   * @default true
   */
  headerDivider?: boolean;
  
  /**
   * Whether to show a divider between content and footer
   * @default true
   */
  footerDivider?: boolean;
  
  /**
   * Custom styles for the card content
   */
  contentSx?: React.ComponentProps<typeof CardContent>['sx'];
}

/**
 * A reusable card component for displaying content with consistent styling
 */
const ContentCard: React.FC<ContentCardProps> = ({
  title,
  subtitle,
  children,
  headerActions,
  footerActions,
  loading = false,
  collapsible = false,
  defaultExpanded = true,
  headerDivider = true,
  footerDivider = true,
  contentSx,
  sx,
  ...cardProps
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = React.useState(defaultExpanded);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const renderHeader = () => {
    if (!title && !subtitle && !headerActions && !collapsible) return null;

    return (
      <CardHeader
        title={
          loading ? (
            <Skeleton variant="text" width="60%" height={28} />
          ) : (
            title
          )
        }
        subheader={
          loading && subtitle ? (
            <Skeleton variant="text" width="40%" height={20} />
          ) : (
            subtitle
          )
        }
        action={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {loading ? (
              <Skeleton variant="circular" width={32} height={32} />
            ) : (
              <>
                {headerActions}
                {collapsible && (
                  <IconButton
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                    size="small"
                  >
                    {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                )}
              </>
            )}
          </Box>
        }
      />
    );
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
      {...cardProps}
    >
      {renderHeader()}
      
      {headerDivider && (title || subtitle || headerActions) && <Divider />}
      
      <Collapse in={!collapsible || expanded} timeout="auto" sx={{ flexGrow: 1 }}>
        <CardContent
          sx={{
            height: '100%',
            ...(loading && {
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }),
            ...contentSx,
          }}
        >
          {loading ? (
            <>
              <Skeleton variant="text" height={20} width="100%" />
              <Skeleton variant="text" height={20} width="90%" />
              <Skeleton variant="text" height={20} width="95%" />
              <Skeleton variant="rectangular" height={100} width="100%" />
            </>
          ) : (
            children
          )}
        </CardContent>
      </Collapse>
      
      {footerActions && (
        <>
          {footerDivider && <Divider />}
          <CardActions sx={{ justifyContent: 'flex-end', p: 1 }}>
            {loading ? (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Skeleton variant="rounded" width={80} height={36} />
                <Skeleton variant="rounded" width={80} height={36} />
              </Box>
            ) : (
              footerActions
            )}
          </CardActions>
        </>
      )}
    </Card>
  );
};

export default ContentCard;