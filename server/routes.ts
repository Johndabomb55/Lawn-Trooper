import type { Express } from "express";
import { createServer, type Server } from "http";
import { getStorage } from "./storage";
import { sendQuoteEmails, sendLeadEmails, type QuoteRequestData, type LeadEmailData } from "./email";
import { z } from "zod";
import { insertLeadSchema, insertWaitlistSchema } from "@shared/schema";

async function sendToGHL(leadData: Record<string, any>) {
  const webhookUrl = process.env.GHL_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("GHL_WEBHOOK_URL not set, skipping webhook");
    return;
  }

  try {
    const payload = {
      first_name: leadData.name?.split(" ")[0] || "",
      last_name: leadData.name?.split(" ").slice(1).join(" ") || "",
      full_name: leadData.name || "",
      email: leadData.email || "",
      phone: leadData.phone || "",
      address: leadData.address || "",
      yard_size: leadData.yardSize || "",
      plan: leadData.plan || "",
      basic_addons: Array.isArray(leadData.basicAddons) ? leadData.basicAddons.join(", ") : "",
      premium_addons: Array.isArray(leadData.premiumAddons) ? leadData.premiumAddons.join(", ") : "",
      term: leadData.term || "",
      pay_upfront: leadData.payUpfront || "false",
      payment_method: leadData.paymentMethod || "",
      free_months: leadData.freeMonths || "0",
      total_price: leadData.totalPrice || "",
      promo_code: leadData.promoCode || "",
      property_type: leadData.propertyType || "residential",
      segments: Array.isArray(leadData.segments) ? leadData.segments.join(", ") : "",
      applied_promos: Array.isArray(leadData.appliedPromos) ? leadData.appliedPromos.join(", ") : "",
      notes: leadData.notes || "",
      hoa_name: leadData.hoaName || "",
      hoa_acreage: leadData.hoaAcreage || "",
      hoa_units: leadData.hoaUnits || "",
      hoa_notes: leadData.hoaNotes || "",
      source: "lawn-trooper-website",
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("GHL webhook failed:", response.status, await response.text());
    } else {
      console.log("GHL webhook sent successfully");
    }
  } catch (error) {
    console.error("GHL webhook error:", error);
  }
}

const photoSchema = z.object({
  name: z.string(),
  data: z.string(),
  type: z.string(),
});

const quoteRequestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().min(5),
  contactMethod: z.enum(["text", "phone", "email", "either"]),
  notes: z.string().optional(),
  yardSize: z.string(),
  plan: z.string(),
  basicAddons: z.array(z.string()),
  premiumAddons: z.array(z.string()),
  photos: z.array(photoSchema).optional(),
}).superRefine((data, ctx) => {
  if ((data.contactMethod === "text" || data.contactMethod === "phone") && !data.phone) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Phone number is required for this contact method",
      path: ["phone"],
    });
  }
  if (data.contactMethod === "email" && !data.email) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Email is required for this contact method",
      path: ["email"],
    });
  }
  if (data.contactMethod === "either" && !data.phone && !data.email) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please provide either phone or email",
      path: ["email"],
    });
  }
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/quote", async (req, res) => {
    try {
      const data = quoteRequestSchema.parse(req.body);
      const result = await sendQuoteEmails(data as QuoteRequestData);

      if (result.businessEmailSent || (result as any).degraded) {
        res.json({ 
          success: true, 
          message: "Quote request sent successfully" 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Failed to send quote request email" 
        });
      }
    } catch (error) {
      console.error("Error processing quote request:", error);
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Invalid request" 
      });
    }
  });

  app.post("/api/leads", async (req, res) => {
    try {
      const data = insertLeadSchema.parse(req.body);
      const storage = getStorage();
      
      const lead = await storage.createLead(data);
      
      sendToGHL(data).catch(err => console.error("GHL webhook background error:", err));
      
      try {
        const emailData: LeadEmailData = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          yardSize: data.yardSize,
          plan: data.plan,
          basicAddons: data.basicAddons || [],
          premiumAddons: data.premiumAddons || [],
          term: data.term,
          payUpfront: data.payUpfront,
          freeMonths: data.freeMonths ? (parseInt(data.freeMonths, 10) || 0) : null,
          totalPrice: data.totalPrice,
          notes: data.notes,
        };
        
        const emailResult = await sendLeadEmails(emailData);
        console.log("Lead emails sent:", emailResult);
      } catch (emailError) {
        console.error("Failed to send lead emails:", emailError);
      }
      
      res.json({ 
        success: true, 
        message: "Lead captured successfully",
        leadId: lead?.id
      });
    } catch (error) {
      console.error("Error capturing lead:", error);
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to capture lead",
        error: true
      });
    }
  });

  app.post("/api/waitlist", async (req, res) => {
    try {
      const data = insertWaitlistSchema.parse(req.body);
      const storage = getStorage();
      
      const existing = await storage.getWaitlistByEmail(data.email);
      if (existing) {
        res.json({ 
          success: true, 
          message: "You're already on the waitlist!",
          alreadySignedUp: true
        });
        return;
      }
      
      await storage.createWaitlistEntry(data);
      
      res.json({ 
        success: true, 
        message: "Successfully joined the waitlist!"
      });
    } catch (error) {
      console.error("Error adding to waitlist:", error);
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Invalid request" 
      });
    }
  });

  return httpServer;
}
