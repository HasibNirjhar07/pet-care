import React from "react";

import {
  Home as HomeIcon,
  Users as UsersIcon,
  Heart as HeartIcon,
  Camera as CameraIcon,
  Bell as BellIcon,
  User as UserIcon,
  Settings as SettingsIcon,
} from "lucide-react";


import {  Box,
  Card,
    CardContent,
    Typography,
    Button,
    Stack,
    Chip,
} from "@mui/material";
const Sidebar = () => {
  const menuItems = [
    { icon: <HomeIcon fontSize="small" />, label: "Feed", active: true },
    { icon: <UsersIcon fontSize="small" />, label: "Adoption Homes", active: false },
    { icon: <HeartIcon fontSize="small" />, label: "Favorites", active: false },
    { icon: <CameraIcon fontSize="small" />, label: "My Posts", active: false },
    { icon: <BellIcon fontSize="small" />, label: "Notifications", active: false },
    { icon: <UserIcon fontSize="small" />, label: "Profile", active: false },
    { icon: <SettingsIcon fontSize="small" />, label: "Settings", active: false },
  ];

  const adoptionStats = [
    { label: "Pets Adopted", value: "2,847", change: "+12%" },
    { label: "Active Posts", value: "156", change: "+5%" },
    { label: "Happy Families", value: "1,924", change: "+8%" },
  ];

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {/* Navigation Menu */}
      <Card elevation={3} sx={{ bgcolor: "rgba(255,255,255,0.8)", backdropFilter: "blur(10px)" }}>
        <CardContent>
          <Stack spacing={1}>
            {menuItems.map((item, index) => (
              <Button
                key={index}
                startIcon={item.icon}
                fullWidth
                sx={{
                  justifyContent: "flex-start",
                  bgcolor: item.active ? "linear-gradient(to right, #9333ea, #ec4899)" : "transparent",
                  color: item.active ? "#fff" : "text.primary",
                  backgroundImage: item.active ? "linear-gradient(to right, #9333ea, #ec4899)" : "none",
                  "&:hover": {
                    bgcolor: item.active ? "linear-gradient(to right, #7e22ce, #db2777)" : "purple.50",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Adoption Stats */}
      <Card elevation={3} sx={{ bgcolor: "rgba(255,255,255,0.8)", backdropFilter: "blur(10px)" }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} color="text.primary" mb={2}>
            Adoption Impact
          </Typography>
          <Stack spacing={2}>
            {adoptionStats.map((stat, index) => (
              <Box key={index} display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {stat.label}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {stat.value}
                  </Typography>
                </Box>
                <Chip
                  label={stat.change}
                  size="small"
                  sx={{
                    bgcolor: "#dcfce7",
                    color: "#15803d",
                    fontWeight: 500,
                  }}
                />
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card
        elevation={3}
        sx={{
          backgroundImage: "linear-gradient(to bottom right, #f3e8ff, #fce7f3)",
        }}
      >
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} color="text.primary" mb={2}>
            Quick Actions
          </Typography>
          <Stack spacing={1.5}>
            <Button
              fullWidth
              sx={{
                backgroundImage: "linear-gradient(to right, #9333ea, #ec4899)",
                color: "#fff",
                "&:hover": {
                  backgroundImage: "linear-gradient(to right, #7e22ce, #db2777)",
                },
              }}
            >
              Post a Pet
            </Button>
            <Button
              fullWidth
              variant="outlined"
              sx={{
                borderColor: "#e9d5ff",
                "&:hover": { bgcolor: "#f5f3ff" },
              }}
            >
              Find Vet Services
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Sidebar;
