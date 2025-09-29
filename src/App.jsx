import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { TerminologyProvider } from './context/TerminologyContext';
import { DiagnosisProvider } from './context/DiagnosisContext';
import { ThemeModeProvider } from './context/ThemeContext';
import { SidebarProvider } from './context/SidebarContext';
import { useSidebar } from './context/SidebarContext';

// Components
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';

// Pages
import Login from './components/auth/Login';
import Dashboard from './pages/Dashboard';
import PatientDiagnosis from './pages/PatientDiagnosis';
import DiagnosisHistory from './pages/DiagnosisHistory';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Terminology from './pages/Terminology';
import MedicalCodingMapping from './pages/MedicalCodingMapping';

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeModeProvider>
        <CssBaseline />
        <AuthProvider>
          <TerminologyProvider>
            <DiagnosisProvider>
              <SidebarProvider>
                <Router>
                  <Box sx={{ display: 'flex' }}>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/login" element={<Login />} />

                      {/* Protected Routes */}
                      <Route path="/*" element={
                        <ProtectedRoute>
                          <AppLayout />
                        </ProtectedRoute>
                      } />
                    </Routes>
                  </Box>
                </Router>
              </SidebarProvider>
            </DiagnosisProvider>
          </TerminologyProvider>
        </AuthProvider>
      </ThemeModeProvider>
    </ErrorBoundary>
  );
};

// Layout component with responsive sidebar - FIXED SPACING
const AppLayout = () => {
  return (
    <>
      <Header />
      <Sidebar />
      <MainContent />
    </>
  );
};

// Separate component for main content with dynamic spacing
const MainContent = () => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        bgcolor: 'background.default',
        p: { xs: 1, sm: 2, md: 3 }, // Responsive padding
        marginTop: '64px',
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/diagnosis/new" element={<PatientDiagnosis />} />
        <Route path="/diagnosis/history" element={<DiagnosisHistory />} />
        <Route path="/terminology" element={<Terminology />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/medical-coding-mapping" element={<MedicalCodingMapping />} />
      </Routes>
    </Box>
  );
};

export default App;
