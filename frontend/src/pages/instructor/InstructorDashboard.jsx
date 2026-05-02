import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { People, LibraryBooks, AttachMoney, TrendingUp } from '@mui/icons-material';
import axios from 'axios';

export default function InstructorDashboard() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 124, // mock data
    totalRevenue: 2500000, // mock data
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        const user = JSON.parse(userStr);
        const res = await axios.get("http://localhost:8080/api/courses", {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const allCourses = Array.isArray(res.data) ? res.data : (res.data.data || []);
        // local filter
        const myCourses = allCourses.filter(c => c.instructorId === user.username);
        
        setStats(prev => ({
          ...prev,
          totalCourses: myCourses.length,
          totalStudents: myCourses.length * 42, // mock metric
          totalRevenue: myCourses.length * 500000 // mock metric
        }));
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      }
    };
    fetchCourses();
  }, []);

  const statCards = [
    { title: 'Total Courses', value: stats.totalCourses, icon: <LibraryBooks fontSize="large" color="primary" />, color: '#e3f2fd' },
    { title: 'Active Students', value: stats.totalStudents, icon: <People fontSize="large" color="success" />, color: '#e8f5e9' },
    { title: 'Total Revenue', value: `${stats.totalRevenue.toLocaleString()} VND`, icon: <AttachMoney fontSize="large" color="warning" />, color: '#fff3e0' },
    { title: 'Avg. Rating', value: '4.8 / 5.0', icon: <TrendingUp fontSize="large" color="error" />, color: '#ffebee' },
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
      
      <Box sx={{ mt: 5, p: 3, bgcolor: '#fff', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Recent Activity</Typography>
        <Typography variant="body2" color="text.secondary">
          No recent activity to show.
        </Typography>
      </Box>
    </Box>
  );
}
