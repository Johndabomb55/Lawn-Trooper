import { type User, type InsertUser, type Lead, type InsertLead, type Waitlist, type InsertWaitlist, users, leads, waitlist as waitlistTable } from "@shared/schema";
import { db, isDbConfigured, checkDatabaseConnection } from "./db";
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
    const [user] = await db!.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db!.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db!.insert(users).values(insertUser).returning();
    return user;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db!.insert(leads).values({
      name: insertLead.name,
      address: insertLead.address,
      contactMethod: insertLead.contactMethod,
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
    }).returning();
    return lead;
  }

  async getWaitlistByEmail(email: string): Promise<Waitlist | undefined> {
    const [entry] = await db!.select().from(waitlistTable).where(eq(waitlistTable.email, email));
    return entry;
  }

  async createWaitlistEntry(insertEntry: InsertWaitlist): Promise<Waitlist> {
    const [entry] = await db!.insert(waitlistTable).values(insertEntry).returning();
    return entry;
  }
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private leadsStore: Lead[] = [];
  private waitlistStore: Waitlist[] = [];
  private nextLeadId = 1;
  private nextWaitlistId = 1;

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((u) => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = crypto.randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const lead: Lead = {
      id: this.nextLeadId++,
      name: insertLead.name,
      email: insertLead.email ?? null,
      phone: insertLead.phone ?? null,
      address: insertLead.address ?? null,
      contactMethod: insertLead.contactMethod ?? null,
      yardSize: insertLead.yardSize,
      plan: insertLead.plan,
      notes: insertLead.notes ?? null,
      totalPrice: insertLead.totalPrice ?? null,
      basicAddons: (insertLead.basicAddons ?? []) as string[],
      premiumAddons: (insertLead.premiumAddons ?? []) as string[],
      term: insertLead.term ?? null,
      payUpfront: insertLead.payUpfront ?? null,
      segments: (insertLead.segments ?? []) as string[],
      appliedPromos: (insertLead.appliedPromos ?? []) as string[],
      freeMonths: insertLead.freeMonths ?? null,
      promoCode: insertLead.promoCode ?? null,
      createdAt: new Date(),
    };
    this.leadsStore.push(lead);
    console.log("[mem-storage] Lead stored in memory:", lead.id);
    return lead;
  }

  async getWaitlistByEmail(email: string): Promise<Waitlist | undefined> {
    return this.waitlistStore.find((w) => w.email === email);
  }

  async createWaitlistEntry(insertEntry: InsertWaitlist): Promise<Waitlist> {
    const entry: Waitlist = {
      id: this.nextWaitlistId++,
      email: insertEntry.email,
      createdAt: new Date(),
    };
    this.waitlistStore.push(entry);
    console.log("[mem-storage] Waitlist entry stored in memory:", entry.id);
    return entry;
  }
}

let storage: IStorage;

export async function initializeStorage(): Promise<IStorage> {
  if (!isDbConfigured) {
    console.log("[storage] No DATABASE_URL — using in-memory storage");
    storage = new MemStorage();
    return storage;
  }

  const connected = await checkDatabaseConnection();
  if (connected) {
    console.log("[storage] Connected to PostgreSQL");
    storage = new DatabaseStorage();
  } else {
    console.log("[storage] DB unreachable — falling back to in-memory storage");
    storage = new MemStorage();
  }
  return storage;
}

export function getStorage(): IStorage {
  if (!storage) {
    console.warn("[storage] getStorage() called before init — defaulting to MemStorage");
    storage = new MemStorage();
  }
  return storage;
}

export { storage };
