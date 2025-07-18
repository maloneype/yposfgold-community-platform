import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Chapter ID for all placeholder data (makes it easy to clear)
const PLACEHOLDER_CHAPTER_ID = "placeholder_chapter_ypo_sf_gold";

// Helper function to create a timestamp for specific dates
const createTimestamp = (year: number, month: number, day: number, hour: number = 10, minute: number = 0) => {
  return new Date(year, month - 1, day, hour, minute).getTime();
};

// Clear all placeholder data
export const clearPlaceholderData = mutation({
  args: {},
  handler: async (ctx) => {
    console.log("Clearing placeholder data...");
    
    // Clear all tables with placeholder data
    const tables = ["users", "events", "announcements", "photos", "photo_reactions", "notifications"];
    
    for (const table of tables) {
      const items = await ctx.db
        .query(table as any)
        .filter((q) => q.eq(q.field("chapter_id"), PLACEHOLDER_CHAPTER_ID))
        .collect();
      
      for (const item of items) {
        await ctx.db.delete(item._id);
      }
    }
    
    console.log("Placeholder data cleared successfully");
    return { success: true, message: "All placeholder data cleared" };
  },
});

// Check if placeholder data exists
export const checkPlaceholderData = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("chapter_id"), PLACEHOLDER_CHAPTER_ID))
      .collect();
    
    const events = await ctx.db
      .query("events")
      .filter((q) => q.eq(q.field("chapter_id"), PLACEHOLDER_CHAPTER_ID))
      .collect();
    
    const announcements = await ctx.db
      .query("announcements")
      .filter((q) => q.eq(q.field("chapter_id"), PLACEHOLDER_CHAPTER_ID))
      .collect();
    
    const photos = await ctx.db
      .query("photos")
      .filter((q) => q.eq(q.field("chapter_id"), PLACEHOLDER_CHAPTER_ID))
      .collect();
    
    return {
      exists: users.length > 0 || events.length > 0 || announcements.length > 0 || photos.length > 0,
      counts: {
        users: users.length,
        events: events.length,
        announcements: announcements.length,
        photos: photos.length,
      },
    };
  },
});

// Seed the database with placeholder data
export const seedPlaceholderData = mutation({
  args: {},
  handler: async (ctx) => {
    console.log("Seeding placeholder data...");
    
    // Create placeholder users (20 total: 10 members, 10 spouses)
    const users = await seedUsers(ctx);
    console.log(`Created ${users.length} users`);
    
    // Create events
    const events = await seedEvents(ctx, users);
    console.log(`Created ${events.length} events`);
    
    // Create announcements
    const announcements = await seedAnnouncements(ctx, users);
    console.log(`Created ${announcements.length} announcements`);
    
    // Create photos
    const photos = await seedPhotos(ctx, users, events);
    console.log(`Created ${photos.length} photos`);
    
    // Create photo reactions
    const reactions = await seedPhotoReactions(ctx, users, photos);
    console.log(`Created ${reactions.length} photo reactions`);
    
    console.log("Seeding completed successfully");
    return { 
      success: true, 
      message: "Placeholder data seeded successfully",
      counts: {
        users: users.length,
        events: events.length,
        announcements: announcements.length,
        photos: photos.length,
        reactions: reactions.length,
      }
    };
  },
});

