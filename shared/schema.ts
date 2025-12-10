import { sql } from 'drizzle-orm';
import { pgTable, text, varchar, integer, real, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Product categories enum
export const CATEGORIES = [
  "Budget",
  "Standard", 
  "Godly",
  "Ancient",
  "Bundles",
  "Royal"
] as const;

export type Category = typeof CATEGORIES[number];

// Rarity levels for visual styling
export const RARITIES = [
  "Common",
  "Uncommon", 
  "Rare",
  "Legendary",
  "Godly",
  "Ancient",
  "Chroma"
] as const;

export type Rarity = typeof RARITIES[number];

// Order status
export const ORDER_STATUSES = [
  "pending",
  "awaiting_payment",
  "payment_uploaded",
  "confirmed",
  "processing",
  "completed",
  "cancelled"
] as const;

export type OrderStatus = typeof ORDER_STATUSES[number];

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Product table schema
export const products = pgTable("products", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  price: real("price").notNull(),
  category: text("category").notNull(),
  rarity: text("rarity").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  inStock: integer("in_stock").default(1),
});

export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Cart item schema
export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey(),
  productId: varchar("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  sessionId: varchar("session_id").notNull(),
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({ id: true });
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

// Order schema with user reference and receipt
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id"),
  email: text("email").notNull(),
  robloxUsername: text("roblox_username").notNull(),
  paymentMethod: text("payment_method").notNull(),
  paymentReference: text("payment_reference"),
  totalAmount: real("total_amount").notNull(),
  status: text("status").notNull().default("pending"),
  items: text("items").notNull(),
  receiptUrl: text("receipt_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Cart item with product details (for frontend)
export interface CartItemWithProduct extends CartItem {
  product: Product;
}

// Checkout form validation
export const checkoutFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  robloxUsername: z.string().min(3, "Roblox username must be at least 3 characters"),
  paymentMethod: z.enum(["vodafone_cash", "instapay"]),
  paymentReference: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

// Contact form validation
export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  robloxUsername: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
