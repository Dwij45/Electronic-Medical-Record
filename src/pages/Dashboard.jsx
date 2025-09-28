// pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  IconButton,
  Divider,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  Sync as SyncIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Code as CodeIcon,
  Analytics as AnalyticsIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../context/AuthContext';
import diagnosisService from '../services/diagnosis.service';
import terminologyService from '../services/terminology.service';
import { format, subDays, startOfDay } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalDiagnoses: 0,
      todayDiagnoses: 0,
      mappingAccuracy: 0,
      systemHealth: 'good',
    },
    recentDiagnoses: [],
    codeUsageData: [],
    syncStatus: {
      lastSync: null,
      status: 'synced',
      nextSync: null,
    },
    systemAlerts: [],
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load dashboard statistics
      const statsResponse = await diagnosisService.getDashboardStats();
      const recentResponse = await diagnosisService.getRecentDiagnoses(10);
      const syncResponse = await terminologyService.getSyncStatus();

      // Generate mock chart data for demonstration
      const chartData = generateChartData();

      setDashboardData({
        stats: statsResponse.data,
        recentDiagnoses: recentResponse.data,
        codeUsageData: chartData,
        syncStatus: syncResponse.data,
        systemAlerts: statsResponse.data.alerts || [],
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = startOfDay(subDays(new Date(), i));
      days.push({
        date: format(date, 'MMM dd'),
        namaste: Math.floor(Math.random() * 50) + 20,
        icd11: Math.floor(Math.random() * 40) + 15,
      });
    }
    return days;
  };

  const StatCard = ({ title, value, icon, color = 'primary', subtitle, trend }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" color={color}>
              {value}
            </Typography>
            {subtitle && (
              <Typography color="textSecondary" variant="body2">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box color={`${color}.main`}>
            {icon}
          </Box>
        </Box>
        {trend && (
          <Box mt={1}>
            <Chip
              label={trend}
              color={trend.includes('+') ? 'success' : 'default'}
              size="small"
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const pieData = [
    { name: 'NAMASTE', value: 45, color: '#2e7d32' },
    { name: 'ICD-11 TM2', value: 30, color: '#1976d2' },
    { name: 'ICD-11 Bio', value: 25, color: '#c51162' },
  ];

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Welcome back, {user?.name || 'Doctor'}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadDashboardData}
        >
          Refresh
        </Button>
      </Box>

      {/* System Alerts */}
      {dashboardData.systemAlerts.length > 0 && (
        <Box mb={3}>
          {dashboardData.systemAlerts.map((alert, index) => (
            <Alert key={index} severity={alert.severity} sx={{ mb: 1 }}>
              {alert.message}
            </Alert>
          ))}
        </Box>
      )}

      {/* Quick Stats */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Diagnoses"
            value={dashboardData.stats.totalDiagnoses}
            icon={<AssignmentIcon fontSize="large" />}
            color="primary"
            trend="+12% this week"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Diagnoses"
            value={dashboardData.stats.todayDiagnoses}
            icon={<PersonIcon fontSize="large" />}
            color="success"
            subtitle="Active patients"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Mapping Accuracy"
            value={`${dashboardData.stats.mappingAccuracy}%`}
            icon={<CodeIcon fontSize="large" />}
            color="info"
            subtitle="Auto-mapping success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="System Health"
            value={dashboardData.stats.systemHealth}
            icon={<CheckCircleIcon fontSize="large" />}
            color="success"
            subtitle="All systems operational"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Diagnosis Trends Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Diagnosis Trends (Last 7 Days)</Typography>
                <Button
                  size="small"
                  startIcon={<AnalyticsIcon />}
                  onClick={() => navigate('/analytics')}
                >
                  View Analytics
                </Button>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData.codeUsageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="namaste"
                    stroke="#2e7d32"
                    strokeWidth={3}
                    name="NAMASTE Codes"
                  />
                  <Line
                    type="monotone"
                    dataKey="icd11"
                    stroke="#1976d2"
                    strokeWidth={3}
                    name="ICD-11 Codes"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Code System Distribution */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Code System Usage
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Diagnoses */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Recent Diagnoses</Typography>
                <Button
                  size="small"
                  onClick={() => navigate('/diagnosis/history')}
                >
                  View All
                </Button>
              </Box>
              <List>
                {dashboardData.recentDiagnoses.map((diagnosis, index) => (
                  <React.Fragment key={diagnosis.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemIcon>
                        <AssignmentIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="subtitle2">
                              {diagnosis.patientName}
                            </Typography>
                            <Chip
                              label={diagnosis.primaryCode}
                              size="small"
                              color="primary"
                            />
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" color="textSecondary">
                            {diagnosis.diagnosis} • {format(new Date(diagnosis.date), 'MMM dd, HH:mm')}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < dashboardData.recentDiagnoses.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Sync Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="between" alignItems="center" mb={2}>
                <Typography variant="h6">System Sync Status</Typography>
                <IconButton
                  onClick={() => terminologyService.syncCodeSystems()}
                  size="small"
                >
                  <SyncIcon />
                </IconButton>
              </Box>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="NAMASTE CodeSystem"
                    secondary={`Last sync: ${dashboardData.syncStatus.lastSync ? format(new Date(dashboardData.syncStatus.lastSync), 'PPp') : 'Never'}`}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="ICD-11 TM2"
                    secondary="Synced with WHO API"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <WarningIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="ConceptMaps"
                    secondary="3 pending mappings for review"
                  />
                </ListItem>
              </List>

              {dashboardData.syncStatus.nextSync && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Next automatic sync: {format(new Date(dashboardData.syncStatus.nextSync), 'PPp')}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<AssignmentIcon />}
                    onClick={() => navigate('/diagnosis/new')}
                  >
                    New Diagnosis
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<CodeIcon />}
                    onClick={() => navigate('/terminology')}
                  >
                    Browse Codes
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AnalyticsIcon />}
                    onClick={() => navigate('/analytics')}
                  >
                    View Reports
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<SyncIcon />}
                    onClick={() => terminologyService.syncCodeSystems()}
                  >
                    Sync Systems
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;