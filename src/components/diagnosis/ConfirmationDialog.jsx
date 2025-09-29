import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography,
  Card, CardContent, Box, CircularProgress
} from '@mui/material';

const ConfirmationDialog = ({
  open, onClose, onConfirm, selectedPatient, encounterData, diagnosisData,
  consentData, otpData, historyReviewed, loading
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Confirm Diagnosis Submission</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          Please review the diagnosis information before submission:
        </Typography>
        
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Final Review</Typography>
            <Typography variant="body2">
              <strong>Patient:</strong> {selectedPatient?.name} ({selectedPatient?.abhaId})
            </Typography>
            <Typography variant="body2">
              <strong>Authentication:</strong> {otpData.verified ? 'OTP Verified ✓' : 'Not Verified ✗'}
            </Typography>
            <Typography variant="body2">
              <strong>History Review:</strong> {historyReviewed ? 'Completed ✓' : 'Not Completed ✗'}
            </Typography>
            <Typography variant="body2">
              <strong>Chief Complaint:</strong> {encounterData.chiefComplaint}
            </Typography>
            <Typography variant="body2">
              <strong>Diagnoses:</strong> {diagnosisData.selectedDiseases.length} condition(s)
            </Typography>
            <Typography variant="body2">
              <strong>Consent Status:</strong> {consentData.consentGiven ? 'Provided ✓' : 'Not Provided ✗'}
            </Typography>
          </CardContent>
        </Card>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Submitting...' : 'Confirm & Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;