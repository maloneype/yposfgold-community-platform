'use client';

import { MainLayout } from "@/components/layout/main-layout";
import { Box, Typography, Button, Container } from "@mui/material";
import { useTheme } from "@/lib/theme-context";
import { useRouter } from "next/navigation";

export default function Home() {
  const { theme } = useTheme();
  const router = useRouter();
  
  const handleSignInClick = () => {
    router.push('/sign-in');
  };
  
  return (
    <MainLayout>
      <Box 
        sx={{ 
          py: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          backgroundColor: 'var(--background)',
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              mb: 4,
              fontFamily: 'var(--font-heading)'
            }}
          >
            Welcome to YPO SF Gold Community Platform
          </Typography>
          
          <Typography 
            variant="h5" 
            component="p" 
            sx={{ 
              mb: 4,
              fontFamily: 'var(--font-body)'
            }}
          >
            A centralized hub for YPO SF Gold Chapter members
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
            <Button variant="contained" color="primary" size="large" onClick={handleSignInClick}>
              Sign In
            </Button>
            <Button variant="outlined" color="secondary" size="large">
              Learn More
            </Button>
          </Box>
        </Container>
      </Box>
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Features
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: '1fr 1fr 1fr'
          },
          gap: 4,
          mt: 4
        }}>
          <FeatureCard 
            title="Member Directory" 
            description="Access contact information for all chapter members with opt-in privacy controls."
          />
          <FeatureCard 
            title="Event Calendar" 
            description="Stay updated on upcoming events and easily add them to your personal calendar."
          />
          <FeatureCard 
            title="Photo Sharing" 
            description="Share and view photos from chapter events with automatic event tagging."
          />
        </Box>
      </Container>
    </MainLayout>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  const { theme } = useTheme();
  
  return (
    <Box sx={{ 
      p: 3, 
      borderRadius: 2, 
      boxShadow: 1,
      backgroundColor: 'background.paper',
      transition: 'transform 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
      }
    }}>
      <Typography 
        variant="h6" 
        component="h3" 
        gutterBottom
        sx={{ 
          fontWeight: 'bold',
          fontFamily: 'var(--font-heading)'
        }}
      >
        {title}
      </Typography>
      <Typography 
        variant="body1"
        sx={{ 
          fontFamily: 'var(--font-body)'
        }}
      >
        {description}
      </Typography>
    </Box>
  );
} 