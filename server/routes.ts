import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrganizationSchema, insertFundSchema, insertDonorSchema, insertDonationSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.post("/api/logout", (req, res) => {
    res.clearCookie("connect.sid");
    res.json({ success: true });
  });

  app.get("/api/organization/:id", async (req, res) => {
    try {
      const org = await storage.getOrganization(req.params.id);
      if (!org) {
        return res.status(404).json({ error: "Organization not found" });
      }
      res.json(org);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch organization" });
    }
  });

  app.get("/api/organization/slug/:slug", async (req, res) => {
    try {
      const org = await storage.getOrganizationBySlug(req.params.slug);
      if (!org) {
        return res.status(404).json({ error: "Organization not found" });
      }
      res.json(org);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch organization" });
    }
  });

  app.post("/api/organization", async (req, res) => {
    try {
      const parsed = insertOrganizationSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }
      const org = await storage.createOrganization(parsed.data);
      
      const defaultFunds = ["General Fund", "Building Fund", "Youth Ministry", "Outreach"];
      for (let i = 0; i < defaultFunds.length; i++) {
        await storage.createFund({
          organizationId: org.id,
          name: defaultFunds[i],
          enabled: i < 3,
          sortOrder: i
        });
      }
      
      res.status(201).json(org);
    } catch (error) {
      res.status(500).json({ error: "Failed to create organization" });
    }
  });

  app.patch("/api/organization/:id", async (req, res) => {
    try {
      const org = await storage.updateOrganization(req.params.id, req.body);
      if (!org) {
        return res.status(404).json({ error: "Organization not found" });
      }
      res.json(org);
    } catch (error) {
      res.status(500).json({ error: "Failed to update organization" });
    }
  });

  app.get("/api/organization/:orgId/funds", async (req, res) => {
    try {
      const funds = await storage.getFundsByOrganization(req.params.orgId);
      res.json(funds);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch funds" });
    }
  });

  app.post("/api/organization/:orgId/funds", async (req, res) => {
    try {
      const parsed = insertFundSchema.safeParse({
        ...req.body,
        organizationId: req.params.orgId
      });
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }
      const fund = await storage.createFund(parsed.data);
      res.status(201).json(fund);
    } catch (error) {
      res.status(500).json({ error: "Failed to create fund" });
    }
  });

  app.patch("/api/funds/:id", async (req, res) => {
    try {
      const fund = await storage.updateFund(req.params.id, req.body);
      if (!fund) {
        return res.status(404).json({ error: "Fund not found" });
      }
      res.json(fund);
    } catch (error) {
      res.status(500).json({ error: "Failed to update fund" });
    }
  });

  app.delete("/api/funds/:id", async (req, res) => {
    try {
      await storage.deleteFund(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete fund" });
    }
  });

  app.get("/api/organization/:orgId/donors", async (req, res) => {
    try {
      const donorStats = await storage.getDonorStats(req.params.orgId);
      res.json(donorStats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch donors" });
    }
  });

  app.post("/api/organization/:orgId/donors", async (req, res) => {
    try {
      const parsed = insertDonorSchema.safeParse({
        ...req.body,
        organizationId: req.params.orgId
      });
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }
      const donor = await storage.createDonor(parsed.data);
      res.status(201).json(donor);
    } catch (error) {
      res.status(500).json({ error: "Failed to create donor" });
    }
  });

  app.get("/api/organization/:orgId/donations", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const donations = await storage.getDonationsByOrganization(req.params.orgId, limit);
      res.json(donations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch donations" });
    }
  });

  app.post("/api/organization/:orgId/donations", async (req, res) => {
    try {
      const parsed = insertDonationSchema.safeParse({
        ...req.body,
        organizationId: req.params.orgId
      });
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }
      const donation = await storage.createDonation(parsed.data);
      res.status(201).json(donation);
    } catch (error) {
      res.status(500).json({ error: "Failed to create donation" });
    }
  });

  app.get("/api/organization/:orgId/stats", async (req, res) => {
    try {
      const stats = await storage.getDonationStats(req.params.orgId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.post("/api/onboarding/complete", async (req, res) => {
    try {
      const { name, type, address, ein, slug } = req.body;
      
      const org = await storage.createOrganization({
        name,
        type,
        address,
        ein,
        slug,
        aboutText: `Welcome to ${name}. Your generous gifts support our programs, outreach, and facilities.`,
        bankConnected: true,
        isVerified: true,
        onboardingComplete: true
      });

      const defaultFunds = ["General Fund", "Building Fund", "Youth Ministry", "Outreach"];
      for (let i = 0; i < defaultFunds.length; i++) {
        await storage.createFund({
          organizationId: org.id,
          name: defaultFunds[i],
          enabled: i < 3,
          sortOrder: i
        });
      }

      res.status(201).json(org);
    } catch (error) {
      res.status(500).json({ error: "Failed to complete onboarding" });
    }
  });

  app.get("/api/current-organization", async (req, res) => {
    try {
      const org = await storage.getFirstOrganization();
      if (org) {
        return res.json(org);
      }
      res.status(404).json({ error: "No organization found" });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch organization" });
    }
  });

  return httpServer;
}
