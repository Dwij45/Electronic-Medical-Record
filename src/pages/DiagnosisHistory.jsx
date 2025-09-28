// pages/DiagnosisHistory.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import diagnosisService from '../services/diagnosis.service';

const DiagnosisHistory = () => {
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [filters, setFilters] = useState({
    patientName: '',
    dateRange: { start: null, end: null },
    codeSystem: 'all',
    status: 'all',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  useEffect(() => {
    loadDiagnosisHistory();
  }, [pagination.page, filters]);

  const loadDiagnosisHistory = async () => {
    setLoading(true);
    try {
      const response = await diagnosisService.getDiagnosisHistory(null, {
        ...filters,
        limit: pagination.limit,
        offset: (pagination.page - 1) * pagination.limit,
      });
      setDiagnoses(response.data);
      setPagination(prev => ({ ...prev, total: response.total }));
    } catch (error) {
      console.error('Failed to load diagnosis history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDiagnosis = (diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    setViewDialog(true);
  };

  const handleExportData = () => {
    // Implementation for exporting diagnosis data
    console.log('Exporting diagnosis data...');
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'success',
      'inactive': 'default',
      'resolved': 'info',
      'entered-in-error': 'error',
    };
    return colors[status] || 'default';
  };

  const mockDiagnoses = [
    {
      id: '1',
      patientName: 'John Doe',
      patientId: 'P001',
      abhaId: '12-3456-7890-1234',
      date: new Date('2023-10-15'),
      codes: [
        { system: 'NAMASTE', code: 'N-AYU-001', display: 'Vata Dosha Imbalance' },
        { system: 'ICD-11-TM2', code: 'TM20.01', display: 'Qi Stagnation' },
      ],
      notes: 'Patient presenting with digestive issues and fatigue.',
      status: 'active',
      practitioner: 'Dr. Smith',
    },
    {
      id: '2',
      patientName: 'Jane Smith',
      patientId: 'P002',
      abhaId: '12-3456-7890-5678',
      date: new Date('2023-10-14'),
      codes: [
        { system: 'NAMASTE', code: 'N-SID-012', display: 'Kapha Vitiation' },
        { system: 'ICD-11-BIO', code: 'K25', display: 'Gastric Ulcer' },
      ],
      notes: 'Follow-up consultation for gastric issues.',
      status: 'active',
      practitioner: 'Dr. Johnson',
    },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Diagnosis History</Typography>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportData}
          >
            Export Data
          </Button>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Filter Options
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Patient Name"
                  value={filters.patientName}
                  onChange={(e) => setFilters({ ...filters, patientName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <DatePicker
                  label="Start Date"
                  value={filters.dateRange.start}
                  onChange={(date) => setFilters({
                    ...filters,
                    dateRange: { ...filters.dateRange, start: date }
                  })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <DatePicker
                  label="End Date"
                  value={filters.dateRange.end}
                  onChange={(date) => setFilters({
                    ...filters,
                    dateRange: { ...filters.dateRange, end: date }
                  })}
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
                    <MenuItem value="icd11">ICD-11</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    label="Status"
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="resolved">Resolved</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={1}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<FilterIcon />}
                  onClick={loadDiagnosisHistory}
                  sx={{ height: '56px' }}
                >
                  Filter
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Diagnosis Table */}
        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Patient</TableCell>
                    <TableCell>ABHA ID</TableCell>
                    <TableCell>Primary Diagnosis</TableCell>
                    <TableCell>Codes</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Practitioner</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockDiagnoses.map((diagnosis) => (
                    <TableRow key={diagnosis.id}>
                      <TableCell>
                        {format(diagnosis.date, 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {diagnosis.patientName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {diagnosis.abhaId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {diagnosis.codes[0]?.display || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" flexWrap="wrap" gap={0.5}>
                          {diagnosis.codes.map((code, index) => (
                            <Chip
                              key={index}
                              label={`${code.system}: ${code.code}`}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={diagnosis.status}
                          color={getStatusColor(diagnosis.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{diagnosis.practitioner}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleViewDiagnosis(diagnosis)}
                        >
                          <ViewIcon />
                        </IconButton>
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={Math.ceil(pagination.total / pagination.limit)}
                page={pagination.page}
                onChange={(event, page) => setPagination({ ...pagination, page })}
                color="primary"
              />
            </Box>
          </CardContent>
        </Card>

        {/* View Diagnosis Dialog */}
        <Dialog
          open={viewDialog}
          onClose={() => setViewDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Diagnosis Details</DialogTitle>
          <DialogContent>
            {selectedDiagnosis && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="primary">
                    Patient Information
                  </Typography>
                  <Typography variant="body2">
                    Name: {selectedDiagnosis.patientName}
                  </Typography>
                  <Typography variant="body2">
                    ABHA ID: {selectedDiagnosis.abhaId}
                  </Typography>
                  <Typography variant="body2">
                    Date: {format(selectedDiagnosis.date, 'PPP')}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="primary">
                    Diagnosis Information
                  </Typography>
                  <Typography variant="body2">
                    Status: {selectedDiagnosis.status}
                  </Typography>
                  <Typography variant="body2">
                    Practitioner: {selectedDiagnosis.practitioner}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Diagnosis Codes
                  </Typography>
                  {selectedDiagnosis.codes.map((code, index) => (
                    <Card key={index} variant="outlined" sx={{ mb: 1 }}>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="body2">
                          <strong>{code.system}:</strong> {code.code}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {code.display}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Grid>
                {selectedDiagnosis.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="primary">
                      Clinical Notes
                    </Typography>
                    <Typography variant="body2">
                      {selectedDiagnosis.notes}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default DiagnosisHistory;