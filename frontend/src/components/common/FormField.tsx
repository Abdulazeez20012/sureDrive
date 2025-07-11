import React from 'react';
import {
  TextField,
  TextFieldProps,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  SelectProps,
  FormControlLabel,
  Checkbox,
  CheckboxProps,
  Switch,
  SwitchProps,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface BaseFormFieldProps {
  error?: string;
  helperText?: string;
  label: string;
  required?: boolean;
}

interface TextFormFieldProps extends BaseFormFieldProps {
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'datetime-local' | 'time';
  textFieldProps: Omit<TextFieldProps, 'error' | 'helperText' | 'label' | 'required' | 'type'>;
}

interface SelectFormFieldProps extends BaseFormFieldProps {
  type: 'select';
  selectProps: Omit<SelectProps, 'error' | 'label' | 'required'>;
  options: Array<{ value: string | number; label: string }>;
}

interface CheckboxFormFieldProps extends BaseFormFieldProps {
  type: 'checkbox';
  checkboxProps: Omit<CheckboxProps, 'required'>;
}

interface SwitchFormFieldProps extends BaseFormFieldProps {
  type: 'switch';
  switchProps: Omit<SwitchProps, 'required'>;
}

type FormFieldProps =
  | TextFormFieldProps
  | SelectFormFieldProps
  | CheckboxFormFieldProps
  | SwitchFormFieldProps;

const FormField: React.FC<FormFieldProps> = (props) => {
  const { error, helperText, label, required } = props;
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  switch (props.type) {
    case 'text':
    case 'email':
    case 'number':
    case 'tel':
    case 'url':
    case 'date':
    case 'datetime-local':
    case 'time':
      return (
        <TextField
          label={label}
          required={required}
          error={!!error}
          helperText={error || helperText}
          type={props.type}
          fullWidth
          margin="normal"
          {...props.textFieldProps}
        />
      );

    case 'password':
      return (
        <TextField
          label={label}
          required={required}
          error={!!error}
          helperText={error || helperText}
          type={showPassword ? 'text' : 'password'}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
            ...props.textFieldProps.InputProps,
          }}
          {...props.textFieldProps}
        />
      );

    case 'select':
      return (
        <FormControl 
          fullWidth 
          margin="normal" 
          error={!!error} 
          required={required}
        >
          <InputLabel>{label}</InputLabel>
          <Select label={label} {...props.selectProps}>
            {props.options.map((option) => (
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
        <FormControl error={!!error} required={required} margin="normal">
          <FormControlLabel
            control={<Checkbox {...props.checkboxProps} />}
            label={label}
          />
          {(error || helperText) && (
            <FormHelperText>{error || helperText}</FormHelperText>
          )}
        </FormControl>
      );

    case 'switch':
      return (
        <FormControl error={!!error} required={required} margin="normal">
          <FormControlLabel
            control={<Switch {...props.switchProps} />}
            label={label}
          />
          {(error || helperText) && (
            <FormHelperText>{error || helperText}</FormHelperText>
          )}
        </FormControl>
      );

    default:
      return null;
  }
};

export default FormField;