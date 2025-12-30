import { db } from "./db";
import {
  messages,
  users,
  type Message,
  type InsertMessage,
} from "@shared/schema";
import { eq, and } from "drizzle-orm";


export interface IStorage {
  getMessages(userId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  createUser(email: string, password: string, country: string): Promise<number>;
  findUserByEmailAndPassword(email: string, password: string): Promise<{ id: number; email: string; country: string } | null>;
  findUserById(id: number): Promise<{ id: number; email: string; country: string } | null>;
}


export class DatabaseStorage implements IStorage {
  async getMessages(userId: number): Promise<Message[]> {
    return await db.select().from(messages).where(eq(messages.userId, userId)).orderBy(messages.createdAt);
  }


  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
  }


  async createUser(email: string, password: string, country: string): Promise<number> {
    const [user] = await db.insert(users).values({ email, password, country }).returning();
    return user.id as number;
  }


  async findUserByEmailAndPassword(email: string, password: string) {
    const [user] = await db.select({ id: users.id, email: users.email, country: users.country }).from(users).where(and(eq(users.email, email), eq(users.password, password)));
    if (!user) return null;
    return { id: user.id as number, email: user.email as string, country: user.country as string };
  }


  async findUserById(id: number) {
    const [user] = await db.select({ id: users.id, email: users.email, country: users.country }).from(users).where(eq(users.id, id));
    if (!user) return null;
    return { id: user.id as number, email: user.email as string, country: user.country as string };
  }
}


export const storage = new DatabaseStorage();
