'use client';

import { MainLayout } from "@/components/layout/main-layout";
import { Box, Container, Typography, Card, CardContent, TextField, Button, Grid, Avatar, Divider, FormControlLabel, Checkbox, FormGroup } from "@mui/material";
import { useTheme } from "@/lib/theme-context";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Notifications } from "@mui/icons-material";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/lib/convex";
import { ThemeToggle } from "@/components/theme-toggle";

export default function ProfilePage() {
  const { theme } = useTheme();
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    phone: '',
    hobbies: '',
    notificationPreferences: {
      events: true,
      announcements: true,
      directMessages: true,
    }
  });
  
  // Get user data from Convex
  const userData = useQuery(api.users.getByEmail, { 
    email: user?.primaryEmailAddress?.emailAddress || '' 
  });
  
  // Update user mutation
  const updateUser = useMutation(api.users.update);
  
  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);
  
  // Populate form with user data from Convex
  useEffect(() => {
    if (userData) {
      setFormData({
        phone: userData.phone || '',
        hobbies: userData.hobbies_passions || '',
        notificationPreferences: {
          events: userData.notification_preferences?.includes('events') || false,
          announcements: userData.notification_preferences?.includes('announcements') || false,
          directMessages: userData.notification_preferences?.includes('directMessages') || false,
        }
      });
    }
  }, [userData]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [name]: checked
      }
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userData) return;
    
    // Convert notification preferences to array format for Convex
    const notificationPreferencesArray = Object.entries(formData.notificationPreferences)
      .filter(([_, enabled]) => enabled)
      .map(([key]) => key);
    
    try {
      await updateUser({
        id: userData._id,
        phone: formData.phone,
        hobbiesPassions: formData.hobbies,
        notificationPreferences: notificationPreferencesArray,
      });
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };
  
  if (!isLoaded || !isSignedIn) {
    return (
      <MainLayout>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h4" align="center" sx={{ fontFamily: 'var(--font-heading)' }}>Loading...</Typography>
        </Container>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <Box 
        sx={{ 
          py: 4,
          backgroundColor: 'var(--background)',
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              mb: 4,
              fontFamily: 'var(--font-heading)'
            }}
          >
            Your Profile
          </Typography>
        </Container>
      </Box>
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar 
                  src={user.imageUrl} 
                  alt={`${user.firstName}'s avatar`}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontFamily: 'var(--font-heading)' }}>
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom sx={{ fontFamily: 'var(--font-body)' }}>
                  {user.primaryEmailAddress?.emailAddress}
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  sx={{ 
                    mt: 2,
                    fontFamily: 'var(--font-body)'
                  }}
                >
                  Change Photo
                </Button>
              </CardContent>
            </Card>
            
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, fontFamily: 'var(--font-heading)' }}>
                  <Notifications fontSize="small" />
                  Notification Preferences
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.notificationPreferences.events}
                        onChange={handleCheckboxChange}
                        name="events"
                      />
                    }
                    label={<Typography sx={{ fontFamily: 'var(--font-body)' }}>Event notifications</Typography>}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.notificationPreferences.announcements}
                        onChange={handleCheckboxChange}
                        name="announcements"
                      />
                    }
                    label={<Typography sx={{ fontFamily: 'var(--font-body)' }}>Announcement notifications</Typography>}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.notificationPreferences.directMessages}
                        onChange={handleCheckboxChange}
                        name="directMessages"
                      />
                    }
                    label={<Typography sx={{ fontFamily: 'var(--font-body)' }}>Direct message notifications</Typography>}
                  />
                </FormGroup>
              </CardContent>
            </Card>

            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, fontFamily: 'var(--font-heading)' }}>
                  Theme Settings
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontFamily: 'var(--font-body)' }}>
                    Current theme: {theme === 'festive' ? 'Festive' : 'Modern'}
                  </Typography>
                  <ThemeToggle />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontFamily: 'var(--font-heading)' }}>
                  Edit Profile Information
                </Typography>
                
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        variant="outlined"
                        value={user.firstName || ''}
                        disabled
                        InputProps={{
                          sx: { fontFamily: 'var(--font-body)' }
                        }}
                        InputLabelProps={{
                          sx: { fontFamily: 'var(--font-body)' }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        variant="outlined"
                        value={user.lastName || ''}
                        disabled
                        InputProps={{
                          sx: { fontFamily: 'var(--font-body)' }
                        }}
                        InputLabelProps={{
                          sx: { fontFamily: 'var(--font-body)' }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        value={user.primaryEmailAddress?.emailAddress || ''}
                        disabled
                        InputProps={{
                          sx: { fontFamily: 'var(--font-body)' }
                        }}
                        InputLabelProps={{
                          sx: { fontFamily: 'var(--font-body)' }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        variant="outlined"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(555) 555-5555"
                        InputProps={{
                          sx: { fontFamily: 'var(--font-body)' }
                        }}
                        InputLabelProps={{
                          sx: { fontFamily: 'var(--font-body)' }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Hobbies & Passions"
                        variant="outlined"
                        name="hobbies"
                        value={formData.hobbies}
                        onChange={handleInputChange}
                        multiline
                        rows={4}
                        placeholder="Share your interests with other members"
                        InputProps={{
                          sx: { fontFamily: 'var(--font-body)' }
                        }}
                        InputLabelProps={{
                          sx: { fontFamily: 'var(--font-body)' }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        size="large"
                        sx={{ fontFamily: 'var(--font-body)' }}
                      >
                        Save Changes
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
} 