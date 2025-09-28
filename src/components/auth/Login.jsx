// components/auth/Login.js

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    abhaId: '',
  });
  const [errors, setErrors] = useState({});
  const { login, loginWithABHA, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setErrors({});
  };

  const handleInputChange = (field) => (event) => {
    setCredentials({
      ...credentials,
      [field]: event.target.value,
    });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (activeTab === 0) {
      if (!credentials.email) newErrors.email = 'Email is required';
      if (!credentials.password) newErrors.password = 'Password is required';
    } else {
      if (!credentials.abhaId) newErrors.abhaId = 'ABHA ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      if (activeTab === 0) {
        await login({
          email: credentials.email,
          password: credentials.password,
        });
      } else {
        await loginWithABHA(credentials.abhaId);
      }
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by context
    }
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 400,
          width: '100%',
          borderRadius: 2,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" color="primary" gutterBottom>
            Healthcare EMR
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Terminology Integration System
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={activeTab} onChange={handleTabChange} centered>
            <Tab label="Email Login" />
            <Tab label="ABHA Login" />
          </Tabs>
        </Box>

        <form onSubmit={handleSubmit}>
          <TabPanel value={activeTab} index={0}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={credentials.email}
              onChange={handleInputChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              margin="normal"
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={credentials.password}
              onChange={handleInputChange('password')}
              error={!!errors.password}
              helperText={errors.password}
              margin="normal"
              disabled={loading}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Login using your ABHA (Ayushman Bharat Health Account) ID
            </Alert>
            <TextField
              fullWidth
              label="ABHA ID"
              value={credentials.abhaId}
              onChange={handleInputChange('abhaId')}
              error={!!errors.abhaId}
              helperText={errors.abhaId || 'Enter your 14-digit ABHA ID'}
              margin="normal"
              disabled={loading}
              placeholder="12-3456-7890-1234"
            />
          </TabPanel>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Secure authentication with OAuth 2.0 and ABHA integration
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;