import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider } from '@mui/material';
import { PersonAdd, Star, Edit, MonetizationOn } from '@mui/icons-material';

const mockActivities = [
  { id: 1, type: 'enrollment', text: 'Nguyen Van A enrolled in "React Native Basics"', time: '2 hours ago', icon: <PersonAdd />, color: '#1976d2', bgcolor: '#e3f2fd' },
  { id: 2, type: 'review', text: 'Tran Thi B gave 5 stars to "Advanced Spring Boot"', time: '5 hours ago', icon: <Star />, color: '#ed6c02', bgcolor: '#fff3e0' },
  { id: 3, type: 'update', text: 'You updated the syllabus for "Python for Data Science"', time: '1 day ago', icon: <Edit />, color: '#9c27b0', bgcolor: '#f3e5f5' },
  { id: 4, type: 'purchase', text: 'Le Van C purchased "Fullstack Web Dev Combo"', time: '2 days ago', icon: <MonetizationOn />, color: '#2e7d32', bgcolor: '#e8f5e9' },
];

export default function ActivityList() {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0', height: '100%' }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#2c3e50' }}>
        Recent Activity
      </Typography>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {mockActivities.map((activity, index) => (
          <React.Fragment key={activity.id}>
            <ListItem alignItems="flex-start" sx={{ px: 0, py: 1.5 }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: activity.bgcolor, color: activity.color }}>
                  {activity.icon}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    {activity.text}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {activity.time}
                  </Typography>
                }
              />
            </ListItem>
            {index < mockActivities.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
      <Typography variant="body2" color="primary" sx={{ mt: 2, cursor: 'pointer', fontWeight: 600, textAlign: 'center' }}>
        View All Activity
      </Typography>
    </Paper>
  );
}
