import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  FormHelperText,
  SxProps,
  Theme,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
} from '@mui/icons-material';

interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in bytes
  onFileSelect: (file: File | null) => void;
  initialPreview?: string;
  label?: string;
  helperText?: string;
  error?: string;
  loading?: boolean;
  sx?: SxProps<Theme>;
  disabled?: boolean;
  multiple?: boolean;
  previewType?: 'image' | 'none';
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  onFileSelect,
  initialPreview = '',
  label = 'Upload File',
  helperText = '',
  error = '',
  loading = false,
  sx,
  disabled = false,
  multiple = false,
  previewType = 'image',
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(initialPreview);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    handleFile(selectedFile);
  };

  const handleFile = (selectedFile: File | null) => {
    if (!selectedFile) {
      setFile(null);
      setPreview('');
      onFileSelect(null);
      return;
    }

    // Check file size
    if (selectedFile.size > maxSize) {
      alert(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
      return;
    }

    setFile(selectedFile);
    onFileSelect(selectedFile);

    // Create preview for images
    if (previewType === 'image' && selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview('');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const droppedFile = event.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview('');
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        ref={fileInputRef}
        disabled={disabled || loading}
        multiple={multiple}
      />

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderStyle: 'dashed',
          borderWidth: 2,
          borderColor: isDragging
            ? 'primary.main'
            : error
            ? 'error.main'
            : 'divider',
          bgcolor: isDragging ? 'action.hover' : 'background.paper',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: disabled ? 'background.paper' : 'action.hover',
          },
        }}
        onClick={disabled ? undefined : handleButtonClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              py: 2,
            }}
          >
            <CircularProgress size={40} />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Uploading...
            </Typography>
          </Box>
        ) : preview && previewType === 'image' ? (
          <Box sx={{ position: 'relative' }}>
            <Box
              component="img"
              src={preview}
              alt="Preview"
              sx={{
                width: '100%',
                height: 200,
                objectFit: 'contain',
                display: 'block',
                margin: '0 auto',
              }}
            />
            <IconButton
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'background.default' },
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              size="small"
              disabled={disabled}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : file ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {file.type.startsWith('image/') ? (
                <ImageIcon sx={{ mr: 2, color: 'primary.main' }} />
              ) : (
                <FileIcon sx={{ mr: 2, color: 'primary.main' }} />
              )}
              <Box>
                <Typography variant="body2" noWrap sx={{ maxWidth: '200px' }}>
                  {file.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {(file.size / 1024).toFixed(1)} KB
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              size="small"
              disabled={disabled}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              py: 3,
            }}
          >
            <CloudUploadIcon
              color="primary"
              sx={{ fontSize: 48, mb: 1, opacity: 0.8 }}
            />
            <Typography variant="subtitle1" align="center">
              {label}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              align="center"
              sx={{ mt: 1 }}
            >
              Drag and drop or click to browse
            </Typography>
          </Box>
        )}
      </Paper>

      {(helperText || error) && (
        <FormHelperText error={!!error} sx={{ mt: 1 }}>
          {error || helperText}
        </FormHelperText>
      )}
    </Box>
  );
};

export default FileUpload;