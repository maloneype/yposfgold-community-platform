import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Get all notifications for a user
export const listByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("user_id", args.userId))
      .order("desc")
      .collect();
  },
});

// Get unread notifications count for a user
export const getUnreadCount = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("user_id", args.userId))
      .filter((q) => q.eq(q.field("is_read"), false))
      .collect();
    
    return unreadNotifications.length;
  },
});

// Create a notification for a single user
export const create = mutation({
  args: {
    userId: v.string(),
    chapterId: v.string(),
    type: v.union(
      v.literal("event_created"),
      v.literal("event_updated"),
      v.literal("announcement_created"),
      v.literal("direct_message")
    ),
    title: v.string(),
    message: v.string(),
    relatedId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const notificationId = await ctx.db.insert("notifications", {
      user_id: args.userId,
      chapter_id: args.chapterId,
      type: args.type,
      title: args.title,
      message: args.message,
      related_id: args.relatedId,
      is_read: false,
      created_at: Date.now(),
    });
    
    return notificationId;
  },
});

// Create notifications for multiple users
export const createBulk = mutation({
  args: {
    userIds: v.array(v.string()),
    chapterId: v.string(),
    type: v.union(
      v.literal("event_created"),
      v.literal("event_updated"),
      v.literal("announcement_created"),
      v.literal("direct_message")
    ),
    title: v.string(),
    message: v.string(),
    relatedId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    const notificationIds = [];
    
    for (const userId of args.userIds) {
      const notificationId = await ctx.db.insert("notifications", {
        user_id: userId,
        chapter_id: args.chapterId,
        type: args.type,
        title: args.title,
        message: args.message,
        related_id: args.relatedId,
        is_read: false,
        created_at: timestamp,
      });
      
      notificationIds.push(notificationId);
    }
    
    return notificationIds;
  },
});

// Mark a notification as read
export const markAsRead = mutation({
  args: {
    id: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      is_read: true,
    });
    
    return args.id;
  },
});

// Mark all notifications as read for a user
export const markAllAsRead = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("user_id", args.userId))
      .filter((q) => q.eq(q.field("is_read"), false))
      .collect();
    
    for (const notification of notifications) {
      await ctx.db.patch(notification._id, {
        is_read: true,
      });
    }
    
    return notifications.length;
  },
});

// Delete a notification
export const remove = mutation({
  args: {
    id: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Create event notifications for all users with event notifications enabled
export const notifyEventCreated = mutation({
  args: {
    chapterId: v.string(),
    eventId: v.string(),
    eventTitle: v.string(),
    eventDescription: v.string(),
    createdBy: v.string(),
  },
  handler: async (ctx, args): Promise<any> => {
    // Get all users in the chapter
    const allUsers = await ctx.db
      .query("users")
      .withIndex("by_chapter", (q) => q.eq("chapter_id", args.chapterId))
      .collect();
    
    // Filter users who have opted in to event notifications
    const users = allUsers.filter(user => 
      user.notification_preferences && 
      user.notification_preferences.includes("events")
    );
    
    // Skip the user who created the event
    const userIds = users
      .filter(user => user._id !== args.createdBy)
      .map(user => user._id);
    
    if (userIds.length === 0) {
      return [];
    }
    
    // Create notifications for all users
    const notificationIds: any = await ctx.runMutation(api.notifications.createBulk, {
      userIds,
      chapterId: args.chapterId,
      type: "event_created",
      title: "New Event: " + args.eventTitle,
      message: args.eventDescription.substring(0, 100) + (args.eventDescription.length > 100 ? "..." : ""),
      relatedId: args.eventId,
    });
    
    return notificationIds;
  },
}); 