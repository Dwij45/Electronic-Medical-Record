import React, { useState } from 'react';
import {
  Box, Paper, Typography, Grid, Card, CardContent, Accordion, AccordionSummary,
  AccordionDetails, Chip, Divider, List, ListItem, ListItemIcon, ListItemText,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Alert, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, InputAdornment, Tabs, Tab
} from '@mui/material';
import {
  ExpandMore, Code, LocalHospital, Assignment, Book, Search,
  Info, Language, Public, School, MedicalServices, Verified,
  Psychology, Favorite, Visibility, Science, HealthAndSafety
} from '@mui/icons-material';

const Terminology = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExample, setSelectedExample] = useState(null);
  const [exampleDialog, setExampleDialog] = useState(false);

  // Medical terminology data
  const codingSystems = [
    {
      id: 'icd11',
      name: 'ICD-11',
      fullName: 'International Classification of Diseases, 11th Revision',
      description: 'The global standard for diagnostic health information, used for mortality and morbidity statistics by WHO.',
      purpose: 'To provide a unified language for recording, reporting and monitoring diseases.',
      maintainer: 'World Health Organization (WHO)',
      version: '2022 Release',
      structure: 'Hierarchical classification with alphanumeric codes',
      examples: [
        { code: '5A11', condition: 'Type 2 Diabetes Mellitus', category: 'Endocrine Disorders' },
        { code: 'BA00', condition: 'Essential Hypertension', category: 'Cardiovascular Diseases' },
        { code: 'CA07', condition: 'Upper Respiratory Infection', category: 'Respiratory Diseases' },
        { code: '8A80', condition: 'Migraine', category: 'Neurological Disorders' }
      ],
      benefits: [
        'Global standardization of disease classification',
        'Improved data quality and comparability',
        'Enhanced research and epidemiological studies',
        'Better health policy decision making',
        'Streamlined insurance and billing processes'
      ]
    },
    {
      id: 'icd11t2',
      name: 'ICD-11 T2',
      fullName: 'ICD-11 Traditional Medicine Conditions Module 2',
      description: 'Traditional medicine supplement to ICD-11 for integrating traditional and complementary medicine.',
      purpose: 'To bridge traditional medicine practices with modern healthcare classification.',
      maintainer: 'World Health Organization (WHO)',
      version: '2022 Release',
      structure: 'Extension codes to complement main ICD-11 classification',
      examples: [
        { code: '5A11.0', condition: 'Type 2 Diabetes with Traditional Medicine Context', category: 'Endocrine Disorders' },
        { code: 'BA00.0', condition: 'Essential Hypertension with Holistic View', category: 'Cardiovascular Diseases' },
        { code: 'CA07.1', condition: 'Upper Respiratory Infection - Traditional Approach', category: 'Respiratory Diseases' },
        { code: '8A80.0', condition: 'Migraine with Traditional Medicine Perspective', category: 'Neurological Disorders' }
      ],
      benefits: [
        'Integration of traditional and modern medicine',
        'Holistic patient care approach',
        'Cultural sensitivity in healthcare',
        'Comprehensive treatment documentation',
        'Research opportunities in integrative medicine'
      ]
    },
    {
      id: 'namaste',
      name: 'NAMASTE',
      fullName: 'National Ayurveda Morbidity and Standardized Terminologies Electronic',
      description: 'India\'s indigenous medical coding system for Ayurveda, Yoga, Unani, Siddha, and Homeopathy (AYUSH).',
      purpose: 'To standardize traditional Indian medicine practices and integrate them with modern healthcare systems.',
      maintainer: 'Ministry of AYUSH, Government of India',
      version: '2023 Edition',
      structure: 'Alphanumeric codes specific to traditional Indian medicine systems',
      examples: [
        { code: 'NAM001', condition: 'Madhumeha (Diabetes) - Ayurvedic Classification', category: 'Metabolic Disorders' },
        { code: 'NAM002', condition: 'Raktagata Vata (Hypertension) - Traditional View', category: 'Circulatory Disorders' },
        { code: 'NAM003', condition: 'Kaphaja Kasa (Respiratory Infection)', category: 'Respiratory Disorders' },
        { code: 'NAM004', condition: 'Ardhavabhedaka (Migraine) - Ayurvedic Term', category: 'Neurological Disorders' }
      ],
      benefits: [
        'Preservation of traditional Indian medical knowledge',
        'Integration with national health programs',
        'Support for AYUSH practitioners',
        'Cultural and linguistic relevance',
        'Evidence-based traditional medicine research'
      ]
    }
  ];

  const medicalTerms = [
    {
      term: 'Chief Complaint',
      definition: 'The primary symptom or concern that brings a patient to seek medical care.',
      example: 'Patient reports "chest pain for the last 2 hours"',
      category: 'Clinical Documentation'
    },
    {
      term: 'Vital Signs',
      definition: 'Basic physiological measurements that indicate the body\'s most essential functions.',
      example: 'Temperature: 98.6°F, Blood Pressure: 120/80 mmHg, Heart Rate: 72 bpm',
      category: 'Clinical Assessment'
    },
    {
      term: 'ABHA ID',
      definition: 'Ayushman Bharat Health Account - Unique health identifier for Indian citizens.',
      example: 'ABHA001234567890',
      category: 'Digital Health ID'
    },
    {
      term: 'Diagnosis',
      definition: 'Medical identification of a disease or condition through examination and analysis.',
      example: 'Type 2 Diabetes Mellitus based on elevated HbA1c levels',
      category: 'Medical Assessment'
    },
    {
      term: 'Prognosis',
      definition: 'Predicted course and outcome of a disease or medical condition.',
      example: 'Good prognosis with proper medication adherence and lifestyle changes',
      category: 'Medical Assessment'
    },
    {
      term: 'Comorbidity',
      definition: 'Presence of one or more additional diseases co-occurring with a primary disease.',
      example: 'Diabetes with hypertension as comorbidity',
      category: 'Medical Conditions'
    }
  ];

  const systemBenefits = [
    {
      title: 'Standardization',
      description: 'Uniform medical language across healthcare providers',
      icon: <Verified color="primary" />
    },
    {
      title: 'Interoperability',
      description: 'Seamless data exchange between different healthcare systems',
      icon: <Public color="primary" />
    },
    {
      title: 'Quality Care',
      description: 'Improved patient safety and treatment outcomes',
      icon: <HealthAndSafety color="primary" />
    },
    {
      title: 'Research',
      description: 'Enhanced medical research and epidemiological studies',
      icon: <Science color="primary" />
    },
    {
      title: 'Policy Making',
      description: 'Data-driven healthcare policy decisions',
      icon: <Assignment color="primary" />
    },
    {
      title: 'Cost Efficiency',
      description: 'Streamlined billing and insurance processes',
      icon: <MedicalServices color="primary" />
    }
  ];

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleExampleClick = (example) => {
    setSelectedExample(example);
    setExampleDialog(true);
  };

  const filteredTerms = medicalTerms.filter(term =>
    term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper sx={{ 
        p: 4, 
        mb: 4, 
        background: (theme) => theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Book sx={{ fontSize: 48, mr: 2 }} />
          <Box>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Medical Terminology & Coding Standards
            </Typography>
            <Typography variant="h6">
              Understanding the Foundation of Modern Healthcare Information Systems
            </Typography>
          </Box>
        </Box>
        
        <Alert severity="info" sx={{ mt: 3, backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
          <Typography variant="body1">
            <strong>What This Page Explains:</strong> This comprehensive guide explains the medical coding systems and terminology used in our Electronic Medical Record (EMR) system to ensure standardized, accurate, and globally compatible healthcare documentation.
          </Typography>
        </Alert>
      </Paper>

      {/* Introduction Section */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <Info sx={{ mr: 1 }} />
          Why Medical Coding Standards Matter
        </Typography>
        
        <Typography variant="body1" paragraph>
          Medical coding standards are the backbone of modern healthcare information systems. They provide a universal language that enables healthcare providers worldwide to communicate effectively, share patient data securely, and ensure consistent treatment protocols.
        </Typography>

        <Typography variant="body1" paragraph>
          Our EMR system implements multiple internationally recognized coding standards to ensure comprehensive, culturally sensitive, and globally compatible healthcare documentation.
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {systemBenefits.map((benefit, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {benefit.icon}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {benefit.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    {benefit.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Main Content Tabs */}
      <Paper sx={{ borderRadius: 2 }}>
        <Tabs 
          value={selectedTab} 
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Coding Systems" icon={<Code />} />
          <Tab label="Medical Terms" icon={<Language />} />
          <Tab label="Implementation" icon={<Assignment />} />
        </Tabs>

        {/* Coding Systems Tab */}
        {selectedTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Medical Coding Systems Used in Our EMR
            </Typography>
            
            {codingSystems.map((system) => (
              <Accordion key={system.id} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Code sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="h6">{system.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {system.fullName}
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Typography variant="body1" paragraph>
                        <strong>Description:</strong> {system.description}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        <strong>Purpose:</strong> {system.purpose}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        <strong>Maintained by:</strong> {system.maintainer}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        <strong>Current Version:</strong> {system.version}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        <strong>Structure:</strong> {system.structure}
                      </Typography>

                      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        Key Benefits:
                      </Typography>
                      <List dense>
                        {system.benefits.map((benefit, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <Verified color="success" />
                            </ListItemIcon>
                            <ListItemText primary={benefit} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Typography variant="h6" gutterBottom>
                        Code Examples:
                      </Typography>
                      {system.examples.map((example, index) => (
                        <Card 
                          key={index} 
                          sx={{ mb: 2, cursor: 'pointer' }}
                          onClick={() => handleExampleClick(example)}
                        >
                          <CardContent>
                            <Chip 
                              label={example.code} 
                              color="primary" 
                              size="small" 
                              sx={{ mb: 1 }} 
                            />
                            <Typography variant="body2" fontWeight="bold">
                              {example.condition}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {example.category}
                            </Typography>
                          </CardContent>
                        </Card>
                      ))}
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}

        {/* Medical Terms Tab */}
        {selectedTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">
                Medical Terminology Glossary
              </Typography>
              <TextField
                size="small"
                placeholder="Search terms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 300 }}
              />
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.100' }}>
                    <TableCell><strong>Term</strong></TableCell>
                    <TableCell><strong>Definition</strong></TableCell>
                    <TableCell><strong>Example</strong></TableCell>
                    <TableCell><strong>Category</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTerms.map((term, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {term.term}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {term.definition}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" fontStyle="italic">
                          {term.example}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={term.category} size="small" variant="outlined" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Implementation Tab */}
        {selectedTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Implementation in Our EMR System
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      <LocalHospital sx={{ mr: 1 }} />
                      Diagnosis Entry Process
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon><Verified color="success" /></ListItemIcon>
                        <ListItemText 
                          primary="Search-based Disease Selection"
                          secondary="Type symptoms or disease names to find appropriate codes"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><Verified color="success" /></ListItemIcon>
                        <ListItemText 
                          primary="Triple Coding System"
                          secondary="Automatic assignment of ICD-11, ICD-11 T2, and NAMASTE codes"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><Verified color="success" /></ListItemIcon>
                        <ListItemText 
                          primary="Severity Assessment"
                          secondary="Configurable severity levels for each diagnosis"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><Verified color="success" /></ListItemIcon>
                        <ListItemText 
                          primary="Real-time Validation"
                          secondary="Instant verification of coding accuracy"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      <Assignment sx={{ mr: 1 }} />
                      Data Storage & Retrieval
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon><Verified color="success" /></ListItemIcon>
                        <ListItemText 
                          primary="Structured Data Format"
                          secondary="JSON-based storage with complete coding information"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><Verified color="success" /></ListItemIcon>
                        <ListItemText 
                          primary="Historical Tracking"
                          secondary="Complete audit trail of all diagnosis entries"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><Verified color="success" /></ListItemIcon>
                        <ListItemText 
                          primary="Advanced Filtering"
                          secondary="Search by patient, date, practitioner, or diagnosis code"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><Verified color="success" /></ListItemIcon>
                        <ListItemText 
                          primary="Export Capabilities"
                          secondary="CSV export with all coding standards included"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body1">
                    <strong>Technical Implementation:</strong> Our EMR system uses a comprehensive database of medical conditions mapped to all three coding systems (ICD-11, ICD-11 T2, and NAMASTE). This ensures that every diagnosis entered into the system is automatically coded according to international and national standards, providing maximum interoperability and compliance.
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Example Detail Dialog */}
      <Dialog open={exampleDialog} onClose={() => setExampleDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6">Code Example Details</Typography>
        </DialogTitle>
        <DialogContent>
          {selectedExample && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedExample.condition}
              </Typography>
              <Chip label={selectedExample.code} color="primary" sx={{ mb: 2 }} />
              <Typography variant="body1" paragraph>
                <strong>Category:</strong> {selectedExample.category}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This code represents a standardized way to classify and identify this medical condition across different healthcare systems and databases.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExampleDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Terminology;