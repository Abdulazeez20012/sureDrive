import React, { useState } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  StepButton,
  Button,
  Typography,
  Box,
  Paper,
  useTheme,
  StepIconProps,
  styled,
  SxProps,
  Theme,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export interface StepItem {
  /**
   * Label for the step
   */
  label: string;
  
  /**
   * Optional description for the step
   */
  description?: string;
  
  /**
   * Content to display when the step is active
   */
  content?: React.ReactNode;
  
  /**
   * Whether the step is optional
   * @default false
   */
  optional?: boolean;
  
  /**
   * Whether the step has an error
   * @default false
   */
  error?: boolean;
  
  /**
   * Whether the step is completed
   * @default false
   */
  completed?: boolean;
  
  /**
   * Whether the step is disabled
   * @default false
   */
  disabled?: boolean;
}

// Custom step icon component
const CustomStepIcon = styled('div')<{
  completed?: boolean;
  active?: boolean;
  error?: boolean;
}>(({ theme, completed, active, error }) => ({
  width: 24,
  height: 24,
  borderRadius: '50%',
  backgroundColor: error
    ? theme.palette.error.main
    : completed
    ? theme.palette.success.main
    : active
    ? theme.palette.primary.main
    : theme.palette.mode === 'dark'
    ? theme.palette.grey[700]
    : theme.palette.grey[300],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: error || completed || active ? theme.palette.common.white : undefined,
}));

// Custom step icon component that integrates with Material UI's StepIcon
function StepIcon(props: StepIconProps & { error?: boolean }) {
  const { active, completed, error, icon } = props;
  
  return (
    <CustomStepIcon active={active} completed={completed} error={error}>
      {completed ? (
        <CheckIcon fontSize="small" />
      ) : error ? (
        <ErrorOutlineIcon fontSize="small" />
      ) : (
        <Typography variant="caption" color="inherit">
          {icon}
        </Typography>
      )}
    </CustomStepIcon>
  );
}

export interface EnhancedStepperProps {
  /**
   * Array of step items
   */
  steps: StepItem[];
  
  /**
   * Active step index
   * @default 0
   */
  activeStep?: number;
  
  /**
   * Whether to allow clicking on steps to navigate
   * @default false
   */
  allowClickNavigation?: boolean;
  
  /**
   * Whether to show the step content
   * @default true
   */
  showContent?: boolean;
  
  /**
   * Orientation of the stepper
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  
  /**
   * Alternative label placement for horizontal stepper
   * @default false
   */
  alternativeLabel?: boolean;
  
  /**
   * Whether to show navigation buttons
   * @default true
   */
  showNavigation?: boolean;
  
  /**
   * Text for the back button
   * @default 'Back'
   */
  backButtonText?: string;
  
  /**
   * Text for the next button
   * @default 'Next'
   */
  nextButtonText?: string;
  
  /**
   * Text for the finish button
   * @default 'Finish'
   */
  finishButtonText?: string;
  
  /**
   * Function to call when the active step changes
   */
  onStepChange?: (step: number) => void;
  
  /**
   * Function to call when the stepper is completed
   */
  onComplete?: () => void;
  
  /**
   * Whether to show a reset button when completed
   * @default false
   */
  showResetOnComplete?: boolean;
  
  /**
   * Text for the reset button
   * @default 'Reset'
   */
  resetButtonText?: string;
  
  /**
   * Whether to use a linear progression (can't skip steps)
   * @default true
   */
  linear?: boolean;
  
  /**
   * Additional styles for the stepper container
   */
  sx?: SxProps<Theme>;
}

/**
 * An enhanced stepper component that extends Material UI's Stepper with additional features
 */
