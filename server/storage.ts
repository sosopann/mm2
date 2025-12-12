import { 
  users,
  orders,
  chatMessages,
  products,
  type User, 
  type UpsertUser,
  type InsertUser,
  type Product,
  type InsertProduct,
  type CartItem,
  type InsertCartItem,
  type Order,
  type InsertOrder,
  type ChatMessage,
  type InsertChatMessage
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, or, inArray } from "drizzle-orm";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined>;
  createProduct(product: Product): Promise<Product>;
  deleteProduct(id: string): Promise<boolean>;
  
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderById(id: string): Promise<Order | undefined>;
  getOrdersByUserId(userId: string): Promise<Order[]>;
  getOrdersByEmail(email: string): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  updateOrderReceipt(id: string, receiptUrl: string): Promise<Order | undefined>;
  deleteOrdersByStatus(statuses: string[]): Promise<number>;
  
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessagesByOrderId(orderId: string): Promise<ChatMessage[]>;
  getAllChats(): Promise<{ orderId: string; messages: ChatMessage[]; order: Order | undefined }[]>;
  deleteChatsByOrderIds(orderIds: string[]): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const id = randomUUID();
    const [user] = await db
      .insert(users)
      .values({ 
        ...userData, 
        id,
        password: hashedPassword 
      })
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const [order] = await db
      .insert(orders)
      .values({ ...insertOrder, id })
      .returning();
    return order;
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  async getOrdersByEmail(email: string): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.email, email))
      .orderBy(desc(orders.createdAt));
  }

  async getAllOrders(): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt));
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  async updateOrderReceipt(id: string, receiptUrl: string): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set({ 
        receiptUrl, 
        status: "payment_uploaded",
        updatedAt: new Date() 
      })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  async createChatMessage(messageData: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const [message] = await db
      .insert(chatMessages)
      .values({ ...messageData, id })
      .returning();
    return message;
  }

  async getChatMessagesByOrderId(orderId: string): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.orderId, orderId))
      .orderBy(chatMessages.createdAt);
  }

  async getAllChats(): Promise<{ orderId: string; messages: ChatMessage[]; order: Order | undefined }[]> {
    const allMessages = await db
      .select()
      .from(chatMessages)
      .orderBy(desc(chatMessages.createdAt));
    
    const orderIds = [...new Set(allMessages.map(m => m.orderId))];
    const result = [];
    
    for (const orderId of orderIds) {
      const messages = allMessages.filter(m => m.orderId === orderId);
      const order = await this.getOrderById(orderId);
      result.push({ orderId, messages, order });
    }
    
    return result;
  }

  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set(updates)
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async createProduct(product: Product): Promise<Product> {
    const [created] = await db
      .insert(products)
      .values(product)
      .onConflictDoNothing()
      .returning();
    return created || product;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const deleted = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();
    return deleted.length > 0;
  }

  async deleteOrdersByStatus(statuses: string[]): Promise<number> {
    if (statuses.length === 0) return 0;
    const deletedOrders = await db
      .delete(orders)
      .where(inArray(orders.status, statuses))
      .returning();
    return deletedOrders.length;
  }

  async deleteChatsByOrderIds(orderIds: string[]): Promise<number> {
    if (orderIds.length === 0) return 0;
    const deletedChats = await db
      .delete(chatMessages)
      .where(inArray(chatMessages.orderId, orderIds))
      .returning();
    return deletedChats.length;
  }
}

export const storage = new DatabaseStorage();
