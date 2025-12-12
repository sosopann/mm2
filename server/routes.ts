import express, { type Express, type Request, type Response, type NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerFormSchema, loginFormSchema, insertOrderSchema, type Product } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";
import session from "express-session";
import memorystore from "memorystore";

const MemoryStore = memorystore(session);

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    isAdmin?: boolean;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.use(session({
    secret: process.env.SESSION_SECRET || 'mm2-shop-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
      checkPeriod: 86400000
    }),
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 * 7
    }
  }));

  app.use("/uploads", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  }, express.static(uploadsDir));

  app.post("/api/auth/register", async (req, res) => {
    try {
      const parsed = registerFormSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(parsed.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }
      
      const user = await storage.createUser({
        email: parsed.email,
        password: parsed.password,
        firstName: parsed.firstName,
        lastName: parsed.lastName || null,
        robloxUsername: parsed.robloxUsername,
        isAdmin: false,
        profileImageUrl: null,
      });
      
      req.session.userId = user.id;
      req.session.isAdmin = false;
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Failed to register" });
      }
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const parsed = loginFormSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(parsed.email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      const validPassword = await bcrypt.compare(parsed.password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      req.session.userId = user.id;
      req.session.isAdmin = user.isAdmin || false;
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Login error:", error);
        res.status(500).json({ error: "Failed to login" });
      }
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/user", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.post("/api/orders", async (req: any, res) => {
    try {
      const parsed = insertOrderSchema.parse(req.body);
      let userId = null;
      if (req.session.userId) {
        userId = req.session.userId;
      }
      const order = await storage.createOrder({ ...parsed, userId });
      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Order error:", error);
        res.status(500).json({ error: "Failed to create order" });
      }
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const order = await storage.getOrderById(id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.get("/api/my-orders", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      const orders = await storage.getOrdersByUserId(req.session.userId);
      
      orders.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.post("/api/orders/:id/receipt", upload.single("receipt"), async (req: any, res) => {
    try {
      const { id } = req.params;
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const receiptUrl = `/uploads/${req.file.filename}`;
      const order = await storage.updateOrderReceipt(id, receiptUrl);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload receipt" });
    }
  });

  app.get("/api/orders/:id/messages", async (req, res) => {
    try {
      const { id } = req.params;
      
      const order = await storage.getOrderById(id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      const isAdmin = req.session.isAdmin === true;
      const isOwner = req.session.userId && order.userId === req.session.userId;
      
      const messages = await storage.getChatMessagesByOrderId(id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/orders/:id/messages", async (req, res) => {
    try {
      const { id } = req.params;
      const { message } = req.body;
      
      if (!message || !message.trim()) {
        return res.status(400).json({ error: "Message is required" });
      }
      
      const order = await storage.getOrderById(id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      let senderId = "guest";
      let senderType = "customer";
      
      if (req.session.userId) {
        senderId = req.session.userId;
        const user = await storage.getUser(req.session.userId);
        senderType = user?.isAdmin ? "admin" : "customer";
      }
      
      const chatMessage = await storage.createChatMessage({
        orderId: id,
        senderId,
        senderType,
        message: message.trim(),
      });
      
      res.json(chatMessage);
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  app.post("/api/admin/verify", (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      return res.status(500).json({ error: "Admin not configured" });
    }
    
    if (password === adminPassword) {
      req.session.isAdmin = true;
      res.json({ success: true });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  });

  const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.isAdmin) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  };

  app.get("/api/admin/orders", requireAdmin, async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.patch("/api/admin/orders/:id/status", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await storage.updateOrderStatus(id, status);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  app.get("/api/admin/chats", requireAdmin, async (req, res) => {
    try {
      const chats = await storage.getAllChats();
      res.json(chats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chats" });
    }
  });

  app.post("/api/admin/orders/:id/messages", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { message } = req.body;
      
      if (!message || !message.trim()) {
        return res.status(400).json({ error: "Message is required" });
      }
      
      const chatMessage = await storage.createChatMessage({
        orderId: id,
        senderId: "admin",
        senderType: "admin",
        message: message.trim(),
      });
      
      res.json(chatMessage);
    } catch (error) {
      console.error("Admin chat error:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.get("/api/admin/products", requireAdmin, async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.patch("/api/admin/products/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { price, inStock } = req.body;
      
      const updates: Partial<Product> = {};
      if (price !== undefined) {
        const priceNum = Number(price);
        if (isNaN(priceNum) || priceNum < 0) {
          return res.status(400).json({ error: "Invalid price value" });
        }
        updates.price = priceNum;
      }
      if (inStock !== undefined) {
        const stockNum = Number(inStock);
        if (isNaN(stockNum) || stockNum < 0 || !Number.isInteger(stockNum)) {
          return res.status(400).json({ error: "Invalid stock value" });
        }
        updates.inStock = stockNum;
      }
      
      const product = await storage.updateProduct(id, updates);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.post("/api/admin/products/seed", requireAdmin, async (req, res) => {
    try {
      const { products } = req.body;
      if (!Array.isArray(products)) {
        return res.status(400).json({ error: "Products array required" });
      }
      
      let created = 0;
      for (const product of products) {
        await storage.createProduct(product);
        created++;
      }
      
      res.json({ success: true, count: created });
    } catch (error) {
      console.error("Error seeding products:", error);
      res.status(500).json({ error: "Failed to seed products" });
    }
  });

  app.post("/api/admin/upload-product-image", requireAdmin, upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }
      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ imageUrl });
    } catch (error) {
      console.error("Error uploading product image:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  app.post("/api/admin/products", requireAdmin, async (req, res) => {
    try {
      const { name, price, category, rarity, description, imageUrl, inStock } = req.body;
      
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: "Name is required and must be a non-empty string" });
      }
      
      const parsedPrice = Number(price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({ error: "Price must be a valid positive number" });
      }
      
      const validCategories = ["Budget", "Standard", "Godly", "Ancient", "Bundles", "Royal"];
      if (!category || !validCategories.includes(category)) {
        return res.status(400).json({ error: "Category must be one of: " + validCategories.join(", ") });
      }
      
      const validRarities = ["Common", "Uncommon", "Rare", "Legendary", "Godly", "Ancient", "Chroma"];
      if (!rarity || !validRarities.includes(rarity)) {
        return res.status(400).json({ error: "Rarity must be one of: " + validRarities.join(", ") });
      }
      
      const parsedStock = inStock !== undefined ? Number(inStock) : 1;
      if (isNaN(parsedStock) || parsedStock < 0) {
        return res.status(400).json({ error: "Stock must be a valid non-negative number" });
      }
      
      const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      
      const product = await storage.createProduct({
        id,
        name: name.trim(),
        price: parsedPrice,
        category,
        rarity,
        description: description?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        inStock: parsedStock,
      });
      
      res.json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.delete("/api/admin/products/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  app.post("/api/admin/cleanup", requireAdmin, async (req, res) => {
    try {
      const { type } = req.body;
      const statuses = type === "completed" 
        ? ["completed"] 
        : type === "cancelled" 
          ? ["cancelled"] 
          : ["completed", "cancelled"];
      
      const ordersToDelete = (await storage.getAllOrders()).filter(o => statuses.includes(o.status));
      const orderIds = ordersToDelete.map(o => o.id);
      
      const deletedChats = await storage.deleteChatsByOrderIds(orderIds);
      const deletedOrders = await storage.deleteOrdersByStatus(statuses);
      
      res.json({ 
        success: true, 
        deletedOrders, 
        deletedChats,
        message: `Deleted ${deletedOrders} orders and ${deletedChats} chat messages`
      });
    } catch (error) {
      console.error("Error cleaning up:", error);
      res.status(500).json({ error: "Failed to cleanup" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, robloxUsername, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      console.log("Contact form submission:", { name, email, robloxUsername, message });
      res.json({ success: true, message: "Message received" });
    } catch (error) {
      res.status(500).json({ error: "Failed to submit contact form" });
    }
  });

  return httpServer;
}
