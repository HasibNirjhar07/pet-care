import React from 'react';
import { Calendar, MapPin, Heart, Users } from 'lucide-react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Divider,
} from '@mui/material';

const QuickActions = () => {
  const nearbyHomes = [
    { name: "Happy Paws Sanctuary", distance: "2.3 km", rating: 4.8, slots: 3 },
    { name: "Golden Hearts Pet Care", distance: "3.1 km", rating: 4.9, slots: 1 },
    { name: "Furry Friends Haven", distance: "4.7 km", rating: 4.7, slots: 5 },
  ];

  const upcomingEvents = [
    { title: "Pet Adoption Fair", date: "Dec 15", location: "Central Park" },
    { title: "Vet Health Checkup", date: "Dec 18", location: "PetCare Clinic" },
    { title: "Training Workshop", date: "Dec 22", location: "Community Center" },
  ];

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      {/* Nearby Adoption Homes */}
      <Card sx={{ boxShadow: 3, bgcolor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(6px)' }}>
        <Box px={2} py={1} display="flex" alignItems="center" borderBottom="1px solid #eee">
          <MapPin size={20} color="#9333ea" style={{ marginRight: 8 }} />
          <Typography variant="h6" fontSize={16}>
            Nearby Adoption Homes
          </Typography>
        </Box>
        <CardContent>
          {nearbyHomes.map((home, index) => (
            <Box
              key={index}
              bgcolor="linear-gradient(to right, #f5f3ff, #ffe4e6)"
              borderRadius={2}
              p={2}
              mb={2}
              sx={{ background: 'linear-gradient(to right, #f5f3ff, #ffe4e6)' }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                <Typography variant="subtitle2">{home.name}</Typography>
                <Typography fontSize={12} px={1} py={0.5} bgcolor="#d1fae5" color="#065f46" borderRadius={1}>
                  ⭐ {home.rating}
                </Typography>
              </Box>
              <Typography fontSize={12} color="text.secondary" mb={1}>
                {home.distance} away
              </Typography>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography fontSize={12} color="text.secondary">
                  {home.slots} slots available
                </Typography>
                <Button size="small" variant="outlined">
                  Book
                </Button>
              </Box>
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card sx={{ boxShadow: 3, bgcolor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(6px)' }}>
        <Box px={2} py={1} display="flex" alignItems="center" borderBottom="1px solid #eee">
          <Calendar size={20} color="#9333ea" style={{ marginRight: 8 }} />
          <Typography variant="h6" fontSize={16}>
            Upcoming Events
          </Typography>
        </Box>
        <CardContent>
          {upcomingEvents.map((event, index) => (
            <Box
              key={index}
              bgcolor="linear-gradient(to right, #eff6ff, #f3e8ff)"
              borderRadius={2}
              p={2}
              mb={2}
              sx={{ background: 'linear-gradient(to right, #eff6ff, #f3e8ff)' }}
            >
              <Typography variant="subtitle2" mb={0.5}>
                {event.title}
              </Typography>
              <Typography fontSize={12} color="text.secondary">
                {event.date} • {event.location}
              </Typography>
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card sx={{ boxShadow: 3, background: 'linear-gradient(to bottom right, #ede9fe, #fce7f3)' }}>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Heart size={32} color="#9333ea" />
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold" color="text.primary">
                2,847
              </Typography>
              <Typography fontSize={14} color="text.secondary">
                Pets Found Homes
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Users size={16} />}
              sx={{
                background: 'linear-gradient(to right, #9333ea, #ec4899)',
                '&:hover': {
                  background: 'linear-gradient(to right, #7e22ce, #db2777)',
                },
                color: 'white',
              }}
            >
              Join Community
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default QuickActions;
