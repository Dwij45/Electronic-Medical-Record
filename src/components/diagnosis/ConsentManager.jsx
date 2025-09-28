// components/diagnosis/ConsentManager.js
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Checkbox,
  Divider,
  Alert,
  Button,
  Grid,
} from '@mui/material';
import { format } from 'date-fns';

const ConsentManager = ({ consentData, onConsentChange, patientData, diagnosisData }) => {
  const handleConsentChange = (field) => (event) => {
    const newConsentData = {
      ...consentData,
      [field]: event.target.checked,
    };

    // Auto-set consent date when main consent is given
    if (field === 'consentGiven' && event.target.checked) {
      newConsentData.consentDate = new Date();
    }

    onConsentChange(newConsentData);
  };

  return (
    <Box>
      {/* Diagnosis Review */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Diagnosis Review
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="primary">
                Patient Information
              </Typography>
              <Typography variant="body2">
                Name: {patientData.name}
              </Typography>
              <Typography variant="body2">
                ABHA ID: {patientData.abhaId}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="primary">
                Selected Codes
              </Typography>
              {diagnosisData.codes.map((code, index) => (
                <Typography key={index} variant="body2">
                  {code.system}: {code.code} - {code.display}
                </Typography>
              ))}
            </Grid>
          </Grid>
          {diagnosisData.notes && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="primary">
                Clinical Notes
              </Typography>
              <Typography variant="body2">
                {diagnosisData.notes}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Consent Form */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Patient Consent
          </Typography>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            Patient consent is required for data processing and storage as per healthcare regulations.
          </Alert>

          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={consentData.dataSharing}
                  onChange={handleConsentChange('dataSharing')}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  I consent to sharing my diagnosis data with authorized healthcare providers 
                  for treatment coordination and continuity of care.
                </Typography>
              }
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={consentData.research}
                  onChange={handleConsentChange('research')}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  I consent to the use of my anonymized diagnosis data for medical research 
                  and improvement of healthcare services.
                </Typography>
              }
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={consentData.analytics}
                  onChange={handleConsentChange('analytics')}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  I consent to the use of my diagnosis data for healthcare analytics 
                  and reporting to Ministry of Ayush and relevant authorities.
                </Typography>
              }
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={consentData.consentGiven}
                  onChange={handleConsentChange('consentGiven')}
                  color="primary"
                  required
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  I have read and understood the above information and give my consent 
                  for the processing of my diagnosis data as described.
                </Typography>
              }
            />
          </Box>

          {consentData.consentDate && (
            <Typography variant="caption" color="text.secondary">
              Consent given on: {format(consentData.consentDate, 'PPpp')}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ConsentManager;