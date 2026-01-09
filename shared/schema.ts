import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const organizations = pgTable("organizations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type"),
  address: text("address"),
  ein: text("ein"),
  slug: text("slug").notNull().unique(),
  aboutText: text("about_text"),
  logoUrl: text("logo_url"),
  primaryColor: text("primary_color").default("#7c3aed"),
  isVerified: boolean("is_verified").default(false),
  bankConnected: boolean("bank_connected").default(false),
  onboardingComplete: boolean("onboarding_complete").default(false),
  // Giving page customization options
  coverImageUrl: text("cover_image_url"),
  suggestedAmounts: text("suggested_amounts").array().default(sql`ARRAY['25', '50', '100', '250']`),
  buttonText: text("button_text").default("Give Now"),
  thankYouMessage: text("thank_you_message").default("Thank you for your generous gift! Your support makes a difference."),
  enableRecurring: boolean("enable_recurring").default(true),
  enableAnonymous: boolean("enable_anonymous").default(true),
  buttonStyle: text("button_style").default("rounded"),
  backgroundPattern: text("background_pattern").default("none"),
  showGoalMeter: boolean("show_goal_meter").default(false),
  goalAmount: decimal("goal_amount", { precision: 10, scale: 2 }),
  accentColor: text("accent_color").default("#f59e0b"),
  enableRoundUp: boolean("enable_round_up").default(true),
  roundUpOptions: text("round_up_options").array().default(sql`ARRAY['nearest-dollar', 'nearest-5', 'nearest-10']`),
});

export const insertOrganizationSchema = createInsertSchema(organizations).omit({
  id: true,
});
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type Organization = typeof organizations.$inferSelect;

export const funds = pgTable("funds", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id").notNull().references(() => organizations.id),
  name: text("name").notNull(),
  enabled: boolean("enabled").default(true),
  sortOrder: integer("sort_order").default(0),
});

export const insertFundSchema = createInsertSchema(funds).omit({
  id: true,
});
export type InsertFund = z.infer<typeof insertFundSchema>;
export type Fund = typeof funds.$inferSelect;

export const donors = pgTable("donors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id").notNull().references(() => organizations.id),
  name: text("name").notNull(),
  email: text("email"),
  isAnonymous: boolean("is_anonymous").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDonorSchema = createInsertSchema(donors).omit({
  id: true,
  createdAt: true,
});
export type InsertDonor = z.infer<typeof insertDonorSchema>;
export type Donor = typeof donors.$inferSelect;

export const donations = pgTable("donations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id").notNull().references(() => organizations.id),
  donorId: varchar("donor_id").references(() => donors.id),
  fundId: varchar("fund_id").references(() => funds.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  fundName: text("fund_name"),
  donorName: text("donor_name"),
  isAnonymous: boolean("is_anonymous").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  createdAt: true,
});
export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Donation = typeof donations.$inferSelect;

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email"),
  password: text("password").notNull(),
  role: text("role").notNull().default("donor"),
  organizationId: varchar("organization_id").references(() => organizations.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
