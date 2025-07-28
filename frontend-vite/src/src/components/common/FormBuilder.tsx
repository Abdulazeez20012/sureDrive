import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormLabel,
  RadioGroup,
  Radio,
  Switch,
  Slider,
  Stack,
  Divider,
  Paper,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'textarea'
  | 'switch'
  | 'slider'
  | 'divider'
  | 'custom';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  defaultValue?: any;
  options?: SelectOption[];
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  disabled?: boolean;
  fullWidth?: boolean;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  validation?: (value: any) => string | null;
  customComponent?: React.ReactNode;
  onChange?: (value: any) => void;
  dependsOn?: {
    field: string;
    value: any;
    condition?: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
  };
}

export interface FormSection {
  title?: string;
  description?: string;
  fields: FormField[];
}

export interface FormBuilderProps {
  /**
   * Form sections containing fields
   */
  sections: FormSection[];
  
  /**
   * Form values
   */
  values: Record<string, any>;
  
  /**
   * Form errors
   */
  errors: Record<string, string>;
  
  /**
   * Form touched fields
   */
  touched: Record<string, boolean>;
  
  /**
   * Handler for form field changes
   */
  handleChange: (name: string, value: any) => void;
  
  /**
   * Handler for form field blur events
   */
  handleBlur: (name: string) => void;
  
  /**
   * Handler for form submission
   */
  handleSubmit: (e: React.FormEvent) => void;
  
  /**
   * Whether the form is submitting
   */
  isSubmitting?: boolean;
  
  /**
   * Text for the submit button
   * @default 'Submit'
   */
  submitButtonText?: string;
  
  /**
   * Text for the cancel button
   * @default 'Cancel'
   */
  cancelButtonText?: string;
  
  /**
   * Handler for cancel button click
   */
  handleCancel?: () => void;
  
  /**
   * Whether to show the cancel button
   * @default true
   */
  showCancelButton?: boolean;
  
  /**
   * Whether to disable the form
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Whether to render the form in a Paper component
   * @default true
   */
  usePaper?: boolean;
  
  /**
   * Spacing between form fields
   * @default 2
   */
  spacing?: number;
}

/**
 * A reusable form builder component that generates forms based on configuration
 */
