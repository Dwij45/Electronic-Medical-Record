import React, { useState } from 'react';
import { Box, Paper, Typography, Stepper, Step, StepLabel, Button, Alert } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import {
  PatientSelection, OTPVerification, MedicalHistoryReview, ClinicalAssessment,
  DiagnosisCoding, ConsentReview, SubmissionSuccess
} from '../components/diagnosis/DiagnosisSteps';
import ConfirmationDialog from '../components/diagnosis/ConfirmationDialog';

const PatientDiagnosis = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [otpData, setOtpData] = useState({
    otpSent: false,
    otpCode: '',
    enteredOtp: '',
    verified: false,
    timeRemaining: 0
  });
  const [historyReviewed, setHistoryReviewed] = useState(false);
  const [encounterData, setEncounterData] = useState({
    date: new Date(),
    type: 'outpatient',
    location: 'General Medicine OPD',
    practitioner: 'Dr. Sarah Wilson',
    chiefComplaint: '',
    vitalSigns: {
      temperature: '',
      bloodPressure: '',
      heartRate: '',
      respiratoryRate: '',
      oxygenSaturation: ''
    }
  });
  const [diagnosisData, setDiagnosisData] = useState({
    selectedDiseases: [],
    clinicalNotes: '',
    treatmentPlan: '',
    followUpDate: null
  });
  const [consentData, setConsentData] = useState({
    dataSharing: false,
    research: false,
    analytics: false,
    publicHealth: false,
    consentGiven: false,
    patientSignature: '',
    consentDate: new Date()
  });
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [submittedDiagnosis, setSubmittedDiagnosis] = useState(null);

  const steps = [
    'Patient Information',
    'OTP Verification',
    'Medical History Review',
    'Clinical Assessment',
    'Diagnosis & Coding',
    'Consent & Review'
  ];

  const handleNext = () => {
    if (validateCurrentStep()) {
      setActiveStep((prev) => prev + 1);
      setError(null);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError(null);
  };

  const validateCurrentStep = () => {
    switch (activeStep) {
      case 0: return selectedPatient !== null;
      case 1: return otpData.verified;
      case 2: return historyReviewed;
      case 3: return encounterData.chiefComplaint.trim() !== '';
      case 4: return diagnosisData.selectedDiseases.length > 0;
      case 5: return consentData.consentGiven;
      default: return true;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const diagnosisRecord = {
        id: Date.now().toString(),
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        patientAbhaId: selectedPatient.abhaId,
        encounterDate: encounterData.date,
        practitioner: encounterData.practitioner,
        chiefComplaint: encounterData.chiefComplaint,
        vitalSigns: encounterData.vitalSigns,
        diagnoses: diagnosisData.selectedDiseases,
        clinicalNotes: diagnosisData.clinicalNotes,
        treatmentPlan: diagnosisData.treatmentPlan,
        consentData: consentData,
        otpVerified: otpData.verified,
        historyReviewed: historyReviewed,
        createdAt: new Date(),
        status: 'Active'
      };

      const existingHistory = JSON.parse(localStorage.getItem('diagnosisHistory') || '[]');
      const updatedHistory = [diagnosisRecord, ...existingHistory];
      localStorage.setItem('diagnosisHistory', JSON.stringify(updatedHistory));

      setSubmittedDiagnosis(diagnosisRecord);
      setSuccess(true);
      setActiveStep(6);
    } catch (err) {
      setError(err.message || 'Failed to submit diagnosis');
    } finally {
      setLoading(false);
      setConfirmDialog(false);
    }
  };

  const resetForm = () => {
    setSelectedPatient(null);
    setOtpData({
      otpSent: false,
      otpCode: '',
      enteredOtp: '',
      verified: false,
      timeRemaining: 0
    });
    setHistoryReviewed(false);
    setEncounterData({
      date: new Date(),
      type: 'outpatient',
      location: 'General Medicine OPD',
      practitioner: 'Dr. Sarah Wilson',
      chiefComplaint: '',
      vitalSigns: {
        temperature: '',
        bloodPressure: '',
        heartRate: '',
        respiratoryRate: '',
        oxygenSaturation: ''
      }
    });
    setDiagnosisData({
      selectedDiseases: [],
      clinicalNotes: '',
      treatmentPlan: '',
      followUpDate: null
    });
    setConsentData({
      dataSharing: false,
      research: false,
      analytics: false,
      publicHealth: false,
      consentGiven: false,
      patientSignature: '',
      consentDate: new Date()
    });
    setActiveStep(0);
    setSuccess(false);
    setError(null);
  };

  const renderStepContent = () => {
    const commonProps = {
      selectedPatient,
      setSelectedPatient,
      otpData,
      setOtpData,
      historyReviewed,
      setHistoryReviewed,
      encounterData,
      setEncounterData,
      diagnosisData,
      setDiagnosisData,
      consentData,
      setConsentData,
      loading,
      setLoading,
      error,
      setError
    };

    switch (activeStep) {
      case 0:
        return <PatientSelection {...commonProps} />;
      case 1:
        return <OTPVerification {...commonProps} />;
      case 2:
        return <MedicalHistoryReview {...commonProps} />;
      case 3:
        return <ClinicalAssessment {...commonProps} />;
      case 4:
        return <DiagnosisCoding {...commonProps} />;
      case 5:
        return <ConsentReview {...commonProps} />;
      case 6:
        return <SubmissionSuccess submittedDiagnosis={submittedDiagnosis} resetForm={resetForm} />;
      default:
        return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Enhanced Patient Diagnosis Entry
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Complete 6-step diagnosis workflow with OTP authentication, medical history review, and ICD-11/NAMASTE coding
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent()}

          {activeStep < 6 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={() => setConfirmDialog(true)}
                  disabled={!validateCurrentStep()}
                  size="large"
                >
                  Submit Diagnosis
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!validateCurrentStep()}
                  size="large"
                >
                  Next
                </Button>
              )}
            </Box>
          )}
        </Paper>

        <ConfirmationDialog
          open={confirmDialog}
          onClose={() => setConfirmDialog(false)}
          onConfirm={handleSubmit}
          selectedPatient={selectedPatient}
          encounterData={encounterData}
          diagnosisData={diagnosisData}
          consentData={consentData}
          otpData={otpData}
          historyReviewed={historyReviewed}
          loading={loading}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default PatientDiagnosis;