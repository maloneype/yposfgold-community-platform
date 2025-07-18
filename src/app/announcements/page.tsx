'use client';

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/lib/convex";
import { APP_CONFIG } from "@/lib/constants";
import { Box, Container, Typography, Grid } from "@mui/material";
import Image from "next/image";
import { format } from "date-fns";

export default function AnnouncementsPage() {
  // Get chapter ID from constants
  const chapterId = APP_CONFIG.CHAPTER_ID;
  
  // Fetch announcements from Convex
  const announcements = useQuery(api.announcements.listByChapter, { chapterId }) || [];
  
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
            Announcements
          </Typography>
        </Container>
      </Box>
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {announcements.map((announcement) => (
            <Grid item xs={12} key={announcement._id}>
              <Card>
                <CardContent>
                  <Typography 
                    variant="h5" 
                    component="h2" 
                    gutterBottom
                    sx={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {announcement.title}
                  </Typography>
                  
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 2,
                      fontFamily: 'var(--font-body)',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {announcement.text}
                  </Typography>
                  
                  {announcement.media_urls && announcement.media_urls.length > 0 && (
                    <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      {announcement.media_urls.map((url, index) => (
                        <Box 
                          key={index} 
                          sx={{ 
                            position: 'relative',
                            width: 200,
                            height: 150,
                            borderRadius: 1,
                            overflow: 'hidden'
                          }}
                        >
                          <Image
                            src={url}
                            alt={`Media for ${announcement.title}`}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </Box>
                      ))}
                    </Box>
                  )}
                  
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: 'block',
                      mt: 2,
                      color: 'text.secondary',
                      fontFamily: 'var(--font-body)'
                    }}
                  >
                    Posted on {format(announcement.created_at, 'MMMM d, yyyy')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
          
          {announcements.length === 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography 
                    variant="body1" 
                    align="center"
                    sx={{ fontFamily: 'var(--font-body)' }}
                  >
                    No announcements yet.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Container>
    </MainLayout>
  );
} 