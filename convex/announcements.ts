import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all announcements for a specific chapter, ordered by the order field
export const listByChapter = query({
  args: { chapterId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("announcements")
      .withIndex("by_chapter", (q) => q.eq("chapter_id", args.chapterId))
      .order("desc")
      .collect();
  },
});

// Create a new announcement
export const create = mutation({
  args: {
    chapterId: v.string(),
    title: v.string(),
    text: v.string(),
    mediaUrls: v.optional(v.array(v.string())),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    
    // Get the highest order value to place the new announcement at the top
    const announcements = await ctx.db
      .query("announcements")
      .withIndex("by_chapter", (q) => q.eq("chapter_id", args.chapterId))
      .order("desc")
      .collect();
    
    // If there are existing announcements, put the new one at the top (order 0)
    // and increment all others
    if (announcements.length > 0) {
      // Update all existing announcements to increment their order
      for (const announcement of announcements) {
        await ctx.db.patch(announcement._id, {
          order: announcement.order + 1,
        });
      }
    }
    
    // Create new announcement with order 0 (top)
    const announcementId = await ctx.db.insert("announcements", {
      chapter_id: args.chapterId,
      title: args.title,
      text: args.text,
      media_urls: args.mediaUrls,
      order: 0,
      created_by: args.createdBy,
      created_at: timestamp,
      updated_at: timestamp,
    });
    
    return announcementId;
  },
});

// Update an existing announcement
export const update = mutation({
  args: {
    id: v.id("announcements"),
    title: v.optional(v.string()),
    text: v.optional(v.string()),
    mediaUrls: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    const { id, ...updates } = args;
    
    // Get the existing announcement
    const existingAnnouncement = await ctx.db.get(id);
    if (!existingAnnouncement) {
      throw new Error(`Announcement with ID ${id} not found`);
    }
    
    // Update the announcement
    await ctx.db.patch(id, {
      ...(updates.title !== undefined && { title: updates.title }),
      ...(updates.text !== undefined && { text: updates.text }),
      ...(updates.mediaUrls !== undefined && { media_urls: updates.mediaUrls }),
      updated_at: timestamp,
    });
    
    return id;
  },
});

// Delete an announcement
export const remove = mutation({
  args: {
    id: v.id("announcements"),
  },
  handler: async (ctx, args) => {
    const { id } = args;
    
    // Get the existing announcement
    const existingAnnouncement = await ctx.db.get(id);
    if (!existingAnnouncement) {
      throw new Error(`Announcement with ID ${id} not found`);
    }
    
    // Get all announcements for this chapter to update order
    const announcements = await ctx.db
      .query("announcements")
      .withIndex("by_chapter", (q) => q.eq("chapter_id", existingAnnouncement.chapter_id))
      .order("desc")
      .collect();
    
    // Update the order of announcements after the deleted one
    for (const announcement of announcements) {
      if (announcement.order > existingAnnouncement.order) {
        await ctx.db.patch(announcement._id, {
          order: announcement.order - 1,
        });
      }
    }
    
    // Delete the announcement
    await ctx.db.delete(id);
    
    return id;
  },
});

// Reorder an announcement
export const reorder = mutation({
  args: {
    id: v.id("announcements"),
    newOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, newOrder } = args;
    
    // Get the existing announcement
    const existingAnnouncement = await ctx.db.get(id);
    if (!existingAnnouncement) {
      throw new Error(`Announcement with ID ${id} not found`);
    }
    
    const currentOrder = existingAnnouncement.order;
    
    // No change needed if the order is the same
    if (currentOrder === newOrder) {
      return id;
    }
    
    // Get all announcements for this chapter
    const announcements = await ctx.db
      .query("announcements")
      .withIndex("by_chapter", (q) => q.eq("chapter_id", existingAnnouncement.chapter_id))
      .collect();
    
    // Update the order of affected announcements
    if (currentOrder < newOrder) {
      // Moving down: decrement order of announcements between currentOrder and newOrder
      for (const announcement of announcements) {
        if (announcement._id !== id && 
            announcement.order > currentOrder && 
            announcement.order <= newOrder) {
          await ctx.db.patch(announcement._id, {
            order: announcement.order - 1,
          });
        }
      }
    } else {
      // Moving up: increment order of announcements between newOrder and currentOrder
      for (const announcement of announcements) {
        if (announcement._id !== id && 
            announcement.order >= newOrder && 
            announcement.order < currentOrder) {
          await ctx.db.patch(announcement._id, {
            order: announcement.order + 1,
          });
        }
      }
    }
    
    // Update the order of the target announcement
    await ctx.db.patch(id, {
      order: newOrder,
      updated_at: Date.now(),
    });
    
    return id;
  },
}); 