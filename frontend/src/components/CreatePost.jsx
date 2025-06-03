import { useState } from "react";
import { Camera, Image, User } from "lucide-react";
import {
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Avatar,
  Grid
} from "@mui/material";

const CreatePost = () => {
  const [postText, setPostText] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [petType, setPetType] = useState("");
  const [adoptionType, setAdoptionType] = useState("");

  return (
    <Card 
      sx={{ 
        boxShadow: 3, 
        border: 'none', 
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {!showForm ? (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                background: 'linear-gradient(45deg, #9c27b0, #e91e63)'
              }}
            >
              <User size={20} />
            </Avatar>
            <Button
              onClick={() => setShowForm(true)}
              variant="outlined"
              fullWidth
              sx={{
                justifyContent: 'flex-start',
                textAlign: 'left',
                py: 1.5,
                px: 3,
                borderRadius: '50px',
                backgroundColor: '#f5f5f5',
                border: 'none',
                color: '#666',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                  border: 'none'
                }
              }}
            >
              Share a pet for adoption...
            </Button>
          </Box>
        ) : (
          <Box sx={{ space: 2 }}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(45deg, #9c27b0, #e91e63)'
                }}
              >
                <User size={20} />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="600">
                  Create Adoption Post
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Help a pet find their forever home
                </Typography>
              </Box>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Tell us about your pet's story, personality, and what kind of home you're looking for..."
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              variant="outlined"
              sx={{ mb: 3 }}
            />

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Pet Type</InputLabel>
                  <Select
                    value={petType}
                    onChange={(e) => setPetType(e.target.value)}
                    label="Pet Type"
                  >
                    <MenuItem value="dog">Dog</MenuItem>
                    <MenuItem value="cat">Cat</MenuItem>
                    <MenuItem value="bird">Bird</MenuItem>
                    <MenuItem value="rabbit">Rabbit</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Adoption Type</InputLabel>
                  <Select
                    value={adoptionType}
                    onChange={(e) => setAdoptionType(e.target.value)}
                    label="Adoption Type"
                  >
                    <MenuItem value="permanent">Permanent</MenuItem>
                    <MenuItem value="temporary">Temporary</MenuItem>
                    <MenuItem value="foster">Foster Care</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Image size={16} />}
                  sx={{
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#f3e5f5'
                    }
                  }}
                >
                  Photo
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Camera size={16} />}
                  sx={{
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#f3e5f5'
                    }
                  }}
                >
                  Video
                </Button>
              </Box>

              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  onClick={() => setShowForm(false)}
                  sx={{ textTransform: 'none' }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(45deg, #9c27b0, #e91e63)',
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #7b1fa2, #c2185b)'
                    }
                  }}
                >
                  Post
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CreatePost;