// Helper function to seed users
async function seedUsers(ctx: any) {
  const now = Date.now();
  const users = [];
  
  // Board members and officers
  const boardMembers = [
    { firstName: "John", lastName: "Anderson", email: "john.anderson@example.com", role: "officer", officerTitle: "Chapter Chair" },
    { firstName: "Sarah", lastName: "Johnson", email: "sarah.johnson@example.com", role: "officer", officerTitle: "Learning Officer" },
    { firstName: "Michael", lastName: "Davis", email: "michael.davis@example.com", role: "officer", officerTitle: "Membership Officer" },
    { firstName: "Emily", lastName: "Wilson", email: "emily.wilson@example.com", role: "officer", officerTitle: "Communications Officer" },
  ];
  
  // Regular members
  const members = [
    { firstName: "David", lastName: "Brown", email: "david.brown@example.com", role: "member" },
    { firstName: "Lisa", lastName: "Taylor", email: "lisa.taylor@example.com", role: "member" },
    { firstName: "James", lastName: "Miller", email: "james.miller@example.com", role: "member" },
    { firstName: "Jennifer", lastName: "Garcia", email: "jennifer.garcia@example.com", role: "member" },
    { firstName: "Robert", lastName: "Martinez", email: "robert.martinez@example.com", role: "member" },
    { firstName: "Amanda", lastName: "Rodriguez", email: "amanda.rodriguez@example.com", role: "member" },
  ];
  
  // Spouses
  const spouses = [
    { firstName: "Karen", lastName: "Anderson", email: "karen.anderson@example.com", role: "spouse" },
    { firstName: "Mark", lastName: "Johnson", email: "mark.johnson@example.com", role: "spouse" },
    { firstName: "Laura", lastName: "Davis", email: "laura.davis@example.com", role: "spouse" },
    { firstName: "Brian", lastName: "Wilson", email: "brian.wilson@example.com", role: "spouse" },
    { firstName: "Susan", lastName: "Brown", email: "susan.brown@example.com", role: "spouse" },
    { firstName: "Kevin", lastName: "Taylor", email: "kevin.taylor@example.com", role: "spouse" },
    { firstName: "Michelle", lastName: "Miller", email: "michelle.miller@example.com", role: "spouse" },
    { firstName: "Paul", lastName: "Garcia", email: "paul.garcia@example.com", role: "spouse" },
    { firstName: "Catherine", lastName: "Martinez", email: "catherine.martinez@example.com", role: "spouse" },
    { firstName: "Thomas", lastName: "Rodriguez", email: "thomas.rodriguez@example.com", role: "spouse" },
  ];
  
  // Create all users
  const allUsers = [...boardMembers, ...members, ...spouses];
  
  for (const user of allUsers) {
    const userId = await ctx.db.insert("users", {
      chapter_id: PLACEHOLDER_CHAPTER_ID,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      phone: `(415) 555-${Math.floor(Math.random() * 9000) + 1000}`,
      photo_url: `https://i.pravatar.cc/300?u=${user.email}`,
      hobbies_passions: [
        "Golf, Wine tasting, Sailing",
        "Tennis, Photography, Travel",
        "Cooking, Art collecting, Yoga",
        "Running, Real estate, Mentoring",
        "Skiing, Board games, Volunteering"
      ][Math.floor(Math.random() * 5)],
      role: user.role as any,
      officer_title: 'officerTitle' in user ? user.officerTitle : undefined,
      notification_preferences: ["email", "in_app"],
      theme_preference: Math.random() > 0.5 ? "modern" : "festive",
      clerk_id: `placeholder_clerk_${user.email}`,
      created_at: now,
      updated_at: now,
    });
    
    users.push({ id: userId, ...user });
  }
  
  return users;
}

