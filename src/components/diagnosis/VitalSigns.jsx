// components/diagnosis/VitalSigns.jsx
import React from 'react';
import {
  Grid,
  TextField,
  Typography,
  Card,
  CardContent,
  Box,
  InputAdornment,
} from '@mui/material';
import {
  Favorite as HeartIcon,
  Thermostat as TempIcon,
  Speed as PressureIcon,
  Air as RespIcon,
} from '@mui/icons-material';

const VitalSigns = ({ vitalSigns, onVitalSignsChange }) => {
  const handleChange = (field, value) => {
    onVitalSignsChange({
      ...vitalSigns,
      [field]: value,
    });
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <HeartIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Vital Signs</Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Blood Pressure (Systolic)"
              type="number"
              value={vitalSigns.bloodPressureSystolic}
              onChange={(e) => handleChange('bloodPressureSystolic', e.target.value)}
              InputProps={{
                endAdornment: <InputAdornment position="end">mmHg</InputAdornment>,
                startAdornment: <PressureIcon color="action" sx={{ mr: 1 }} />,
              }}
              placeholder="120"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Blood Pressure (Diastolic)"
              type="number"
              value={vitalSigns.bloodPressureDiastolic}
              onChange={(e) => handleChange('bloodPressureDiastolic', e.target.value)}
              InputProps={{
                endAdornment: <InputAdornment position="end">mmHg</InputAdornment>,
                startAdornment: <PressureIcon color="action" sx={{ mr: 1 }} />,
              }}
              placeholder="80"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Heart Rate"
              type="number"
              value={vitalSigns.heartRate}
              onChange={(e) => handleChange('heartRate', e.target.value)}
              InputProps={{
                endAdornment: <InputAdornment position="end">bpm</InputAdornment>,
                startAdornment: <HeartIcon color="action" sx={{ mr: 1 }} />,
              }}
              placeholder="72"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Respiratory Rate"
              type="number"
              value={vitalSigns.respiratoryRate}
              onChange={(e) => handleChange('respiratoryRate', e.target.value)}
              InputProps={{
                endAdornment: <InputAdornment position="end">breaths/min</InputAdornment>,
                startAdornment: <RespIcon color="action" sx={{ mr: 1 }} />,
              }}
              placeholder="16"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Body Temperature"
              type="number"
              value={vitalSigns.temperature}
              onChange={(e) => handleChange('temperature', e.target.value)}
              InputProps={{
                endAdornment: <InputAdornment position="end">°F</InputAdornment>,
                startAdornment: <TempIcon color="action" sx={{ mr: 1 }} />,
              }}
              placeholder="98.6"
              inputProps={{ step: 0.1 }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Oxygen Saturation"
              type="number"
              value={vitalSigns.oxygenSaturation}
              onChange={(e) => handleChange('oxygenSaturation', e.target.value)}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              placeholder="98"
              inputProps={{ min: 0, max: 100 }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Additional Notes"
              multiline
              rows={2}
              value={vitalSigns.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Any additional observations or notes about vital signs..."
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default VitalSigns;