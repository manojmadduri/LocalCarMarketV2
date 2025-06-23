import { db } from "./db";
import { carAnalytics, carViewLog, type InsertCarViewLog } from "@shared/schema";
import { eq, sql, and, gte } from "drizzle-orm";

export class AnalyticsService {
  // Track a car view
  async trackCarView(carId: number, sessionId: string, userAgent?: string, ipAddress?: string, referrer?: string) {
    try {
      // Log the view
      await db.insert(carViewLog).values({
        carId,
        sessionId,
        userAgent,
        ipAddress,
        referrer,
      });

      // Update analytics counters
      await this.updateViewCounters(carId);
    } catch (error) {
      console.error('Error tracking car view:', error);
    }
  }

  // Update view counters in car_analytics
  private async updateViewCounters(carId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Get current counts
    const todayViews = await db
      .select({ count: sql<number>`count(*)` })
      .from(carViewLog)
      .where(and(
        eq(carViewLog.carId, carId),
        gte(carViewLog.viewedAt, today)
      ));

    const weekViews = await db
      .select({ count: sql<number>`count(*)` })
      .from(carViewLog)
      .where(and(
        eq(carViewLog.carId, carId),
        gte(carViewLog.viewedAt, weekAgo)
      ));

    const totalViews = await db
      .select({ count: sql<number>`count(*)` })
      .from(carViewLog)
      .where(eq(carViewLog.carId, carId));

    // Upsert analytics record
    await db.insert(carAnalytics).values({
      carId,
      totalViews: Number(totalViews[0]?.count || 0),
      viewsToday: Number(todayViews[0]?.count || 0),
      viewsThisWeek: Number(weekViews[0]?.count || 0),
      lastViewedAt: new Date(),
      updatedAt: new Date(),
    }).onConflictDoUpdate({
      target: [carAnalytics.carId],
      set: {
        totalViews: Number(totalViews[0]?.count || 0),
        viewsToday: Number(todayViews[0]?.count || 0),
        viewsThisWeek: Number(weekViews[0]?.count || 0),
        lastViewedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  // Track contact inquiry
  async trackContactInquiry(carId: number) {
    try {
      await db.update(carAnalytics)
        .set({
          contactInquiries: sql`${carAnalytics.contactInquiries} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(carAnalytics.carId, carId));
    } catch (error) {
      console.error('Error tracking contact inquiry:', error);
    }
  }

  // Track phone click
  async trackPhoneClick(carId: number) {
    try {
      await db.update(carAnalytics)
        .set({
          phoneClicks: sql`${carAnalytics.phoneClicks} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(carAnalytics.carId, carId));
    } catch (error) {
      console.error('Error tracking phone click:', error);
    }
  }

  // Track share action
  async trackShare(carId: number) {
    try {
      await db.update(carAnalytics)
        .set({
          shareCount: sql`${carAnalytics.shareCount} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(carAnalytics.carId, carId));
    } catch (error) {
      console.error('Error tracking share:', error);
    }
  }

  // Get analytics for a car
  async getCarAnalytics(carId: number) {
    try {
      const [analytics] = await db
        .select()
        .from(carAnalytics)
        .where(eq(carAnalytics.carId, carId));
      
      return analytics || {
        carId,
        totalViews: 0,
        viewsToday: 0,
        viewsThisWeek: 0,
        contactInquiries: 0,
        phoneClicks: 0,
        shareCount: 0,
        lastViewedAt: null,
      };
    } catch (error) {
      console.error('Error getting car analytics:', error);
      return {
        carId,
        totalViews: 0,
        viewsToday: 0,
        viewsThisWeek: 0,
        contactInquiries: 0,
        phoneClicks: 0,
        shareCount: 0,
        lastViewedAt: null,
      };
    }
  }

  // Update time spent on a car page
  async updateTimeSpent(carId: number, sessionId: string, timeSpent: number) {
    try {
      await db.update(carViewLog)
        .set({ timeSpent })
        .where(and(
          eq(carViewLog.carId, carId),
          eq(carViewLog.sessionId, sessionId)
        ));
    } catch (error) {
      console.error('Error updating time spent:', error);
    }
  }

  // Reset daily counters (should be run daily via cron)
  async resetDailyCounters() {
    try {
      await db.update(carAnalytics)
        .set({
          viewsToday: 0,
          updatedAt: new Date(),
        });
    } catch (error) {
      console.error('Error resetting daily counters:', error);
    }
  }

  // Initialize analytics for a new car
  async initializeCarAnalytics(carId: number) {
    try {
      await db.insert(carAnalytics).values({
        carId,
        totalViews: 0,
        viewsToday: 0,
        viewsThisWeek: 0,
        contactInquiries: 0,
        phoneClicks: 0,
        shareCount: 0,
      }).onConflictDoNothing();
    } catch (error) {
      console.error('Error initializing car analytics:', error);
    }
  }
}

export const analyticsService = new AnalyticsService();