const EnhancedStepper: React.FC<EnhancedStepperProps> = ({
  steps,
  activeStep: externalActiveStep,
  allowClickNavigation = false,
  showContent = true,
  orientation = 'horizontal',
  alternativeLabel = false,
  showNavigation = true,
  backButtonText = 'Back',
  nextButtonText = 'Next',
  finishButtonText = 'Finish',
  onStepChange,
  onComplete,
  showResetOnComplete = false,
  resetButtonText = 'Reset',
  linear = true,
  sx,
}) => {
  const theme = useTheme();
  const [internalActiveStep, setInternalActiveStep] = useState<number>(0);
  
  // Use external active step if provided, otherwise use internal state
  const activeStep = externalActiveStep !== undefined ? externalActiveStep : internalActiveStep;
  
  // Handle step change
  const handleStep = (step: number) => {
    if (!allowClickNavigation || (linear && step > activeStep + 1)) {
      return;
    }
    
    const newStep = step;
    setInternalActiveStep(newStep);
    
    if (onStepChange) {
      onStepChange(newStep);
    }
  };
  
  // Handle next button click
  const handleNext = () => {
    const newStep = activeStep + 1;
    setInternalActiveStep(newStep);
    
    if (onStepChange) {
      onStepChange(newStep);
    }
    
    if (newStep === steps.length && onComplete) {
      onComplete();
    }
  };
  
  // Handle back button click
  const handleBack = () => {
    const newStep = activeStep - 1;
    setInternalActiveStep(newStep);
    
    if (onStepChange) {
      onStepChange(newStep);
    }
  };
  
  // Handle reset button click
  const handleReset = () => {
    setInternalActiveStep(0);
    
    if (onStepChange) {
      onStepChange(0);
    }
  };
  
  // Check if all steps are completed
  const isStepperCompleted = activeStep === steps.length;
  
  return (
    <Box sx={{ width: '100%', ...sx }}>
      <Stepper
        activeStep={activeStep}
        orientation={orientation}
        alternativeLabel={orientation === 'horizontal' ? alternativeLabel : false}
        nonLinear={!linear}
      >
        {steps.map((step, index) => {
          const stepProps: { completed?: boolean; error?: boolean } = {};
          
          if (step.completed) stepProps.completed = true;
          if (step.error) stepProps.error = true;
          
          const labelProps: { optional?: React.ReactNode; error?: boolean } = {};
          
          if (step.optional) {
            labelProps.optional = (
              <Typography variant="caption" color={step.error ? 'error' : 'text.secondary'}>
                Optional
              </Typography>
            );
          }
          
          if (step.error) {
            labelProps.error = true;
          }
          
          return allowClickNavigation ? (
            <Step key={step.label} {...stepProps}>
              <StepButton
                onClick={() => handleStep(index)}
                disabled={step.disabled}
                optional={
                  step.description && (
                    <Typography variant="caption" color={step.error ? 'error' : 'text.secondary'}>
                      {step.description}
                    </Typography>
                  )
                }
              >
                {step.label}
              </StepButton>
              {orientation === 'vertical' && showContent && step.content && activeStep === index && (
                <StepContent>
                  {step.content}
                  {showNavigation && (
                    <Box sx={{ mb: 2, mt: 2 }}>
                      <div>
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {index === steps.length - 1 ? finishButtonText : nextButtonText}
                        </Button>
                        <Button
                          disabled={index === 0}
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {backButtonText}
                        </Button>
                      </div>
                    </Box>
                  )}
                </StepContent>
              )}
            </Step>
          ) : (
            <Step key={step.label} {...stepProps}>
              <StepLabel
                StepIconComponent={(iconProps) => <StepIcon {...iconProps} error={step.error} />}
                error={step.error}
                optional={
                  step.description ? (
                    <Typography variant="caption" color={step.error ? 'error' : 'text.secondary'}>
                      {step.description}
                    </Typography>
                  ) : step.optional ? (
                    <Typography variant="caption" color={step.error ? 'error' : 'text.secondary'}>
                      Optional
                    </Typography>
                  ) : null
                }
              >
                {step.label}
              </StepLabel>
              {orientation === 'vertical' && showContent && step.content && activeStep === index && (
                <StepContent>
                  {step.content}
                  {showNavigation && (
                    <Box sx={{ mb: 2, mt: 2 }}>
                      <div>
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {index === steps.length - 1 ? finishButtonText : nextButtonText}
                        </Button>
                        <Button
                          disabled={index === 0}
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {backButtonText}
                        </Button>
                      </div>
                    </Box>
                  )}
                </StepContent>
              )}
            </Step>
          );
        })}
      </Stepper>
      
      {orientation === 'horizontal' && showContent && !isStepperCompleted && steps[activeStep]?.content && (
        <Box sx={{ mt: 2, mb: 1 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
              borderRadius: theme.shape.borderRadius,
            }}
          >
            {steps[activeStep].content}
          </Paper>
        </Box>
      )}
      
      {orientation === 'horizontal' && showNavigation && (
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            {backButtonText}
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {isStepperCompleted && showResetOnComplete ? (
            <Button onClick={handleReset}>{resetButtonText}</Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={activeStep === steps.length}
            >
              {activeStep === steps.length - 1 ? finishButtonText : nextButtonText}
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default EnhancedStepper;