// pages/TerminologyManagement.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
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
  Alert,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Sync as SyncIcon,
  Search as SearchIcon,
  Code as CodeIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import terminologyService from '../services/terminology.service';

const TerminologyManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState({
    namaste: { status: 'synced', lastSync: new Date() },
    icd11tm2: { status: 'synced', lastSync: new Date() },
    icd11bio: { status: 'synced', lastSync: new Date() },
  });
  const [mappingDialog, setMappingDialog] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await terminologyService.autocomplete(searchQuery, {
        systems: ['NAMASTE', 'ICD-11-TM2', 'ICD-11-BIOMEDICINE'],
        limit: 50,
      });
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (system) => {
    setLoading(true);
    try {
      await terminologyService.syncCodeSystems();
      // Update sync status
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  // Mock data for demonstration
  const mockResults = [
    {
      system: 'NAMASTE',
      code: 'N-AYU-001',
      display: 'Vata Dosha Imbalance',
      definition: 'Imbalance in Vata dosha affecting digestion and circulation',
    },
    {
      system: 'ICD-11-TM2',
      code: 'TM20.01',
      display: 'Qi Stagnation',
      definition: 'Blockage or stagnation of qi energy flow',
    },
    {
      system: 'ICD-11-BIOMEDICINE',
      code: 'K59.0',
      display: 'Constipation',
      definition: 'Infrequent or difficult evacuation of bowels',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Terminology Management
      </Typography>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
          <Tab label="Browse Codes" />
          <Tab label="Mappings" />
          <Tab label="Sync Status" />
        </Tabs>
      </Box>

      {/* Browse Codes Tab */}
      <TabPanel value={activeTab} index={0}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Search Terminology"
                  placeholder="Enter code, term, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={handleSearch}
                  disabled={loading}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {loading && <LinearProgress sx={{ mb: 2 }} />}

        <Card>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>System</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Display</TableCell>
                    <TableCell>Definition</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(searchResults.length > 0 ? searchResults : mockResults).map((result, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Chip
                          label={result.system}
                          color={result.system === 'NAMASTE' ? 'success' : 'primary'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {result.code}
                        </Typography>
                      </TableCell>
                      <TableCell>{result.display}</TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {result.definition || 'No definition available'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          startIcon={<LinkIcon />}
                          onClick={() => {
                            setSelectedConcept(result);
                            setMappingDialog(true);
                          }}
                        >
                          View Mappings
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Mappings Tab */}
      <TabPanel value={activeTab} index={1}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Concept mappings link traditional medicine codes (NAMASTE) with international standards (ICD-11).
        </Alert>
        
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Mappings
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Source Code</TableCell>
                    <TableCell>Target Code</TableCell>
                    <TableCell>Mapping Type</TableCell>
                    <TableCell>Confidence</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>N-AYU-001</TableCell>
                    <TableCell>TM20.01</TableCell>
                    <TableCell>Equivalent</TableCell>
                    <TableCell>95%</TableCell>
                    <TableCell>
                      <Chip label="Approved" color="success" size="small" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>N-SID-012</TableCell>
                    <TableCell>K59.0</TableCell>
                    <TableCell>Related</TableCell>
                    <TableCell>78%</TableCell>
                    <TableCell>
                      <Chip label="Pending" color="warning" size="small" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Sync Status Tab */}
      <TabPanel value={activeTab} index={2}>
        <Grid container spacing={3}>
          {Object.entries(syncStatus).map(([system, status]) => (
            <Grid item xs={12} md={4} key={system}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="between" mb={2}>
                    <Typography variant="h6">
                      {system.toUpperCase().replace(/(\d+)/g, '-$1')}
                    </Typography>
                    <Chip
                      label={status.status}
                      color={status.status === 'synced' ? 'success' : 'warning'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Last sync: {status.lastSync.toLocaleString()}
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<SyncIcon />}
                    onClick={() => handleSync(system)}
                    disabled={loading}
                    fullWidth
                  >
                    Sync Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Alert severity="success" sx={{ mt: 3 }}>
          All code systems are up to date. Next automatic sync scheduled for tomorrow at 2:00 AM.
        </Alert>
      </TabPanel>

      {/* Mapping Dialog */}
      <Dialog
        open={mappingDialog}
        onClose={() => setMappingDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Concept Mappings</DialogTitle>
        <DialogContent>
          {selectedConcept && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedConcept.code} - {selectedConcept.display}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                System: {selectedConcept.system}
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom>
                Available Mappings
              </Typography>
              <Alert severity="info">
                No mappings available for this concept. Consider creating a manual mapping.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMappingDialog(false)}>Close</Button>
          <Button variant="contained">Create Mapping</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TerminologyManagement;