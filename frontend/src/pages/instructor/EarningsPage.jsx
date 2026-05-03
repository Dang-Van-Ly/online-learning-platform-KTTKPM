import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import ChartSection from '../../components/instructor/ChartSection';

export default function EarningsPage() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3, color: '#2c3e50' }}>
        Earnings & Analytics
      </Typography>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0', mb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Detailed revenue reports will be displayed here.
        </Typography>
      </Paper>
      <ChartSection />
    </Box>
  );
}
