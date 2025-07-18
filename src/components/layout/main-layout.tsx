'use client';

import { Box } from "@mui/material";
import { Header } from "./header";
import { Footer } from "./footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: 'var(--theme-background)',
      color: 'var(--theme-text-primary)',
      fontFamily: 'var(--font-body)',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      <Header />
      <Box component="main" sx={{ 
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--theme-background)',
        minHeight: 'calc(100vh - 160px)' // Adjust for header and footer
      }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
} 