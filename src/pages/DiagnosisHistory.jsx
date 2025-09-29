import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Grid, Card, CardContent, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, Pagination, Divider,
  IconButton, Collapse, Avatar, Badge, Tooltip, CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  History, Search, FilterList, Visibility, Download, Print,
  ExpandMore, ExpandLess, Person, LocalHospital, Assignment, Code,
  CalendarToday, Refresh, Analytics, FileDownload, MedicalServices
} from '@mui/icons-material';

// Pre-populated diagnosis history data (same as before)
const initialDiagnosisHistory = [
  {
    id: 'DIAG_2024_001',
    patientId: 'PAT001',
    patientName: 'John Doe',
    patientAbhaId: 'ABHA001234567890',
    encounterDate: new Date('2024-09-25'),
    practitioner: 'Dr. Sarah Wilson',
    chiefComplaint: 'Increased thirst, frequent urination, and fatigue for the past 2 weeks',
    vitalSigns: {
      temperature: '98.6°F',
      bloodPressure: '145/95',
      heartRate: '82 bpm',
      respiratoryRate: '18/min',
      oxygenSaturation: '98%'
    },
    diagnoses: [
      {
        id: 'DIAG001',
        name: 'Type 2 Diabetes Mellitus',
        icd11Code: '5A11',
        icd11T2Code: '5A11.0',
        namasteCode: 'NAM001',
        severity: 'Moderate',
        category: 'Endocrine'
      }
    ],
    clinicalNotes: 'Patient presents with classic symptoms of diabetes. HbA1c elevated at 8.2%. Recommended lifestyle modifications and metformin therapy.',
    treatmentPlan: 'Start Metformin 500mg BD, dietary counseling, follow-up in 3 months for HbA1c monitoring',
    consentData: {
      dataSharing: true,
      research: false,
      consentGiven: true,
      patientSignature: 'John Doe'
    },
    otpVerified: true,
    historyReviewed: true,
    createdAt: new Date('2024-09-25T10:30:00'),
    status: 'Active'
  },
  {
    id: 'DIAG_2024_002',
    patientId: 'PAT002',
    patientName: 'Jane Smith',
    patientAbhaId: 'ABHA002345678901',
    encounterDate: new Date('2024-09-27'),
    practitioner: 'Dr. Rajesh Kumar',
    chiefComplaint: 'Severe headache with nausea and light sensitivity, recurring for past month',
    vitalSigns: {
      temperature: '98.2°F',
      bloodPressure: '115/75',
      heartRate: '68 bpm',
      respiratoryRate: '16/min',
      oxygenSaturation: '99%'
    },
    diagnoses: [
      {
        id: 'DIAG004',
        name: 'Migraine',
        icd11Code: '8A80',
        icd11T2Code: '8A80.0',
        namasteCode: 'NAM004',
        severity: 'Severe',
        category: 'Neurological'
      }
    ],
    clinicalNotes: 'Patient experiencing classic migraine symptoms. Triggers identified as stress and lack of sleep. No neurological deficits observed.',
    treatmentPlan: 'Prescribed Sumatriptan 50mg for acute episodes, Propranolol 40mg BD for prevention. Lifestyle counseling provided.',
    consentData: {
      dataSharing: true,
      research: true,
      consentGiven: true,
      patientSignature: 'Jane Smith'
    },
    otpVerified: true,
    historyReviewed: true,
    createdAt: new Date('2024-09-27T14:15:00'),
    status: 'Active'
  },
  {
    id: 'DIAG_2024_003',
    patientId: 'PAT003',
    patientName: 'Ram Kumar',
    patientAbhaId: 'ABHA003456789012',
    encounterDate: new Date('2024-09-28'),
    practitioner: 'Dr. Amit Patel',
    chiefComplaint: 'Heartburn and chest pain after meals, difficulty swallowing occasionally',
    vitalSigns: {
      temperature: '98.8°F',
      bloodPressure: '128/82',
      heartRate: '72 bpm',
      respiratoryRate: '18/min',
      oxygenSaturation: '97%'
    },
    diagnoses: [
      {
        id: 'DIAG005',
        name: 'Gastroesophageal Reflux Disease',
        icd11Code: 'DA22',
        icd11T2Code: 'DA22.0',
        namasteCode: 'NAM005',
        severity: 'Moderate',
        category: 'Gastrointestinal'
      }
    ],
    clinicalNotes: 'Patient reports symptoms consistent with GERD. Endoscopy recommended to rule out complications. Diet modification counseling provided.',
    treatmentPlan: 'Omeprazole 20mg BD before meals, dietary modifications (avoid spicy foods, late meals), follow-up in 6 weeks',
    consentData: {
      dataSharing: true,
      research: false,
      consentGiven: true,
      patientSignature: 'Ram Kumar'
    },
    otpVerified: true,
    historyReviewed: true,
    createdAt: new Date('2024-09-28T11:45:00'),
    status: 'Active'
  }
];

