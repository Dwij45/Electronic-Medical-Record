import React, { useState } from 'react';
import {
  Box, Paper, Typography, Grid, Card, CardContent, Accordion, AccordionSummary,
  AccordionDetails, Chip, List, ListItem, ListItemIcon, ListItemText,
  TextField, InputAdornment, Tabs, Tab, useTheme
} from '@mui/material';
import {
  ExpandMore, Code, Language, Assignment, Search,
  Verified, Public, HealthAndSafety, Science, MedicalServices
} from '@mui/icons-material';
import { useThemeMode } from '../context/ThemeContext';

const Terminology = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme();
  const { darkMode } = useThemeMode();

  // Simplified coding systems with basic colors
  const codingSystems = [
    {
      id: 'icd11',
      name: 'ICD-11',
      fullName: 'International Classification of Diseases, 11th Revision',
      description: 'Global standard for diagnostic health information by WHO.',
      maintainer: 'World Health Organization',
      examples: [
        { code: '5A11', condition: 'Type 2 Diabetes', category: 'Endocrine' },
        { code: 'BA00', condition: 'Hypertension', category: 'Cardiovascular' },
        { code: 'CA07', condition: 'Upper Respiratory Infection', category: 'Respiratory' }
      ]
    },
    {
      id: 'namaste',
      name: 'NAMASTE',
      fullName: 'National Ayurveda Morbidity and Standardized Terminologies',
      description: 'Indian coding system for traditional AYUSH medicine practices.',
      maintainer: 'Ministry of AYUSH, India',
      examples: [
        { code: 'NAM001', condition: 'Madhumeha (Diabetes)', category: 'Metabolic' },
        { code: 'NAM002', condition: 'Raktagata Vata (Hypertension)', category: 'Circulatory' },
        { code: 'NAM003', condition: 'Kaphaja Kasa (Respiratory)', category: 'Respiratory' }
      ]
    },
    {
      id: 'icd11t2',
      name: 'ICD-11 T2',
      fullName: 'ICD-11 Traditional Medicine Module',
      description: 'Traditional medicine supplement integrating with modern classification.',
      maintainer: 'World Health Organization',
      examples: [
        { code: '5A11.0', condition: 'Diabetes (Traditional Context)', category: 'Endocrine' },
        { code: 'BA00.0', condition: 'Hypertension (Holistic View)', category: 'Cardiovascular' }
      ]
    }
  ];

  // Medical terms
  const medicalTerms = [
    { term: 'Chief Complaint', definition: 'Primary symptom bringing patient to seek care', category: 'Documentation' },
    { term: 'Vital Signs', definition: 'Basic physiological measurements (BP, HR, Temp)', category: 'Assessment' },
    { term: 'ABHA ID', definition: 'Unique health identifier for Indian citizens', category: 'Digital Health' },
    { term: 'Diagnosis', definition: 'Medical identification of disease/condition', category: 'Assessment' },
    { term: 'Prognosis', definition: 'Predicted course and outcome of condition', category: 'Assessment' },
    { term: 'Comorbidity', definition: 'Additional diseases co-occurring with primary', category: 'Conditions' }
  ];

  // Simple benefits with basic styling
  const systemBenefits = [
    { title: 'Standardization', icon: <Verified /> },
    { title: 'Interoperability', icon: <Public /> },
    { title: 'Quality Care', icon: <HealthAndSafety /> },
    { title: 'Research', icon: <Science /> },
    { title: 'Cost Efficiency', icon: <MedicalServices /> }
  ];

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const filteredTerms = medicalTerms.filter(term =>
    term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Header gradient matching Diagnosis History colors
  const getHeaderGradient = () => {
    if (darkMode) {
      // Matching the exact dark blue-gray from Diagnosis History
      return 'linear-gradient(135deg, #334155 0%, #475569 30%, #64748b 70%, #94a3b8 100%)';
    } else {
      // Light mode version with similar tones
      return 'linear-gradient(135deg, #475569 0%, #64748b 30%, #94a3b8 70%, #cbd5e1 100%)';
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header with Diagnosis History Color Scheme */}
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
        <Typography variant="h4" fontWeight="600" gutterBottom sx={{
          color: (theme) => theme.palette.mode === 'dark' ? '#f0f0f0' : '#212121'
        }}>
          Medical Terminology & Coding
        </Typography>
        <Typography variant="body1" sx={{
          opacity: 0.9,
          color: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)'
        }}>
          Understanding healthcare coding standards in our EMR system
        </Typography>
      </Paper>

      {/* Simple Benefits Overview */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {systemBenefits.map((benefit, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index} >
            <Card sx={{
              textAlign: 'center',
              p: 3,
              height: '100%',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
              boxShadow: (theme) => theme.palette.mode === 'dark' ? '0 2px 8px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.1)',
              border: (theme) => theme.palette.mode === 'dark' ? '1px solid #404040' : '1px solid #e0e0e0',
              backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff',
              color: (theme) => theme.palette.mode === 'dark' ? '#f0f0f0' : '#212121',
              borderRadius: 2

            }}>
              <Box sx={{ color: 'primary.main', mb: 1 }}>
                {benefit.icon}
              </Box>
              <Typography variant="body2" fontWeight="500" sx={{ fontSize: '0.875rem' }}>
                {benefit.title}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Basic Main Content Tabs */}
      <Paper sx={{
        borderRadius: 3,
        overflow: 'hidden',
      }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
            }
          }}
        >
          <Tab label="Coding Systems" icon={<Code />} iconPosition="start" />
          <Tab label="Medical Terms" icon={<Language />} iconPosition="start" />
          <Tab label="Implementation" icon={<Assignment />} iconPosition="start" />
        </Tabs>

        {/* Coding Systems Tab */}
        {selectedTab === 0 && (
          <Box sx={{ p: 3 }}>
            {codingSystems.map((system) => (
              <Accordion
                key={system.id}
                sx={{
                  mb: 2,
                  '&:before': { display: 'none' },
                  borderRadius: 2,
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 4,
                        height: 40,
                        backgroundColor: 'primary.main',
                        mr: 2,
                        borderRadius: 1,
                      }}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight="600">
                        {system.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {system.description}
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body1" paragraph>
                        <strong>Full Name:</strong> {system.fullName}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        <strong>Maintained by:</strong> {system.maintainer}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                        Code Examples:
                      </Typography>
                      {system.examples.map((example, index) => (
                        <Box
                          key={index}
                          sx={{
                            mb: 1,
                            p: 2,
                            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                            borderRadius: 1,
                            border: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={example.code}
                              size="small"
                              color="primary"
                            />
                            <Typography variant="body2" fontWeight="500">
                              {example.condition}
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {example.category}
                          </Typography>
                        </Box>
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
              <Typography variant="h6" fontWeight="600">
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
                sx={{ width: 250 }}
              />
            </Box>

            <Grid container spacing={2}>
              {filteredTerms.map((term, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card sx={{
                    p: 2,
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    }
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="600">
                        {term.term}
                      </Typography>
                      <Chip label={term.category} size="small" variant="outlined" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {term.definition}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Implementation Tab */}
        {selectedTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              EMR System Implementation
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Diagnosis Process
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><Verified color="success" /></ListItemIcon>
                      <ListItemText
                        primary="Search-based Selection"
                        secondary="Find diseases by symptoms or names"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Verified color="success" /></ListItemIcon>
                      <ListItemText
                        primary="Triple Coding"
                        secondary="Auto-assign ICD-11, T2, and NAMASTE codes"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Verified color="success" /></ListItemIcon>
                      <ListItemText
                        primary="Real-time Validation"
                        secondary="Instant coding accuracy verification"
                      />
                    </ListItem>
                  </List>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Data Management
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><Verified color="success" /></ListItemIcon>
                      <ListItemText
                        primary="Structured Storage"
                        secondary="JSON-based format with complete coding"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Verified color="success" /></ListItemIcon>
                      <ListItemText
                        primary="Historical Tracking"
                        secondary="Complete audit trail of entries"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Verified color="success" /></ListItemIcon>
                      <ListItemText
                        primary="Export Capabilities"
                        secondary="CSV export with all coding standards"
                      />
                    </ListItem>
                  </List>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Terminology;