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
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { 
  PersonAdd, 
  LocalHospital, 
  Assignment, 
  CheckCircle,
  Search,
  Code,
  Description
} from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';

// Mock Data
const mockPatients = [
  {
    id: 'PAT001',
    name: 'John Doe',
    abhaId: 'ABHA001234567890',
    dateOfBirth: new Date('1985-05-15'),
    gender: 'Male',
    contactNumber: '+91-9876543210',
    address: '123 Main St, Mumbai, MH 400001',
    bloodGroup: 'B+',
    allergies: ['Penicillin', 'Peanuts']
  },
  {
    id: 'PAT002',
    name: 'Jane Smith',
    abhaId: 'ABHA002345678901',
    dateOfBirth: new Date('1990-08-22'),
    gender: 'Female',
    contactNumber: '+91-9876543211',
    address: '456 Oak Ave, Delhi, DL 110001',
    bloodGroup: 'A+',
    allergies: ['Shellfish']
  },
  {
    id: 'PAT003',
    name: 'Ram Kumar',
    abhaId: 'ABHA003456789012',
    dateOfBirth: new Date('1975-12-10'),
    gender: 'Male',
    contactNumber: '+91-9876543212',
    address: '789 Pine Rd, Bangalore, KA 560001',
    bloodGroup: 'O+',
    allergies: []
  }
];

const mockDiseases = [
  {
    id: 'DIAG001',
    name: 'Type 2 Diabetes Mellitus',
    icd11Code: '5A11',
    icd11T2Code: '5A11.0',
    namasteCode: 'NAM001',
    description: 'A metabolic disorder characterized by high blood glucose levels due to insulin resistance',
    category: 'Endocrine',
    severity: ['Mild', 'Moderate', 'Severe'],
    commonSymptoms: ['Increased thirst', 'Frequent urination', 'Fatigue', 'Blurred vision']
  },
  {
    id: 'DIAG002',
    name: 'Essential Hypertension',
    icd11Code: 'BA00',
    icd11T2Code: 'BA00.0',
    namasteCode: 'NAM002',
    description: 'High blood pressure with no identifiable underlying cause',
    category: 'Cardiovascular',
    severity: ['Stage 1', 'Stage 2', 'Severe'],
    commonSymptoms: ['Headache', 'Dizziness', 'Chest pain', 'Shortness of breath']
  },
  {
    id: 'DIAG003',
    name: 'Acute Upper Respiratory Infection',
    icd11Code: 'CA07',
    icd11T2Code: 'CA07.1',
    namasteCode: 'NAM003',
    description: 'Infection affecting the upper respiratory tract including nose, throat, and sinuses',
    category: 'Respiratory',
    severity: ['Mild', 'Moderate', 'Severe'],
    commonSymptoms: ['Cough', 'Sore throat', 'Runny nose', 'Fever']
  },
  {
    id: 'DIAG004',
    name: 'Migraine',
    icd11Code: '8A80',
    icd11T2Code: '8A80.0',
    namasteCode: 'NAM004',
    description: 'Recurrent headache disorder characterized by moderate to severe headaches',
    category: 'Neurological',
    severity: ['Mild', 'Moderate', 'Severe'],
    commonSymptoms: ['Throbbing headache', 'Nausea', 'Light sensitivity', 'Sound sensitivity']
  },
  {
    id: 'DIAG005',
    name: 'Gastroesophageal Reflux Disease',
    icd11Code: 'DA22',
    icd11T2Code: 'DA22.0',
    namasteCode: 'NAM005',
    description: 'Chronic condition where stomach acid flows back into the esophagus',
    category: 'Gastrointestinal',
    severity: ['Mild', 'Moderate', 'Severe'],
    commonSymptoms: ['Heartburn', 'Regurgitation', 'Chest pain', 'Difficulty swallowing']
  }
];

