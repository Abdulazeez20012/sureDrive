import React from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker as MuiTimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker as MuiDateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { FormControl, FormHelperText, SxProps, Theme } from '@mui/material';

interface BaseDatePickerProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  error?: string;
  helperText?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  required?: boolean;
  sx?: SxProps<Theme>;
  fullWidth?: boolean;
}

interface DatePickerProps extends BaseDatePickerProps {
  type: 'date';
}

interface TimePickerProps extends BaseDatePickerProps {
  type: 'time';
}

interface DateTimePickerProps extends BaseDatePickerProps {
  type: 'datetime';
}

type CustomDatePickerProps = DatePickerProps | TimePickerProps | DateTimePickerProps;

const CustomDatePicker: React.FC<CustomDatePickerProps> = (props) => {
  const {
    label,
    value,
    onChange,
    error,
    helperText,
    minDate,
    maxDate,
    disabled = false,
    required = false,
    sx,
    fullWidth = true,
    type,
  } = props;

  const renderPicker = () => {
    const commonProps = {
      label,
      value,
      onChange,
      minDate,
      maxDate,
      disabled,
      slotProps: {
        textField: {
          fullWidth,
          required,
          error: !!error,
          helperText: error || helperText,
          margin: 'normal' as const,
        },
      },
      sx,
    };

    switch (type) {
      case 'date':
        return <MuiDatePicker {...commonProps} />;
      case 'time':
        return <MuiTimePicker {...commonProps} />;
      case 'datetime':
        return <MuiDateTimePicker {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {renderPicker()}
    </LocalizationProvider>
  );
};

export default CustomDatePicker;