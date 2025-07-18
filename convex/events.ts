import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { api } from "./_generated/api";

// Get all events for a specific chapter
export const listByChapter = query({
  args: { chapterId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("events")
      .withIndex("by_chapter", (q) => q.eq("chapter_id", args.chapterId))
      .order("desc")
      .collect();
  },
});

// Get upcoming events for a specific chapter
export const listUpcoming = query({
  args: { chapterId: v.string() },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db
      .query("events")
      .withIndex("by_chapter", (q) => q.eq("chapter_id", args.chapterId))
      .order("asc")
      .collect();
  },
});

// Get a specific event by ID
export const getById = query({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a new event
export const create = mutation({
  args: {
    chapterId: v.string(),
    title: v.string(),
    description: v.string(),
    location: v.string(),
    startTime: v.number(),
    endTime: v.number(),
    photoUrl: v.optional(v.string()),
    cventLink: v.optional(v.string()),
    type: v.union(v.literal("main"), v.literal("small"), v.literal("community_led")),
    createdBy: v.string(),
    sendNotifications: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    
    // Create the event
    const eventId = await ctx.db.insert("events", {
      chapter_id: args.chapterId,
      title: args.title,
      description: args.description,
      location: args.location,
      start_time: args.startTime,
      end_time: args.endTime,
      photo_url: args.photoUrl,
      cvent_link: args.cventLink,
      type: args.type,
      created_by: args.createdBy,
      created_at: timestamp,
      updated_at: timestamp,
    });
    
    // Send notifications if requested
    if (args.sendNotifications) {
      await ctx.runMutation(api.notifications.notifyEventCreated, {
        chapterId: args.chapterId,
        eventId,
        eventTitle: args.title,
        eventDescription: args.description,
        createdBy: args.createdBy,
      });
    }
    
    return eventId;
  },
});

// Update an existing event
export const update = mutation({
  args: {
    id: v.id("events"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    location: v.optional(v.string()),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
    photoUrl: v.optional(v.string()),
    cventLink: v.optional(v.string()),
    type: v.optional(v.union(v.literal("main"), v.literal("small"), v.literal("community_led"))),
    sendNotifications: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, sendNotifications, ...updates } = args;
    const timestamp = Date.now();
    
    // Get the existing event
    const existingEvent = await ctx.db.get(id);
    if (!existingEvent) {
      throw new Error(`Event with ID ${id} not found`);
    }
    
    // Update the event
    await ctx.db.patch(id, {
      ...(updates.title !== undefined && { title: updates.title }),
      ...(updates.description !== undefined && { description: updates.description }),
      ...(updates.location !== undefined && { location: updates.location }),
      ...(updates.startTime !== undefined && { start_time: updates.startTime }),
      ...(updates.endTime !== undefined && { end_time: updates.endTime }),
      ...(updates.photoUrl !== undefined && { photo_url: updates.photoUrl }),
      ...(updates.cventLink !== undefined && { cvent_link: updates.cventLink }),
      ...(updates.type !== undefined && { type: updates.type }),
      updated_at: timestamp,
    });
    
    // Send notifications if requested
    if (sendNotifications) {
      // Get the updated event (with new values)
      const updatedEvent = await ctx.db.get(id);
      if (!updatedEvent) {
        throw new Error(`Updated event with ID ${id} not found`);
      }
      
      // Get all users in the chapter
      const allUsers = await ctx.db
        .query("users")
        .withIndex("by_chapter", (q) => q.eq("chapter_id", updatedEvent.chapter_id))
        .collect();
      
      // Filter users who have opted in to event notifications
      const users = allUsers.filter(user => 
        user.notification_preferences && 
        user.notification_preferences.includes("events")
      );
      
      // Skip the user who created the event
      const userIds = users
        .filter(user => user._id !== updatedEvent.created_by)
        .map(user => user._id);
      
      if (userIds.length > 0) {
        await ctx.runMutation(api.notifications.createBulk, {
          userIds,
          chapterId: updatedEvent.chapter_id,
          type: "event_updated",
          title: "Event Updated: " + updatedEvent.title,
          message: updatedEvent.description.substring(0, 100) + (updatedEvent.description.length > 100 ? "..." : ""),
          relatedId: id,
        });
      }
    }
    
    return id;
  },
});

// Delete an event
export const remove = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    // Get the event to delete
    const event = await ctx.db.get(args.id);
    
    if (!event) {
      throw new Error(`Event with ID ${args.id} not found`);
    }
    
    // Delete the event
    await ctx.db.delete(args.id);
    
    return args.id;
  },
});

// Scrape event data from Cvent URL
export const scrapeCventEvent = action({
  args: { cventUrl: v.string() },
  handler: async (ctx, args) => {
    // This is a mock implementation
    // In a real implementation, you would use a library like cheerio to scrape the event data
    
    // For now, return mock data based on the URL
    const mockEventData = {
      title: "YPO Event " + args.cventUrl.substring(args.cventUrl.lastIndexOf("/") + 1),
      description: "This is a mock event description scraped from Cvent. In a real implementation, this would be extracted from the event page.",
      location: "San Francisco, CA",
      startTime: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week from now
      endTime: Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000, // 3 hours after start
      photoUrl: "/placeholder.jpg",
      cventLink: args.cventUrl,
      type: "main",
    };
    
    return mockEventData;
  },
}); 