const FormBuilder: React.FC<FormBuilderProps> = ({
  sections,
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting = false,
  submitButtonText = 'Submit',
  cancelButtonText = 'Cancel',
  handleCancel,
  showCancelButton = true,
  disabled = false,
  usePaper = true,
  spacing = 2,
}) => {
  // Check if a field should be visible based on its dependencies
  const isFieldVisible = (field: FormField): boolean => {
    if (!field.dependsOn) return true;
    
    const { dependsOn } = field;
    const dependentValue = values[dependsOn.field];
    
    switch (dependsOn.condition) {
      case 'equals':
        return dependentValue === dependsOn.value;
      case 'notEquals':
        return dependentValue !== dependsOn.value;
      case 'contains':
        return Array.isArray(dependentValue) 
          ? dependentValue.includes(dependsOn.value)
          : String(dependentValue).includes(String(dependsOn.value));
      case 'greaterThan':
        return Number(dependentValue) > Number(dependsOn.value);
      case 'lessThan':
        return Number(dependentValue) < Number(dependsOn.value);
      default:
        return dependentValue === dependsOn.value;
    }
  };
  
  // Render a form field based on its type
  const renderField = (field: FormField) => {
    if (!isFieldVisible(field)) return null;
    
    const {
      name,
      label,
      type,
      required = false,
      placeholder,
      helperText,
      defaultValue,
      options,
      min,
      max,
      step,
      rows = 4,
      disabled: fieldDisabled = false,
      fullWidth = true,
      customComponent,
      onChange,
    } = field;
    
    const value = values[name] !== undefined ? values[name] : defaultValue || '';
    const error = touched[name] && errors[name] ? errors[name] : '';
    const isDisabled = disabled || fieldDisabled || isSubmitting;
    
    const handleFieldChange = (e: React.ChangeEvent<any> | null, newValue?: any) => {
      let fieldValue;
      
      if (e === null && newValue !== undefined) {
        // For components like DatePicker that pass value directly
        fieldValue = newValue;
      } else if (type === 'checkbox' && e?.target) {
        fieldValue = e.target.checked;
      } else if (e?.target) {
        fieldValue = e.target.value;
      } else {
        fieldValue = e;
      }
      
      handleChange(name, fieldValue);
      if (onChange) onChange(fieldValue);
    };

    const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
      handleChange(name, e.target.value);
      if (onChange) onChange(e.target.value);
    };

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
      handleChange(name, newValue);
      if (onChange) onChange(newValue);
    };
    
    const handleFieldBlur = () => {
      handleBlur(name);
    };
    
    switch (type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
        return (
          <TextField
            fullWidth={fullWidth}
            label={label}
            name={name}
            value={value}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            error={!!error}
            helperText={error || helperText}
            type={type}
            required={required}
            placeholder={placeholder}
            disabled={isDisabled}
            inputProps={{
              min: type === 'number' ? min : undefined,
              max: type === 'number' ? max : undefined,
              step: type === 'number' ? step : undefined,
            }}
          />
        );
        
      case 'textarea':
        return (
          <TextField
            fullWidth={fullWidth}
            label={label}
            name={name}
            value={value}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            error={!!error}
            helperText={error || helperText}
            multiline
            rows={rows}
            required={required}
            placeholder={placeholder}
            disabled={isDisabled}
          />
        );
        
      case 'select':
        return (
          <FormControl
            fullWidth={fullWidth}
            error={!!error}
            required={required}
            disabled={isDisabled}
          >
            <InputLabel id={`${name}-label`}>{label}</InputLabel>
            <Select
              labelId={`${name}-label`}
              id={name}
              name={name}
              value={value}
              onChange={handleSelectChange as any}
              onBlur={handleFieldBlur}
              label={label}
            >
              {options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {(error || helperText) && (
              <FormHelperText>{error || helperText}</FormHelperText>
            )}
          </FormControl>
        );
        
      case 'multiselect':
        return (
          <FormControl
            fullWidth={fullWidth}
            error={!!error}
            required={required}
            disabled={isDisabled}
          >
            <InputLabel id={`${name}-label`}>{label}</InputLabel>
            <Select
              labelId={`${name}-label`}
              id={name}
              name={name}
              multiple
              value={Array.isArray(value) ? value : []}
              onChange={handleSelectChange as any}
              onBlur={handleFieldBlur}
              label={label}
            >
              {options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {(error || helperText) && (
              <FormHelperText>{error || helperText}</FormHelperText>
            )}
          </FormControl>
        );
        
      case 'checkbox':
        return (
          <FormControl
            error={!!error}
            required={required}
            disabled={isDisabled}
            fullWidth={fullWidth}
          >
            <FormControlLabel
              control={
                <Checkbox
                  name={name}
                  checked={!!value}
                  onChange={handleFieldChange}
                  onBlur={handleFieldBlur}
                />
              }
              label={label}
            />
            {(error || helperText) && (
              <FormHelperText>{error || helperText}</FormHelperText>
            )}
          </FormControl>
        );
        
      case 'radio':
        return (
          <FormControl
            component="fieldset"
            error={!!error}
            required={required}
            disabled={isDisabled}
            fullWidth={fullWidth}
          >
            <FormLabel component="legend">{label}</FormLabel>
            <RadioGroup
              name={name}
              value={value}
              onChange={handleFieldChange}
              onBlur={handleFieldBlur}
            >
              {options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {(error || helperText) && (
              <FormHelperText>{error || helperText}</FormHelperText>
            )}
          </FormControl>
        );
        
      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <FormControl
              fullWidth={fullWidth}
              error={!!error}
              required={required}
              disabled={isDisabled}
            >
              <DatePicker
                label={label}
                value={value || null}
                onChange={(newValue) => handleFieldChange(null, newValue)}
                slotProps={{
                  textField: {
                    onBlur: handleFieldBlur,
                    error: !!error,
                    helperText: error || helperText,
                    fullWidth: true,
                  },
                }}
              />
            </FormControl>
          </LocalizationProvider>
        );
        
      case 'switch':
        return (
          <FormControl
            error={!!error}
            required={required}
            disabled={isDisabled}
            fullWidth={fullWidth}
          >
            <FormControlLabel
              control={
                <Switch
                  name={name}
                  checked={!!value}
                  onChange={handleFieldChange}
                  onBlur={handleFieldBlur}
                />
              }
              label={label}
            />
            {(error || helperText) && (
              <FormHelperText>{error || helperText}</FormHelperText>
            )}
          </FormControl>
        );
        
      case 'slider':
        return (
          <FormControl
            fullWidth={fullWidth}
            error={!!error}
            required={required}
            disabled={isDisabled}
          >
            <Typography id={`${name}-label`} gutterBottom>
              {label}
            </Typography>
            <Slider
              name={name}
              value={typeof value === 'number' ? value : 0}
              onChange={handleSliderChange}
              onBlur={handleFieldBlur}
              aria-labelledby={`${name}-label`}
              valueLabelDisplay="auto"
              min={min}
              max={max}
              step={step}
            />
            {(error || helperText) && (
              <FormHelperText>{error || helperText}</FormHelperText>
            )}
          </FormControl>
        );
        
      case 'divider':
        return (
          <Box sx={{ width: '100%', my: 2 }}>
            {label && (
              <Typography variant="subtitle1" gutterBottom>
                {label}
              </Typography>
            )}
            <Divider />
            {helperText && (
              <Typography variant="caption" color="text.secondary">
                {helperText}
              </Typography>
            )}
          </Box>
        );
        
      case 'custom':
        return customComponent || null;
        
      default:
        return null;
    }
  };
  
  const formContent = (
    <form onSubmit={handleSubmit} noValidate>
      <Stack spacing={spacing}>
        {sections.map((section, sectionIndex) => (
          <Box key={sectionIndex}>
            {section.title && (
              <Typography variant="h6" gutterBottom>
                {section.title}
              </Typography>
            )}
            {section.description && (
              <Typography variant="body2" color="text.secondary" paragraph>
                {section.description}
              </Typography>
            )}
            <Grid container spacing={spacing}>
              {section.fields.map((field, fieldIndex) => {
                const { xs = 12, sm, md, lg, xl } = field;
                return (
                  <Grid
                    item
                    xs={xs}
                    sm={sm}
                    md={md}
                    lg={lg}
                    xl={xl}
                    key={`${sectionIndex}-${fieldIndex}-${field.name}`}
                  >
                    {renderField(field)}
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        ))}
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
          {showCancelButton && handleCancel && (
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              {cancelButtonText}
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting || disabled}
          >
            {submitButtonText}
          </Button>
        </Box>
      </Stack>
    </form>
  );
  
  return usePaper ? <Paper sx={{ p: 3 }}>{formContent}</Paper> : formContent;
};

export default FormBuilder;