// Helper function to seed events
async function seedEvents(ctx: any, users: any[]) {
  const now = Date.now();
  const events = [];
  const adminUsers = users.filter(u => u.role === "officer" || u.role === "admin");
  
  // Main events (5)
  const mainEvents = [
    {
      title: "Annual SF Gold Retreat",
      description: "Join us for our annual chapter retreat in Napa Valley. Three days of learning, networking, and relaxation with fellow members and their families.",
      location: "Auberge du Soleil, Napa Valley",
      startTime: createTimestamp(2025, 2, 15, 9, 0),
      endTime: createTimestamp(2025, 2, 17, 17, 0),
      type: "main",
      cventLink: "https://cvent.me/kqVXoW",
    },
    {
      title: "Leadership Excellence Summit",
      description: "A transformative summit focusing on leadership development, featuring keynote speakers and interactive workshops.",
      location: "Four Seasons San Francisco",
      startTime: createTimestamp(2025, 3, 20, 8, 0),
      endTime: createTimestamp(2025, 3, 21, 18, 0),
      type: "main",
      cventLink: "https://cvent.me/leadership2025",
    },
    {
      title: "SF Gold Gala 2025",
      description: "Our annual black-tie gala celebrating achievements and raising funds for our chapter's community initiatives.",
      location: "San Francisco Museum of Modern Art",
      startTime: createTimestamp(2025, 4, 12, 18, 0),
      endTime: createTimestamp(2025, 4, 12, 23, 0),
      type: "main",
      cventLink: "https://cvent.me/gala2025",
    },
    {
      title: "Innovation & Technology Forum",
      description: "Explore the latest trends in technology and innovation with industry leaders and venture capitalists.",
      location: "Salesforce Tower, San Francisco",
      startTime: createTimestamp(2025, 5, 8, 14, 0),
      endTime: createTimestamp(2025, 5, 8, 18, 0),
      type: "main",
      cventLink: "https://cvent.me/innovation2025",
    },
    {
      title: "Family Day at Golden Gate Park",
      description: "A family-friendly event with activities for all ages, including picnic, games, and guided nature walks.",
      location: "Golden Gate Park, San Francisco",
      startTime: createTimestamp(2025, 6, 14, 10, 0),
      endTime: createTimestamp(2025, 6, 14, 16, 0),
      type: "main",
      cventLink: "https://cvent.me/familyday2025",
    },
  ];
  
  // Small events (3)
  const smallEvents = [
    {
      title: "Monthly Breakfast Club",
      description: "Casual breakfast meeting for members to connect and share business insights.",
      location: "The St. Regis San Francisco",
      startTime: createTimestamp(2025, 2, 28, 7, 30),
      endTime: createTimestamp(2025, 2, 28, 9, 0),
      type: "small",
      cventLink: "https://cvent.me/breakfast-feb",
    },
    {
      title: "Wine Tasting Evening",
      description: "Exclusive wine tasting featuring selections from Napa Valley's finest vineyards.",
      location: "Private Residence, Pacific Heights",
      startTime: createTimestamp(2025, 3, 15, 18, 0),
      endTime: createTimestamp(2025, 3, 15, 21, 0),
      type: "small",
      cventLink: "https://cvent.me/wine-tasting",
    },
    {
      title: "Book Club: 'The Innovator's Dilemma'",
      description: "Monthly book club discussion focused on business and leadership literature.",
      location: "San Francisco Public Library",
      startTime: createTimestamp(2025, 4, 5, 17, 0),
      endTime: createTimestamp(2025, 4, 5, 19, 0),
      type: "small",
      cventLink: "https://cvent.me/bookclub-april",
    },
  ];
  
  // Community-led events (2)
  const communityEvents = [
    {
      title: "Volunteer Day at Local Food Bank",
      description: "Give back to the community by volunteering at the SF Food Bank. Organized by chapter members.",
      location: "SF-Marin Food Bank",
      startTime: createTimestamp(2025, 3, 10, 9, 0),
      endTime: createTimestamp(2025, 3, 10, 13, 0),
      type: "community_led",
      cventLink: "https://cvent.me/volunteer-march",
    },
    {
      title: "Hiking Group: Mt. Tamalpais",
      description: "Join fellow members for a scenic hike in Marin County followed by lunch.",
      location: "Mt. Tamalpais State Park",
      startTime: createTimestamp(2025, 4, 19, 8, 0),
      endTime: createTimestamp(2025, 4, 19, 15, 0),
      type: "community_led",
      cventLink: "https://cvent.me/hiking-april",
    },
  ];
  
  // Create all events
  const allEvents = [...mainEvents, ...smallEvents, ...communityEvents];
  
  for (const event of allEvents) {
    const eventId = await ctx.db.insert("events", {
      chapter_id: PLACEHOLDER_CHAPTER_ID,
      title: event.title,
      description: event.description,
      location: event.location,
      start_time: event.startTime,
      end_time: event.endTime,
      photo_url: `https://picsum.photos/800/400?random=${Math.floor(Math.random() * 1000)}`,
      cvent_link: event.cventLink,
      type: event.type as any,
      created_by: adminUsers[Math.floor(Math.random() * adminUsers.length)].id,
      created_at: now,
      updated_at: now,
    });
    
    events.push({ id: eventId, ...event });
  }
  
  return events;
}

