// components/terminology/DualCodingWidget.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  Autocomplete,
  Chip,
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
  CircularProgress,
  Badge,
  Tooltip,
} from '@mui/material';
import { debounce } from 'lodash';
import terminologyService from '../../services/terminology.service';

const DualCodingWidget = ({ 
  onSelectionChange, 
  selectedCodes = [], 
  patientContext = null 
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mappings, setMappings] = useState({});
  const [error, setError] = useState(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery) => {
      if (!searchQuery || searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const results = await terminologyService.autocomplete(searchQuery, {
          systems: ['NAMASTE', 'ICD-11-TM2', 'ICD-11-BIOMEDICINE'],
          limit: 20,
          patientContext,
        });

        setSuggestions(results);
        
        // Fetch mappings for NAMASTE codes
        const namasteCodes = results
          .filter(item => item.system === 'NAMASTE')
          .map(item => item.code);
        
        if (namasteCodes.length > 0) {
          const mappingResults = await Promise.all(
            namasteCodes.map(code => 
              terminologyService.getMapping(code).catch(() => null)
            )
          );
          
          const newMappings = {};
          namasteCodes.forEach((code, index) => {
            if (mappingResults[index]) {
              newMappings[code] = mappingResults[index];
            }
          });
          
          setMappings(prev => ({ ...prev, ...newMappings }));
        }
      } catch (err) {
        setError('Failed to fetch terminology suggestions');
        console.error('Autocomplete error:', err);
      } finally {
        setLoading(false);
      }
    }, 300),
    [patientContext]
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const handleSelectionChange = (event, newValue) => {
    if (newValue) {
      const isAlreadySelected = selectedCodes.some(
        code => code.code === newValue.code && code.system === newValue.system
      );

      if (!isAlreadySelected) {
        const updatedCodes = [...selectedCodes, newValue];
        onSelectionChange(updatedCodes);
        
        // Auto-select mapped codes if available
        if (newValue.system === 'NAMASTE' && mappings[newValue.code]) {
          const mappedCode = mappings[newValue.code];
          const isMappedSelected = updatedCodes.some(
            code => code.code === mappedCode.target.code
          );
          
          if (!isMappedSelected) {
            onSelectionChange([...updatedCodes, mappedCode.target]);
          }
        }
      }
    }
    setQuery('');
  };

  const handleRemoveCode = (codeToRemove) => {
    const updatedCodes = selectedCodes.filter(
      code => !(code.code === codeToRemove.code && code.system === codeToRemove.system)
    );
    onSelectionChange(updatedCodes);
  };

  const getSystemColor = (system) => {
    const colors = {
      'NAMASTE': 'success',
      'ICD-11-TM2': 'primary',
      'ICD-11-BIOMEDICINE': 'secondary',
    };
    return colors[system] || 'default';
  };

  const getSystemLabel = (system) => {
    const labels = {
      'NAMASTE': 'NAMASTE (Ayurveda/Siddha/Unani)',
      'ICD-11-TM2': 'ICD-11 Traditional Medicine',
      'ICD-11-BIOMEDICINE': 'ICD-11 Biomedicine',
    };
    return labels[system] || system;
  };

  const renderOption = (props, option) => (
    <Box component="li" {...props}>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12}>
          <Box display="flex" alignItems="center" gap={1}>
            <Badge
              badgeContent={mappings[option.code] ? 'M' : null}
              color="info"
              invisible={!mappings[option.code]}
            >
              <Chip
                label={option.system}
                color={getSystemColor(option.system)}
                size="small"
              />
            </Badge>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {option.code}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary">
            {option.display}
          </Typography>
        </Grid>
        {mappings[option.code] && (
          <Grid item xs={12}>
            <Alert severity="info" sx={{ py: 0, px: 1 }}>
              <Typography variant="caption">
                Maps to: {mappings[option.code].target.display}
              </Typography>
            </Alert>
          </Grid>
        )}
      </Grid>
    </Box>
  );

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Dual Coding Terminology Selection
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Autocomplete
          options={suggestions}
          getOptionLabel={(option) => `${option.code} - ${option.display}`}
          renderOption={renderOption}
          loading={loading}
          onInputChange={(event, newInputValue) => setQuery(newInputValue)}
          onChange={handleSelectionChange}
          inputValue={query}
          noOptionsText="Start typing to search terminology..."
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search NAMASTE & ICD-11 Codes"
              placeholder="Type symptom, disease, or diagnosis..."
              variant="outlined"
              fullWidth
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />

        {/* Selected Codes Display */}
        {selectedCodes.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Selected Codes ({selectedCodes.length})
            </Typography>
            <Grid container spacing={2}>
              {selectedCodes.map((code, index) => (
                <Grid item xs={12} md={6} key={`${code.system}-${code.code}-${index}`}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box flexGrow={1}>
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <Chip
                              label={getSystemLabel(code.system)}
                              color={getSystemColor(code.system)}
                              size="small"
                            />
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {code.code}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {code.display}
                          </Typography>
                        </Box>
                        <Tooltip title="Remove code">
                          <Chip
                            label="×"
                            size="small"
                            onClick={() => handleRemoveCode(code)}
                            sx={{ cursor: 'pointer', minWidth: '24px' }}
                          />
                        </Tooltip>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Coding Guidelines */}
        <Box sx={{ mt: 3 }}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Dual Coding Guidelines:</strong> Select both traditional medicine codes (NAMASTE) 
              and corresponding international codes (ICD-11) for comprehensive documentation. 
              Mappings are automatically suggested when available.
            </Typography>
          </Alert>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DualCodingWidget;