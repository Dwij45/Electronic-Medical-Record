import React, { useState, useEffect } from 'react';
import {
    Grid, Typography, Card, CardContent, Autocomplete, TextField, Button, Box,
    Alert, Checkbox, FormControlLabel, FormControl, InputLabel, Select, MenuItem,
    Chip, Divider, CircularProgress, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, List, ListItem, ListItemText, ListItemIcon, Paper
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
    PersonAdd, Security, History, LocalHospital, Code, Assignment, CheckCircle,
    Search, Phone, Verified, MedicalServices, Warning, AccessTime, LocalPharmacy
} from '@mui/icons-material';
import { mockPatients, mockDiseases } from '../../data/mockData';

// Patient Selection Step
export const PatientSelection = ({ selectedPatient, setSelectedPatient }) => {
    const [patientSearchTerm, setPatientSearchTerm] = useState('');
    const [filteredPatients, setFilteredPatients] = useState(mockPatients);

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

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonAdd sx={{ mr: 1 }} />
                    Patient Information
                </Typography>
            </Grid>

            <Grid item xs={12} md={8}>
                <Autocomplete
                    options={filteredPatients}
                    getOptionLabel={(option) => `${option.name} (${option.abhaId})`}
                    value={selectedPatient}
                    onChange={(event, newValue) => setSelectedPatient(newValue)}
                    onInputChange={(event, newInputValue) => setPatientSearchTerm(newInputValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search & Select Patient"
                            placeholder="Search by name, ABHA ID, or phone number"
                            fullWidth
                            required
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                        />
                    )}
                    renderOption={(props, option) => (
                        <Box component="li" {...props}>
                            <Box>
                                <Typography variant="subtitle1">{option.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    ABHA: {option.abhaId} | {option.gender} | {option.bloodGroup}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Contact: {option.contactNumber}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                />
            </Grid>

            {selectedPatient && (
                <Grid item xs={12}>
                    <Card sx={{ backgroundColor: 'success.50', border: '1px solid', borderColor: 'success.main' }}>
                        <CardContent>
                            <Typography variant="h6" color="success.main" gutterBottom>
                                Selected Patient: {selectedPatient.name}
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2"><strong>ABHA ID:</strong> {selectedPatient.abhaId}</Typography>
                                    <Typography variant="body2"><strong>DOB:</strong> {selectedPatient.dateOfBirth.toLocaleDateString()}</Typography>
                                    <Typography variant="body2"><strong>Gender:</strong> {selectedPatient.gender}</Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2"><strong>Contact:</strong> {selectedPatient.contactNumber}</Typography>
                                    <Typography variant="body2"><strong>Blood Group:</strong> {selectedPatient.bloodGroup}</Typography>
                                    {selectedPatient.allergies.length > 0 && (
                                        <Typography variant="body2" color="error">
                                            <strong>Allergies:</strong> {selectedPatient.allergies.join(', ')}
                                        </Typography>
                                    )}
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            )}
        </Grid>
    );
};

// OTP Verification Step - FIXED
export const OTPVerification = ({ selectedPatient, otpData, setOtpData, loading, setLoading, setError }) => {
    const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

    const sendOTP = async () => {
        setLoading(true);
        setError(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const otpCode = generateOTP();
            setOtpData({
                ...otpData,
                otpSent: true,
                otpCode: otpCode,
                timeRemaining: 60, // 1 minute
                enteredOtp: '',
                verified: false
            });

            alert(`🔐 Mock OTP sent to ${selectedPatient?.contactNumber}\n\nYour OTP: ${otpCode}`);

        } catch (err) {
            setError('Failed to send OTP. Please try again.');
            setOtpData({ ...otpData, otpSent: false });
        } finally {
            setLoading(false);
        }
    };

    const verifyOTP = () => {
        if (!otpData.enteredOtp || otpData.enteredOtp.length !== 6) {
            setError('Please enter a complete 6-digit OTP');
            return false;
        }

        if (otpData.enteredOtp === otpData.otpCode) {
            setOtpData({ ...otpData, verified: true });
            setError(null);
            return true;
        } else {
            setError(`Invalid OTP. Hint: The correct OTP is ${otpData.otpCode}`);
            return false;
        }
    };

    useEffect(() => {
        let interval = null;
        if (otpData.otpSent && otpData.timeRemaining > 0 && !otpData.verified) {
            interval = setInterval(() => {
                setOtpData(prev => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }));
            }, 1000);
        } else if (otpData.timeRemaining <= 0) {
            setOtpData(prev => ({ ...prev, otpSent: false, otpCode: '', enteredOtp: '' }));
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [otpData.otpSent, otpData.timeRemaining, otpData.verified, setOtpData]);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Security sx={{ mr: 1 }} />
                    OTP Verification
                </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                            <Phone sx={{ mr: 1 }} />
                            Patient Contact Verification
                        </Typography>

                        <Typography variant="body2" sx={{ mb: 2 }}>
                            <strong>Patient:</strong> {selectedPatient?.name}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            <strong>Mobile:</strong> {selectedPatient?.contactNumber}
                        </Typography>

                        {!otpData.otpSent ? (
                            <Button
                                variant="contained"
                                onClick={sendOTP}
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} /> : <Phone />}
                                fullWidth
                                size="large"
                            >
                                {loading ? 'Sending OTP...' : 'Send OTP to Patient'}
                            </Button>
                        ) : (
                            <Box>
                                <Alert severity="info" sx={{ mb: 2 }}>
                                    OTP sent to {selectedPatient?.contactNumber}
                                </Alert>

                                <TextField
                                    fullWidth
                                    label="Enter 6-digit OTP"
                                    value={otpData.enteredOtp}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        if (value.length <= 6) {
                                            setOtpData({ ...otpData, enteredOtp: value });
                                        }
                                    }}
                                    placeholder="123456"
                                    inputProps={{
                                        maxLength: 6,
                                        style: { fontSize: '1.2rem', textAlign: 'center', letterSpacing: '0.3rem' }
                                    }}
                                    sx={{ mb: 2 }}
                                />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {otpData.timeRemaining > 0 ? (
                                            `Expires in: ${otpData.timeRemaining}s`
                                        ) : (
                                            <Typography color="error">OTP expired</Typography>
                                        )}
                                    </Typography>

                                    <Button
                                        size="small"
                                        onClick={sendOTP}
                                        disabled={otpData.timeRemaining > 0 || loading}
                                    >
                                        {otpData.timeRemaining > 0 ? `Resend (${otpData.timeRemaining}s)` : 'Resend OTP'}
                                    </Button>
                                </Box>

                                <Button
                                    variant="contained"
                                    onClick={verifyOTP}
                                    disabled={otpData.enteredOtp.length !== 6 || otpData.verified || otpData.timeRemaining <= 0}
                                    startIcon={otpData.verified ? <Verified /> : null}
                                    fullWidth
                                    color={otpData.verified ? 'success' : 'primary'}
                                    size="large"
                                >
                                    {otpData.verified ? 'OTP Verified ✓' : 'Verify OTP'}
                                </Button>

                                <Alert severity="info" sx={{ mt: 2 }}>
                                    <Typography variant="caption">
                                        <strong>Testing:</strong> OTP is {otpData.otpCode}
                                    </Typography>
                                </Alert>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Grid>

            {otpData.verified && (
                <Grid item xs={12}>
                    <Alert severity="success" icon={<Verified />}>
                        <strong>🎉 Authentication Successful!</strong> You can proceed to the next step.
                    </Alert>
                </Grid>
            )}
        </Grid>
    );
};

