import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { sendQuoteEmails, type QuoteRequestData } from "./email";
import { z } from "zod";

// Quote request validation schema
const quoteRequestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().min(5),
  contactMethod: z.enum(["text", "phone", "email", "either"]),
  yardSize: z.number().min(0.01),
  plan: z.enum(["basic", "premium", "executive"]),
  addOns: z.array(z.string()).default([]),
  notes: z.string().optional(),
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

      if (result.businessEmailSent && result.customerEmailSent) {
        res.json({ 
          success: true, 
          message: "Quote request sent successfully" 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Failed to send one or more emails" 
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

  return httpServer;
}
