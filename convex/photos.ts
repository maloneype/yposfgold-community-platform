import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

// Get all photos for a specific chapter
export const listByChapter = query({
  args: { chapterId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("photos")
      .withIndex("by_chapter", (q) => q.eq("chapter_id", args.chapterId))
      .order("desc")
      .collect();
  },
});

// Get photos for a specific event
export const listByEvent = query({
  args: { eventId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("photos")
      .withIndex("by_event", (q) => q.eq("event_id", args.eventId))
      .order("desc")
      .collect();
  },
});

// Get photos not associated with any event (miscellaneous)
export const listMiscellaneous = query({
  args: { chapterId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("photos")
      .withIndex("by_chapter", (q) => q.eq("chapter_id", args.chapterId))
      .order("desc")
      .collect();
  },
});

// Generate a URL to upload a photo
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Store photo metadata after upload
export const storePhotoMetadata = mutation({
  args: {
    storageId: v.id("_storage"),
    chapterId: v.string(),
    metadata: v.object({
      date: v.optional(v.number()),
      gps: v.optional(v.object({
        lat: v.number(),
        lon: v.number(),
      })),
    }),
    eventId: v.optional(v.string()),
    uploadedBy: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the storage URL for the uploaded photo
    const url = await ctx.storage.getUrl(args.storageId);
    
    if (!url) {
      throw new Error("Failed to get URL for uploaded photo");
    }
    
    // Store the photo metadata
    const photoId = await ctx.db.insert("photos", {
      chapter_id: args.chapterId,
      url,
      metadata: args.metadata,
      event_id: args.eventId,
      uploaded_by: args.uploadedBy,
      created_at: Date.now(),
    });
    
    return photoId;
  },
});

// Extract EXIF metadata from an uploaded photo
export const extractMetadata = action({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    // In a real implementation, you would use a library like ExifReader or Sharp
    // to extract metadata from the photo. For this example, we'll simulate it.
    
    // Get the storage URL for the uploaded photo
    const url = await ctx.storage.getUrl(args.storageId);
    
    if (!url) {
      throw new Error("Failed to get URL for uploaded photo");
    }
    
    // Simulate extracting metadata
    // In a real implementation, you would fetch the image and extract EXIF data
    const mockMetadata = {
      date: Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
      gps: {
        lat: 37.7749 + (Math.random() - 0.5) * 0.1, // Random location near San Francisco
        lon: -122.4194 + (Math.random() - 0.5) * 0.1,
      },
    };
    
    return mockMetadata;
  },
});

// Create a new photo
export const create = mutation({
  args: {
    chapterId: v.string(),
    url: v.string(),
    metadata: v.optional(
      v.object({
        date: v.optional(v.number()),
        gps: v.optional(
          v.object({
            lat: v.number(),
            lon: v.number(),
          })
        ),
      })
    ),
    eventId: v.optional(v.string()),
    uploadedBy: v.string(),
  },
  handler: async (ctx, args) => {
    const photoId = await ctx.db.insert("photos", {
      chapter_id: args.chapterId,
      url: args.url,
      metadata: args.metadata || {},
      event_id: args.eventId,
      uploaded_by: args.uploadedBy,
      created_at: Date.now(),
    });
    
    return photoId;
  },
});

// Delete a photo
export const remove = mutation({
  args: {
    id: v.id("photos"),
  },
  handler: async (ctx, args) => {
    const { id } = args;
    
    // Get the existing photo
    const existingPhoto = await ctx.db.get(id);
    if (!existingPhoto) {
      throw new Error(`Photo with ID ${id} not found`);
    }
    
    // Delete the photo
    await ctx.db.delete(id);
    
    return id;
  },
});

// Associate a photo with an event
export const associateWithEvent = mutation({
  args: {
    id: v.id("photos"),
    eventId: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    const { id, eventId } = args;
    
    // Get the existing photo
    const existingPhoto = await ctx.db.get(id);
    if (!existingPhoto) {
      throw new Error(`Photo with ID ${id} not found`);
    }
    
    // Update the photo with the new event ID
    await ctx.db.patch(id, {
      event_id: eventId || undefined,
    });
    
    return id;
  },
});

// Find events that might match a photo based on date/location
export const findMatchingEvents = query({
  args: { 
    chapterId: v.string(),
    date: v.number(),
    gps: v.optional(v.object({
      lat: v.number(),
      lon: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    // Get events around the photo date (within 24 hours)
    const oneDayMs = 24 * 60 * 60 * 1000;
    const startRange = args.date - oneDayMs;
    const endRange = args.date + oneDayMs;
    
    const events = await ctx.db
      .query("events")
      .withIndex("by_chapter", (q) => q.eq("chapter_id", args.chapterId))
      .filter((q) => 
        q.and(
          q.lte(q.field("start_time"), endRange),
          q.gte(q.field("end_time"), startRange)
        )
      )
      .collect();
    
    // In a real implementation, you might also consider GPS coordinates
    // to further narrow down matching events
    
    return events;
  },
}); 