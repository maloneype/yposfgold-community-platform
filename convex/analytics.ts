import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Track page view
export const trackPageView = mutation({
  args: {
    chapter_id: v.string(),
    user_id: v.optional(v.string()),
    page_path: v.string(),
    session_id: v.string(),
    device_info: v.optional(v.object({
      browser: v.string(),
      os: v.string(),
      device_type: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const { chapter_id, user_id, page_path, session_id, device_info } = args;
    
    // Insert page view record
    await ctx.db.insert("page_views", {
      chapter_id,
      user_id,
      page_path,
      session_id,
      device_info,
      timestamp: Date.now(),
    });
    
    return true;
  },
});

// Track feature usage
export const trackFeatureUsage = mutation({
  args: {
    chapter_id: v.string(),
    user_id: v.string(),
    feature: v.string(),
    action: v.string(),
    details: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { chapter_id, user_id, feature, action, details } = args;
    
    // Insert feature usage record
    await ctx.db.insert("feature_usage", {
      chapter_id,
      user_id,
      feature,
      action,
      details,
      timestamp: Date.now(),
    });
    
    return true;
  },
});

// Update user activity (aggregate daily data)
export const updateUserActivity = mutation({
  args: {
    chapter_id: v.string(),
    user_id: v.string(),
    date: v.string(), // ISO date string (YYYY-MM-DD)
    session_duration: v.number(),
    features_used: v.array(v.string()),
    pages_visited: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { chapter_id, user_id, date, session_duration, features_used, pages_visited } = args;
    
    // Check if activity record exists for this user and date
    const existingActivity = await ctx.db
      .query("user_activity")
      .withIndex("by_user", (q) => q.eq("user_id", user_id))
      .filter((q) => q.eq(q.field("date"), date))
      .first();
    
    if (existingActivity) {
      // Update existing record
      await ctx.db.patch(existingActivity._id, {
        login_count: existingActivity.login_count + 1,
        session_duration: existingActivity.session_duration + session_duration,
        features_used: Array.from(new Set([...existingActivity.features_used, ...features_used])),
        pages_visited: Array.from(new Set([...existingActivity.pages_visited, ...pages_visited])),
      });
    } else {
      // Create new record
      await ctx.db.insert("user_activity", {
        chapter_id,
        user_id,
        date,
        login_count: 1,
        session_duration,
        features_used,
        pages_visited,
      });
    }
    
    return true;
  },
});

// Get user activity data
export const getUserActivity = query({
  args: {
    chapter_id: v.optional(v.string()),
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.days || 30;
    const chapterId = args.chapter_id || "chapter1";
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Get all user activity records for the date range
    const activities = await ctx.db
      .query("user_activity")
      .withIndex("by_chapter", (q) => q.eq("chapter_id", chapterId))
      .filter((q) => q.gte(q.field("date"), startDate.toISOString().split('T')[0]))
      .collect();
    
    // Group by date and calculate totals
    const activityByDate = activities.reduce((acc, activity) => {
      const date = activity.date;
      if (!acc[date]) {
        acc[date] = { active: 0, new: 0, totalSessions: 0 };
      }
      acc[date].active += 1;
      acc[date].totalSessions += activity.login_count;
      return acc;
    }, {} as Record<string, { active: number; new: number; totalSessions: number }>);
    
    // Get new users for each date
    const newUsers = await ctx.db
      .query("users")
      .withIndex("by_chapter", (q) => q.eq("chapter_id", chapterId))
      .filter((q) => q.gte(q.field("created_at"), startDate.getTime()))
      .collect();
    
    // Group new users by date
    newUsers.forEach(user => {
      const date = new Date(user.created_at).toISOString().split('T')[0];
      if (activityByDate[date]) {
        activityByDate[date].new += 1;
      }
    });
    
    // Convert to array format for charts
    const result = Object.entries(activityByDate).map(([date, data]) => ({
      name: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      active: data.active,
      new: data.new,
    }));
    
    return result.sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
  },
});

// Get feature usage data
export const getFeatureUsage = query({
  args: {
    chapter_id: v.optional(v.string()),
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.days || 30;
    const chapterId = args.chapter_id || "chapter1";
    
    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Get all feature usage records for the date range
    const usageRecords = await ctx.db
      .query("feature_usage")
      .withIndex("by_chapter", (q) => q.eq("chapter_id", chapterId))
      .filter((q) => q.gte(q.field("timestamp"), startDate.getTime()))
      .collect();
    
    // Group by feature and count usage
    const usageByFeature = usageRecords.reduce((acc, record) => {
      const feature = record.feature;
      if (!acc[feature]) {
        acc[feature] = 0;
      }
      acc[feature] += 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Convert to array format for charts
    const result = Object.entries(usageByFeature).map(([feature, count]) => ({
      name: feature.charAt(0).toUpperCase() + feature.slice(1).replace('_', ' '),
      value: count,
    }));
    
    return result.sort((a, b) => b.value - a.value);
  },
});

// Get page views data
export const getPageViews = query({
  args: {
    chapter_id: v.optional(v.string()),
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.days || 30;
    const chapterId = args.chapter_id || "chapter1";
    
    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Get all page view records for the date range
    const pageViews = await ctx.db
      .query("page_views")
      .withIndex("by_chapter", (q) => q.eq("chapter_id", chapterId))
      .filter((q) => q.gte(q.field("timestamp"), startDate.getTime()))
      .collect();
    
    // Group by page and count views
    const viewsByPage = pageViews.reduce((acc, record) => {
      const page = record.page_path;
      if (!acc[page]) {
        acc[page] = 0;
      }
      acc[page] += 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Convert to array format for charts
    const result = Object.entries(viewsByPage).map(([page, count]) => ({
      name: page === '/' ? 'Home' : page.replace('/', '').charAt(0).toUpperCase() + page.replace('/', '').slice(1),
      views: count,
    }));
    
    return result.sort((a, b) => b.views - a.views);
  },
});

// Get all analytics data in a single query
export const getAllAnalyticsData = query({
  args: {
    chapter_id: v.optional(v.string()),
    days: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<{
    userActivity: { name: string; active: number; new: number; }[];
    featureUsage: { name: string; value: number; }[];
    pageViews: { name: string; views: number; }[];
  }> => {
    const chapterId = args.chapter_id || "chapter1";
    const days = args.days || 30;
    
    // Run all queries in parallel
    const [userActivity, featureUsage, pageViews] = await Promise.all([
      ctx.runQuery(api.analytics.getUserActivity, { chapter_id: chapterId, days }),
      ctx.runQuery(api.analytics.getFeatureUsage, { chapter_id: chapterId, days }),
      ctx.runQuery(api.analytics.getPageViews, { chapter_id: chapterId, days }),
    ]);
    
    return {
      userActivity,
      featureUsage,
      pageViews,
    };
  },
});

// Get analytics summary for dashboard
export const getAnalyticsSummary = query({
  args: {
    chapter_id: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const chapterId = args.chapter_id || "chapter1";
    
    // Get total users
    const totalUsers = await ctx.db
      .query("users")
      .withIndex("by_chapter", (q) => q.eq("chapter_id", chapterId))
      .collect();
    
    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentActivity = await ctx.db
      .query("user_activity")
      .withIndex("by_chapter", (q) => q.eq("chapter_id", chapterId))
      .filter((q) => q.gte(q.field("date"), sevenDaysAgo.toISOString().split('T')[0]))
      .collect();
    
    // Get total events
    const totalEvents = await ctx.db
      .query("events")
      .withIndex("by_chapter", (q) => q.eq("chapter_id", chapterId))
      .collect();
    
    // Get total photos
    const totalPhotos = await ctx.db
      .query("photos")
      .withIndex("by_chapter", (q) => q.eq("chapter_id", chapterId))
      .collect();
    
    // Calculate active users in last 7 days
    const activeUsers = recentActivity.reduce((acc, activity) => {
      acc.add(activity.user_id);
      return acc;
    }, new Set()).size;
    
    // Calculate engagement rate
    const engagementRate = totalUsers.length > 0 ? (activeUsers / totalUsers.length) * 100 : 0;
    
    return {
      totalUsers: totalUsers.length,
      activeUsers,
      engagementRate: Math.round(engagementRate),
      totalEvents: totalEvents.length,
      totalPhotos: totalPhotos.length,
    };
  },
}); 