import React, { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, Grid, Card, CardContent, Avatar, Chip,
    List, ListItem, ListItemText, ListItemIcon, Button, Alert,
    LinearProgress, IconButton, Badge, Tooltip, Switch, FormControlLabel
} from '@mui/material';
import {
    Person, Phone, LocationOn, LocalHospital, Healing, Schedule,
    Favorite, Security, ArrowBack, CalendarToday, Email, Logout,
    Notifications, Settings, Help, Download, Water, Height, MonitorWeight,
    DarkMode, LightMode
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../context/ThemeContext';
import { format, parseISO, differenceInDays, differenceInYears } from 'date-fns';

const PatientDashboard = () => {
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Theme toggle functionality
    const { darkMode, toggleDarkMode } = useThemeMode();

    useEffect(() => {
        loadPatientData();
    }, []);

    const loadPatientData = () => {
        try {
            const isAuthenticated = localStorage.getItem('abha_authenticated');
            const patientData = localStorage.getItem('patient_data');

            console.log('Loading patient data...', { isAuthenticated, hasData: !!patientData });

            if (isAuthenticated === 'true' && patientData) {
                const parsedData = JSON.parse(patientData);
                console.log('Patient data loaded:', parsedData);
                setPatient(parsedData);
            } else {
                setError('Authentication required. Please login with your ABHA ID.');
            }
        } catch (err) {
            setError('Failed to load patient data. Please try again.');
            console.error('Patient data loading error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('abha_authenticated');
        localStorage.removeItem('patient_data');
        localStorage.removeItem('user_type');
        navigate('/login');
    };

    const getSeverityColor = (severity) => {
        const colors = { mild: 'success', moderate: 'warning', severe: 'error' };
        return colors[severity] || 'primary';
    };

    const getStatusColor = (status) => {
        const colors = {
            ongoing: 'error',
            improving: 'warning',
            controlled: 'success',
            stable: 'info'
        };
        return colors[status] || 'primary';
    };

    const calculateAge = (birthDate) => {
        return differenceInYears(new Date(), parseISO(birthDate));
    };

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                bgcolor: 'background.default'
            }}>
                <Security sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    Loading Your Health Dashboard...
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Securely accessing your medical records
                </Typography>
                <LinearProgress sx={{ width: 300 }} />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
                    ABHA Authenticated • FHIR Compliant
                </Typography>
            </Box>
        );
    }

    if (error || !patient) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                bgcolor: 'background.default',
                p: 3
            }}>
                <Alert severity="error" sx={{ maxWidth: 500 }}>
                    <Typography variant="h6" gutterBottom>Access Denied</Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        {error || 'Patient data not available'}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/login')}
                        fullWidth
                    >
                        Return to Login
                    </Button>
                </Alert>
            </Box>
        );
    }

    const age = calculateAge(patient.dateOfBirth);
    const mostRecentConsultation = patient.consultations?.[0];
    const daysSinceLastVisit = mostRecentConsultation ?
        differenceInDays(new Date(), parseISO(mostRecentConsultation.date)) : 0;

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: 'background.default',
            width: '100%',
            overflow: 'hidden'
        }}>
            {/* Enhanced Header Navigation with Theme Toggle */}
            <Paper sx={{
                p: 2,
                mb: 3,
                borderRadius: 0,
                background: darkMode
                    ? 'linear-gradient(135deg, #0f3460 0%, #16213e 100%)'
                    : 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                color: 'white',
                width: '100%'
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    maxWidth: '100%',
                    mx: 'auto'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={() => navigate('/login')} sx={{ mr: 2, color: 'white' }}>
                            <ArrowBack />
                        </IconButton>
                        <Typography variant="h6">
                             Patient Portal - {patient.name.split(' ')[0]}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {/* Theme Toggle */}
                        <Tooltip title={`Switch to ${darkMode ? 'Light' : 'Dark'} Mode`}>
                            <IconButton onClick={toggleDarkMode} sx={{ color: 'white' }}>
                                {darkMode ? <LightMode /> : <DarkMode />}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Notifications">
                            <IconButton sx={{ color: 'white' }}>
                                <Badge badgeContent={3} color="error">
                                    <Notifications />
                                </Badge>
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Settings">
                            <IconButton sx={{ color: 'white' }}>
                                <Settings />
                            </IconButton>
                        </Tooltip>

                        <Button
                            variant="outlined"
                            onClick={handleLogout}
                            startIcon={<Logout />}
                            sx={{
                                color: 'white',
                                borderColor: 'white',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                            }}
                        >
                            Logout
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {/* Fixed Container with proper spacing */}
            <Box sx={{
                maxWidth: { xs: '100%', sm: '100%', md: '95%', lg: '90%', xl: '85%' },
                mx: 'auto',
                px: { xs: 2, sm: 3, md: 4 },
                pb: 4
            }}>
                {/* Enhanced Welcome Header */}
                <Paper sx={{
                    p: { xs: 3, md: 4 },
                    mb: 4,
                    background: darkMode
                        ? 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
                        : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'inherit',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    borderRadius: 3,
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Enhanced decorative elements */}
                    <Box sx={{
                        position: 'absolute',
                        top: -20,
                        right: -20,
                        width: { xs: 60, md: 100 },
                        height: { xs: 60, md: 100 },
                        borderRadius: '50%',
                        bgcolor: 'rgba(255,255,255,0.08)',
                        animation: 'float 6s ease-in-out infinite'
                    }} />
                    <Box sx={{
                        position: 'absolute',
                        bottom: -30,
                        left: -30,
                        width: { xs: 50, md: 80 },
                        height: { xs: 50, md: 80 },
                        borderRadius: '50%',
                        bgcolor: 'rgba(255,255,255,0.05)',
                        animation: 'float 4s ease-in-out infinite reverse'
                    }} />
                    <Box sx={{
                        position: 'absolute',
                        top: '30%',
                        right: '15%',
                        width: { xs: 30, md: 60 },
                        height: { xs: 30, md: 60 },
                        borderRadius: '50%',
                        bgcolor: 'rgba(255,255,255,0.03)',
                        animation: 'float 8s ease-in-out infinite'
                    }} />

                    {/* CSS Animation */}
                    <style>
                        {`
              @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-15px); }
              }
            `}
                    </style>

                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={2}>
                            <Avatar sx={{
                                width: { xs: 80, md: 100 },
                                height: { xs: 80, md: 100 },
                                mx: 'auto',
                                fontSize: { xs: '1.5rem', md: '2rem' },
                                bgcolor: darkMode
                                    ? 'rgba(255,255,255,0.2)'
                                    : 'rgba(0,0,0,0.1)',
                                color: darkMode ? 'white' : 'inherit',
                                border: darkMode
                                    ? '4px solid rgba(255,255,255,0.2)'
                                    : '4px solid rgba(0,0,0,0.1)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            }}>
                                {patient.name.split(' ').map(n => n[0]).join('')}
                            </Avatar>
                            <Box sx={{ textAlign: 'center', mt: 1 }}>
                                <Chip
                                    label="ABHA Verified"
                                    icon={<Security />}
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        color: darkMode ? 'white' : 'inherit',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        fontSize: { xs: '0.7rem', md: '0.8rem' }
                                    }}
                                />
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="h3" fontWeight="bold" gutterBottom sx={{
                                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem', lg: '3rem' },
                                color: darkMode ? 'white' : '#0277bd'
                            }}>
                                Welcome, {patient.name.split(' ')[0]}!
                            </Typography>
                            <Typography variant="h6" sx={{
                                opacity: 0.95,
                                mb: 2,
                                fontSize: { xs: '1rem', md: '1.25rem' }
                            }}>
                                ABHA ID: {patient.abhaId}
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Person sx={{ mr: 1, fontSize: 20 }} />
                                        <Typography sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
                                            {patient.gender}, {age} years old
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Phone sx={{ mr: 1, fontSize: 20 }} />
                                        <Typography sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
                                            {patient.phone}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Water sx={{ mr: 1, fontSize: 20 }} />
                                        <Typography sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
                                            Blood Group: {patient.bloodGroup}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <LocationOn sx={{ mr: 1, fontSize: 20 }} />
                                        <Typography sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
                                            {patient.address.city}, {patient.address.state}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" gutterBottom>Last Consultation</Typography>
                                {mostRecentConsultation ? (
                                    <>
                                        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{
                                            fontSize: { xs: '2rem', md: '2.5rem' }
                                        }}>
                                            {format(parseISO(mostRecentConsultation.date), 'MMM dd')}
                                        </Typography>
                                        <Typography variant="h6" sx={{
                                            opacity: 0.9,
                                            fontSize: { xs: '1rem', md: '1.25rem' },
                                            color: darkMode ? 'white' : 'black'
                                        }}>
                                            {mostRecentConsultation.doctor}
                                        </Typography>
                                        <Chip
                                            label={`${daysSinceLastVisit} days ago`}
                                            sx={{
                                                bgcolor: 'rgba(255,255,255,0.2)',
                                                color: darkMode ? 'white' : 'black',
                                                mt: 1
                                            }}
                                        />
                                    </>
                                ) : (
                                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                        No consultations yet
                                    </Typography>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Enhanced Quick Stats Cards - FIXED DUPLICATE TRANSITION */}
                <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
                    <Grid item xs={6} sm={6} md={3}>
                        <Card sx={{
                            textAlign: 'center',
                            p: 2,
                            height: '100%',
                            boxShadow: (theme) => theme.palette.mode === 'dark' ? '0 2px 8px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.1)',
                            border: (theme) => theme.palette.mode === 'dark' ? '1px solid #404040' : '1px solid #e0e0e0',
                            backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff',
                            color: (theme) => theme.palette.mode === 'dark' ? '#f0f0f0' : '#212121',
                            borderRadius: 2,
                            minHeight: { xs: 120, md: 140 },
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px) scale(1.02)',
                                boxShadow: 6
                            }
                        }}>
                            <Healing sx={{ color: 'primary.main', fontSize: { xs: 32, md: 40 }, mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold" sx={{
                                fontSize: { xs: '1.5rem', md: '2rem' }
                            }}>
                                {patient.currentProblems?.length || 0}
                            </Typography>
                            <Typography variant="body2" sx={{
                                fontSize: { xs: '0.8rem', md: '0.9rem' }
                            }}>
                                Active Conditions
                            </Typography>
                        </Card>
                    </Grid>

                    <Grid item xs={6} sm={6} md={3}>
                        <Card sx={{
                            textAlign: 'center',
                            p: 2,
                            height: '100%',
                            boxShadow: (theme) => theme.palette.mode === 'dark' ? '0 2px 8px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.1)',
                            border: (theme) => theme.palette.mode === 'dark' ? '1px solid #404040' : '1px solid #e0e0e0',
                            backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff',
                            color: (theme) => theme.palette.mode === 'dark' ? '#f0f0f0' : '#212121',
                            borderRadius: 2,
                            minHeight: { xs: 120, md: 140 },
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px) scale(1.02)',
                                boxShadow: 6
                            }
                        }}>
                            <LocalHospital sx={{ color: 'primary.main', fontSize: { xs: 32, md: 40 }, mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold" sx={{
                                fontSize: { xs: '1.5rem', md: '2rem' }
                            }}>
                                {patient.consultations?.length || 0}
                            </Typography>
                            <Typography variant="body2" sx={{
                                fontSize: { xs: '0.8rem', md: '0.9rem' }
                            }}>
                                Total Consultations
                            </Typography>
                        </Card>
                    </Grid>

                    <Grid item xs={6} sm={6} md={3}>
                        <Card sx={{
                            textAlign: 'center',
                            p: 2,
                            height: '100%',
                            boxShadow: (theme) => theme.palette.mode === 'dark' ? '0 2px 8px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.1)',
                            border: (theme) => theme.palette.mode === 'dark' ? '1px solid #404040' : '1px solid #e0e0e0',
                            backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff',
                            color: (theme) => theme.palette.mode === 'dark' ? '#f0f0f0' : '#212121',
                            borderRadius: 2,
                            minHeight: { xs: 120, md: 140 },
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px) scale(1.02)',
                                boxShadow: 6
                            }
                        }}>
                            <Schedule sx={{ color: 'primary.main', fontSize: { xs: 32, md: 40 }, mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold" sx={{
                                fontSize: { xs: '1.5rem', md: '2rem' }
                            }}>
                                {mostRecentConsultation ? format(parseISO(mostRecentConsultation.nextAppointment), 'dd') : '-'}
                            </Typography>
                            <Typography variant="body2" sx={{
                                fontSize: { xs: '0.8rem', md: '0.9rem' }
                            }}>
                                Next Appointment
                            </Typography>
                        </Card>
                    </Grid>

                    <Grid item xs={6} sm={6} md={3}>
                        <Card sx={{
                            textAlign: 'center',
                            p: 2,
                            height: '100%',
                            boxShadow: (theme) => theme.palette.mode === 'dark' ? '0 2px 8px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.1)',
                            border: (theme) => theme.palette.mode === 'dark' ? '1px solid #404040' : '1px solid #e0e0e0',
                            backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff',
                            color: (theme) => theme.palette.mode === 'dark' ? '#f0f0f0' : '#212121',
                            borderRadius: 2,
                            minHeight: { xs: 120, md: 140 },
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px) scale(1.02)',
                                boxShadow: 6
                            }
                        }}>
                            <Favorite sx={{ color: 'primary.main', fontSize: { xs: 32, md: 40 }, mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold" sx={{
                                fontSize: { xs: '1.5rem', md: '2rem' }
                            }}>
                                4.8
                            </Typography>
                            <Typography variant="body2" sx={{
                                fontSize: { xs: '0.8rem', md: '0.9rem' }
                            }}>
                                Health Score
                            </Typography>
                        </Card>
                    </Grid>
                </Grid>

                {/* Rest of your component remains the same... */}
                {/* Enhanced Main Content with better spacing */}
                <Grid container spacing={3}>
                    {/* Current Health Problems */}
                    <Grid item xs={12} lg={8}>
                        <Card sx={{
                            height: 'fit-content',
                            transition: 'all 0.3s ease',
                            '&:hover': { boxShadow: 4 }
                        }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Healing color="error" sx={{ mr: 1 }} />
                                    Current Health Conditions
                                    {patient.currentProblems?.length > 0 && (
                                        <Badge badgeContent={patient.currentProblems.length} color="error" sx={{ ml: 2 }} />
                                    )}
                                </Typography>

                                {patient.currentProblems && patient.currentProblems.length > 0 ? (
                                    <List>
                                        {patient.currentProblems.map((problem, index) => (
                                            <ListItem key={index} sx={{
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                borderRadius: 2,
                                                mb: 2,
                                                bgcolor: 'background.paper',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    bgcolor: darkMode ? 'action.hover' : 'primary.50',
                                                    transform: 'translateX(8px)',
                                                    borderColor: 'primary.main'
                                                }
                                            }}>
                                                <ListItemIcon>
                                                    <Healing color={getSeverityColor(problem.severity)} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={
                                                        <Box sx={{ mb: 1 }}>
                                                            <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 0.5 }}>
                                                                {problem.sanskrit} ({problem.english})
                                                            </Typography>
                                                            <Typography variant="body1" color="text.secondary">
                                                                Modern Diagnosis: {problem.modern}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <Box>
                                                            <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                                                                <Chip
                                                                    label={`Severity: ${problem.severity}`}
                                                                    color={getSeverityColor(problem.severity)}
                                                                    size="small"
                                                                />
                                                                <Chip
                                                                    label={`Status: ${problem.status}`}
                                                                    color={getStatusColor(problem.status)}
                                                                    size="small"
                                                                />
                                                                <Chip
                                                                    label={`Since: ${format(parseISO(problem.since), 'MMM yyyy')}`}
                                                                    size="small"
                                                                    variant="outlined"
                                                                />
                                                            </Box>
                                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                                                                <Chip label={`NAMASTE: ${problem.namasteCode}`} size="small" color="primary" />
                                                                <Chip label={`ICD-11: ${problem.icd11Code}`} size="small" color="success" />
                                                                <Chip label={`TM2: ${problem.tm2Code}`} size="small" color="secondary" />
                                                            </Box>
                                                            {mostRecentConsultation?.treatment && (
                                                                <Typography variant="body2" sx={{
                                                                    mt: 1,
                                                                    p: 1,
                                                                    bgcolor: darkMode ? 'action.hover' : 'info.50',
                                                                    borderRadius: 1,
                                                                    borderLeft: '4px solid',
                                                                    borderLeftColor: 'info.main'
                                                                }}>
                                                                    <strong>Current Treatment:</strong> {mostRecentConsultation.treatment}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Alert severity="success" sx={{ borderRadius: 2 }}>
                                        <Typography variant="body1">
                                            🎉 No active health problems! Keep up the great work with your health.
                                        </Typography>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Enhanced Right Sidebar */}
                    {/* Enhanced Right Sidebar - ULTRA COMPACT */}
                    <Grid item xs={12} lg={4}>
                        {/* Current Vitals */}
                        <Card sx={{ mb: 2, transition: 'all 0.3s ease', '&:hover': { boxShadow: 4 } }}>
                            <CardContent sx={{ pb: '12px !important' }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                    <Favorite color="error" sx={{ mr: 1 }} />
                                    Current Vitals
                                </Typography>
                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'error.50', borderRadius: 1 }}>
                                            <Typography variant="caption" fontWeight="bold" display="block">
                                                {patient.vitals?.bloodPressure || 'N/A'}
                                            </Typography>
                                            <Typography variant="caption">BP</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'primary.50', borderRadius: 1 }}>
                                            <Typography variant="caption" fontWeight="bold" display="block">
                                                {patient.vitals?.heartRate || 'N/A'}
                                            </Typography>
                                            <Typography variant="caption">HR</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'warning.50', borderRadius: 1 }}>
                                            <Typography variant="caption" fontWeight="bold" display="block">
                                                {patient.vitals?.temperature || 'N/A'}
                                            </Typography>
                                            <Typography variant="caption">Temp</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'success.50', borderRadius: 1 }}>
                                            <Typography variant="caption" fontWeight="bold" display="block">
                                                {patient.vitals?.oxygenSaturation || 'N/A'}
                                            </Typography>
                                            <Typography variant="caption">O2</Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        {/* Physical Info & Next Appointment - SIDE BY SIDE COMPACT */}
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={6}>
                                <Card sx={{ height: '100%', transition: 'all 0.3s ease', '&:hover': { boxShadow: 4 } }}>
                                    <CardContent sx={{ pb: '12px !important' }}>
                                        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Height color="primary" sx={{ mr: 0.5, fontSize: 16 }} />
                                            Physical
                                        </Typography>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="body2" fontWeight="bold">{patient.height || 'N/A'}</Typography>
                                            <Typography variant="caption" color="text.secondary">Height</Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'center', mt: 1 }}>
                                            <Typography variant="body2" fontWeight="bold">{patient.weight || 'N/A'}</Typography>
                                            <Typography variant="caption" color="text.secondary">Weight</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={6}>
                                <Card sx={{ height: '100%', transition: 'all 0.3s ease', '&:hover': { boxShadow: 4 } }}>
                                    <CardContent sx={{ pb: '12px !important' }}>
                                        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Schedule color="warning" sx={{ mr: 0.5, fontSize: 16 }} />
                                            Next Visit
                                        </Typography>
                                        {mostRecentConsultation?.nextAppointment ? (
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography variant="body2" color="primary" fontWeight="bold">
                                                    {format(parseISO(mostRecentConsultation.nextAppointment), 'MMM dd')}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                    {mostRecentConsultation.doctor.split(' ')[1]} {/* Just last name */}
                                                </Typography>
                                                <Button variant="outlined" size="small" fullWidth sx={{ mt: 0.5, py: 0.25, fontSize: '0.65rem' }}>
                                                    Reschedule
                                                </Button>
                                            </Box>
                                        ) : (
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography variant="caption" color="text.secondary">No appointment</Typography>
                                                <Button variant="outlined" size="small" fullWidth sx={{ mt: 0.5, py: 0.25, fontSize: '0.65rem' }}>
                                                    Book Now
                                                </Button>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Contact Info - Compact */}
                        <Card sx={{ transition: 'all 0.3s ease', '&:hover': { boxShadow: 4 } }}>
                            <CardContent sx={{ pb: '12px !important' }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                    <Person color="info" sx={{ mr: 1 }} />
                                    Contact Info
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Email sx={{ mr: 1, fontSize: 14, color: 'text.secondary' }} />
                                    <Typography variant="caption">{patient.email}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Phone sx={{ mr: 1, fontSize: 14, color: 'text.secondary' }} />
                                    <Typography variant="caption">{patient.phone}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <LocationOn sx={{ mr: 1, fontSize: 14, color: 'text.secondary' }} />
                                    <Typography variant="caption">{patient.address.city}, {patient.address.state}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Enhanced Quick Actions Footer */}
                <Paper sx={{
                    p: 3,
                    mt: 4,
                    bgcolor: darkMode ? 'background.paper' : 'primary.50',
                    borderRadius: 3,
                    border: darkMode ? '1px solid' : 'none',
                    borderColor: 'divider'
                }}>
                    <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                        Quick Actions
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Button
                                variant="contained"
                                fullWidth
                                startIcon={<LocalHospital />}
                                sx={{
                                    py: 1.5,
                                    transition: 'all 0.3s ease',
                                    '&:hover': { transform: 'translateY(-2px)' }
                                }}
                            >
                                Book Appointment
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Button
                                variant="outlined"
                                fullWidth
                                startIcon={<Download />}
                                sx={{
                                    py: 1.5,
                                    transition: 'all 0.3s ease',
                                    '&:hover': { transform: 'translateY(-2px)' }
                                }}
                            >
                                Download Records
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Button
                                variant="outlined"
                                fullWidth
                                startIcon={<Help />}
                                sx={{
                                    py: 1.5,
                                    transition: 'all 0.3s ease',
                                    '&:hover': { transform: 'translateY(-2px)' }
                                }}
                            >
                                Emergency Contact
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Button
                                variant="outlined"
                                fullWidth
                                startIcon={<Email />}
                                sx={{
                                    py: 1.5,
                                    transition: 'all 0.3s ease',
                                    '&:hover': { transform: 'translateY(-2px)' }
                                }}
                            >
                                Share with Doctor
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Enhanced Footer */}
                <Paper sx={{
                    p: 4,
                    mt: 4,
                    textAlign: 'center',
                    bgcolor: darkMode ? 'background.paper' : 'info.50',
                    borderRadius: 3,
                    border: darkMode ? '1px solid' : 'none',
                    borderColor: 'divider'
                }}>
                    <Typography variant="h6" gutterBottom>
                        Your Health, Our Priority
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 800, mx: 'auto' }}>
                        This dashboard shows your complete health records with traditional and modern medicine integration.
                        All data is secured with ABHA authentication and complies with FHIR R4 standards for global healthcare interoperability.
                    </Typography>

                    <Grid container spacing={3} sx={{ mt: 2 }} display="flex" justifyContent={"space-around"}>
                        
                        <Grid item xs={6} md={3}>
                            <Box sx={{
                                p: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': { bgcolor: 'action.hover' }
                            }}>
                                <Typography variant="body2" fontWeight="bold" color="secondary">
                                    Dual Coding EMR
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Traditional + Modern
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Box sx={{
                                p: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': { bgcolor: 'action.hover' }
                            }}>
                                <Typography variant="body2" fontWeight="bold" color="success.main">
                                    NAMASTE + ICD-11
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    WHO Standards
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Box sx={{
                                p: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': { bgcolor: 'action.hover' }
                            }}>
                                <Typography variant="body2" fontWeight="bold" color="info.main">
                                    FHIR R4
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Compliant
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </Box>
    );
};

export default PatientDashboard;