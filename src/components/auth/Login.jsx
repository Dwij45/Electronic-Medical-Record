// components/auth/Login.jsx - Fixed Routing
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

// Memoized background component
const AnimatedBackground = React.memo(() => (
  <Box sx={{
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1,
    background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    animation: 'float 20s ease-in-out infinite',
    '@keyframes float': {
      '0%, 100%': { transform: 'translateY(0px)' },
      '50%': { transform: 'translateY(-20px)' },
    },
  }} />
));

// Memoized feature card
const FeatureCard = React.memo(({ feature, index }) => (
  <Fade in={true} timeout={1500 + index * 200}>
    <Card sx={{
      background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)', color: 'white',
      transition: 'transform 0.3s ease', '&:hover': { transform: 'translateY(-5px)' },
    }}>
      <CardContent sx={{ textAlign: 'center', py: 2 }}>
        {feature.icon}
        <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>{feature.text}</Typography>
      </CardContent>
    </Card>
  </Fade>
));

// Memoized left panel
const LeftPanel = React.memo(({ darkMode }) => {
  const features = useMemo(() => [
    { icon: <Security color="primary" />, text: 'ISO 22600 Secure' },
    { icon: <HealthAndSafety color="success" />, text: 'FHIR Compliant' },
    { icon: <Psychology color="secondary" />, text: 'AI-Powered Mapping' },
    { icon: <Biotech color="info" />, text: 'Dual Coding System' },
  ], []);

  return (
    <Box sx={{
      width: '60%', height: '100%', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center', padding: '2rem', color: 'white',
      position: 'relative', '@media (max-width: 900px)': { display: 'none' },
    }}>
      <Fade in={true} timeout={1000}>
        <Box textAlign="center" mb={6} sx={{ maxWidth: '80%' }}>
          <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3, flexWrap: 'wrap',
          }}>
            <LocalHospital sx={{ fontSize: 60, mr: 2, color: '#64b5f6' }} />
            <Typography variant="h2" sx={{
              fontWeight: 700, background: 'linear-gradient(45deg, #64b5f6, #ffffff)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              fontSize: { lg: '3.75rem', md: '3rem', sm: '2.5rem' },
            }}>DualMed : The Healthcare EMR</Typography>
          </Box>
          <Typography variant="h5" sx={{
            mb: 2, fontWeight: 300, opacity: 0.9, fontSize: { lg: '1.5rem', md: '1.25rem' },
          }}>Advanced Terminology Integration Platform</Typography>
          <Typography variant="body1" sx={{
            opacity: 0.7, lineHeight: 1.6, fontSize: { lg: '1rem', md: '0.875rem' },
          }}>
            Seamlessly bridge traditional medicine with modern healthcare standards
            through NAMASTE and ICD-11 dual coding system
          </Typography>
        </Box>
      </Fade>

      <Box sx={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 2, width: '100%', maxWidth: '600px',
      }}>
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} index={index} />
        ))}
      </Box>
    </Box>
  );
});

