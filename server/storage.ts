import { eq, desc, sql, and, gte } from "drizzle-orm";
import { db } from "./db";
import {
  type User, type InsertUser,
  type Organization, type InsertOrganization,
  type Fund, type InsertFund,
  type Donor, type InsertDonor,
  type Donation, type InsertDonation,
  users, organizations, funds, donors, donations
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getOrganization(id: string): Promise<Organization | undefined>;
  getOrganizationBySlug(slug: string): Promise<Organization | undefined>;
  getFirstOrganization(): Promise<Organization | undefined>;
  getAllOrganizations(): Promise<Organization[]>;
  createOrganization(org: InsertOrganization): Promise<Organization>;
  updateOrganization(id: string, org: Partial<InsertOrganization>): Promise<Organization | undefined>;
  
  getFundsByOrganization(organizationId: string): Promise<Fund[]>;
  createFund(fund: InsertFund): Promise<Fund>;
  updateFund(id: string, fund: Partial<InsertFund>): Promise<Fund | undefined>;
  deleteFund(id: string): Promise<void>;
  
  getDonorsByOrganization(organizationId: string): Promise<Donor[]>;
  getDonor(id: string): Promise<Donor | undefined>;
  createDonor(donor: InsertDonor): Promise<Donor>;
  
  getDonationsByOrganization(organizationId: string, limit?: number): Promise<Donation[]>;
  createDonation(donation: InsertDonation): Promise<Donation>;
  getDonationStats(organizationId: string): Promise<{
    todayTotal: string;
    monthTotal: string;
    giftCountToday: number;
    giftCountMonth: number;
    giftCountYear: number;
    averageGift: string;
    newDonorsThisMonth: number;
  }>;
  getDonorStats(organizationId: string): Promise<Array<{
    id: string;
    name: string;
    email: string | null;
    totalGifts: string;
    giftCount: number;
    lastGift: Date | null;
    status: string;
  }>>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getOrganization(id: string): Promise<Organization | undefined> {
    const [org] = await db.select().from(organizations).where(eq(organizations.id, id));
    return org;
  }

  async getOrganizationBySlug(slug: string): Promise<Organization | undefined> {
    const [org] = await db.select().from(organizations).where(eq(organizations.slug, slug));
    return org;
  }

  async getFirstOrganization(): Promise<Organization | undefined> {
    const [org] = await db.select().from(organizations).limit(1);
    return org;
  }

  async getAllOrganizations(): Promise<Organization[]> {
    return db.select().from(organizations).where(eq(organizations.onboardingComplete, true));
  }

  async createOrganization(org: InsertOrganization): Promise<Organization> {
    const [created] = await db.insert(organizations).values(org).returning();
    return created;
  }

  async updateOrganization(id: string, org: Partial<InsertOrganization>): Promise<Organization | undefined> {
    const [updated] = await db.update(organizations).set(org).where(eq(organizations.id, id)).returning();
    return updated;
  }

  async getFundsByOrganization(organizationId: string): Promise<Fund[]> {
    return db.select().from(funds).where(eq(funds.organizationId, organizationId)).orderBy(funds.sortOrder);
  }

  async createFund(fund: InsertFund): Promise<Fund> {
    const [created] = await db.insert(funds).values(fund).returning();
    return created;
  }

  async updateFund(id: string, fund: Partial<InsertFund>): Promise<Fund | undefined> {
    const [updated] = await db.update(funds).set(fund).where(eq(funds.id, id)).returning();
    return updated;
  }

  async deleteFund(id: string): Promise<void> {
    await db.delete(funds).where(eq(funds.id, id));
  }

  async getDonorsByOrganization(organizationId: string): Promise<Donor[]> {
    return db.select().from(donors).where(eq(donors.organizationId, organizationId)).orderBy(desc(donors.createdAt));
  }

  async getDonor(id: string): Promise<Donor | undefined> {
    const [donor] = await db.select().from(donors).where(eq(donors.id, id));
    return donor;
  }

  async createDonor(donor: InsertDonor): Promise<Donor> {
    const [created] = await db.insert(donors).values(donor).returning();
    return created;
  }

  async getDonationsByOrganization(organizationId: string, limit?: number): Promise<Donation[]> {
    const query = db.select().from(donations).where(eq(donations.organizationId, organizationId)).orderBy(desc(donations.createdAt));
    if (limit) {
      return query.limit(limit);
    }
    return query;
  }

  async createDonation(donation: InsertDonation): Promise<Donation> {
    const [created] = await db.insert(donations).values(donation).returning();
    return created;
  }

  async getDonationStats(organizationId: string): Promise<{
    todayTotal: string;
    monthTotal: string;
    giftCountToday: number;
    giftCountMonth: number;
    giftCountYear: number;
    averageGift: string;
    newDonorsThisMonth: number;
  }> {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [todayStats] = await db.select({
      total: sql<string>`COALESCE(SUM(${donations.amount}), 0)`,
      count: sql<number>`COUNT(*)::int`
    }).from(donations).where(and(eq(donations.organizationId, organizationId), gte(donations.createdAt, startOfToday)));

    const [monthStats] = await db.select({
      total: sql<string>`COALESCE(SUM(${donations.amount}), 0)`,
      count: sql<number>`COUNT(*)::int`,
      avg: sql<string>`COALESCE(AVG(${donations.amount}), 0)`
    }).from(donations).where(and(eq(donations.organizationId, organizationId), gte(donations.createdAt, startOfMonth)));

    const [yearStats] = await db.select({
      count: sql<number>`COUNT(*)::int`
    }).from(donations).where(and(eq(donations.organizationId, organizationId), gte(donations.createdAt, startOfYear)));

    const [newDonorStats] = await db.select({
      count: sql<number>`COUNT(*)::int`
    }).from(donors).where(and(eq(donors.organizationId, organizationId), gte(donors.createdAt, startOfMonth)));

    return {
      todayTotal: `$${parseFloat(todayStats.total).toFixed(2)}`,
      monthTotal: `$${parseFloat(monthStats.total).toFixed(2)}`,
      giftCountToday: todayStats.count,
      giftCountMonth: monthStats.count,
      giftCountYear: yearStats.count,
      averageGift: `$${parseFloat(monthStats.avg).toFixed(2)}`,
      newDonorsThisMonth: newDonorStats.count
    };
  }

  async getDonorStats(organizationId: string): Promise<Array<{
    id: string;
    name: string;
    email: string | null;
    totalGifts: string;
    giftCount: number;
    lastGift: Date | null;
    status: string;
  }>> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const donorList = await db.select().from(donors).where(eq(donors.organizationId, organizationId));
    
    const results = await Promise.all(donorList.map(async (donor) => {
      const [stats] = await db.select({
        total: sql<string>`COALESCE(SUM(${donations.amount}), 0)`,
        count: sql<number>`COUNT(*)::int`,
        lastGift: sql<Date | null>`MAX(${donations.createdAt})`
      }).from(donations).where(eq(donations.donorId, donor.id));

      let status = "active";
      if (!stats.lastGift) {
        status = "new";
      } else if (stats.lastGift < sixtyDaysAgo) {
        status = "lapsed";
      } else if (stats.lastGift >= thirtyDaysAgo) {
        status = stats.count === 1 ? "new" : "active";
      }

      return {
        id: donor.id,
        name: donor.isAnonymous ? "Anonymous" : donor.name,
        email: donor.isAnonymous ? null : donor.email,
        totalGifts: `$${parseFloat(stats.total).toFixed(2)}`,
        giftCount: stats.count,
        lastGift: stats.lastGift,
        status
      };
    }));

    return results.sort((a, b) => parseFloat(b.totalGifts.slice(1)) - parseFloat(a.totalGifts.slice(1)));
  }
}

export const storage = new DatabaseStorage();
