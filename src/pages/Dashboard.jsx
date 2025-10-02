import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, LinearProgress, Chip,
  List, ListItem, ListItemText, ListItemIcon, Alert, IconButton, Divider,
  Avatar, Badge, Paper, Tooltip, Fade, Zoom, Collapse, Switch, FormControlLabel,
  Container, Link
} from '@mui/material';
import {
  TrendingUp, Assignment, Sync, Warning, CheckCircle, Person, Code, Analytics,
  Refresh, LocalHospital, Translate, Science, Public, Timeline, Speed,
  Notifications, Star, AutoAwesome, Language, AccountBalance, Security,
  TrendingDown, ArrowUpward, ArrowDownward, Schedule, Today, GitHub,
  Email, Phone, LocationOn, Copyright
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import diagnosisService from '../services/diagnosis.service';
import terminologyService from '../services/terminology.service';
import { format, subDays, startOfDay } from 'date-fns';

// Enhanced Dashboard with Footer and Improvements
const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [animationTrigger, setAnimationTrigger] = useState(false);
  const [dualCodingMode, setDualCodingMode] = useState(true);
  const [showTraditionalView, setShowTraditionalView] = useState(false);

  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalDiagnoses: 1247,
      todayDiagnoses: 23,
      dualCodedToday: 18,
      mappingAccuracy: 94.6,
      systemHealth: 'excellent',
      traditionalTermsUsed: 89,
      fhirResourcesGenerated: 1156,
      activeUsers: 45,
      avgResponseTime: 180
    },
    recentActivity: [
      {
        id: 1,
        type: 'dual-diagnosis',
        sanskrit: 'अर्धावभेदक',
        english: 'Ardhavabhedaka',
        modern: 'Migraine',
        practitioner: 'Dr. Sharma',
        time: '5 mins ago',
        codes: { namaste: 'NAM004', icd11: '8A80', tm2: 'TM2.A01.2' }
      },
      {
        id: 2,
        type: 'traditional-search',
        sanskrit: 'मधुमेह',
        english: 'Madhumeha',
        modern: 'Type 2 Diabetes',
        practitioner: 'Dr. Patel',
        time: '12 mins ago',
        codes: { namaste: 'NAM001', icd11: '5A11', tm2: 'TM2.E01.1' }
      },
      {
        id: 3,
        type: 'fhir-generation',
        sanskrit: 'कास',
        english: 'Kasa',
        modern: 'Chronic Cough',
        practitioner: 'Dr. Kumar',
        time: '18 mins ago',
        codes: { namaste: 'NAM008', icd11: 'R05', tm2: 'TM2.R01.2' }
      }
    ],
    quickStats: {
      ayushSystems: { ayurveda: 76, siddha: 14, unani: 8, yoga: 2 },
      weeklyGrowth: 24,
      governmentCompliance: 100,
      userSatisfaction: 96
    },
    systemStatus: {
      namasteSync: 'active',
      fhirValidation: 'passed',
      mappingService: 'optimal',
      searchPerformance: 'excellent'
    },
    notifications: [
      { type: 'success', message: 'FHIR validation completed - 100% compliant', time: '2 mins ago' },
      { type: 'info', message: 'New NAMASTE terminology update available', time: '1 hour ago' },
      { type: 'warning', message: 'Weekly backup scheduled in 30 minutes', time: '2 hours ago' }
    ]
  });

  useEffect(() => {
    loadDashboardData();
    setAnimationTrigger(true);

    // Ensure sidebar is collapsed on dashboard load
    const sidebarToggleEvent = new CustomEvent('toggleSidebar', { detail: { forceCollapse: true } });
    window.dispatchEvent(sidebarToggleEvent);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Your existing service calls here
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Dashboard data loading error:', error);
      setLoading(false);
    }
  };

  const getHealthColor = (health) => {
    const colors = {
      excellent: 'success',
      good: 'primary',
      warning: 'warning',
      critical: 'error'
    };
    return colors[health] || 'primary';
  };

  const ActivityIcon = ({ type }) => {
    const icons = {
      'dual-diagnosis': <Translate color="primary" />,
      'traditional-search': <Language color="secondary" />,
      'fhir-generation': <Code color="success" />
    };
    return icons[type] || <Assignment />;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <LocalHospital sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">Loading Dashboard...</Typography>
          <LinearProgress sx={{ mt: 2, width: 200 }} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Main Content */}
      <Box sx={{ flexGrow: 1, maxWidth: 1400, mx: 'auto', p: 3, width: '100%' }}>
        {/* Hero Section - Enhanced Blue Gradient */}
        <Fade in={animationTrigger} timeout={800}>
          <Paper sx={{
            p: 4,
            mb: 4,
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 25%, #3b82f6 50%, #60a5fa 75%, #93c5fd 100%)',
            color: 'white',
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(30, 60, 114, 0.3)'
          }}>
            {/* Floating Elements */}
            <Box sx={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: 100,
              height: 100,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.08)',
              animation: 'float 6s ease-in-out infinite'
            }} />
            <Box sx={{
              position: 'absolute',
              bottom: -30,
              left: -30,
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.05)',
              animation: 'float 4s ease-in-out infinite reverse'
            }} />
            <Box sx={{
              position: 'absolute',
              top: '50%',
              right: '20%',
              width: 60,
              height: 60,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.03)',
              animation: 'float 8s ease-in-out infinite'
            }} />

            {/* CSS Animation */}
            <style>
              {`
                @keyframes float {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-20px); }
                }
              `}
            </style>

            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h3" fontWeight="bold" gutterBottom sx={{
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  Welcome back, {user?.name || 'Dr. Dwij'}!
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.95, mb: 2, fontWeight: 300 }}>
                  Traditional Medicine + Modern Healthcare Integration Dashboard
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>

                  <Chip
                    label="FHIR R4 Compliant"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                    icon={<CheckCircle sx={{ color: 'white !important' }} />}
                  />
                  <Chip
                    label="NAMASTE Integrated"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                    icon={<Language sx={{ color: 'white !important' }} />}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h2" fontWeight="bold" gutterBottom sx={{
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}>
                    {dashboardData.stats.todayDiagnoses}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.95, fontSize: '1.1rem' }}>
                    Diagnoses Today
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                    <ArrowUpward sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2">
                      +{dashboardData.quickStats.weeklyGrowth}% this week
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Fade>

        {/* Quick Action Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Zoom in={animationTrigger} timeout={600}>
              <Card sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-8px)', boxShadow: 8 }
              }}
                onClick={() => navigate('/diagnosis/new')}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <AutoAwesome sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>New Dual Diagnosis</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Traditional + Modern coding
                  </Typography>
                  <Button variant="contained" sx={{ mt: 2 }} fullWidth>
                    Start Diagnosis
                  </Button>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>

          <Grid item xs={12} md={3}>
            <Zoom in={animationTrigger} timeout={800}>
              <Card sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-8px)', boxShadow: 8 }
              }}
                onClick={() => navigate('/medical-coding-mapping')}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Code sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>Coding Mapping</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sanskrit ↔ ICD-11 mapping
                  </Typography>
                  <Button variant="outlined" sx={{ mt: 2 }} fullWidth>
                    View Mappings
                  </Button>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>

          <Grid item xs={12} md={3}>
            <Zoom in={animationTrigger} timeout={1000}>
              <Card sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-8px)', boxShadow: 8 }
              }}
                onClick={() => navigate('/dual-coding-analytics')}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Analytics sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>Analytics</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Performance insights
                  </Typography>
                  <Button variant="outlined" color="success" sx={{ mt: 2 }} fullWidth>
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>

          <Grid item xs={12} md={3}>
            <Zoom in={animationTrigger} timeout={1200}>
              <Card sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-8px)', boxShadow: 8 }
              }}
                onClick={() => navigate('/terminology')}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Language sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>Terminology</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Medical terms database
                  </Typography>
                  <Button variant="outlined" color="warning" sx={{ mt: 2 }} fullWidth>
                    Browse Terms
                  </Button>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        </Grid>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Left Column - Stats & Activity */}
          <Grid item xs={12} md={8}>
            {/* Real-time Stats */}
            <Fade in={animationTrigger} timeout={1000}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6">
                      Today's Performance
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={showTraditionalView}
                          onChange={(e) => setShowTraditionalView(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Traditional View"
                    />
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="primary.main" fontWeight="bold">
                          {dashboardData.stats.dualCodedToday}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Dual Coded Today
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(dashboardData.stats.dualCodedToday / dashboardData.stats.todayDiagnoses) * 100}
                          sx={{ mt: 1, height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="secondary.main" fontWeight="bold">
                          {dashboardData.stats.traditionalTermsUsed}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          NAMASTE Terms
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={89}
                          color="secondary"
                          sx={{ mt: 1, height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="success.main" fontWeight="bold">
                          {dashboardData.stats.mappingAccuracy}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Mapping Accuracy
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={dashboardData.stats.mappingAccuracy}
                          color="success"
                          sx={{ mt: 1, height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="warning.main" fontWeight="bold">
                          {dashboardData.stats.avgResponseTime}ms
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Avg Response
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={85}
                          color="warning"
                          sx={{ mt: 1, height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Fade>

            {/* Recent Activity */}
            <Fade in={animationTrigger} timeout={1200}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Recent Dual Coding Activity</Typography>
                    <Button size="small" onClick={() => navigate('/diagnosis/history')}>
                      View All
                    </Button>
                  </Box>

                  <List>
                    {dashboardData.recentActivity.map((activity, index) => (
                      <ListItem key={activity.id} sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        mb: 1,
                        transition: 'all 0.2s ease',
                        '&:hover': { bgcolor: 'action.hover', transform: 'translateX(4px)' }
                      }}>
                        <ListItemIcon>
                          <ActivityIcon type={activity.type} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                              <Typography variant="body1" fontWeight="bold">
                                {showTraditionalView ? activity.sanskrit : activity.english}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                → {activity.modern}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                {activity.practitioner} • {activity.time}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                                <Chip label={activity.codes.namaste} size="small" color="primary" />
                                <Chip label={activity.codes.icd11} size="small" color="success" />
                                <Chip label={activity.codes.tm2} size="small" color="secondary" />
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          {/* Right Column - System Status & Notifications */}
          <Grid item xs={12} md={4}>
            {/* AYUSH Systems Distribution */}
            <Fade in={animationTrigger} timeout={1400}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>AYUSH Systems Usage</Typography>
                  {Object.entries(dashboardData.quickStats.ayushSystems).map(([system, percentage], index) => (
                    <Box key={system} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {system} {system === 'ayurveda' ? '(आयुर्वेद)' : system === 'siddha' ? '(சித்தா)' : system === 'unani' ? '(یونانی)' : '(योग)'}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">{percentage}%</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        color={index === 0 ? 'primary' : index === 1 ? 'secondary' : index === 2 ? 'success' : 'warning'}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Fade>

            {/* System Status */}
            <Fade in={animationTrigger} timeout={1600}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>System Status</Typography>
                  <List dense>
                    {Object.entries(dashboardData.systemStatus).map(([system, status]) => (
                      <ListItem key={system}>
                        <ListItemIcon>
                          <CheckCircle color={status === 'active' || status === 'passed' || status === 'optimal' || status === 'excellent' ? 'success' : 'warning'} />
                        </ListItemIcon>
                        <ListItemText
                          primary={system.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          secondary={status.toUpperCase()}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Divider sx={{ my: 2 }} />

                  <Alert severity="success" sx={{ fontSize: '0.875rem' }}>
                    All systems operational. FHIR validation: 100% compliant
                  </Alert>
                </CardContent>
              </Card>
            </Fade>

            {/* Notifications */}
            <Fade in={animationTrigger} timeout={1800}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Notifications color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Recent Notifications</Typography>
                    <Badge badgeContent={dashboardData.notifications.length} color="error" sx={{ ml: 'auto' }} />
                  </Box>

                  <List dense>
                    {dashboardData.notifications.map((notification, index) => (
                      <ListItem key={index} sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        mb: 1
                      }}>
                        <ListItemIcon>
                          {notification.type === 'success' && <CheckCircle color="success" />}
                          {notification.type === 'warning' && <Warning color="warning" />}
                          {notification.type === 'info' && <Analytics color="info" />}
                        </ListItemIcon>
                        <ListItemText
                          primary={notification.message}
                          secondary={notification.time}
                          primaryTypographyProps={{ fontSize: '0.875rem' }}
                          secondaryTypographyProps={{ fontSize: '0.75rem' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>

        {/* Spacer for floating action bar */}
        <Box sx={{ height: 100 }} />
      </Box>

      {/* Enhanced Footer */}
      <Fade in={animationTrigger} timeout={2000}>
        <Paper sx={{
          mt: 'auto',
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          color: 'white',
          borderRadius: 0
        }}>
          <Container maxWidth="lg">
            <Grid container spacing={3} sx={{ py: 6 }}>
              {/* Project Info */}
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Electronic Medical Record
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                  Innovative dual coding system bridging traditional medicine with modern healthcare standards.
                  Built for SIH 2025 to revolutionize AYUSH system integration.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label="SIH 2025"
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                  <Chip
                    label="FHIR R4"
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                  <Chip
                    label="NAMASTE"
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                </Box>
              </Grid>

              {/* Quick Links */}
              <Grid item xs={12} md={2}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Quick Links
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Link
                    component="button"
                    onClick={() => navigate('/diagnosis/new')}
                    sx={{ color: 'white', textAlign: 'left', opacity: 0.9 }}
                  >
                    New Diagnosis
                  </Link>
                  <Link
                    component="button"
                    onClick={() => navigate('/medical-coding-mapping')}
                    sx={{ color: 'white', textAlign: 'left', opacity: 0.9 }}
                  >
                    Coding Mapping
                  </Link>
                  <Link
                    component="button"
                    onClick={() => navigate('/dual-coding-analytics')}
                    sx={{ color: 'white', textAlign: 'left', opacity: 0.9 }}
                  >
                    Analytics
                  </Link>
                  <Link
                    component="button"
                    onClick={() => navigate('/terminology')}
                    sx={{ color: 'white', textAlign: 'left', opacity: 0.9 }}
                  >
                    Terminology
                  </Link>
                </Box>
              </Grid>

              {/* Technical Standards */}
              <Grid item xs={12} md={3}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Technical Standards
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    - FHIR R4 Compliant
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    - ICD-11 TM2 Integration
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    - WHO Standards
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    - Ministry of AYUSH Ready
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    - DPDP Act 2023 Compliant
                  </Typography>
                </Box>
              </Grid>

              {/* Contact & Developer */}

            </Grid>

            {/* Bottom Bar */}
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
            <Box sx={{
              py: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Copyright sx={{ fontSize: 16 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Built for Smart India Hackathon 2025.
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Traditional Medicine + Modern Healthcare Integration
              </Typography>
            </Box>
          </Container>
        </Paper>
      </Fade>

    </Box>
  );
};

export default Dashboard;