import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all users for a specific chapter
export const listByChapter = query({
  args: { chapterId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_chapter", (q) => q.eq("chapter_id", args.chapterId))
      .collect();
  },
});

// Search users by name, email, or other fields
export const searchUsers = query({
  args: { 
    chapterId: v.string(),
    searchQuery: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get all users for the chapter
    const users = await ctx.db
      .query("users")
      .withIndex("by_chapter", (q) => q.eq("chapter_id", args.chapterId))
      .collect();
    
    // If no search query, return all users
    if (!args.searchQuery) {
      return users;
    }
    
    // Otherwise, filter by search query
    const lowerCaseQuery = args.searchQuery.toLowerCase();
    
    return users
      .filter(user => {
        // Search in various fields
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
        const email = user.email.toLowerCase();
        const phone = user.phone ? user.phone.toLowerCase() : '';
        const hobbies = user.hobbies_passions ? user.hobbies_passions.toLowerCase() : '';
        const title = user.officer_title ? user.officer_title.toLowerCase() : '';
        
        return (
          fullName.includes(lowerCaseQuery) ||
          email.includes(lowerCaseQuery) ||
          phone.includes(lowerCaseQuery) ||
          hobbies.includes(lowerCaseQuery) ||
          title.includes(lowerCaseQuery)
        );
      });
  },
});

// Get a user by email
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Create a new user
export const create = mutation({
  args: {
    chapterId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
    hobbiesPassions: v.optional(v.string()),
    role: v.union(v.literal("member"), v.literal("spouse"), v.literal("officer"), v.literal("admin")),
    officerTitle: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    
    // Check if user with this email already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (existingUser) {
      throw new Error(`User with email ${args.email} already exists`);
    }
    
    // Create new user
    const userId = await ctx.db.insert("users", {
      chapter_id: args.chapterId,
      first_name: args.firstName,
      last_name: args.lastName,
      email: args.email,
      phone: args.phone,
      photo_url: args.photoUrl,
      hobbies_passions: args.hobbiesPassions,
      role: args.role,
      officer_title: args.officerTitle,
      notification_preferences: [],
      created_at: timestamp,
      updated_at: timestamp,
    });
    
    // Log the action
    await ctx.db.insert("audit_logs", {
      user_id: userId,
      action: "user_created",
      details: { email: args.email, role: args.role },
      timestamp,
    });
    
    return userId;
  },
});

// Update an existing user
export const update = mutation({
  args: {
    id: v.id("users"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    phone: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
    hobbiesPassions: v.optional(v.string()),
    notificationPreferences: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    const { id, ...updates } = args;
    
    // Get the existing user
    const existingUser = await ctx.db.get(id);
    if (!existingUser) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    // Update the user
    await ctx.db.patch(id, {
      ...(updates.firstName !== undefined && { first_name: updates.firstName }),
      ...(updates.lastName !== undefined && { last_name: updates.lastName }),
      ...(updates.phone !== undefined && { phone: updates.phone }),
      ...(updates.photoUrl !== undefined && { photo_url: updates.photoUrl }),
      ...(updates.hobbiesPassions !== undefined && { hobbies_passions: updates.hobbiesPassions }),
      ...(updates.notificationPreferences !== undefined && { notification_preferences: updates.notificationPreferences }),
      updated_at: timestamp,
    });
    
    // Log the action
    await ctx.db.insert("audit_logs", {
      user_id: id,
      action: "user_updated",
      details: { updates },
      timestamp,
    });
    
    return id;
  },
}); 

// Delete a user
export const deleteUser = mutation({
  args: {
    id: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { id } = args;
    
    // Get the existing user
    const existingUser = await ctx.db.get(id);
    if (!existingUser) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    // Log the action before deletion
    await ctx.db.insert("audit_logs", {
      user_id: id,
      action: "user_deleted",
      details: { email: existingUser.email, role: existingUser.role },
      timestamp: Date.now(),
    });
    
    // Delete the user
    await ctx.db.delete(id);
    
    return id;
  },
});

// Send invitations to multiple email addresses
export const sendInvites = mutation({
  args: {
    chapterId: v.string(),
    emails: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { chapterId, emails } = args;
    const timestamp = Date.now();
    const results = [];
    
    for (const email of emails) {
      try {
        // Check if user already exists
        const existingUser = await ctx.db
          .query("users")
          .withIndex("by_email", (q) => q.eq("email", email))
          .first();
        
        if (existingUser) {
          results.push({
            email,
            status: "skipped",
            message: "User already exists",
          });
          continue;
        }
        
        // In a real implementation, you would:
        // 1. Generate a magic link or invitation token
        // 2. Send an email with the link using a service like SendGrid or AWS SES
        // 3. Store the invitation in a separate table to track it
        
        // For now, we'll just log that an invitation would be sent
        await ctx.db.insert("audit_logs", {
          user_id: "system",
          action: "invitation_sent",
          details: { email, chapterId },
          timestamp,
        });
        
        results.push({
          email,
          status: "success",
          message: "Invitation sent",
        });
      } catch (error) {
        results.push({
          email,
          status: "error",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
    
    return results;
  },
}); 

// Update a user's theme preference
export const updateThemePreference = mutation({
  args: {
    userId: v.string(),
    themePreference: v.union(v.literal("modern"), v.literal("festive")),
  },
  handler: async (ctx, args) => {
    const { userId, themePreference } = args;
    const timestamp = Date.now();
    
    // Find the user by clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_id", userId))
      .first();
    
    if (!user) {
      throw new Error(`User with Clerk ID ${userId} not found`);
    }
    
    // Update the user's theme preference
    await ctx.db.patch(user._id, {
      theme_preference: themePreference,
      updated_at: timestamp,
    });
    
    // Log the action
    await ctx.db.insert("audit_logs", {
      user_id: user._id,
      action: "theme_preference_updated",
      details: { themePreference },
      timestamp,
    });
    
    return user._id;
  },
}); 