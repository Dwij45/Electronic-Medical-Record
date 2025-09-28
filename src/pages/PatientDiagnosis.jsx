// pages/PatientDiagnosis.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Autocomplete,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DualCodingWidget from '../components/terminology/DualCodingWidget';
import ConsentManager from '../components/diagnosis/ConsentManager';
import { useAuth } from '../context/AuthContext';
import diagnosisService from '../services/diagnosis.service';
import fhirService from '../services/fhir.service';

const PatientDiagnosis = () => {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [patientData, setPatientData] = useState({
    id: '',
    name: '',
    abhaId: '',
    dateOfBirth: null,
    gender: '',
    contactNumber: '',
  });

  const [encounterData, setEncounterData] = useState({
    date: new Date(),
    type: 'outpatient',
    location: '',
    practitioner: user?.name || '',
  });

  const [diagnosisData, setDiagnosisData] = useState({
    codes: [],
    notes: '',
    severity: 'moderate',
    onset: null,
    status: 'active',
  });

  const [consentData, setConsentData] = useState({
    dataSharing: false,
    research: false,
    analytics: false,
    consentGiven: false,
    consentDate: null,
  });

  const [confirmDialog, setConfirmDialog] = useState(false);

  const steps = [
    'Patient Information',
    'Diagnosis Coding',
    'Consent & Review',
    'Submit'
  ];

  const handlePatientSearch = async (searchTerm) => {
    // Implementation for patient search
    // This would connect to your patient registry API
    try {
      const results = await diagnosisService.searchPatients(searchTerm);
      return results;
    } catch (err) {
      console.error('Patient search error:', err);
      return [];
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const validateCurrentStep = () => {
    switch (activeStep) {
      case 0:
        return patientData.id && patientData.name && patientData.abhaId;
      case 1:
        return diagnosisData.codes.length > 0;
      case 2:
        return consentData.consentGiven;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Create FHIR Bundle
      const fhirBundle = await fhirService.createDiagnosisBundle({
        patient: patientData,
        encounter: encounterData,
        diagnosis: diagnosisData,
        consent: consentData,
        practitioner: user,
      });

      // Submit to backend
      const result = await diagnosisService.submitDiagnosis(fhirBundle);
      
      setSuccess(true);
      setActiveStep(3);
    } catch (err) {
      setError(err.message || 'Failed to submit diagnosis');
    } finally {
      setLoading(false);
      setConfirmDialog(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Patient Information
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={[]} // This would be populated by patient search
                getOptionLabel={(option) => `${option.name} (${option.abhaId})`}
                onInputChange={async (event, value) => {
                  if (value && value.length > 2) {
                    const results = await handlePatientSearch(value);
                    // Update options
                  }
                }}
                onChange={(event, value) => {
                  if (value) {
                    setPatientData(value);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Patient"
                    placeholder="Enter name or ABHA ID"
                    fullWidth
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ABHA ID"
                value={patientData.abhaId}
                onChange={(e) => setPatientData({ ...patientData, abhaId: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={patientData.name}
                onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date of Birth"
                  value={patientData.dateOfBirth}
                  onChange={(date) => setPatientData({ ...patientData, dateOfBirth: date })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Diagnosis Coding
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <DualCodingWidget
                selectedCodes={diagnosisData.codes}
                onSelectionChange={(codes) => setDiagnosisData({ ...diagnosisData, codes })}
                patientContext={patientData}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Clinical Notes"
                multiline
                rows={4}
                value={diagnosisData.notes}
                onChange={(e) => setDiagnosisData({ ...diagnosisData, notes: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Severity"
                value={diagnosisData.severity}
                onChange={(e) => setDiagnosisData({ ...diagnosisData, severity: e.target.value })}
                SelectProps={{ native: true }}
              >
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </TextField>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Consent & Review
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <ConsentManager
                consentData={consentData}
                onConsentChange={setConsentData}
                patientData={patientData}
                diagnosisData={diagnosisData}
              />
            </Grid>
          </Grid>
        );

      case 3:
        return success ? (
          <Box textAlign="center" py={4}>
            <Typography variant="h5" color="success.main" gutterBottom>
              Diagnosis Submitted Successfully!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              FHIR Bundle created and submitted with dual coding compliance.
            </Typography>
            <Button variant="contained" onClick={() => window.location.reload()}>
              Create New Diagnosis
            </Button>
          </Box>
        ) : (
          <Typography>Submitting...</Typography>
        );

      default:
        return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Patient Diagnosis Entry
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3, mb: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent()}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
            
            {activeStep === steps.length - 2 ? (
              <Button
                variant="contained"
                onClick={() => setConfirmDialog(true)}
                disabled={!validateCurrentStep()}
              >
                Review & Submit
              </Button>
            ) : activeStep < steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!validateCurrentStep()}
              >
                Next
              </Button>
            ) : null}
          </Box>
        </Paper>

        {/* Confirmation Dialog */}
        <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
          <DialogTitle>Confirm Diagnosis Submission</DialogTitle>
          <DialogContent>
            <Typography gutterBottom>
              Please review the diagnosis information:
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              <strong>Patient:</strong> {patientData.name} ({patientData.abhaId})
            </Typography>
            <Typography variant="body2">
              <strong>Codes Selected:</strong> {diagnosisData.codes.length}
            </Typography>
            <Typography variant="body2">
              <strong>Consent Given:</strong> {consentData.consentGiven ? 'Yes' : 'No'}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : 'Submit'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default PatientDiagnosis;