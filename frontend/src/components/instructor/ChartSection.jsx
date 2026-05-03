import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Jan', students: 400, revenue: 2400000 },
  { name: 'Feb', students: 300, revenue: 1398000 },
  { name: 'Mar', students: 200, revenue: 9800000 },
  { name: 'Apr', students: 278, revenue: 3908000 },
  { name: 'May', students: 189, revenue: 4800000 },
  { name: 'Jun', students: 239, revenue: 3800000 },
  { name: 'Jul', students: 349, revenue: 4300000 },
];

export default function ChartSection() {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0', height: '100%' }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: '#2c3e50' }}>
        Revenue & Enrollments
      </Typography>
      <Box sx={{ width: '100%', height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1976d2" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#1976d2" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2e7d32" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#2e7d32" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="#8884d8" />
            <YAxis yAxisId="left" stroke="#1976d2" />
            <YAxis yAxisId="right" orientation="right" stroke="#2e7d32" />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <Tooltip 
              formatter={(value, name) => [name === 'revenue' ? `${value.toLocaleString()} VND` : value, name === 'revenue' ? 'Revenue' : 'Students']}
            />
            <Legend />
            <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#1976d2" fillOpacity={1} fill="url(#colorRevenue)" name="revenue" />
            <Area yAxisId="right" type="monotone" dataKey="students" stroke="#2e7d32" fillOpacity={1} fill="url(#colorStudents)" name="students" />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