// Medical History Review Step
export const MedicalHistoryReview = ({ selectedPatient, historyReviewed, setHistoryReviewed }) => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <History sx={{ mr: 1 }} />
                    Medical History Review
                </Typography>
            </Grid>

            <Grid item xs={12} md={8}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Previous Diagnoses & Treatments
                        </Typography>

                        {selectedPatient?.medicalHistory.length > 0 ? (
                            selectedPatient.medicalHistory.map((record) => (
                                <Card key={record.id} sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Typography variant="subtitle1" color="primary">
                                            {record.diagnosis}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                                            {record.date.toLocaleDateString()} | {record.doctor}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            <strong>Status:</strong> <Chip label={record.status} size="small"
                                                color={record.status === 'Active' ? 'error' : record.status === 'Controlled' ? 'warning' : 'success'} />
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Hospital:</strong> {record.hospital}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Prescription:</strong> {record.prescription.join(', ')}
                                        </Typography>
                                        {record.followUp && (
                                            <Typography variant="body2" color="warning.main">
                                                <strong>Next Follow-up:</strong> {record.followUp.toLocaleDateString()}
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Alert severity="info">
                                No previous medical history found for this patient.
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={4}>
                <Card sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Recent Vitals
                        </Typography>
                        {selectedPatient?.vitalsHistory.length > 0 ? (
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date</TableCell>
                                            <TableCell>BP</TableCell>
                                            <TableCell>HR</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedPatient.vitalsHistory.map((vital, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{vital.date.toLocaleDateString()}</TableCell>
                                                <TableCell>{vital.bloodPressure}</TableCell>
                                                <TableCell>{vital.heartRate}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                No vital signs history available.
                            </Typography>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Recent Lab Results
                        </Typography>
                        {selectedPatient?.labResults.length > 0 ? (
                            <List dense>
                                {selectedPatient.labResults.map((lab, index) => (
                                    <ListItem key={index}>
                                        <ListItemIcon>
                                            <LocalPharmacy color={lab.status === 'Normal' ? 'success' : 'warning'} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={lab.test}
                                            secondary={`${lab.result} (${lab.status})`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                No lab results available.
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Grid>

            {selectedPatient?.allergies.length > 0 && (
                <Grid item xs={12}>
                    <Alert severity="error" icon={<Warning />}>
                        <strong>ALLERGIES ALERT:</strong> Patient is allergic to: {selectedPatient.allergies.join(', ')}
                    </Alert>
                </Grid>
            )}

            <Grid item xs={12}>
                <Card sx={{ backgroundColor: 'info.50', border: '1px solid', borderColor: 'info.main' }}>
                    <CardContent>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={historyReviewed}
                                    onChange={(e) => setHistoryReviewed(e.target.checked)}
                                />
                            }
                            label="I have reviewed the complete medical history and am ready to proceed with clinical assessment"
                        />
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

// Clinical Assessment Step
export const ClinicalAssessment = ({ encounterData, setEncounterData }) => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocalHospital sx={{ mr: 1 }} />
                    Clinical Assessment
                </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
                <DatePicker
                    label="Encounter Date"
                    value={encounterData.date}
                    onChange={(date) => setEncounterData({ ...encounterData, date })}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                />
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
};

// Diagnosis Coding Step - FIXED with Search
// Diagnosis Coding Step - CRASH-PROOF VERSION
export const DiagnosisCoding = ({ diagnosisData, setDiagnosisData }) => {
    const [diseaseSearchTerm, setDiseaseSearchTerm] = useState('');
    const [filteredDiseases, setFilteredDiseases] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Safe filter function with error handling
    useEffect(() => {
        try {
            if (diseaseSearchTerm && diseaseSearchTerm.trim().length >= 2) {
                const searchLower = diseaseSearchTerm.toLowerCase();
                const filtered = mockDiseases.filter(disease => {
                    try {
                        return (
                            (disease.name && disease.name.toLowerCase().includes(searchLower)) ||
                            (disease.category && disease.category.toLowerCase().includes(searchLower)) ||
                            (disease.icd11Code && disease.icd11Code.toLowerCase().includes(searchLower)) ||
                            (disease.namasteCode && disease.namasteCode.toLowerCase().includes(searchLower)) ||
                            (disease.description && disease.description.toLowerCase().includes(searchLower)) ||
                            (disease.commonSymptoms && Array.isArray(disease.commonSymptoms) &&
                                disease.commonSymptoms.some(symptom =>
                                    symptom && symptom.toLowerCase().includes(searchLower)
                                ))
                        );
                    } catch (filterError) {
                        console.error('Error filtering disease:', disease, filterError);
                        return false;
                    }
                });
                setFilteredDiseases(filtered || []);
                setShowSuggestions(true);
            } else {
                setFilteredDiseases([]);
                setShowSuggestions(false);
            }
        } catch (error) {
            console.error('Error in disease filter effect:', error);
            setFilteredDiseases([]);
            setShowSuggestions(false);
        }
    }, [diseaseSearchTerm]);

    // Safe disease selection with comprehensive error handling
    const handleDiseaseSelection = (disease) => {
        try {
            if (!disease || !disease.id) {
                console.error('Invalid disease object:', disease);
                return;
            }

            if (!diagnosisData || !Array.isArray(diagnosisData.selectedDiseases)) {
                console.error('Invalid diagnosisData structure:', diagnosisData);
                return;
            }

            const isSelected = diagnosisData.selectedDiseases.some(d => d && d.id === disease.id);

            if (!isSelected) {
                const newDiseaseSelection = {
                    ...disease,
                    severity: 'Moderate' // Default severity
                };

                const updatedDiagnosisData = {
                    ...diagnosisData,
                    selectedDiseases: [...diagnosisData.selectedDiseases, newDiseaseSelection]
                };

                setDiagnosisData(updatedDiagnosisData);

                // Clear search after successful selection
                setDiseaseSearchTerm('');
                setShowSuggestions(false);

                console.log('Disease selected successfully:', disease.name);
            } else {
                console.log('Disease already selected:', disease.name);
            }
        } catch (error) {
            console.error('Error selecting disease:', error);
            alert('Error selecting disease. Please try again.');
        }
    };

    // Safe disease removal
    const removeDiseaseSelection = (diseaseId) => {
        try {
            if (!diseaseId) {
                console.error('Invalid diseaseId for removal');
                return;
            }

            if (!diagnosisData || !Array.isArray(diagnosisData.selectedDiseases)) {
                console.error('Invalid diagnosisData for removal:', diagnosisData);
                return;
            }

            const updatedDiagnosisData = {
                ...diagnosisData,
                selectedDiseases: diagnosisData.selectedDiseases.filter(d => d && d.id !== diseaseId)
            };

            setDiagnosisData(updatedDiagnosisData);
            console.log('Disease removed successfully:', diseaseId);
        } catch (error) {
            console.error('Error removing disease:', error);
            alert('Error removing disease. Please try again.');
        }
    };

    // Safe severity update
    const updateDiseaseSeverity = (diseaseId, severity) => {
        try {
            if (!diseaseId || !severity) {
                console.error('Invalid parameters for severity update:', { diseaseId, severity });
                return;
            }

            if (!diagnosisData || !Array.isArray(diagnosisData.selectedDiseases)) {
                console.error('Invalid diagnosisData for severity update:', diagnosisData);
                return;
            }

            const updatedDiagnosisData = {
                ...diagnosisData,
                selectedDiseases: diagnosisData.selectedDiseases.map(disease => {
                    if (disease && disease.id === diseaseId) {
                        return { ...disease, severity };
                    }
                    return disease;
                })
            };

            setDiagnosisData(updatedDiagnosisData);
            console.log('Severity updated successfully:', { diseaseId, severity });
        } catch (error) {
            console.error('Error updating disease severity:', error);
            alert('Error updating severity. Please try again.');
        }
    };

    // Safe search change handler
    const handleSearchChange = (event) => {
        try {
            const value = event?.target?.value || '';
            setDiseaseSearchTerm(value);
        } catch (error) {
            console.error('Error handling search change:', error);
        }
    };

    // Safe clear search
    const clearSearch = () => {
        try {
            setDiseaseSearchTerm('');
            setShowSuggestions(false);
        } catch (error) {
            console.error('Error clearing search:', error);
        }
    };

    // Safe check for selected diseases
    const selectedDiseases = diagnosisData?.selectedDiseases || [];

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Code sx={{ mr: 1 }} />
                    Diagnosis & Medical Coding
                </Typography>
            </Grid>

            {/* Disease Search Box */}
            <Grid item xs={12} md={8}>
                <Box sx={{ position: 'relative' }}>
                    <TextField
                        fullWidth
                        label="Search for Disease or Condition"
                        placeholder="Type disease name, symptoms, or medical codes..."
                        value={diseaseSearchTerm}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                            endAdornment: diseaseSearchTerm && (
                                <Button size="small" onClick={clearSearch}>
                                    Clear
                                </Button>
                            )
                        }}
                        sx={{ mb: 2 }}
                    />

                    {/* Search Results Dropdown */}
                    {showSuggestions && filteredDiseases.length > 0 && (
                        <Paper sx={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            zIndex: 1000,
                            maxHeight: '400px',
                            overflow: 'auto',
                            border: '1px solid',
                            borderColor: 'primary.main'
                        }}>
                            {filteredDiseases.map((disease) => {
                                if (!disease || !disease.id) return null;

                                const isAlreadySelected = selectedDiseases.some(d => d && d.id === disease.id);

                                return (
                                    <Card
                                        key={disease.id}
                                        sx={{
                                            m: 1,
                                            cursor: isAlreadySelected ? 'not-allowed' : 'pointer',
                                            opacity: isAlreadySelected ? 0.6 : 1,
                                            border: isAlreadySelected ? '1px solid' : 'none',
                                            borderColor: isAlreadySelected ? 'success.main' : 'transparent',
                                            '&:hover': {
                                                backgroundColor: isAlreadySelected ? 'inherit' : 'action.hover'
                                            }
                                        }}
                                        onClick={() => {
                                            if (!isAlreadySelected) {
                                                handleDiseaseSelection(disease);
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ py: 2 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="h6" gutterBottom>
                                                        {disease.name || 'Unknown Disease'} {isAlreadySelected && '✓ Selected'}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" paragraph>
                                                        {disease.description || 'No description available'}
                                                    </Typography>

                                                    <Box sx={{ mb: 2 }}>
                                                        <Chip
                                                            label={`ICD-11: ${disease.icd11Code || 'N/A'}`}
                                                            size="small"
                                                            color="primary"
                                                            sx={{ mr: 1, mb: 1 }}
                                                        />
                                                        <Chip
                                                            label={`ICD-11 T2: ${disease.icd11T2Code || 'N/A'}`}
                                                            size="small"
                                                            color="secondary"
                                                            sx={{ mr: 1, mb: 1 }}
                                                        />
                                                        <Chip
                                                            label={`NAMASTE: ${disease.namasteCode || 'N/A'}`}
                                                            size="small"
                                                            color="success"
                                                            sx={{ mb: 1 }}
                                                        />
                                                    </Box>

                                                    <Typography variant="caption" color="text.secondary">
                                                        <strong>Category:</strong> {disease.category || 'N/A'} | {' '}
                                                        <strong>Symptoms:</strong> {
                                                            Array.isArray(disease.commonSymptoms)
                                                                ? disease.commonSymptoms.join(', ')
                                                                : 'N/A'
                                                        }
                                                    </Typography>
                                                </Box>

                                                {!isAlreadySelected && (
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDiseaseSelection(disease);
                                                        }}
                                                    >
                                                        Add Diagnosis
                                                    </Button>
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </Paper>
                    )}

                    {/* No Results Message */}
                    {showSuggestions && filteredDiseases.length === 0 && diseaseSearchTerm.length >= 2 && (
                        <Paper sx={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000, p: 2 }}>
                            <Typography variant="body2" color="text.secondary" textAlign="center">
                                No diseases found matching "{diseaseSearchTerm}". Try different keywords.
                            </Typography>
                        </Paper>
                    )}
                </Box>
            </Grid>

            {/* Search Tips */}
            <Grid item xs={12} md={4}>
                <Card sx={{ backgroundColor: 'info.50' }}>
                    <CardContent>
                        <Typography variant="subtitle2" gutterBottom>
                            💡 Search Tips:
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            • Disease names: "diabetes", "hypertension"
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            • Symptoms: "headache", "chest pain"
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            • Medical codes: "5A11", "BA00"
                        </Typography>
                        <Typography variant="body2">
                            • Categories: "cardiovascular", "respiratory"
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* Selected Diagnoses */}
            {selectedDiseases.length > 0 && (
                <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>
                        Selected Diagnoses ({selectedDiseases.length}):
                    </Typography>

                    {selectedDiseases.map((disease) => {
                        if (!disease || !disease.id) return null;

                        return (
                            <Card key={disease.id} sx={{ mb: 2, border: '2px solid', borderColor: 'success.main', backgroundColor: 'success.50' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="h6" gutterBottom>
                                                {disease.name || 'Unknown Disease'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" paragraph>
                                                {disease.description || 'No description available'}
                                            </Typography>

                                            <Box sx={{ mb: 2 }}>
                                                <Chip
                                                    label={`ICD-11: ${disease.icd11Code || 'N/A'}`}
                                                    size="small"
                                                    color="primary"
                                                    sx={{ mr: 1 }}
                                                />
                                                <Chip
                                                    label={`ICD-11 T2: ${disease.icd11T2Code || 'N/A'}`}
                                                    size="small"
                                                    color="secondary"
                                                    sx={{ mr: 1 }}
                                                />
                                                <Chip
                                                    label={`NAMASTE: ${disease.namasteCode || 'N/A'}`}
                                                    size="small"
                                                    color="success"
                                                />
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                                    <InputLabel>Severity</InputLabel>
                                                    <Select
                                                        value={disease.severity || 'Moderate'}
                                                        onChange={(e) => updateDiseaseSeverity(disease.id, e.target.value)}
                                                    >
                                                        {(Array.isArray(disease.severity) ? disease.severity : ['Mild', 'Moderate', 'Severe']).map(sev => (
                                                            <MenuItem key={sev} value={sev}>{sev}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>

                                                <Typography variant="body2" color="text.secondary">
                                                    <strong>Category:</strong> {disease.category || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            onClick={() => removeDiseaseSelection(disease.id)}
                                            sx={{ ml: 2 }}
                                        >
                                            Remove
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        );
                    })}
                </Grid>
            )}

            {/* Clinical Notes and Treatment Plan */}
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    label="Clinical Notes"
                    multiline
                    rows={4}
                    value={diagnosisData?.clinicalNotes || ''}
                    onChange={(e) => {
                        try {
                            setDiagnosisData({
                                ...diagnosisData,
                                clinicalNotes: e.target.value
                            });
                        } catch (error) {
                            console.error('Error updating clinical notes:', error);
                        }
                    }}
                    placeholder="Additional clinical observations and notes..."
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    label="Treatment Plan"
                    multiline
                    rows={4}
                    value={diagnosisData?.treatmentPlan || ''}
                    onChange={(e) => {
                        try {
                            setDiagnosisData({
                                ...diagnosisData,
                                treatmentPlan: e.target.value
                            });
                        } catch (error) {
                            console.error('Error updating treatment plan:', error);
                        }
                    }}
                    placeholder="Recommended treatment and follow-up plan..."
                />
            </Grid>

            {/* Available Diseases Summary */}
            <Grid item xs={12}>
                <Card sx={{ backgroundColor: 'grey.50' }}>
                    <CardContent>
                        <Typography variant="subtitle2" gutterBottom>
                            Available Conditions in Database ({mockDiseases.length}):
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {mockDiseases.map(disease => disease.name).join(' • ')}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};
// Consent Review Step
export const ConsentReview = ({ selectedPatient, encounterData, diagnosisData, consentData, setConsentData, otpData, historyReviewed }) => {
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
                            <strong>OTP Verified:</strong> {otpData.verified ? 'Yes ✓' : 'No ✗'}
                        </Typography>
                        <Typography variant="body2">
                            <strong>History Reviewed:</strong> {historyReviewed ? 'Yes ✓' : 'No ✗'}
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
                            label="I consent to use of my data for medical research"
                        />

                        <TextField
                            fullWidth
                            label="Patient/Guardian Signature"
                            value={consentData.patientSignature}
                            onChange={(e) => setConsentData({ ...consentData, patientSignature: e.target.value })}
                            placeholder="Type full name as digital signature"
                            sx={{ my: 2 }}
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={consentData.consentGiven}
                                    onChange={(e) => setConsentData({ ...consentData, consentGiven: e.target.checked })}
                                />
                            }
                            label="I confirm that I agree to proceed with the diagnosis and treatment"
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
};

// Success Step
export const SubmissionSuccess = ({ submittedDiagnosis, resetForm }) => {
    return (
        <Box textAlign="center" py={4}>
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" color="success.main" gutterBottom>
                Diagnosis Submitted Successfully!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                Medical record created with ICD-11 & NAMASTE coding compliance.
            </Typography>

            {submittedDiagnosis && (
                <Card sx={{ maxWidth: 600, mx: 'auto', mt: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Record Details
                        </Typography>
                        <Typography variant="body2">
                            <strong>Patient:</strong> {submittedDiagnosis.patientName}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Diagnoses:</strong> {submittedDiagnosis.diagnoses.length} condition(s)
                        </Typography>
                    </CardContent>
                </Card>
            )}

            <Box sx={{ mt: 4 }}>
                <Button variant="contained" onClick={resetForm} sx={{ mr: 2 }}>
                    Create New Diagnosis
                </Button>
                <Button variant="outlined" onClick={() => {
                    const history = JSON.parse(localStorage.getItem('diagnosisHistory') || '[]');
                    alert(`Found ${history.length} diagnosis records.`);
                }}>
                    View History
                </Button>
            </Box>
        </Box>
    );
};