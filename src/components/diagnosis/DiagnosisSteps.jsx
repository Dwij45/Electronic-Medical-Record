import React, { useState, useEffect } from 'react';
import {
    Grid, Typography, Card, CardContent, Autocomplete, TextField, Button, Box,
    Alert, Checkbox, FormControlLabel, FormControl, InputLabel, Select, MenuItem,
    Chip, Divider, CircularProgress, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, List, ListItem, ListItemText, ListItemIcon, Paper,
    Switch
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
    PersonAdd, Security, History, LocalHospital, Code, Assignment, CheckCircle,
    Search, Phone, Verified, MedicalServices, Warning, AccessTime, LocalPharmacy
} from '@mui/icons-material';

// Import mock data and traditional diseases
import { mockPatients, mockDiseases } from '../../data/mockData';
import { traditionalDiseases, ayushSystems } from '../../data/traditionalDiseases';

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
                                    {selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
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

// OTP Verification Step
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
                timeRemaining: 60,
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
                        <strong> Authentication Successful!</strong> You can proceed to the next step.
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

                        {selectedPatient?.medicalHistory && selectedPatient.medicalHistory.length > 0 ? (
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
                        {selectedPatient?.vitalsHistory && selectedPatient.vitalsHistory.length > 0 ? (
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
                        {selectedPatient?.labResults && selectedPatient.labResults.length > 0 ? (
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

            {selectedPatient?.allergies && selectedPatient.allergies.length > 0 && (
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

// Enhanced DiagnosisCoding with Dual Coding
export const DiagnosisCoding = ({ diagnosisData, setDiagnosisData }) => {
    // Existing modern medicine search state
    const [diseaseSearchTerm, setDiseaseSearchTerm] = useState('');
    const [filteredDiseases, setFilteredDiseases] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // NEW: Traditional medicine state
    const [traditionalMode, setTraditionalMode] = useState(false);
    const [selectedAyushSystem, setSelectedAyushSystem] = useState('');
    const [traditionalSearchTerm, setTraditionalSearchTerm] = useState('');
    const [traditionalSuggestions, setTraditionalSuggestions] = useState([]);
    const [dualCodedDiagnoses, setDualCodedDiagnoses] = useState([]);

    // Existing modern medicine search logic
    useEffect(() => {
        try {
            if (diseaseSearchTerm && diseaseSearchTerm.trim().length >= 2) {
                const searchLower = diseaseSearchTerm.toLowerCase();
                const filtered = mockDiseases.filter(disease => {
                    try {
                        return (
                            (disease.name && disease.name.toLowerCase().includes(searchLower)) ||
                            (disease.category && disease.category.toLowerCase().includes(searchLower)) ||
                            (disease.icd11Code && disease.icd11Code.toLowerCase().includes(searchLower))
                        );
                    } catch (filterError) {
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
            console.error('Error in disease filter:', error);
        }
    }, [diseaseSearchTerm]);

    // NEW: Traditional medicine search
    const searchTraditionalTerms = (searchTerm) => {
        if (searchTerm.length < 2) {
            setTraditionalSuggestions([]);
            return;
        }

        const results = traditionalDiseases.filter(disease =>
            disease.system === selectedAyushSystem &&
            disease.searchTerms.some(term =>
                term.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

        setTraditionalSuggestions(results.slice(0, 5));
    };

    // NEW: Handle traditional disease selection with dual coding
    const handleTraditionalDiseaseSelect = (disease) => {
        const dualCodeEntry = {
            id: `DC_${Date.now()}`,
            traditional: {
                namasteCode: disease.namasteCode,
                sanskritName: disease.sanskritName,
                englishName: disease.englishName,
                system: disease.system
            },
            modern: {
                icd11Code: disease.icd11Code,
                modernName: disease.modernEquivalent
            },
            tm2: {
                icd11TM2Code: disease.icd11TM2Code,
                tm2Name: `Traditional ${disease.modernEquivalent}`
            },
            isDualCoded: true,
            severity: 'Moderate',
            timestamp: new Date().toISOString()
        };

        // Add to dual coded diagnoses
        setDualCodedDiagnoses(prev => [...prev, dualCodeEntry]);

        // Also add to regular selected diseases for compatibility
        const regularDiseaseEntry = {
            ...disease,
            id: dualCodeEntry.id,
            name: disease.modernEquivalent,
            severity: 'Moderate',
            isDualCoded: true
        };

        setDiagnosisData({
            ...diagnosisData,
            selectedDiseases: [...(diagnosisData.selectedDiseases || []), regularDiseaseEntry]
        });

        setTraditionalSearchTerm('');
        setTraditionalSuggestions([]);
    };

    // Existing modern disease selection
    const handleDiseaseSelection = (disease) => {
        try {
            if (!disease || !disease.id) return;
            if (!diagnosisData || !Array.isArray(diagnosisData.selectedDiseases)) return;

            const isSelected = diagnosisData.selectedDiseases.some(d => d && d.id === disease.id);
            if (!isSelected) {
                const updatedDiagnosisData = {
                    ...diagnosisData,
                    selectedDiseases: [...diagnosisData.selectedDiseases, { ...disease, severity: 'Moderate' }]
                };
                setDiagnosisData(updatedDiagnosisData);
                setDiseaseSearchTerm('');
                setShowSuggestions(false);
            }
        } catch (error) {
            console.error('Error selecting disease:', error);
        }
    };

    // Remove disease selection
    const removeDiseaseSelection = (diseaseId) => {
        try {
            const updatedDiagnosisData = {
                ...diagnosisData,
                selectedDiseases: diagnosisData.selectedDiseases.filter(d => d && d.id !== diseaseId)
            };
            setDiagnosisData(updatedDiagnosisData);

            // Also remove from dual coded diagnoses
            setDualCodedDiagnoses(prev => prev.filter(dc => dc.id !== diseaseId));
        } catch (error) {
            console.error('Error removing disease:', error);
        }
    };

    const selectedDiseases = diagnosisData?.selectedDiseases || [];

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Code sx={{ mr: 1 }} />
                    Diagnosis & Medical Coding
                </Typography>
            </Grid>

            {/* NEW: Traditional Medicine Toggle */}
            <Grid item xs={12}>
                <Card sx={{
                    border: traditionalMode ? '2px solid' : '1px solid',
                    borderColor: traditionalMode ? 'success.main' : 'divider',
                    bgcolor: traditionalMode ? 'success.50' : 'background.paper',
                    boxShadow: traditionalMode ? 4 : 1,
                    transition: 'all 0.3s ease'
                }}>

                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="h6">
                                    Traditional Medicine (AYUSH)
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Enable dual coding: NAMASTE + ICD-11 TM2 + ICD-11 Biomedicine
                                </Typography>
                            </Box>
                            <Switch
                                checked={traditionalMode}
                                onChange={(e) => setTraditionalMode(e.target.checked)}
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: 'success.main',
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                        backgroundColor: 'success.main',
                                    },
                                }}
                            />
                        </Box>

                        {traditionalMode && (
                            <Box sx={{ mt: 2 }}>
                                {/* AYUSH System Selection */}
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel>Select AYUSH System</InputLabel>
                                    <Select
                                        value={selectedAyushSystem}
                                        onChange={(e) => setSelectedAyushSystem(e.target.value)}
                                        sx={{
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: selectedAyushSystem ? 'success.main' : 'divider',
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'success.main',
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'success.main',
                                            },
                                        }}
                                    >
                                        {ayushSystems.map(system => (
                                            <MenuItem key={system.id} value={system.id}>
                                                {system.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* Traditional Search */}
                                {selectedAyushSystem && (
                                    <Box>
                                        <TextField
                                            fullWidth
                                            label="Search Traditional Disease"
                                            placeholder="Try: शिरोरोग or shirog or headache"
                                            value={traditionalSearchTerm}
                                            onChange={(e) => {
                                                setTraditionalSearchTerm(e.target.value);
                                                searchTraditionalTerms(e.target.value);
                                            }}
                                            sx={{
                                                mb: 2,
                                                '& .MuiOutlinedInput-root': {
                                                    '&:hover fieldset': {
                                                        borderColor: 'success.main',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: 'success.main',
                                                    },
                                                },
                                                '& .MuiInputLabel-root': {
                                                    '&.Mui-focused': {
                                                        color: 'success.main',
                                                    },
                                                },
                                            }}
                                        />
                                        {/* Traditional Suggestions */}
                                        {traditionalSuggestions.map(disease => (
                                            <Card
                                                key={disease.id}
                                                sx={{
                                                    mb: 1,
                                                    cursor: 'pointer',
                                                    bgcolor: 'background.paper',
                                                    border: '2px solid',
                                                    borderColor: 'success.light',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        bgcolor: 'action.hover',
                                                        borderColor: 'success.main',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: 6
                                                    }
                                                }}
                                                onClick={() => handleTraditionalDiseaseSelect(disease)}
                                            >
                                                <CardContent sx={{ py: 2 }}>
                                                    <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                                                        {disease.sanskritName} ({disease.englishName})
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                        Category: {disease.category} | System: {disease.system}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                                                        <Chip
                                                            label={`NAMASTE: ${disease.namasteCode}`}
                                                            size="small"
                                                            color="warning"
                                                            variant="filled"
                                                        />
                                                        <Chip
                                                            label={`ICD-11: ${disease.icd11Code}`}
                                                            size="small"
                                                            color="primary"
                                                            variant="outlined"
                                                        />
                                                        <Chip
                                                            label={`Modern: ${disease.modernEquivalent}`}
                                                            size="small"
                                                            color="default"
                                                            variant="outlined"
                                                        />
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        ))}

                                    </Box>
                                )}
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Grid>

            {/* Modern medicine search */}
            <Grid item xs={12} md={8}>
                <Box sx={{ position: 'relative' }}>
                    <TextField
                        fullWidth
                        label="Search for Disease or Condition"
                        placeholder="Type disease name, symptoms, or medical codes..."
                        value={diseaseSearchTerm}
                        onChange={(e) => setDiseaseSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                        sx={{ mb: 2 }}
                    />

                    {/* Search results dropdown */}
                    {showSuggestions && filteredDiseases.length > 0 && (
                        <Paper sx={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000, maxHeight: '400px', overflow: 'auto' }}>
                            {filteredDiseases.map((disease) => {
                                if (!disease?.id) return null;
                                const isSelected = selectedDiseases.some(d => d?.id === disease.id);

                                return (
                                    <Card key={disease.id} sx={{ m: 1, cursor: 'pointer', opacity: isSelected ? 0.6 : 1 }}
                                        onClick={() => !isSelected && handleDiseaseSelection(disease)}>
                                        <CardContent sx={{ py: 2 }}>
                                            <Typography variant="h6">
                                                {disease.name} {isSelected && '✓ Selected'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {disease.description}
                                            </Typography>
                                            <Box sx={{ mt: 1 }}>
                                                <Chip label={`ICD-11: ${disease.icd11Code}`} size="small" sx={{ mr: 1 }} />
                                                <Chip label={`NAMASTE: ${disease.namasteCode}`} size="small" />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </Paper>
                    )}
                </Box>
            </Grid>

            {/* Dual Coded Results */}
            {dualCodedDiagnoses.length > 0 && (
                <Grid item xs={12}>
                    <Card sx={{
                        bgcolor: 'background.paper',
                        border: '3px solid',
                        borderColor: 'success.main',
                        borderRadius: 2,
                        boxShadow: 8
                    }}>
                        <CardContent>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 3,
                                p: 2,
                                bgcolor: 'success.50',
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'success.main'
                            }}>
                                <Typography variant="h5" sx={{
                                    color: 'success.main',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    Dual Coded Diagnoses ({dualCodedDiagnoses.length})
                                </Typography>
                            </Box>

                            {dualCodedDiagnoses.map(diagnosis => (
                                <Card key={diagnosis.id} sx={{
                                    mb: 3,
                                    bgcolor: 'background.paper',
                                    border: '2px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                    boxShadow: 4
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Grid container spacing={3}>
                                            {/* Traditional Section - Dark Mode Compatible */}
                                            <Grid item xs={12} md={4}>
                                                <Box sx={{
                                                    p: 2,
                                                    bgcolor: 'warning.50',
                                                    borderRadius: 1,
                                                    border: '2px solid',
                                                    borderColor: 'warning.main'
                                                }}>
                                                    <Typography variant="subtitle1" sx={{
                                                        color: 'warning.main',
                                                        fontWeight: 'bold',
                                                        mb: 1
                                                    }}>
                                                        Traditional (NAMASTE)
                                                    </Typography>
                                                    <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                                                        {diagnosis.traditional.sanskritName}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {diagnosis.traditional.englishName}
                                                    </Typography>
                                                    <Chip
                                                        label={diagnosis.traditional.namasteCode}
                                                        size="small"
                                                        color="warning"
                                                        sx={{ mt: 1 }}
                                                    />
                                                </Box>
                                            </Grid>

                                            {/* TM2 Section - Dark Mode Compatible */}
                                            <Grid item xs={12} md={4}>
                                                <Box sx={{
                                                    p: 2,
                                                    bgcolor: 'secondary.50',
                                                    borderRadius: 1,
                                                    border: '2px solid',
                                                    borderColor: 'secondary.main'
                                                }}>
                                                    <Typography variant="subtitle1" sx={{
                                                        color: 'secondary.main',
                                                        fontWeight: 'bold',
                                                        mb: 1
                                                    }}>
                                                        ICD-11 TM2
                                                    </Typography>
                                                    <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                                                        {diagnosis.tm2.tm2Name}
                                                    </Typography>
                                                    <Chip
                                                        label={diagnosis.tm2.icd11TM2Code}
                                                        size="small"
                                                        color="secondary"
                                                        sx={{ mt: 1 }}
                                                    />
                                                </Box>
                                            </Grid>

                                            {/* Modern Section - Dark Mode Compatible */}
                                            <Grid item xs={12} md={4}>
                                                <Box sx={{
                                                    p: 2,
                                                    bgcolor: 'success.50',
                                                    borderRadius: 1,
                                                    border: '2px solid',
                                                    borderColor: 'success.main'
                                                }}>
                                                    <Typography variant="subtitle1" sx={{
                                                        color: 'success.main',
                                                        fontWeight: 'bold',
                                                        mb: 1
                                                    }}>
                                                        Modern (ICD-11)
                                                    </Typography>
                                                    <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                                                        {diagnosis.modern.modernName}
                                                    </Typography>
                                                    <Chip
                                                        label={diagnosis.modern.icd11Code}
                                                        size="small"
                                                        color="success"
                                                        sx={{ mt: 1 }}
                                                    />
                                                </Box>
                                            </Grid>
                                        </Grid>

                                        {/* Success Alert - Dark Mode Compatible */}
                                        <Alert severity="success" sx={{
                                            mt: 3,
                                            bgcolor: 'success.50',
                                            border: '1px solid',
                                            borderColor: 'success.main',
                                            '& .MuiAlert-icon': {
                                                color: 'success.main'
                                            }
                                        }}>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                                Triple Coded Successfully: NAMASTE + ICD-11 TM2 + ICD-11 Biomedicine
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                                                Ready for government reporting, insurance claims, and international interoperability
                                            </Typography>
                                        </Alert>
                                    </CardContent>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>

                </Grid>
            )}

            {/* Selected diagnoses display */}
            {selectedDiseases.length > 0 && (
                <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>
                        Selected Diagnoses ({selectedDiseases.length}):
                    </Typography>

                    {selectedDiseases.map((disease) => {
                        if (!disease?.id) return null;
                        return (
                            <Card key={disease.id} sx={{
                                mb: 2,
                                border: '2px solid',
                                borderColor: 'success.main',
                                backgroundColor: 'background.paper',
                                boxShadow: 4,
                                '&:hover': {
                                    boxShadow: 8,
                                    transform: 'translateY(-1px)',
                                    transition: 'all 0.3s ease'
                                }
                            }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="h6" color="text.primary">
                                                {disease.name || 'Unknown Disease'}
                                                {disease.isDualCoded && (
                                                    <Chip
                                                        label=" Dual Coded"
                                                        size="small"
                                                        color="success"
                                                        sx={{ ml: 1 }}
                                                    />
                                                )}
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
                    value={diagnosisData?.treatmentPlan || ''}
                    onChange={(e) => setDiagnosisData({ ...diagnosisData, treatmentPlan: e.target.value })}
                    placeholder="Recommended treatment and follow-up plan..."
                />
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