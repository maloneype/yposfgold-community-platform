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

// Get photo reactions for a specific photo
export const getPhotoReactions = query({
  args: { photoId: v.id("photos") },
  handler: async (ctx, args) => {
    const reactions = await ctx.db
      .query("photo_reactions")
      .withIndex("by_photo", (q) => q.eq("photo_id", args.photoId))
      .collect();
    
    // Group reactions by type and count
    const reactionCounts = reactions.reduce<Record<string, number>>((acc, reaction) => {
      acc[reaction.reaction_type] = (acc[reaction.reaction_type] || 0) + 1;
      return acc;
    }, {});
    
    return {
      reactions,
      counts: reactionCounts,
      total: reactions.length,
    };
  },
});

// Get user's reaction to a specific photo
export const getUserReaction = query({
  args: { 
    photoId: v.id("photos"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const reaction = await ctx.db
      .query("photo_reactions")
      .withIndex("by_photo", (q) => q.eq("photo_id", args.photoId))
      .filter((q) => q.eq(q.field("user_id"), args.userId))
      .unique();
    
    return reaction;
  },
});

// Add or update a photo reaction
export const addReaction = mutation({
  args: {
    photoId: v.id("photos"),
    userId: v.string(),
    chapterId: v.string(),
    reactionType: v.union(v.literal("like"), v.literal("love"), v.literal("wow"), v.literal("laugh")),
  },
  handler: async (ctx, args) => {
    // Check if user already has a reaction to this photo
    const existingReaction = await ctx.db
      .query("photo_reactions")
      .withIndex("by_photo", (q) => q.eq("photo_id", args.photoId))
      .filter((q) => q.eq(q.field("user_id"), args.userId))
      .unique();
    
    if (existingReaction) {
      // Update existing reaction
      await ctx.db.patch(existingReaction._id, {
        reaction_type: args.reactionType,
        created_at: Date.now(),
      });
      return existingReaction._id;
    } else {
      // Create new reaction
      const reactionId = await ctx.db.insert("photo_reactions", {
        photo_id: args.photoId,
        user_id: args.userId,
        chapter_id: args.chapterId,
        reaction_type: args.reactionType,
        created_at: Date.now(),
      });
      return reactionId;
    }
  },
});

// Remove a photo reaction
export const removeReaction = mutation({
  args: {
    photoId: v.id("photos"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const existingReaction = await ctx.db
      .query("photo_reactions")
      .withIndex("by_photo", (q) => q.eq("photo_id", args.photoId))
      .filter((q) => q.eq(q.field("user_id"), args.userId))
      .unique();
    
    if (existingReaction) {
      await ctx.db.delete(existingReaction._id);
      return existingReaction._id;
    }
    
    return null;
  },
});

// Get photos with reaction counts
export const listWithReactions = query({
  args: { chapterId: v.string() },
  handler: async (ctx, args) => {
    const photos = await ctx.db
      .query("photos")
      .withIndex("by_chapter", (q) => q.eq("chapter_id", args.chapterId))
      .order("desc")
      .collect();
    
    // Get reaction counts for each photo
    const photosWithReactions = await Promise.all(
      photos.map(async (photo) => {
        const reactions = await ctx.db
          .query("photo_reactions")
          .withIndex("by_photo", (q) => q.eq("photo_id", photo._id))
          .collect();
        
        const reactionCounts = reactions.reduce<Record<string, number>>((acc, reaction) => {
          acc[reaction.reaction_type] = (acc[reaction.reaction_type] || 0) + 1;
          return acc;
        }, {});
        
        return {
          ...photo,
          reactions: {
            counts: reactionCounts,
            total: reactions.length,
          },
        };
      })
    );
    
    return photosWithReactions;
  },
});

// Auto-associate photos with events based on metadata
export const autoAssociateWithEvents = mutation({
  args: { chapterId: v.string() },
  handler: async (ctx, args) => {
    // Get all photos without event associations
    const orphanedPhotos = await ctx.db
      .query("photos")
      .withIndex("by_chapter", (q) => q.eq("chapter_id", args.chapterId))
      .filter((q) => q.eq(q.field("event_id"), undefined))
      .collect();
    
    // Get all events for the chapter
    const events = await ctx.db
      .query("events")
      .withIndex("by_chapter", (q) => q.eq("chapter_id", args.chapterId))
      .collect();
    
    let associatedCount = 0;
    
    for (const photo of orphanedPhotos) {
      if (photo.metadata?.date) {
        // Find matching events (within 24 hours)
        const oneDayMs = 24 * 60 * 60 * 1000;
        const matchingEvents = events.filter(event => {
          const photoDate = photo.metadata.date!;
          return photoDate >= (event.start_time - oneDayMs) && 
                 photoDate <= (event.end_time + oneDayMs);
        });
        
        // If we found exactly one matching event, associate it
        if (matchingEvents.length === 1) {
          await ctx.db.patch(photo._id, {
            event_id: matchingEvents[0]._id,
          });
          associatedCount++;
        }
      }
    }
    
    return { associatedCount, totalOrphaned: orphanedPhotos.length };
  },
}); 