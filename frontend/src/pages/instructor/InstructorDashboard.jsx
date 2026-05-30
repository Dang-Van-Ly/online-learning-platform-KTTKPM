import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { People, LibraryBooks, AttachMoney, TrendingUp } from '@mui/icons-material';
import api from '../../api/axios';
import ChartSection from '../../components/instructor/ChartSection';
import ActivityList from '../../components/instructor/ActivityList';

export default function InstructorDashboard() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    avgRating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/instructor/stats');
        setStats(response.data);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Courses', value: loading ? '...' : stats.totalCourses, icon: <LibraryBooks fontSize="large" color="primary" />, color: '#e3f2fd' },
    { title: 'Active Students', value: loading ? '...' : stats.totalStudents, icon: <People fontSize="large" color="success" />, color: '#e8f5e9' },
    { title: 'Total Revenue', value: loading ? '...' : `${stats.totalRevenue.toLocaleString()} VND`, icon: <AttachMoney fontSize="large" color="warning" />, color: '#fff3e0' },
    { title: 'Avg. Rating', value: loading ? '...' : `${stats.avgRating} / 5.0`, icon: <TrendingUp fontSize="large" color="error" />, color: '#ffebee' },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 4, color: '#2c3e50' }}>
        Overview
      </Typography>
      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                <Box sx={{ bgcolor: card.color, p: 1.5, borderRadius: 2, mr: 2, display: 'flex' }}>
                  {card.icon}
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={600} gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {card.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <ChartSection />
        </Grid>
        <Grid item xs={12} md={4}>
          <ActivityList />
        </Grid>
      </Grid>
    </Box>
  );
}
