'use client';

import { Box, Container, Typography, Link as MuiLink } from "@mui/material";
import { useTheme } from "@/lib/theme-context";

export function Footer() {
  const { theme } = useTheme();
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 3, 
        mt: 'auto',
        backgroundColor: 'var(--muted)',
        borderTop: '1px solid',
        borderColor: 'var(--border)'
      }}
    >
      <Container maxWidth="xl">
        <Typography 
          variant="body2" 
          color="text.secondary" 
          align="center"
          sx={{
            fontFamily: 'var(--font-body)'
          }}
        >
          © {new Date().getFullYear()} YPO SF Gold Chapter. All rights reserved.
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          align="center" 
          sx={{ mt: 1 }}
        >
          <MuiLink href="#" color="inherit" sx={{ mx: 1 }}>
            Privacy Policy
          </MuiLink>
          |
          <MuiLink href="#" color="inherit" sx={{ mx: 1 }}>
            Terms of Use
          </MuiLink>
          |
          <MuiLink href="#" color="inherit" sx={{ mx: 1 }}>
            Contact
          </MuiLink>
        </Typography>
      </Container>
    </Box>
  );
} 