import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table for member/spouse/admin profiles
  users: defineTable({
    chapter_id: v.string(),
    first_name: v.string(),
    last_name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    photo_url: v.optional(v.string()),
    hobbies_passions: v.optional(v.string()),
    role: v.union(v.literal("member"), v.literal("spouse"), v.literal("officer"), v.literal("admin")),
    officer_title: v.optional(v.string()),
    notification_preferences: v.optional(v.array(v.string())),
    theme_preference: v.optional(v.union(v.literal("modern"), v.literal("festive"))),
    clerk_id: v.optional(v.string()), // Clerk user ID for authentication
    created_at: v.number(),
    updated_at: v.number(),
  }).index("by_email", ["email"]).index("by_role", ["role"]).index("by_chapter", ["chapter_id"]).index("by_clerk_id", ["clerk_id"]),

  // Announcements table for admin-posted content
  announcements: defineTable({
    chapter_id: v.string(),
    title: v.string(),
    text: v.string(),
    media_urls: v.optional(v.array(v.string())),
    order: v.number(),
    created_by: v.string(),
    created_at: v.number(),
    updated_at: v.number(),
  }).index("by_chapter", ["chapter_id"]).index("by_order", ["order"]),

  // Events table for admin-created events
  events: defineTable({
    chapter_id: v.string(),
    title: v.string(),
    description: v.string(),
    location: v.string(),
    start_time: v.number(),
    end_time: v.number(),
    photo_url: v.optional(v.string()),
    cvent_link: v.optional(v.string()),
    type: v.union(v.literal("main"), v.literal("small"), v.literal("community_led")),
    created_by: v.string(),
    created_at: v.number(),
    updated_at: v.number(),
  }).index("by_chapter", ["chapter_id"]).index("by_start_time", ["start_time"]),

  // Photos table for user uploads with auto-tagging
  photos: defineTable({
    chapter_id: v.string(),
    url: v.string(),
    metadata: v.object({
      date: v.optional(v.number()),
      gps: v.optional(v.object({
        lat: v.number(),
        lon: v.number(),
      })),
    }),
    event_id: v.optional(v.string()),
    uploaded_by: v.string(),
    created_at: v.number(),
  }).index("by_chapter", ["chapter_id"]).index("by_event", ["event_id"]).index("by_created", ["created_at"]),

  // Sessions/Auth Logs table for tracking logins/sessions
  sessions: defineTable({
    user_id: v.string(),
    token: v.string(),
    device_ip: v.string(),
    expires_at: v.number(),
    created_at: v.number(),
  }).index("by_user", ["user_id"]),

  // Audit Logs table for GDPR/privacy audit trail
  audit_logs: defineTable({
    user_id: v.string(),
    action: v.string(),
    details: v.any(),
    timestamp: v.number(),
  }).index("by_user", ["user_id"]).index("by_timestamp", ["timestamp"]),
  
  // Notifications table for user notifications
  notifications: defineTable({
    user_id: v.string(),
    chapter_id: v.string(),
    type: v.union(
      v.literal("event_created"),
      v.literal("event_updated"),
      v.literal("announcement_created"),
      v.literal("direct_message")
    ),
    title: v.string(),
    message: v.string(),
    related_id: v.optional(v.string()), // ID of related event, announcement, etc.
    is_read: v.boolean(),
    created_at: v.number(),
  }).index("by_user", ["user_id"]).index("by_chapter", ["chapter_id"]).index("by_created", ["created_at"]).index("by_read", ["is_read"]),
  
  // Page views analytics table
  page_views: defineTable({
    chapter_id: v.string(),
    user_id: v.optional(v.string()), // Optional because some views might be from non-logged-in users
    page_path: v.string(),
    timestamp: v.number(),
    session_id: v.string(),
    device_info: v.optional(v.object({
      browser: v.string(),
      os: v.string(),
      device_type: v.string(),
    })),
  }).index("by_chapter", ["chapter_id"]).index("by_user", ["user_id"]).index("by_page", ["page_path"]).index("by_timestamp", ["timestamp"]),
  
  // Feature usage analytics table
  feature_usage: defineTable({
    chapter_id: v.string(),
    user_id: v.string(),
    feature: v.string(), // e.g., "directory_search", "photo_upload", etc.
    action: v.string(), // e.g., "view", "create", "delete", etc.
    details: v.optional(v.any()), // Additional details about the usage
    timestamp: v.number(),
  }).index("by_chapter", ["chapter_id"]).index("by_user", ["user_id"]).index("by_feature", ["feature"]).index("by_timestamp", ["timestamp"]),
  
  // User activity analytics table
  user_activity: defineTable({
    chapter_id: v.string(),
    user_id: v.string(),
    date: v.string(), // ISO date string (YYYY-MM-DD)
    login_count: v.number(),
    session_duration: v.number(), // Total session duration in seconds
    features_used: v.array(v.string()),
    pages_visited: v.array(v.string()),
  }).index("by_chapter", ["chapter_id"]).index("by_user", ["user_id"]).index("by_date", ["date"]),
  
  // Photo reactions table for likes/loves/reactions
  photo_reactions: defineTable({
    photo_id: v.id("photos"),
    user_id: v.string(),
    chapter_id: v.string(),
    reaction_type: v.union(v.literal("like"), v.literal("love"), v.literal("wow"), v.literal("laugh")),
    created_at: v.number(),
  }).index("by_photo", ["photo_id"]).index("by_user", ["user_id"]).index("by_chapter", ["chapter_id"]),
}); 