const DiagnosisHistory = () => {
  const [diagnosisHistory, setDiagnosisHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    dateFrom: null,
    dateTo: null,
    status: 'all',
    practitioner: 'all'
  });

  // Initialize with pre-populated data and load from localStorage
  useEffect(() => {
    initializeDiagnosisHistory();
  }, []);

  // Auto-refresh every 30 seconds to catch new diagnoses
  useEffect(() => {
    const interval = setInterval(() => {
      loadDiagnosisHistory(false);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Filter records based on search and filters
  useEffect(() => {
    applyFilters();
  }, [diagnosisHistory, searchTerm, filters]);

  const initializeDiagnosisHistory = () => {
    try {
      setLoading(true);

      // Get existing history from localStorage
      const existingHistory = JSON.parse(localStorage.getItem('diagnosisHistory') || '[]');

      // If no existing history, populate with initial data
      if (existingHistory.length === 0) {
        localStorage.setItem('diagnosisHistory', JSON.stringify(initialDiagnosisHistory));
        setDiagnosisHistory(initialDiagnosisHistory);
      } else {
        // Merge and sort all records
        const allRecords = [...initialDiagnosisHistory, ...existingHistory];
        // Remove duplicates based on ID
        const uniqueRecords = allRecords.filter((record, index, self) =>
          index === self.findIndex(r => r.id === record.id)
        );

        // Sort by creation date (newest first)
        const sortedHistory = uniqueRecords.sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );

        setDiagnosisHistory(sortedHistory);
        // Update localStorage with merged data
        localStorage.setItem('diagnosisHistory', JSON.stringify(sortedHistory));
      }
    } catch (error) {
      console.error('Error initializing diagnosis history:', error);
      setDiagnosisHistory(initialDiagnosisHistory);
    } finally {
      setLoading(false);
    }
  };

  const loadDiagnosisHistory = (showLoading = true) => {
    try {
      if (showLoading) setRefreshing(true);

      const history = JSON.parse(localStorage.getItem('diagnosisHistory') || '[]');

      // Sort by creation date (newest first)
      const sortedHistory = history.sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      setDiagnosisHistory(sortedHistory);
    } catch (error) {
      console.error('Error loading diagnosis history:', error);
    } finally {
      if (showLoading) setRefreshing(false);
    }
  };

  const applyFilters = () => {
    try {
      let filtered = [...diagnosisHistory];

      // Search filter
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(record =>
          record.patientName?.toLowerCase().includes(searchLower) ||
          record.patientAbhaId?.toLowerCase().includes(searchLower) ||
          record.chiefComplaint?.toLowerCase().includes(searchLower) ||
          record.practitioner?.toLowerCase().includes(searchLower) ||
          record.diagnoses?.some(diag =>
            diag.name?.toLowerCase().includes(searchLower)
          )
        );
      }

      // Date range filter
      if (filters.dateFrom) {
        filtered = filtered.filter(record =>
          new Date(record.encounterDate) >= filters.dateFrom
        );
      }
      if (filters.dateTo) {
        filtered = filtered.filter(record =>
          new Date(record.encounterDate) <= filters.dateTo
        );
      }

      // Status filter
      if (filters.status !== 'all') {
        filtered = filtered.filter(record =>
          record.status?.toLowerCase() === filters.status.toLowerCase()
        );
      }

      // Practitioner filter
      if (filters.practitioner !== 'all') {
        filtered = filtered.filter(record =>
          record.practitioner === filters.practitioner
        );
      }

      setFilteredHistory(filtered);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error applying filters:', error);
      setFilteredHistory([]);
    }
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setDetailsDialog(true);
  };

  const toggleRowExpansion = (recordId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(recordId)) {
      newExpanded.delete(recordId);
    } else {
      newExpanded.add(recordId);
    }
    setExpandedRows(newExpanded);
  };

  const exportToCSV = () => {
    try {
      const csvContent = [
        ['Date', 'Patient', 'ABHA ID', 'Chief Complaint', 'Diagnoses', 'Practitioner', 'Status'],
        ...filteredHistory.map(record => [
          new Date(record.encounterDate).toLocaleDateString(),
          record.patientName,
          record.patientAbhaId,
          record.chiefComplaint,
          record.diagnoses?.map(d => d.name).join('; ') || '',
          record.practitioner,
          record.status
        ])
      ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `diagnosis-history-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilters({
      dateFrom: null,
      dateTo: null,
      status: 'all',
      practitioner: 'all'
    });
  };

  const refreshData = () => {
    loadDiagnosisHistory(true);
  };

  // Get unique practitioners for filter dropdown
  const uniquePractitioners = [...new Set(diagnosisHistory.map(record => record.practitioner))];

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredHistory.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredHistory.length / recordsPerPage);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'error';
      case 'completed': return 'success';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
        {/* Header - Updated with subtle gradient */}
        <Paper sx={{
          p: 3,
          mb: 3,
          background: (theme) => theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
            : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'inherit',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: (theme) => theme.palette.mode === 'dark' ? '1px solid #404040' : '1px solid #e0e0e0'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <History sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="h4" gutterBottom>
                  Diagnosis History
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Comprehensive patient diagnosis records and medical history
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Badge badgeContent={filteredHistory.length} color="primary">
                <MedicalServices sx={{ fontSize: 32, color: 'primary.main' }} />
              </Badge>
              <Typography variant="h6" color="text.primary">
                {filteredHistory.length} Records
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Statistics Cards - Subtle, Dark Mode Compatible */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{
              background: (theme) => theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #53637cff 0%, #2d3748 100%)'
                : 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)',
              color: (theme) => theme.palette.mode === 'dark' ? '#e2e8f0' : '#2d3748',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: 2,
              border: (theme) => theme.palette.mode === 'dark' ? '1px solid #4a5568' : '1px solid #e2e8f0'
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold">{diagnosisHistory.length}</Typography>
                <Typography variant="body1">Total Diagnoses</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{
              background: (theme) => theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #2b6cb9 0%, #1e4a73 100%)'
                : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
              color: (theme) => theme.palette.mode === 'dark' ? '#dbeafe' : '#1e40af',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: 2,
              border: (theme) => theme.palette.mode === 'dark' ? '1px solid #2b6cb9' : '1px solid #dbeafe'
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold">
                  {diagnosisHistory.filter(r => r.status === 'Active').length}
                </Typography>
                <Typography variant="body1">Active Cases</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{
              background: (theme) => theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)'
                : 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
              color: (theme) => theme.palette.mode === 'dark' ? '#d1fae5' : '#065f46',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: 2,
              border: (theme) => theme.palette.mode === 'dark' ? '1px solid #38a169' : '1px solid #d1fae5'
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold">{uniquePractitioners.length}</Typography>
                <Typography variant="body1">Practitioners</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{
              background: (theme) => theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #d69e2e 0%, #b7791f 100%)'
                : 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              color: (theme) => theme.palette.mode === 'dark' ? '#fef3c7' : '#92400e',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: 2,
              border: (theme) => theme.palette.mode === 'dark' ? '1px solid #d69e2e' : '1px solid #fef3c7'
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold">
                  {new Set(diagnosisHistory.map(r => r.patientId)).size}
                </Typography>
                <Typography variant="body1">Unique Patients</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Filters */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search Records"
                placeholder="Search by patient name, ABHA ID, diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <DatePicker
                label="From Date"
                value={filters.dateFrom}
                onChange={(date) => setFilters({ ...filters, dateFrom: date })}
                renderInput={(params) => <TextField {...params} fullWidth size="small" />}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <DatePicker
                label="To Date"
                value={filters.dateTo}
                onChange={(date) => setFilters({ ...filters, dateTo: date })}
                renderInput={(params) => <TextField {...params} fullWidth size="small" />}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={clearAllFilters}
                  size="small"
                  startIcon={<FilterList />}
                  sx={{ borderRadius: 2 }}
                >
                  Clear
                </Button>
                <Tooltip title="Refresh Data">
                  <IconButton
                    onClick={refreshData}
                    disabled={refreshing}
                    color="primary"
                    sx={{ borderRadius: 2 }}
                  >
                    {refreshing ? <CircularProgress size={20} /> : <Refresh />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Export Actions */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Showing {currentRecords.length} of {filteredHistory.length} records
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={exportToCSV}
              disabled={filteredHistory.length === 0}
              sx={{ borderRadius: 2 }}
            >
              Export CSV
            </Button>
            <Button
              variant="outlined"
              startIcon={<Print />}
              onClick={() => window.print()}
              sx={{ borderRadius: 2 }}
            >
              Print
            </Button>
          </Box>
        </Box>

        {/* Main Table */}
        <Paper sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : currentRecords.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Analytics sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No diagnosis records found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchTerm || filters.dateFrom || filters.status !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'Start by creating your first diagnosis record'
                }
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{
                    backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50'
                  }}>
                    <TableCell width="50px"></TableCell>
                    <TableCell sx={{
                      fontWeight: 'bold',
                      color: (theme) => theme.palette.mode === 'dark' ? 'grey.100' : 'grey.900'
                    }}>
                      Date
                    </TableCell>
                    <TableCell sx={{
                      fontWeight: 'bold',
                      color: (theme) => theme.palette.mode === 'dark' ? 'grey.100' : 'grey.900'
                    }}>
                      Patient Info
                    </TableCell>
                    <TableCell sx={{
                      fontWeight: 'bold',
                      color: (theme) => theme.palette.mode === 'dark' ? 'grey.100' : 'grey.900'
                    }}>
                      Chief Complaint
                    </TableCell>
                    <TableCell sx={{
                      fontWeight: 'bold',
                      color: (theme) => theme.palette.mode === 'dark' ? 'grey.100' : 'grey.900'
                    }}>
                      Diagnoses
                    </TableCell>
                    <TableCell sx={{
                      fontWeight: 'bold',
                      color: (theme) => theme.palette.mode === 'dark' ? 'grey.100' : 'grey.900'
                    }}>
                      Practitioner
                    </TableCell>
                    <TableCell sx={{
                      fontWeight: 'bold',
                      color: (theme) => theme.palette.mode === 'dark' ? 'grey.100' : 'grey.900'
                    }}>
                      Status
                    </TableCell>
                    <TableCell sx={{
                      fontWeight: 'bold',
                      color: (theme) => theme.palette.mode === 'dark' ? 'grey.100' : 'grey.900'
                    }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentRecords.map((record) => (
                    <React.Fragment key={record.id}>
                      <TableRow hover sx={{
                        '&:hover': {
                          backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'action.hover'
                        }
                      }}>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => toggleRowExpansion(record.id)}
                          >
                            {expandedRows.has(record.id) ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {new Date(record.encounterDate).toLocaleDateString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(record.createdAt).toLocaleTimeString()}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 1, bgcolor: 'primary.main' }}>
                              <Person />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {record.patientName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {record.patientAbhaId}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 200 }}>
                            {record.chiefComplaint?.length > 50
                              ? `${record.chiefComplaint.substring(0, 50)}...`
                              : record.chiefComplaint
                            }
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            {record.diagnoses?.slice(0, 2).map((diagnosis, index) => (
                              <Chip
                                key={index}
                                label={diagnosis.name}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                            {record.diagnoses?.length > 2 && (
                              <Typography variant="caption" color="text.secondary">
                                +{record.diagnoses.length - 2} more
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {record.practitioner}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={record.status}
                            color={getStatusColor(record.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(record)}
                              color="primary"
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>

                      {/* Expanded Row Content */}
                      <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                          <Collapse in={expandedRows.has(record.id)} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 2 }}>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                  <Card variant="outlined" sx={{ borderRadius: 2 }}>
                                    <CardContent>
                                      <Typography variant="subtitle2" gutterBottom>
                                        <LocalHospital sx={{ mr: 1, verticalAlign: 'middle' }} />
                                        Vital Signs
                                      </Typography>
                                      <Grid container spacing={1}>
                                        <Grid item xs={6}>
                                          <Typography variant="caption">Temperature:</Typography>
                                          <Typography variant="body2">{record.vitalSigns?.temperature || 'N/A'}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                          <Typography variant="caption">Blood Pressure:</Typography>
                                          <Typography variant="body2">{record.vitalSigns?.bloodPressure || 'N/A'}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                          <Typography variant="caption">Heart Rate:</Typography>
                                          <Typography variant="body2">{record.vitalSigns?.heartRate || 'N/A'}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                          <Typography variant="caption">O2 Saturation:</Typography>
                                          <Typography variant="body2">{record.vitalSigns?.oxygenSaturation || 'N/A'}</Typography>
                                        </Grid>
                                      </Grid>
                                    </CardContent>
                                  </Card>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <Card variant="outlined" sx={{ borderRadius: 2 }}>
                                    <CardContent>
                                      <Typography variant="subtitle2" gutterBottom>
                                        <Code sx={{ mr: 1, verticalAlign: 'middle' }} />
                                        Medical Codes
                                      </Typography>
                                      {record.diagnoses?.map((diagnosis, index) => (
                                        <Box key={index} sx={{ mb: 1 }}>
                                          <Typography variant="body2" fontWeight="bold">
                                            {diagnosis.name}
                                          </Typography>
                                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                            <Chip label={`ICD-11: ${diagnosis.icd11Code}`} size="small" />
                                            <Chip label={`T2: ${diagnosis.icd11T2Code}`} size="small" />
                                            <Chip label={`NAMASTE: ${diagnosis.namasteCode}`} size="small" />
                                          </Box>
                                        </Box>
                                      ))}
                                    </CardContent>
                                  </Card>
                                </Grid>
                              </Grid>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
              color="primary"
              size="large"
            />
          </Box>
        )}

        {/* Detailed View Dialog - Same as before but with rounded corners */}
        <Dialog
          open={detailsDialog}
          onClose={() => setDetailsDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Visibility sx={{ mr: 1 }} />
              Detailed Diagnosis Record
            </Box>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {selectedRecord && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Patient Information
                      </Typography>
                      <Typography><strong>Name:</strong> {selectedRecord.patientName}</Typography>
                      <Typography><strong>ABHA ID:</strong> {selectedRecord.patientAbhaId}</Typography>
                      <Typography><strong>Encounter Date:</strong> {new Date(selectedRecord.encounterDate).toLocaleDateString()}</Typography>
                      <Typography><strong>Practitioner:</strong> {selectedRecord.practitioner}</Typography>
                      <Chip
                        label={selectedRecord.status}
                        color={getStatusColor(selectedRecord.status)}
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        <LocalHospital sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Vital Signs
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            <strong>Temperature:</strong> {selectedRecord.vitalSigns?.temperature || 'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            <strong>BP:</strong> {selectedRecord.vitalSigns?.bloodPressure || 'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            <strong>Heart Rate:</strong> {selectedRecord.vitalSigns?.heartRate || 'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            <strong>O2 Sat:</strong> {selectedRecord.vitalSigns?.oxygenSaturation || 'N/A'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        Chief Complaint
                      </Typography>
                      <Typography variant="body1">
                        {selectedRecord.chiefComplaint}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        <Code sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Diagnoses & Medical Coding
                      </Typography>
                      {selectedRecord.diagnoses?.map((diagnosis, index) => (
                        <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            {diagnosis.name}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Severity:</strong> {diagnosis.severity} | <strong>Category:</strong> {diagnosis.category}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip label={`ICD-11: ${diagnosis.icd11Code}`} color="primary" size="small" />
                            <Chip label={`ICD-11 T2: ${diagnosis.icd11T2Code}`} color="secondary" size="small" />
                            <Chip label={`NAMASTE: ${diagnosis.namasteCode}`} color="success" size="small" />
                          </Box>
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>

                {selectedRecord.clinicalNotes && (
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary">
                          Clinical Notes
                        </Typography>
                        <Typography variant="body2">
                          {selectedRecord.clinicalNotes}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {selectedRecord.treatmentPlan && (
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary">
                          Treatment Plan
                        </Typography>
                        <Typography variant="body2">
                          {selectedRecord.treatmentPlan}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        <Assignment sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Authentication & Consent
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            <strong>OTP Verified:</strong> {selectedRecord.otpVerified ? ' Yes' : ' No'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            <strong>History Reviewed:</strong> {selectedRecord.historyReviewed ? ' Yes' : ' No'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            <strong>Data Sharing Consent:</strong> {selectedRecord.consentData?.dataSharing ? ' Yes' : ' No'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            <strong>Research Consent:</strong> {selectedRecord.consentData?.research ? ' Yes' : ' No'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2">
                            <strong>Patient Signature:</strong> {selectedRecord.consentData?.patientSignature || 'N/A'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailsDialog(false)}>Close</Button>
            <Button
              variant="contained"
              startIcon={<Print />}
              onClick={() => window.print()}
            >
              Print Record
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default DiagnosisHistory;