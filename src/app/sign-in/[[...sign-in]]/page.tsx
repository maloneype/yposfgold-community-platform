'use client';

import { SignIn } from "@clerk/nextjs";
import { MainLayout } from "@/components/layout/main-layout";
import { Box, Container } from "@mui/material";

export default function SignInPage() {
  return (
    <MainLayout>
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <SignIn
            appearance={{
              elements: {
                rootBox: {
                  width: '100%',
                  maxWidth: '500px',
                },
                card: {
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                },
              },
            }}
          />
        </Box>
      </Container>
    </MainLayout>
  );
} 