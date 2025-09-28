import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6">Welcome, {user?.name || 'User'}</Typography>
          <Typography>Profile management coming soon...</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;