import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Autocomplete, Typography, Card, CardContent,
  Chip, Paper, Alert, CircularProgress, Grid, Badge, Button
} from '@mui/material';
import { Search, Translate, Code, Language, History } from '@mui/icons-material';
import DualCodingService from '../../services/dualCodingService';

const DualCodingSearch = ({ 
  selectedSystem, 
  onSelectDisease, 
  searchTerm, 
  onSearchChange 
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  // Search with transliteration support
  useEffect(() => {
    const searchTraditional = async () => {
      if (!searchTerm || searchTerm.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const results = await DualCodingService.searchTraditionalTerms(
          searchTerm, 
          selectedSystem
        );
        setSuggestions(results.slice(0, 10));
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchTraditional, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedSystem]);

  const handleDiseaseSelect = (disease) => {
    if (disease) {
      setSearchHistory(prev => {
        const updated = [disease, ...prev.filter(item => item.id !== disease.id)];
        return updated.slice(0, 5);
      });
      onSelectDisease(disease);
    }
  };

  const getMatchTypeColor = (matchType) => {
    const colorMap = {
      sanskrit: 'primary',
      transliteration: 'secondary',
      searchterm: 'success',
      modern: 'warning',
      fuzzy: 'info'
    };
    return colorMap[matchType] || 'default';
  };

  const renderSuggestion = (props, option) => (
    <Box component="li" {...props}>
      <Card sx={{ width: '100%', m: 0.5 }}>
        <CardContent sx={{ py: 1.5 }}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" sx={{ mr: 1 }}>
                  {option.sanskritName}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  ({option.englishName})
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
                <Chip label={option.namasteCode} size="small" color="primary" />
                <Chip label={option.modernEquivalent} size="small" variant="outlined" />
                <Chip 
                  label={option.matchType} 
                  size="small" 
                  color={getMatchTypeColor(option.matchType)}
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                <strong>Category:</strong> {option.category} | 
                <strong> Dosha:</strong> {option.doshaEnglish?.join(', ') || 'N/A'}
              </Typography>
            </Grid>
            
            <Grid item>
              <Badge badgeContent={Math.round(option.matchScore || 0)} color="primary" max={100}>
                <Language sx={{ color: 'primary.main' }} />
              </Badge>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Box>
      <Autocomplete
        options={suggestions}
        getOptionLabel={(option) => `${option.sanskritName} (${option.englishName})`}
        renderOption={renderSuggestion}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Traditional Disease"
            placeholder="Type: शिरोरोग or shirog or headache"
            variant="outlined"
            fullWidth
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                  <Search color="action" />
                  {loading && <CircularProgress size={20} sx={{ ml: 1 }} />}
                </Box>
              )
            }}
          />
        )}
        onChange={(event, value) => handleDiseaseSelect(value)}
        onInputChange={(event, value) => onSearchChange(value)}
        loading={loading}
        loadingText="Searching traditional terminologies..."
        noOptionsText="No diseases found. Try Sanskrit, transliteration, or English terms."
      />

      {/* Search Tips */}
      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>Search Examples:</strong>
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Chip label="शिरोरोग → shirog → headache" size="small" sx={{ mr: 0.5, mb: 0.5 }} />
          <Chip label="मधुमेह → madhumeha → diabetes" size="small" sx={{ mr: 0.5, mb: 0.5 }} />
          <Chip label="कास → kasa → cough" size="small" sx={{ mr: 0.5, mb: 0.5 }} />
        </Box>
      </Alert>

      {/* Recent Searches */}
      {searchHistory.length > 0 && (
        <Card sx={{ mt: 2, bgcolor: 'grey.50' }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <History sx={{ mr: 1 }} />
              Recent Searches
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {searchHistory.map((disease, index) => (
                <Chip
                  key={index}
                  label={`${disease.sanskritName} (${disease.englishName})`}
                  variant="outlined"
                  size="small"
                  onClick={() => handleDiseaseSelect(disease)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default DualCodingSearch;