// components/auth/Login.jsx - Fixed ABHA Login
import React, { useState, useCallback, useMemo } from 'react';
import {
  Box, Paper, Typography, TextField, Button, Tab, Tabs, Alert,
  CircularProgress, Divider, IconButton, Card, CardContent, Fade, Chip,
} from '@mui/material';
import {
  Visibility, VisibilityOff, LocalHospital, Security, HealthAndSafety,
  Psychology, Biotech, Login as LoginIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useThemeMode } from '../../context/ThemeContext';

const Login = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    abhaId: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); // Only use login from context
  const { darkMode } = useThemeMode();
  const navigate = useNavigate();

  const handleTabChange = useCallback((event, newValue) => {
    setActiveTab(newValue);
    setErrors({});
  }, []);

  const handleInputChange = useCallback((field) => (event) => {
    setCredentials(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (activeTab === 0) {
      if (!credentials.email) newErrors.email = 'Email is required';
      if (!credentials.password) newErrors.password = 'Password is required';
    } else {
      if (!credentials.abhaId) newErrors.abhaId = 'ABHA ID is required';
      if (credentials.abhaId && !/^\d{2}-\d{4}-\d{4}-\d{4}$/.test(credentials.abhaId)) {
        newErrors.abhaId = 'Please enter a valid ABHA ID format (XX-XXXX-XXXX-XXXX)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [activeTab, credentials]);

  // Standalone ABHA Login Handler
  const handleABHALogin = useCallback(async (abhaId) => {
    console.log('Starting ABHA authentication for:', abhaId);
    
    const patientDatabase = {
      '12-3456-7890-1234': {
        id: 'PAT001',
        abhaId: '12-3456-7890-1234',
        name: 'Rajesh Kumar Sharma',
        phone: '+91 98765 43210',
        email: 'rajesh.sharma@email.com',
        dateOfBirth: '1978-08-15',
        gender: 'Male',
        bloodGroup: 'B+',
        height: '175 cm',
        weight: '78 kg',
        address: {
          street: '123, Sector 15',
          city: 'Gurgaon',
          state: 'Haryana',
          pincode: '122001'
        },
        currentProblems: [
          {
            id: 1,
            sanskrit: 'अर्धावभेदक',
            english: 'Ardhavabhedaka',
            modern: 'Migraine',
            severity: 'moderate',
            status: 'ongoing',
            since: '2024-01-15',
            namasteCode: 'NAM004',
            icd11Code: '8A80',
            tm2Code: 'TM2.A01.2'
          }
        ],
        consultations: [
          {
            date: '2024-09-28',
            doctor: 'Dr. Sunita Agarwal',
            hospital: 'Apollo Ayurveda Center',
            diagnosis: 'Vata-Pitta Imbalance with stress-induced headaches',
            treatment: 'Saraswatarishta 15ml twice daily + Sumatriptan 50mg as needed',
            nextAppointment: '2024-10-15'
          }
        ],
        vitals: {
          bloodPressure: '128/82 mmHg',
          heartRate: '76 bpm',
          temperature: '98.6°F',
          oxygenSaturation: '98%',
          lastUpdated: '2024-09-28'
        }
      },
      '12-3456-7890-5678': {
        id: 'PAT002',
        abhaId: '12-3456-7890-5678',
        name: 'Priya Devi Patel',
        phone: '+91 99887 65432',
        email: 'priya.patel@email.com',
        dateOfBirth: '1991-12-03',
        gender: 'Female',
        bloodGroup: 'A+',
        height: '162 cm',
        weight: '58 kg',
        address: {
          street: '456, Civil Lines',
          city: 'Ahmedabad',
          state: 'Gujarat',
          pincode: '380001'
        },
        currentProblems: [
          {
            id: 1,
            sanskrit: 'मधुमेह',
            english: 'Madhumeha',
            modern: 'Type 2 Diabetes',
            severity: 'moderate',
            status: 'controlled',
            since: '2023-11-10',
            namasteCode: 'NAM001',
            icd11Code: '5A11',
            tm2Code: 'TM2.E01.1'
          }
        ],
        consultations: [
          {
            date: '2024-09-25',
            doctor: 'Dr. Ramesh Thakkar',
            hospital: 'Sterling Ayurveda Hospital',
            diagnosis: 'Well-controlled diabetes with Ayurvedic support',
            treatment: 'Metformin 500mg twice daily + Nishamalaki 2 tablets daily',
            nextAppointment: '2024-10-25'
          }
        ],
        vitals: {
          bloodPressure: '118/75 mmHg',
          heartRate: '72 bpm',
          temperature: '98.4°F',
          oxygenSaturation: '99%',
          lastUpdated: '2024-09-25'
        }
      }
    };

    // Simulate authentication delay
    console.log('Simulating authentication delay...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    const patient = patientDatabase[abhaId];
    console.log('Patient lookup result:', patient ? 'Found' : 'Not found');

    if (patient) {
      console.log('Storing patient data and navigating...');
      localStorage.setItem('abha_authenticated', 'true');
      localStorage.setItem('patient_data', JSON.stringify(patient));
      localStorage.setItem('user_type', 'patient');
      
      console.log('Data stored, navigating to /patient-dashboard');
      navigate('/patient-dashboard');
    } else {
      throw new Error(`ABHA ID not found. Please use: 12-3456-7890-1234 or 12-3456-7890-5678`);
    }
  }, [navigate]);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    console.log('Form submitted, activeTab:', activeTab);
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      if (activeTab === 0) {
        console.log('Doctor login attempt');
        await login({
          email: credentials.email,
          password: credentials.password,
        });
        navigate('/dashboard');
      } else {
        console.log('ABHA login attempt with ID:', credentials.abhaId);
        await handleABHALogin(credentials.abhaId);
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrors({ general: err.message || 'Login failed' });
    } finally {
      setIsLoading(false);
    }
  }, [validateForm, activeTab, login, credentials, navigate, handleABHALogin]);

  const backgroundStyles = useMemo(() => ({
    background: darkMode
      ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
      : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  }), [darkMode]);

  const features = useMemo(() => [
    { icon: <Security sx={{ color: darkMode ? '#64b5f6' : '#1976d2' }} />, text: 'ISO 22600 Secure' },
    { icon: <HealthAndSafety sx={{ color: darkMode ? '#81c784' : '#2e7d32' }} />, text: 'FHIR Compliant' },
    { icon: <Psychology sx={{ color: darkMode ? '#ba68c8' : '#7b1fa2' }} />, text: 'AI-Powered Mapping' },
    { icon: <Biotech sx={{ color: darkMode ? '#4fc3f7' : '#0277bd' }} />, text: 'Dual Coding System' },
  ], [darkMode]);

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box sx={{ width: '100vw', height: '100vh', display: 'flex', ...backgroundStyles, position: 'relative', overflow: 'hidden' }}>
      {/* Background Pattern */}
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.03,
        background: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${darkMode ? '%23ffffff' : '%231976d2'}' fill-opacity='0.3'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Left Side - Branding */}
      <Box sx={{
        width: '60%', height: '100%', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', padding: '2rem',
        color: darkMode ? 'white' : '#1a237e', position: 'relative',
        '@media (max-width: 900px)': { display: 'none' },
      }}>
        <Fade in={true} timeout={1000}>
          <Box textAlign="center" mb={6} sx={{ maxWidth: '80%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3, flexWrap: 'wrap' }}>
              <LocalHospital sx={{ fontSize: 48, mr: 2, color: darkMode ? '#64b5f6' : '#1976d2' }} />
              <Typography variant="h2" sx={{
                fontWeight: 600, color: darkMode ? '#ffffff' : '#1a237e',
                fontSize: { lg: '3rem', md: '2.5rem', sm: '2rem' },
              }}>Medical EMR</Typography>
            </Box>
            <Typography variant="h5" sx={{
              mb: 2, fontWeight: 300, opacity: 0.9,
              fontSize: { lg: '1.25rem', md: '1.125rem' },
              color: darkMode ? 'rgba(255, 255, 255, 0.8)' : '#3949ab',
            }}>Electronic Medical Records System</Typography>
            <Typography variant="body1" sx={{
              opacity: 0.7, lineHeight: 1.6,
              fontSize: { lg: '1rem', md: '0.875rem' },
              color: darkMode ? 'rgba(255, 255, 255, 0.7)' : '#5c6bc0',
            }}>Comprehensive healthcare management platform with advanced medical coding and patient data integration</Typography>
          </Box>
        </Fade>

        <Box sx={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 2, width: '100%', maxWidth: '500px',
        }}>
          {features.map((feature, index) => (
            <Card key={index} sx={{
              background: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(8px)',
              border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(25, 118, 210, 0.1)',
              color: darkMode ? 'white' : '#1a237e', transition: 'transform 0.2s ease',
              boxShadow: darkMode ? '0 2px 10px rgba(0, 0, 0, 0.1)' : '0 2px 10px rgba(25, 118, 210, 0.1)',
              '&:hover': { transform: 'translateY(-2px)' },
            }}>
              <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                {feature.icon}
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 500, fontSize: '0.875rem' }}>
                  {feature.text}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Right Side - Login Form */}
      <Box sx={{
        width: '40%', height: '100%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '1rem',
        '@media (max-width: 900px)': { width: '100%' },
      }}>
        <Paper elevation={8} sx={{
          p: 4, width: '100%', maxWidth: '420px', borderRadius: 3,
          background: darkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: darkMode ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
          '@media (max-width: 480px)': { p: 3 },
        }}>
          {/* Welcome Section */}
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" fontWeight={600} sx={{ color: darkMode ? '#ffffff' : '#1a237e', mb: 1 }}>
              Welcome Back
            </Typography>
            <Typography variant="body1" sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : '#5c6bc0', fontWeight: 400 }}>
              Access your medical dashboard
            </Typography>
          </Box>

          {errors.general && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {errors.general}
            </Alert>
          )}

          {/* Tabs */}
          <Box sx={{ mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth" sx={{
              '& .MuiTabs-indicator': { height: 2, borderRadius: 1 },
              '& .MuiTab-root': { fontWeight: 500, textTransform: 'none', fontSize: '0.925rem', minHeight: 44 },
            }}>
              <Tab label="Provider Login" icon={<LoginIcon />} iconPosition="start" />
              <Tab label="ABHA Login" icon={<Security />} iconPosition="start" />
            </Tabs>
          </Box>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <TabPanel value={activeTab} index={0}>
              <TextField
                fullWidth label="Email Address" type="email"
                value={credentials.email} onChange={handleInputChange('email')}
                error={!!errors.email} helperText={errors.email}
                margin="normal" disabled={isLoading}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <TextField
                fullWidth label="Password" type={showPassword ? 'text' : 'password'}
                value={credentials.password} onChange={handleInputChange('password')}
                error={!!errors.password} helperText={errors.password}
                margin="normal" disabled={isLoading}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={togglePasswordVisibility} edge="end" size="small">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
                <Typography variant="body2" fontWeight={500} gutterBottom>
                  Login using your ABHA (Ayushman Bharat Health Account) ID
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  📋 Demo IDs: 12-3456-7890-1234 (Rajesh Kumar) | 12-3456-7890-5678 (Priya Patel)
                </Typography>
              </Alert>
              <TextField
                fullWidth label="ABHA ID" value={credentials.abhaId}
                onChange={handleInputChange('abhaId')} error={!!errors.abhaId}
                helperText={errors.abhaId || 'Format: 12-3456-7890-1234'}
                margin="normal" disabled={isLoading} placeholder="XX-XXXX-XXXX-XXXX"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                InputProps={{
                  startAdornment: <Chip label="ABHA" size="small" color="primary" sx={{ mr: 1 }} />
                }}
              />
            </TabPanel>

            <Button type="submit" fullWidth variant="contained" size="large" disabled={isLoading} sx={{
              mt: 3, mb: 2, py: 1.5, borderRadius: 2, fontWeight: 600, fontSize: '1rem',
              textTransform: 'none', '&:disabled': { background: 'rgba(0, 0, 0, 0.12)' },
            }}>
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                `Sign In${activeTab === 1 ? ' with ABHA' : ''}`
              )}
            </Button>
          </form>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary">Secure Access</Typography>
          </Divider>

          <Box textAlign="center">
            <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
              Protected by OAuth 2.0 & ABHA Integration
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Compliant with Healthcare Standards
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;