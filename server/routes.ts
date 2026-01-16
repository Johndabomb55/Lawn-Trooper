import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { sendQuoteEmails, sendLeadEmails, type QuoteRequestData, type LeadEmailData } from "./email";
import { z } from "zod";
import { insertLeadSchema, insertWaitlistSchema } from "@shared/schema";

// Photo schema for uploaded images
const photoSchema = z.object({
  name: z.string(),
  data: z.string(), // base64 encoded
  type: z.string(),
});

// Quote request validation schema (includes plan selection)
const quoteRequestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().min(5),
  contactMethod: z.enum(["text", "phone", "email", "either"]),
  notes: z.string().optional(),
  // Plan selection fields
  yardSize: z.string(),
  plan: z.string(),
  basicAddons: z.array(z.string()),
  premiumAddons: z.array(z.string()),
  // Optional photos
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
  // Submit quote request
  app.post("/api/quote", async (req, res) => {
    try {
      // Validate request body
      const data = quoteRequestSchema.parse(req.body);

      // Send emails via Resend
      const result = await sendQuoteEmails(data as QuoteRequestData);

      // Success if business email was sent (customer email is optional)
      if (result.businessEmailSent) {
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

  // Capture lead data and send email notifications
  app.post("/api/leads", async (req, res) => {
    try {
      const data = insertLeadSchema.parse(req.body);
      
      // Store lead in database
      const lead = await storage.createLead(data);
      
      // Send email notifications to business and customer
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
        // Log email error but don't fail the lead capture
        console.error("Failed to send lead emails:", emailError);
      }
      
      res.json({ 
        success: true, 
        message: "Lead captured successfully",
        leadId: lead?.id
      });
    } catch (error) {
      console.error("Error capturing lead:", error);
      // Return error for monitoring but don't block user experience on frontend
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to capture lead",
        error: true
      });
    }
  });

  // Waitlist signup
  app.post("/api/waitlist", async (req, res) => {
    try {
      const data = insertWaitlistSchema.parse(req.body);
      
      // Check if email already exists
      const existing = await storage.getWaitlistByEmail(data.email);
      if (existing) {
        res.json({ 
          success: true, 
          message: "You're already on the waitlist!",
          alreadySignedUp: true
        });
        return;
      }
      
      // Store waitlist entry
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
