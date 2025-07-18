import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";
import { query, mutation } from "./_generated/server";
import { clerkClient } from '@clerk/nextjs/server';

// Store a session token
export const createSession = mutation({
  args: {
    userId: v.string(),
    token: v.string(),
    deviceIp: v.string(),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    
    // Set expiration to 90 days (in milliseconds)
    const expiresAt = timestamp + (90 * 24 * 60 * 60 * 1000);
    
    // Create session
    const sessionId = await ctx.db.insert("sessions", {
      user_id: args.userId,
      token: args.token, // In a real implementation, this should be hashed
      device_ip: args.deviceIp,
      expires_at: expiresAt,
      created_at: timestamp,
    });
    
    // Log the action
    await ctx.db.insert("audit_logs", {
      user_id: args.userId,
      action: "session_created",
      details: { device_ip: args.deviceIp, expires_at: expiresAt },
      timestamp,
    });
    
    return {
      sessionId,
      expiresAt,
    };
  },
});

// Validate a session token
export const validateSession = query({
  args: {
    userId: v.string(),
    token: v.string(),
    deviceIp: v.string(),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    
    // Find the session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("user_id", args.userId))
      .filter((q) => q.eq(q.field("token"), args.token))
      .first();
    
    if (!session) {
      return { valid: false, reason: "session_not_found" };
    }
    
    // Check if expired
    if (session.expires_at < timestamp) {
      return { valid: false, reason: "session_expired" };
    }
    
    // Check for IP change (potential security risk)
    if (session.device_ip !== args.deviceIp) {
      return { valid: false, reason: "ip_changed" };
    }
    
    return { valid: true };
  },
});

// Revoke a session
export const revokeSession = mutation({
  args: {
    sessionId: v.id("sessions"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    
    // Delete the session
    await ctx.db.delete(args.sessionId);
    
    // Log the action
    await ctx.db.insert("audit_logs", {
      user_id: args.userId,
      action: "session_revoked",
      details: { session_id: args.sessionId },
      timestamp,
    });
    
    return true;
  },
});

// Get all active sessions for a user
export const getActiveSessions = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    
    return await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("user_id", args.userId))
      .filter((q) => q.gt(q.field("expires_at"), timestamp))
      .collect();
  },
}); 