const PatientDiagnosis = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState(mockPatients);

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
    followUpDate: null,
    medications: [],
    labTests: []
  });

  const [consentData, setConsentData] = useState({
    dataSharing: false,
    research: false,
    analytics: false,
    publicHealth: false,
    consentGiven: false,
    patientSignature: '',
    guardianConsent: false,
    consentDate: new Date()
  });

  const [confirmDialog, setConfirmDialog] = useState(false);
  const [submittedDiagnosis, setSubmittedDiagnosis] = useState(null);

  const steps = [
    'Patient Information',
    'Clinical Assessment',
    'Diagnosis & Coding',
    'Consent & Review'
  ];

  // Filter patients based on search term
  useEffect(() => {
    if (patientSearchTerm.trim() === '') {
      setFilteredPatients(mockPatients);
    } else {
      const filtered = mockPatients.filter(patient =>
        patient.name.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
        patient.abhaId.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
        patient.contactNumber.includes(patientSearchTerm)
      );
      setFilteredPatients(filtered);
    }
  }, [patientSearchTerm]);

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
        return selectedPatient !== null;
      case 1:
        return encounterData.chiefComplaint.trim() !== '';
      case 2:
        return diagnosisData.selectedDiseases.length > 0;
      case 3:
        return consentData.consentGiven;
      default:
        return true;
    }
  };

  const handleDiseaseSelection = (disease) => {
    const isSelected = diagnosisData.selectedDiseases.some(d => d.id === disease.id);
    if (isSelected) {
      setDiagnosisData({
        ...diagnosisData,
        selectedDiseases: diagnosisData.selectedDiseases.filter(d => d.id !== disease.id)
      });
    } else {
      setDiagnosisData({
        ...diagnosisData,
        selectedDiseases: [...diagnosisData.selectedDiseases, { ...disease, severity: 'Moderate' }]
      });
    }
  };

  const updateDiseaseSeverity = (diseaseId, severity) => {
    setDiagnosisData({
      ...diagnosisData,
      selectedDiseases: diagnosisData.selectedDiseases.map(disease =>
        disease.id === diseaseId ? { ...disease, severity } : disease
      )
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create diagnosis record
      const diagnosisRecord = {
        id: uuidv4(),
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
        createdAt: new Date(),
        status: 'Active'
      };

      // Store in localStorage (mock database)
      const existingHistory = JSON.parse(localStorage.getItem('diagnosisHistory') || '[]');
      const updatedHistory = [diagnosisRecord, ...existingHistory];
      localStorage.setItem('diagnosisHistory', JSON.stringify(updatedHistory));

      setSubmittedDiagnosis(diagnosisRecord);
      setSuccess(true);
      setActiveStep(4);
    } catch (err) {
      setError(err.message || 'Failed to submit diagnosis');
    } finally {
      setLoading(false);
      setConfirmDialog(false);
    }
  };

  const resetForm = () => {
    setSelectedPatient(null);
    setPatientSearchTerm('');
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
      followUpDate: null,
      medications: [],
      labTests: []
    });
    setConsentData({
      dataSharing: false,
      research: false,
      analytics: false,
      publicHealth: false,
      consentGiven: false,
      patientSignature: '',
      guardianConsent: false,
      consentDate: new Date()
    });
    setActiveStep(0);
    setSuccess(false);
    setError(null);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonAdd sx={{ mr: 1 }} />
                Patient Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Search Patient"
                placeholder="Search by name, ABHA ID, or phone number"
                value={patientSearchTerm}
                onChange={(e) => setPatientSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Select Patient:
              </Typography>
              <Grid container spacing={2}>
                {filteredPatients.map((patient) => (
                  <Grid item xs={12} md={6} key={patient.id}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        border: selectedPatient?.id === patient.id ? '2px solid' : '1px solid',
                        borderColor: selectedPatient?.id === patient.id ? 'primary.main' : 'divider',
                        '&:hover': { elevation: 4 }
                      }}
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <CardContent>
                        <Typography variant="h6">{patient.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          ABHA ID: {patient.abhaId}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          DOB: {patient.dateOfBirth.toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Contact: {patient.contactNumber}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Blood Group: {patient.bloodGroup}
                        </Typography>
                        {patient.allergies.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" color="error">
                              Allergies: {patient.allergies.join(', ')}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {selectedPatient && (
              <Grid item xs={12}>
                <Alert severity="success">
                  Patient selected: <strong>{selectedPatient.name}</strong> ({selectedPatient.abhaId})
                </Alert>
              </Grid>
            )}
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalHospital sx={{ mr: 1 }} />
                Clinical Assessment
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Encounter Date"
                  value={encounterData.date}
                  onChange={(date) => setEncounterData({ ...encounterData, date })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Encounter Type</InputLabel>
                <Select
                  value={encounterData.type}
                  onChange={(e) => setEncounterData({ ...encounterData, type: e.target.value })}
                >
                  <MenuItem value="outpatient">Outpatient</MenuItem>
                  <MenuItem value="inpatient">Inpatient</MenuItem>
                  <MenuItem value="emergency">Emergency</MenuItem>
                  <MenuItem value="telemedicine">Telemedicine</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Chief Complaint"
                multiline
                rows={3}
                value={encounterData.chiefComplaint}
                onChange={(e) => setEncounterData({ ...encounterData, chiefComplaint: e.target.value })}
                placeholder="Describe the patient's primary concern or symptom..."
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Vital Signs
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Temperature (°F)"
                value={encounterData.vitalSigns.temperature}
                onChange={(e) => setEncounterData({
                  ...encounterData,
                  vitalSigns: { ...encounterData.vitalSigns, temperature: e.target.value }
                })}
                placeholder="98.6"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Blood Pressure (mmHg)"
                value={encounterData.vitalSigns.bloodPressure}
                onChange={(e) => setEncounterData({
                  ...encounterData,
                  vitalSigns: { ...encounterData.vitalSigns, bloodPressure: e.target.value }
                })}
                placeholder="120/80"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Heart Rate (bpm)"
                value={encounterData.vitalSigns.heartRate}
                onChange={(e) => setEncounterData({
                  ...encounterData,
                  vitalSigns: { ...encounterData.vitalSigns, heartRate: e.target.value }
                })}
                placeholder="72"
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Code sx={{ mr: 1 }} />
                Diagnosis & Medical Coding
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Available Diagnoses (Select applicable conditions):
              </Typography>
              <Grid container spacing={2}>
                {mockDiseases.map((disease) => {
                  const isSelected = diagnosisData.selectedDiseases.some(d => d.id === disease.id);
                  return (
                    <Grid item xs={12} md={6} key={disease.id}>
                      <Card 
                        sx={{ 
                          cursor: 'pointer',
                          border: isSelected ? '2px solid' : '1px solid',
                          borderColor: isSelected ? 'primary.main' : 'divider',
                          backgroundColor: isSelected ? 'primary.50' : 'background.paper'
                        }}
                        onClick={() => handleDiseaseSelection(disease)}
                      >
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {disease.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {disease.description}
                          </Typography>
                          
                          <Box sx={{ mb: 2 }}>
                            <Chip label={`ICD-11: ${disease.icd11Code}`} size="small" sx={{ mr: 1, mb: 1 }} />
                            <Chip label={`ICD-11 T2: ${disease.icd11T2Code}`} size="small" sx={{ mr: 1, mb: 1 }} />
                            <Chip label={`NAMASTE: ${disease.namasteCode}`} size="small" sx={{ mb: 1 }} />
                          </Box>

                          <Typography variant="caption" color="text.secondary">
                            Category: {disease.category}
                          </Typography>
                          
                          {disease.commonSymptoms && (
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="caption" display="block">
                                Common symptoms: {disease.commonSymptoms.join(', ')}
                              </Typography>
                            </Box>
                          )}

                          {isSelected && (
                            <Box sx={{ mt: 2 }}>
                              <FormControl size="small" fullWidth>
                                <InputLabel>Severity</InputLabel>
                                <Select
                                  value={diagnosisData.selectedDiseases.find(d => d.id === disease.id)?.severity || 'Moderate'}
                                  onChange={(e) => updateDiseaseSeverity(disease.id, e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {disease.severity.map(sev => (
                                    <MenuItem key={sev} value={sev}>{sev}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>

            {diagnosisData.selectedDiseases.length > 0 && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Selected Diagnoses:
                </Typography>
                {diagnosisData.selectedDiseases.map((disease) => (
                  <Card key={disease.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6">{disease.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Severity: {disease.severity}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip label={`ICD-11: ${disease.icd11Code}`} size="small" sx={{ mr: 1 }} />
                        <Chip label={`ICD-11 T2: ${disease.icd11T2Code}`} size="small" sx={{ mr: 1 }} />
                        <Chip label={`NAMASTE: ${disease.namasteCode}`} size="small" />
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Clinical Notes"
                multiline
                rows={4}
                value={diagnosisData.clinicalNotes}
                onChange={(e) => setDiagnosisData({ ...diagnosisData, clinicalNotes: e.target.value })}
                placeholder="Additional clinical observations and notes..."
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Treatment Plan"
                multiline
                rows={4}
                value={diagnosisData.treatmentPlan}
                onChange={(e) => setDiagnosisData({ ...diagnosisData, treatmentPlan: e.target.value })}
                placeholder="Recommended treatment and follow-up plan..."
              />
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Assignment sx={{ mr: 1 }} />
                Patient Consent & Review
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Diagnosis Summary
                  </Typography>
                  <Typography variant="body2">
                    <strong>Patient:</strong> {selectedPatient?.name} ({selectedPatient?.abhaId})
                  </Typography>
                  <Typography variant="body2">
                    <strong>Date:</strong> {encounterData.date.toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Chief Complaint:</strong> {encounterData.chiefComplaint}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Diagnoses ({diagnosisData.selectedDiseases.length}):</strong>
                  </Typography>
                  {diagnosisData.selectedDiseases.map((disease, index) => (
                    <Typography key={disease.id} variant="body2" sx={{ ml: 2 }}>
                      {index + 1}. {disease.name} ({disease.severity})
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Patient Consent Form
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Please review and provide consent for the following:
                  </Typography>

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={consentData.dataSharing}
                        onChange={(e) => setConsentData({ ...consentData, dataSharing: e.target.checked })}
                      />
                    }
                    label="I consent to sharing my health data with authorized healthcare providers"
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={consentData.research}
                        onChange={(e) => setConsentData({ ...consentData, research: e.target.checked })}
                      />
                    }
                    label="I consent to use of my anonymized data for medical research"
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={consentData.analytics}
                        onChange={(e) => setConsentData({ ...consentData, analytics: e.target.checked })}
                      />
                    }
                    label="I consent to use of my data for healthcare analytics and quality improvement"
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={consentData.publicHealth}
                        onChange={(e) => setConsentData({ ...consentData, publicHealth: e.target.checked })}
                      />
                    }
                    label="I consent to sharing relevant data for public health monitoring"
                  />

                  <Divider sx={{ my: 2 }} />

                  <TextField
                    fullWidth
                    label="Patient/Guardian Signature"
                    value={consentData.patientSignature}
                    onChange={(e) => setConsentData({ ...consentData, patientSignature: e.target.value })}
                    placeholder="Type full name as digital signature"
                    sx={{ mb: 2 }}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={consentData.consentGiven}
                        onChange={(e) => setConsentData({ ...consentData, consentGiven: e.target.checked })}
                      />
                    }
                    label="I confirm that I have read and understood the above consent form and agree to proceed with the diagnosis and treatment"
                  />
                </CardContent>
              </Card>
            </Grid>

            {consentData.consentGiven && (
              <Grid item xs={12}>
                <Alert severity="success">
                  <strong>Consent Confirmed!</strong> Ready to submit diagnosis record.
                </Alert>
              </Grid>
            )}
          </Grid>
        );

      case 4:
        return success ? (
          <Box textAlign="center" py={4}>
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" color="success.main" gutterBottom>
              Diagnosis Submitted Successfully!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Medical record has been created with dual coding compliance (ICD-11 & NAMASTE).
            </Typography>
            
            {submittedDiagnosis && (
              <Card sx={{ maxWidth: 600, mx: 'auto', mt: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Diagnosis Record Details
                  </Typography>
                  <Typography variant="body2">
                    <strong>Record ID:</strong> {submittedDiagnosis.id}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Patient:</strong> {submittedDiagnosis.patientName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Date:</strong> {submittedDiagnosis.encounterDate.toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Diagnoses:</strong> {submittedDiagnosis.diagnoses.length} condition(s)
                  </Typography>
                </CardContent>
              </Card>
            )}

            <Box sx={{ mt: 4 }}>
              <Button 
                variant="contained" 
                onClick={resetForm}
                sx={{ mr: 2 }}
              >
                Create New Diagnosis
              </Button>
              <Button 
                variant="outlined"
                onClick={() => window.location.href = '/diagnosis-history'}
              >
                View Diagnosis History
              </Button>
            </Box>
          </Box>
        ) : (
          <Box textAlign="center" py={4}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Submitting Diagnosis...
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Patient Diagnosis Entry
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Complete diagnosis workflow with ICD-11 and NAMASTE coding compliance
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
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

          {activeStep < 4 && (
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

        {/* Confirmation Dialog */}
        <Dialog 
          open={confirmDialog} 
          onClose={() => setConfirmDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Confirm Diagnosis Submission</DialogTitle>
          <DialogContent>
            <Typography gutterBottom>
              Please review the diagnosis information before submission:
            </Typography>
            
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Final Review</Typography>
                <Typography variant="body2">
                  <strong>Patient:</strong> {selectedPatient?.name} ({selectedPatient?.abhaId})
                </Typography>
                <Typography variant="body2">
                  <strong>Chief Complaint:</strong> {encounterData.chiefComplaint}
                </Typography>
                <Typography variant="body2">
                  <strong>Diagnoses:</strong> {diagnosisData.selectedDiseases.length} condition(s)
                </Typography>
                <Typography variant="body2">
                  <strong>Consent Status:</strong> {consentData.consentGiven ? 'Provided' : 'Not Provided'}
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2"><strong>Selected Conditions:</strong></Typography>
                  {diagnosisData.selectedDiseases.map((disease, index) => (
                    <Typography key={disease.id} variant="body2" sx={{ ml: 2 }}>
                      {index + 1}. {disease.name} - {disease.severity}
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;ICD-11: {disease.icd11Code} | T2: {disease.icd11T2Code} | NAMASTE: {disease.namasteCode}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Submitting...' : 'Confirm & Submit'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default PatientDiagnosis;