const Login = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [credentials, setCredentials] = useState({ email: '', password: '', abhaId: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { darkMode } = useThemeMode();
  const navigate = useNavigate();

  const handleTabChange = useCallback((event, newValue) => {
    setActiveTab(newValue);
    setErrors({});
  }, []);

  const handleInputChange = useCallback((field) => (event) => {
    const value = event.target.value;
    setCredentials(prev => ({ ...prev, [field]: value }));
    setErrors(prev => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

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
  }, [activeTab, credentials.email, credentials.password, credentials.abhaId]);

  // ABHA Login Handler with Patient Database
  const handleABHALogin = useCallback(async (abhaId) => {
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

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const patient = patientDatabase[abhaId];
    if (patient) {
      localStorage.setItem('abha_authenticated', 'true');
      localStorage.setItem('patient_data', JSON.stringify(patient));
      localStorage.setItem('user_type', 'patient');
      return true;
    } else {
      throw new Error(`ABHA ID not found. Use: 12-3456-7890-1234 or 12-3456-7890-5678`);
    }
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      if (activeTab === 0) {
        // Healthcare Provider Login
        await login({
          email: credentials.email,
          password: credentials.password,
        });
        navigate('/dashboard');
      } else {
        // ABHA Patient Login
        await handleABHALogin(credentials.abhaId);
        navigate('/patient-dashboard');
      }
    } catch (err) {
      setErrors({ general: err.message || 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }, [validateForm, activeTab, login, credentials, navigate, handleABHALogin]);

  const TabPanel = useCallback(({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  ), []);

  const backgroundGradient = useMemo(() =>
    darkMode
      ? 'linear-gradient(135deg, #0d1421 0%, #1a1a2e 50%, #16213e 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
    , [darkMode]);

  const paperStyles = useMemo(() => ({
    p: 4, width: '100%', maxWidth: '450px', borderRadius: 4,
    background: darkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: darkMode ? '0 20px 40px rgba(0, 0, 0, 0.3)' : '0 20px 40px rgba(0, 0, 0, 0.1)',
    '@media (max-width: 480px)': { p: 3 },
  }), [darkMode]);

  return (
    <Box sx={{
      width: '100vw', height: '100vh', display: 'flex', background: backgroundGradient,
      position: 'relative', overflow: 'hidden',
    }}>
      <AnimatedBackground />
      <LeftPanel darkMode={darkMode} />

      <Box sx={{
        width: '40%', height: '100%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '1rem',
        '@media (max-width: 900px)': { width: '100%' },
      }}>
        <Fade in={true} timeout={800}>
          <Paper elevation={24} sx={paperStyles}>
            <Box textAlign="center" mb={4}>
              <Typography variant="h4" fontWeight={700} color="primary">
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sign in to access your healthcare dashboard
              </Typography>
            </Box>

            {errors.general && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {errors.general}
              </Alert>
            )}

            <Box sx={{ mb: 3 }}>
              <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth" sx={{
                '& .MuiTabs-indicator': { height: 3, borderRadius: 2 },
                '& .MuiTab-root': {
                  fontWeight: 600, textTransform: 'none',
                  fontSize: { xs: '0.875rem', sm: '1rem' }, minHeight: 48,
                },
              }}>
                <Tab label="Healthcare Provider" icon={<LoginIcon />} iconPosition="start" />
                <Tab label="ABHA Login" icon={<Security />} iconPosition="start" />
              </Tabs>
            </Box>

            <form onSubmit={handleSubmit}>
              <TabPanel value={activeTab} index={0}>
                <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                  <Typography variant="body2" fontWeight={500}>
                    Login as registered Doctor <br />
                    Email : doctor@hospital.com<br />
                    Password : password123
                  </Typography>
                </Alert>
                <TextField
                  fullWidth label="Email Address" type="email"
                  value={credentials.email} onChange={handleInputChange('email')}
                  error={!!errors.email} helperText={errors.email}
                  margin="normal" disabled={isLoading}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  InputProps={{
                    startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>@</Box>
                  }}
                />
                <TextField
                  fullWidth label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password} onChange={handleInputChange('password')}
                  error={!!errors.password} helperText={errors.password}
                  margin="normal" disabled={isLoading}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
              </TabPanel>

              <TabPanel value={activeTab} index={1}>
                <Alert severity="info" sx={{ mb: 3, borderRadius: 2, background: darkMode ? 'rgba(33, 150, 243, 0.1)' : undefined }}>
                  <Typography variant="body2" fontWeight={500}>
                    Login using your ABHA (Ayushman Bharat Health Account) ID
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    Demo IDs: 12-3456-7890-1234 (Rajesh Kumar) | 12-3456-7890-5678 (Priya Patel)
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
                mt: 4, mb: 2, py: 1.5, borderRadius: 3, fontWeight: 600, fontSize: '1.1rem',
                background: 'linear-gradient(45deg, #2196f3, #21cbf3)',
                boxShadow: '0 8px 25px rgba(33, 150, 243, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976d2, #00acc1)',
                  boxShadow: '0 12px 35px rgba(33, 150, 243, 0.4)',
                  transform: 'translateY(-2px)',
                },
                '&:disabled': { background: 'rgba(0, 0, 0, 0.12)' },
                transition: 'all 0.3s ease',
              }}>
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  `Sign In${activeTab === 1 ? ' with ABHA' : ''}`
                )}
              </Button>
            </form>

            <Divider sx={{ my: 3 }}>
              <Typography variant="caption" color="text.secondary">Secure Authentication</Typography>
            </Divider>

            <Box textAlign="center">
              <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                Protected by OAuth 2.0 & ABHA Integration
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Compliant with Indian EHR Standards 2016 & ISO 22600
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Box>
    </Box>
  );
};

export default Login;