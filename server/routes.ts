import type { Express } from "express";
import { createServer, type Server } from "http";
import { getStorage } from "./storage";
import { sendQuoteEmails, sendLeadEmails, type QuoteRequestData, type LeadEmailData } from "./email";
import { z } from "zod";
import { insertLeadSchema, insertWaitlistSchema } from "@shared/schema";

function describeError(error: unknown): { message: string; details?: string } {
  if (error instanceof z.ZodError) {
    const details = error.issues
      .map((issue) => `${issue.path.join(".") || "field"}: ${issue.message}`)
      .join("; ");
    return {
      message: "Invalid request payload",
      details,
    };
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: "Unknown error" };
}

function logRouteError(context: string, error: unknown) {
  const formatted = describeError(error);
  console.error(`[${context}] ${formatted.message}${formatted.details ? ` | ${formatted.details}` : ""}`);
  if (error instanceof Error && error.stack) {
    console.error(error.stack);
  }
}

async function sendToGHL(leadData: Record<string, any>) {
  const webhookUrl = process.env.GHL_WEBHOOK_URL || process.env.GOHIGHLEVEL_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("GHL webhook URL not set (GHL_WEBHOOK_URL/GOHIGHLEVEL_WEBHOOK_URL), skipping webhook");
    return;
  }

  try {
    const notesText = typeof leadData.notes === "string" ? leadData.notes : "";
    const sourceFromNotes = notesText.match(/\[Attribution\]\s*Source:\s*([^|]+)/i)?.[1]?.trim();
    const detailFromNotes = notesText.match(/\[Attribution\].*Detail:\s*([^|]+)/i)?.[1]?.trim();
    const landingFromNotes = notesText.match(/\[Attribution\].*Landing:\s*([^|]+)/i)?.[1]?.trim();
    const referrerFromNotes = notesText.match(/\[Attribution\].*Referrer:\s*([^|]+)/i)?.[1]?.trim();
    const resolvedSource = leadData.source || sourceFromNotes || "website_chat";
    const resolvedSourceDetail = leadData.sourceDetail || detailFromNotes || "";
    const resolvedLandingPath = leadData.landingPath || landingFromNotes || "";
    const resolvedReferrer = leadData.referrer || referrerFromNotes || "";

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
      source: resolvedSource,
      source_detail: resolvedSourceDetail,
      landing_path: resolvedLandingPath,
      referrer: resolvedReferrer,
      utm_source: leadData.utmSource || "",
      utm_medium: leadData.utmMedium || "",
      utm_campaign: leadData.utmCampaign || "",
      utm_content: leadData.utmContent || "",
      utm_term: leadData.utmTerm || "",
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
  source: z.string().optional(),
  sourceDetail: z.string().optional(),
  landingPath: z.string().optional(),
  referrer: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional(),
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

const leadRequestSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().email("Valid email required").or(z.literal("")).optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  yardSize: z.string().trim().min(1, "Yard size is required"),
  plan: z.string().trim().min(1, "Plan is required"),
  basicAddons: z.array(z.string()).optional().default([]),
  premiumAddons: z.array(z.string()).optional().default([]),
  notes: z.string().optional().nullable(),
  totalPrice: z.string().optional().nullable(),
  freeMonths: z.string().optional().nullable(),
  term: z.string().optional().nullable(),
  payUpfront: z.string().optional().nullable(),
  promoCode: z.string().optional().nullable(),
  paymentMethod: z.string().optional().nullable(),
  propertyType: z.string().optional().nullable(),
  hoaName: z.string().optional().nullable(),
  hoaAcreage: z.string().optional().nullable(),
  hoaUnits: z.string().optional().nullable(),
  hoaNotes: z.string().optional().nullable(),
  segments: z.array(z.string()).optional().default([]),
  appliedPromos: z.array(z.string()).optional().default([]),
  source: z.string().optional().nullable(),
  sourceDetail: z.string().optional().nullable(),
  landingPath: z.string().optional().nullable(),
  referrer: z.string().optional().nullable(),
  utmSource: z.string().optional().nullable(),
  utmMedium: z.string().optional().nullable(),
  utmCampaign: z.string().optional().nullable(),
  utmContent: z.string().optional().nullable(),
  utmTerm: z.string().optional().nullable(),
}).superRefine((data, ctx) => {
  const hasPhone = Boolean((data.phone || "").trim());
  const hasEmail = Boolean((data.email || "").trim());
  if (!hasPhone && !hasEmail) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Either phone or email is required",
      path: ["phone"],
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
      
      // Send to GoHighLevel webhook (fire and forget)
      sendToGHL(data).catch(err => console.error("GHL webhook background error:", err));
      
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
      logRouteError("quote", error);
      const formatted = describeError(error);
      res.status(400).json({ 
        success: false, 
        message: formatted.details ? `${formatted.message}: ${formatted.details}` : formatted.message,
      });
    }
  });

  app.post("/api/leads", async (req, res) => {
    try {
      const requestData = leadRequestSchema.parse(req.body);
      const data = insertLeadSchema.parse({
        ...requestData,
        basicAddons: requestData.basicAddons ?? [],
        premiumAddons: requestData.premiumAddons ?? [],
        segments: requestData.segments ?? [],
        appliedPromos: requestData.appliedPromos ?? [],
      });
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
      logRouteError("leads", error);
      const formatted = describeError(error);
      const isValidation = error instanceof z.ZodError;
      res.status(isValidation ? 400 : 500).json({ 
        success: false, 
        message: formatted.details ? `${formatted.message}: ${formatted.details}` : formatted.message,
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
