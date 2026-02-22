import { randomUUID } from "crypto";
import {
  type User,
  type InsertUser,
  type Lead,
  type InsertLead,
  type Waitlist,
  type InsertWaitlist,
  users,
  leads,
  waitlist as waitlistTable,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createLead(lead: InsertLead): Promise<Lead>;
  getWaitlistByEmail(email: string): Promise<Waitlist | undefined>;
  createWaitlistEntry(entry: InsertWaitlist): Promise<Waitlist>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    if (!db) {
      return undefined;
    }

    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!db) {
      return undefined;
    }

    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    if (!db) {
      return {
        id: randomUUID(),
        username: insertUser.username,
        password: insertUser.password,
      };
    }

    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    if (!db) {
      return {
        id: randomUUID(),
        name: insertLead.name,
        address: insertLead.address ?? null,
        contactMethod: insertLead.contactMethod ?? null,
        yardSize: insertLead.yardSize,
        plan: insertLead.plan,
        email: insertLead.email ?? null,
        phone: insertLead.phone ?? null,
        notes: insertLead.notes ?? null,
        totalPrice: insertLead.totalPrice ?? null,
        basicAddons: (insertLead.basicAddons ?? []) as string[],
        premiumAddons: (insertLead.premiumAddons ?? []) as string[],
        term: insertLead.term ?? null,
        payUpfront: insertLead.payUpfront ?? null,
        segments: (insertLead.segments ?? []) as string[],
        appliedPromos: (insertLead.appliedPromos ?? []) as string[],
        createdAt: new Date(),
      };
    }

    const [lead] = await db
      .insert(leads)
      .values({
        name: insertLead.name,
        address: insertLead.address ?? null,
        contactMethod: insertLead.contactMethod ?? null,
        yardSize: insertLead.yardSize,
        plan: insertLead.plan,
        email: insertLead.email ?? null,
        phone: insertLead.phone ?? null,
        notes: insertLead.notes ?? null,
        totalPrice: insertLead.totalPrice ?? null,
        basicAddons: (insertLead.basicAddons ?? []) as string[],
        premiumAddons: (insertLead.premiumAddons ?? []) as string[],
        term: insertLead.term ?? null,
        payUpfront: insertLead.payUpfront ?? null,
        segments: (insertLead.segments ?? []) as string[],
        appliedPromos: (insertLead.appliedPromos ?? []) as string[],
      })
      .returning();
    return lead;
  }

  async getWaitlistByEmail(email: string): Promise<Waitlist | undefined> {
    if (!db) {
      return undefined;
    }

    const [entry] = await db.select().from(waitlistTable).where(eq(waitlistTable.email, email));
    return entry;
  }

  async createWaitlistEntry(insertEntry: InsertWaitlist): Promise<Waitlist> {
    if (!db) {
      return {
        id: randomUUID(),
        ...insertEntry,
        createdAt: new Date(),
      };
    }

    const [entry] = await db.insert(waitlistTable).values(insertEntry).returning();
    return entry;
  }
}

export const storage = new DatabaseStorage();
