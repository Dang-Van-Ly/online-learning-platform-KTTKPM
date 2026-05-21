import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider } from '@mui/material';
import { PersonAdd, Star, Edit, MonetizationOn } from '@mui/icons-material';

const mockActivities = [
  // Real activities will be populated from API later
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
