import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';

function StatCard({ title, value, subtitle, color, icon, progress }) {
  return (
    <Card elevation={3} sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h6" component="div" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {icon && (
            <Box
              sx={{
                backgroundColor: `${color}20`,
                borderRadius: '50%',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: color,
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
        {progress !== undefined && (
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 5,
                backgroundColor: `${color}20`,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: color,
                },
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {progress}% Complete
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default StatCard;