// Helper function to seed announcements
async function seedAnnouncements(ctx: any, users: any[]) {
  const now = Date.now();
  const announcements = [];
  const adminUsers = users.filter(u => u.role === "officer" || u.role === "admin");
  
  const announcementData = [
    {
      title: "Welcome to the New YPO SF Gold Platform!",
      text: "We're excited to launch our new community platform! This central hub will keep you connected with chapter activities, member directory, and upcoming events. Please take a moment to update your profile and explore the features.",
      order: 1,
    },
    {
      title: "2025 Chapter Goals & Initiatives",
      text: "This year, we're focusing on three key areas: Leadership Development, Community Impact, and Member Engagement. Join us in making 2025 our most successful year yet!",
      order: 2,
    },
    {
      title: "New Member Spotlights",
      text: "Please join us in welcoming our newest members to the SF Gold chapter. Their diverse backgrounds and experiences will enrich our community. Check out their profiles in the member directory.",
      order: 3,
    },
    {
      title: "Annual Retreat Registration Open",
      text: "Registration is now open for our annual chapter retreat in Napa Valley! Limited spots available. This three-day event promises incredible learning opportunities and networking. Register through the events page.",
      order: 4,
    },
    {
      title: "Community Service Opportunities",
      text: "We have several volunteer opportunities coming up this quarter. From food bank volunteering to mentoring local entrepreneurs, there are many ways to give back. Check the events page for details.",
      order: 5,
    },
  ];
  
  for (const announcement of announcementData) {
    const announcementId = await ctx.db.insert("announcements", {
      chapter_id: PLACEHOLDER_CHAPTER_ID,
      title: announcement.title,
      text: announcement.text,
      media_urls: Math.random() > 0.7 ? [`https://picsum.photos/600/300?random=${Math.floor(Math.random() * 1000)}`] : undefined,
      order: announcement.order,
      created_by: adminUsers[Math.floor(Math.random() * adminUsers.length)].id,
      created_at: now - (announcement.order * 24 * 60 * 60 * 1000), // Stagger creation dates
      updated_at: now - (announcement.order * 24 * 60 * 60 * 1000),
    });
    
    announcements.push({ id: announcementId, ...announcement });
  }
  
  return announcements;
}

// Helper function to seed photos
async function seedPhotos(ctx: any, users: any[], events: any[]) {
  const photos = [];
  
  // Create 3-5 photos for each event
  for (const event of events) {
    const photoCount = Math.floor(Math.random() * 3) + 3; // 3-5 photos per event
    
    for (let i = 0; i < photoCount; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const photoDate = event.startTime + (Math.random() * (event.endTime - event.startTime));
      
      const photoId = await ctx.db.insert("photos", {
        chapter_id: PLACEHOLDER_CHAPTER_ID,
        url: `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 10000)}`,
        metadata: {
          date: photoDate,
          gps: {
            lat: 37.7749 + (Math.random() - 0.5) * 0.1,
            lon: -122.4194 + (Math.random() - 0.5) * 0.1,
          },
        },
        event_id: event.id,
        uploaded_by: randomUser.id,
        created_at: photoDate + Math.floor(Math.random() * 24 * 60 * 60 * 1000), // Uploaded within 24 hours
      });
      
      photos.push({ id: photoId, eventId: event.id, uploadedBy: randomUser.id });
    }
  }
  
  // Create some miscellaneous photos (not associated with events)
  for (let i = 0; i < 10; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const photoDate = Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000); // Within last 30 days
    
    const photoId = await ctx.db.insert("photos", {
      chapter_id: PLACEHOLDER_CHAPTER_ID,
      url: `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 10000)}`,
      metadata: {
        date: photoDate,
        gps: {
          lat: 37.7749 + (Math.random() - 0.5) * 0.1,
          lon: -122.4194 + (Math.random() - 0.5) * 0.1,
        },
      },
      uploaded_by: randomUser.id,
      created_at: photoDate + Math.floor(Math.random() * 24 * 60 * 60 * 1000),
    });
    
    photos.push({ id: photoId, uploadedBy: randomUser.id });
  }
  
  return photos;
}

// Helper function to seed photo reactions
async function seedPhotoReactions(ctx: any, users: any[], photos: any[]) {
  const reactions = [];
  const reactionTypes = ["like", "love", "wow", "laugh"] as const;
  
  // Add random reactions to photos
  for (const photo of photos) {
    const reactionCount = Math.floor(Math.random() * 5) + 1; // 1-5 reactions per photo
    const reactingUsers = users.sort(() => 0.5 - Math.random()).slice(0, reactionCount);
    
    for (const user of reactingUsers) {
      const reactionType = reactionTypes[Math.floor(Math.random() * reactionTypes.length)];
      
      const reactionId = await ctx.db.insert("photo_reactions", {
        photo_id: photo.id,
        user_id: user.id,
        chapter_id: PLACEHOLDER_CHAPTER_ID,
        reaction_type: reactionType,
        created_at: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000), // Within last week
      });
      
      reactions.push({ id: reactionId, photoId: photo.id, userId: user.id, type: reactionType });
    }
  }
  
  return reactions;
} 