// pages/Analytics.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { Download as DownloadIcon, FilterList as FilterIcon } from '@mui/icons-material';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  });
  const [filters, setFilters] = useState({
    codeSystem: 'all',
    practitioner: 'all',
    department: 'all',
  });

  const [analyticsData, setAnalyticsData] = useState({
    codeUsageStats: [],
    complianceMetrics: {},
    trendData: [],
    topDiagnoses: [],
    mappingAccuracy: [],
    systemPerformance: {},
  });

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange, filters]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch from your analytics API
      const mockData = generateMockAnalyticsData();
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockAnalyticsData = () => {
    // Generate mock data for demonstration
    const codeUsageStats = [
      { system: 'NAMASTE', count: 245, percentage: 45 },
      { system: 'ICD-11-TM2', count: 178, percentage: 32 },
      { system: 'ICD-11-BIO', count: 127, percentage: 23 },
    ];

    const trendData = Array.from({ length: 30 }, (_, i) => ({
      date: format(subDays(new Date(), 29 - i), 'MMM dd'),
      diagnoses: Math.floor(Math.random() * 50) + 20,
      dualCoded: Math.floor(Math.random() * 40) + 15,
      mapped: Math.floor(Math.random() * 35) + 10,
    }));

    const topDiagnoses = [
      { code: 'N-AYU-001', display: 'Vata Dosha Imbalance', count: 45, system: 'NAMASTE' },
      { code: 'N-SID-012', display: 'Kapha Vitiation', count: 38, system: 'NAMASTE' },
      { code: 'TM20.01', display: 'Qi Stagnation', count: 32, system: 'ICD-11-TM2' },
      { code: 'K25', display: 'Gastric Ulcer', count: 28, system: 'ICD-11-BIO' },
      { code: 'N-UNA-005', display: 'Mizaj Imbalance', count: 25, system: 'NAMASTE' },
    ];

    return {
      codeUsageStats,
      complianceMetrics: {
        dualCodingRate: 87,
        mappingAccuracy: 92,
        dataQuality: 94,
        consentCompliance: 98,
      },
      trendData,
      topDiagnoses,
      mappingAccuracy: [
        { month: 'Jan', accuracy: 89 },
        { month: 'Feb', accuracy: 91 },
        { month: 'Mar', accuracy: 92 },
        { month: 'Apr', accuracy: 94 },
        { month: 'May', accuracy: 92 },
        { month: 'Jun', accuracy: 93 },
      ],
      systemPerformance: {
        uptime: 99.8,
        avgResponseTime: 245,
        errorRate: 0.2,
      },
    };
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleExport = async (format) => {
    // Implementation for data export
    console.log(`Exporting data in ${format} format`);
    // This would trigger a download of the analytics data
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  const COLORS = ['#2e7d32', '#1976d2', '#c51162', '#f57c00', '#7b1fa2'];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Analytics Dashboard</Typography>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => handleExport('pdf')}
          >
            Export Report
          </Button>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={3}>
                <DatePicker
                  label="Start Date"
                  value={dateRange.start}
                  onChange={(date) => setDateRange({ ...dateRange, start: date })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <DatePicker
                  label="End Date"
                  value={dateRange.end}
                  onChange={(date) => setDateRange({ ...dateRange, end: date })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Code System</InputLabel>
                  <Select
                    value={filters.codeSystem}
                    label="Code System"
                    onChange={(e) => setFilters({ ...filters, codeSystem: e.target.value })}
                  >
                    <MenuItem value="all">All Systems</MenuItem>
                    <MenuItem value="namaste">NAMASTE</MenuItem>
                    <MenuItem value="icd11-tm2">ICD-11 TM2</MenuItem>
                    <MenuItem value="icd11-bio">ICD-11 Bio</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={filters.department}
                    label="Department"
                    onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                  >
                    <MenuItem value="all">All Departments</MenuItem>
                    <MenuItem value="ayurveda">Ayurveda</MenuItem>
                    <MenuItem value="siddha">Siddha</MenuItem>
                    <MenuItem value="unani">Unani</MenuItem>
                    <MenuItem value="general">General</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={loadAnalyticsData}
                >
                  Apply Filters
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {loading && <LinearProgress sx={{ mb: 2 }} />}

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Overview" />
            <Tab label="Code Usage" />
            <Tab label="Compliance" />
            <Tab label="Trends" />
          </Tabs>
        </Box>

        {/* Overview Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            {/* Key Metrics */}
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Diagnoses
                  </Typography>
                  <Typography variant="h4" color="primary">
                    1,247
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    This period
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Dual Coding Rate
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {analyticsData.complianceMetrics.dualCodingRate}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={analyticsData.complianceMetrics.dualCodingRate}
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Mapping Accuracy
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    {analyticsData.complianceMetrics.mappingAccuracy}%
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    Auto-mapping success
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    System Uptime
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {analyticsData.systemPerformance.uptime}%
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    Last 30 days
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Diagnosis Trends */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Diagnosis Trends (Last 30 Days)
                  </Typography>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={analyticsData.trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="diagnoses"
                        stackId="1"
                        stroke="#1976d2"
                        fill="#1976d2"
                        fillOpacity={0.8}
                        name="Total Diagnoses"
                      />
                      <Area
                        type="monotone"
                        dataKey="dualCoded"
                        stackId="2"
                        stroke="#2e7d32"
                        fill="#2e7d32"
                        fillOpacity={0.6}
                        name="Dual Coded"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Top Diagnoses */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Top Diagnoses
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        {analyticsData.topDiagnoses.map((diagnosis, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {diagnosis.code}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {diagnosis.display}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Chip
                                label={diagnosis.count}
                                size="small"
                                color="primary"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Code Usage Tab */}
        <TabPanel value={activeTab} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Code System Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData.codeUsageStats}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ system, percentage }) => `${system}: ${percentage}%`}
                      >
                        {analyticsData.codeUsageStats.map((entry, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Code Usage Statistics
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.codeUsageStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="system" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#1976d2" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Compliance Tab */}
        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Compliance metrics are calculated based on Ministry of Ayush and WHO ICD-11 standards.
              </Alert>
            </Grid>

            {/* Compliance Metrics Cards */}
            {Object.entries(analyticsData.complianceMetrics).map(([key, value]) => (
              <Grid item xs={12} md={3} key={key}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Typography>
                    <Typography variant="h4" color={value >= 90 ? 'success.main' : value >= 80 ? 'warning.main' : 'error.main'}>
                      {value}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={value}
                      color={value >= 90 ? 'success' : value >= 80 ? 'warning' : 'error'}
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {/* Mapping Accuracy Trend */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Mapping Accuracy Trend
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analyticsData.mappingAccuracy}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[80, 100]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="accuracy"
                        stroke="#2e7d32"
                        strokeWidth={3}
                        dot={{ fill: '#2e7d32', strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Trends Tab */}
        <TabPanel value={activeTab} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Monthly Diagnosis Trends
                  </Typography>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={analyticsData.trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="diagnoses"
                        stroke="#1976d2"
                        strokeWidth={2}
                        name="Total Diagnoses"
                      />
                      <Line
                        type="monotone"
                        dataKey="dualCoded"
                        stroke="#2e7d32"
                        strokeWidth={2}
                        name="Dual Coded"
                      />
                      <Line
                        type="monotone"
                        dataKey="mapped"
                        stroke="#f57c00"
                        strokeWidth={2}
                        name="Auto Mapped"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    System Performance Metrics
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Average Response Time
                      </Typography>
                      <Typography variant="h6">
                        {analyticsData.systemPerformance.avgResponseTime}ms
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={Math.max(0, 100 - (analyticsData.systemPerformance.avgResponseTime / 5))}
                        color="success"
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Error Rate
                      </Typography>
                      <Typography variant="h6" color="error.main">
                        {analyticsData.systemPerformance.errorRate}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={analyticsData.systemPerformance.errorRate * 20}
                        color="error"
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Usage Statistics
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Metric</TableCell>
                          <TableCell align="right">Value</TableCell>
                          <TableCell align="right">Change</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>Daily Active Users</TableCell>
                          <TableCell align="right">127</TableCell>
                          <TableCell align="right">
                            <Chip label="+5.2%" color="success" size="small" />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>API Requests/Day</TableCell>
                          <TableCell align="right">2,847</TableCell>
                          <TableCell align="right">
                            <Chip label="+12.3%" color="success" size="small" />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Storage Used</TableCell>
                          <TableCell align="right">2.4 GB</TableCell>
                          <TableCell align="right">
                            <Chip label="+0.8%" color="default" size="small" />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Sync Operations</TableCell>
                          <TableCell align="right">156</TableCell>
                          <TableCell align="right">
                            <Chip label="-2.1%" color="warning" size="small" />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Box>
    </LocalizationProvider>
  );
};

export default Analytics;