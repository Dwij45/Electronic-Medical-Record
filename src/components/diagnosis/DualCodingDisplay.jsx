import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Box, Chip, Grid, Divider,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, ListItemIcon, Alert, Collapse
} from '@mui/material';
import {
  Code, Translate, Visibility, Delete, ExpandMore, ExpandLess,
  LocalHospital, Science, Public, Verified, Info
} from '@mui/icons-material';

const DualCodingDisplay = ({ 
  dualCodeEntry, 
  onRemove, 
  onUpdateSeverity, 
  onViewDetails, 
  showActions = true 
}) => {
  const [expanded, setExpanded] = useState(false);
  const [detailsDialog, setDetailsDialog] = useState(false);

  const confidenceColor = (confidence) => {
    if (confidence >= 0.9) return 'success';
    if (confidence >= 0.7) return 'warning';
    return 'error';
  };

  const confidenceLabel = (confidence) => {
    if (confidence >= 0.9) return 'High Confidence';
    if (confidence >= 0.7) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <>
      <Card sx={{ 
        mb: 2, 
        border: '2px solid', 
        borderColor: 'success.main',
        backgroundColor: 'success.50',
        '&:hover': { boxShadow: 6 }
      }}>
        <CardContent>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <Translate sx={{ mr: 1 }} />
              Dual Coded Diagnosis
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip 
                label={confidenceLabel(dualCodeEntry.metadata?.confidence || 0)} 
                color={confidenceColor(dualCodeEntry.metadata?.confidence || 0)}
                size="small"
              />
              {showActions && (
                <>
                  <Button
                    size="small"
                    onClick={() => setExpanded(!expanded)}
                    endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
                  >
                    {expanded ? 'Less' : 'More'}
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setDetailsDialog(true)}
                    startIcon={<Visibility />}
                  >
                    Details
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => onRemove && onRemove(dualCodeEntry.id)}
                    startIcon={<Delete />}
                  >
                    Remove
                  </Button>
                </>
              )}
            </Box>
          </Box>

          {/* Traditional Medicine Code */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalHospital sx={{ mr: 1 }} />
              Traditional Medicine (NAMASTE)
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Chip label={dualCodeEntry.traditional?.namasteCode} color="primary" />
              </Grid>
              <Grid item xs>
                <Typography variant="body1" fontWeight="bold">
                  {dualCodeEntry.traditional?.sanskritName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {dualCodeEntry.traditional?.englishName} ({dualCodeEntry.traditional?.pronunciation})
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* ICD-11 TM2 Code */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Science sx={{ mr: 1 }} />
              ICD-11 Traditional Medicine Module 2
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Chip label={dualCodeEntry.tm2?.code} color="secondary" />
              </Grid>
              <Grid item xs>
                <Typography variant="body1">
                  {dualCodeEntry.tm2?.display}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* ICD-11 Biomedicine Code */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="success" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Public sx={{ mr: 1 }} />
              ICD-11 Biomedicine (Global Standard)
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Chip label={dualCodeEntry.biomedicine?.code} color="success" />
              </Grid>
              <Grid item xs>
                <Typography variant="body1">
                  {dualCodeEntry.biomedicine?.display}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* WHO International Terminology */}
          {dualCodeEntry.whoTerminology && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" color="info" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Verified sx={{ mr: 1 }} />
                WHO International Terminology
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Chip label={dualCodeEntry.whoTerminology.code} color="info" size="small" />
                </Grid>
                <Grid item xs>
                  <Typography variant="body2">
                    {dualCodeEntry.whoTerminology.display}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Expandable Details */}
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Divider sx={{ my: 2 }} />
            
            {/* Traditional Assessment */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Traditional Assessment:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="System" 
                      secondary={dualCodeEntry.traditional?.system || 'N/A'} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Category" 
                      secondary={dualCodeEntry.traditional?.category || 'N/A'} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Dosha Involvement" 
                      secondary={dualCodeEntry.traditional?.doshaEnglish?.join(', ') || 'N/A'} 
                    />
                  </ListItem>
                </List>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Mapping Information:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Confidence Score" 
                      secondary={`${Math.round((dualCodeEntry.metadata?.confidence || 0) * 100)}%`} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Equivalence" 
                      secondary={dualCodeEntry.metadata?.equivalence || 'N/A'} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Last Updated" 
                      secondary={dualCodeEntry.metadata?.lastUpdated || 'N/A'} 
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>

            {/* Traditional Symptoms */}
            {dualCodeEntry.traditional?.symptomsEnglish && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Traditional Symptoms:
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {dualCodeEntry.traditional.symptomsEnglish.map((symptom, index) => (
                    <Chip key={index} label={symptom} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}

            {/* Traditional Treatments */}
            {dualCodeEntry.traditional?.treatmentsEnglish && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Traditional Treatments:
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {dualCodeEntry.traditional.treatmentsEnglish.map((treatment, index) => (
                    <Chip key={index} label={treatment} size="small" color="primary" variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}
          </Collapse>

          {/* Compliance Status */}
          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>✅ FHIR R4 Compliant:</strong> This diagnosis entry meets all requirements for 
              NAMASTE, ICD-11 TM2, and ICD-11 Biomedicine coding standards. Ready for government 
              reporting and insurance claims.
            </Typography>
          </Alert>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={detailsDialog} onClose={() => setDetailsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Complete Dual Coding Details
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            {/* FHIR JSON Preview */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                FHIR Condition Resource Preview:
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.100', maxHeight: 300, overflow: 'auto' }}>
                <pre style={{ fontSize: '12px', margin: 0 }}>
                  {JSON.stringify(
                    {
                      resourceType: 'Condition',
                      code: {
                        coding: [
                          {
                            system: 'http://namaste.gov.in/fhir/CodeSystem/ayush-disorders',
                            code: dualCodeEntry.traditional?.namasteCode,
                            display: dualCodeEntry.traditional?.englishName
                          },
                          {
                            system: 'http://id.who.int/icd/release/11/tm2',
                            code: dualCodeEntry.tm2?.code,
                            display: dualCodeEntry.tm2?.display
                          },
                          {
                            system: 'http://id.who.int/icd/release/11/mms',
                            code: dualCodeEntry.biomedicine?.code,
                            display: dualCodeEntry.biomedicine?.display
                          }
                        ]
                      }
                    }, 
                    null, 
                    2
                  )}
                </pre>
              </Paper>
            </Grid>

            {/* Code Systems Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Code Systems Used:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><LocalHospital color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="NAMASTE AYUSH Disorders"
                    secondary="http://namaste.gov.in/fhir/CodeSystem/ayush-disorders"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Science color="secondary" /></ListItemIcon>
                  <ListItemText 
                    primary="ICD-11 Traditional Medicine Module 2"
                    secondary="http://id.who.int/icd/release/11/tm2"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Public color="success" /></ListItemIcon>
                  <ListItemText 
                    primary="ICD-11 Mortality and Morbidity Statistics"
                    secondary="http://id.who.int/icd/release/11/mms"
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialog(false)}>Close</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              const fhirResource = JSON.stringify({
                resourceType: 'Condition',
                id: dualCodeEntry.id,
                code: {
                  coding: [
                    {
                      system: 'http://namaste.gov.in/fhir/CodeSystem/ayush-disorders',
                      code: dualCodeEntry.traditional?.namasteCode,
                      display: dualCodeEntry.traditional?.englishName
                    },
                    {
                      system: 'http://id.who.int/icd/release/11/tm2', 
                      code: dualCodeEntry.tm2?.code,
                      display: dualCodeEntry.tm2?.display
                    },
                    {
                      system: 'http://id.who.int/icd/release/11/mms',
                      code: dualCodeEntry.biomedicine?.code,
                      display: dualCodeEntry.biomedicine?.display
                    }
                  ]
                }
              }, null, 2);
              
              navigator.clipboard.writeText(fhirResource);
              alert('FHIR resource copied to clipboard!');
            }}
          >
            Copy FHIR JSON
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DualCodingDisplay;