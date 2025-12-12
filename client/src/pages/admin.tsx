import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Lock, Package, Eye, CheckCircle, Clock, RefreshCw, MessageCircle, Send, User, Shield, Trash2, Edit2, ShoppingBag, Plus, Search, X, Upload, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Order, ChatMessage, Product } from "@shared/schema";
import { CATEGORIES, RARITIES } from "@shared/schema";
import { allProducts } from "@/lib/products";

const ORDER_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "awaiting_payment", label: "Awaiting Payment" },
  { value: "payment_uploaded", label: "Receipt Uploaded" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500",
  awaiting_payment: "bg-orange-500/10 text-orange-500",
  payment_uploaded: "bg-blue-500/10 text-blue-500",
  confirmed: "bg-green-500/10 text-green-500",
  processing: "bg-purple-500/10 text-purple-500",
  completed: "bg-green-600/10 text-green-600",
  cancelled: "bg-red-500/10 text-red-500",
};

interface ChatData {
  orderId: string;
  messages: ChatMessage[];
  order: Order | undefined;
}

interface OrderItem {
  id?: string;
  name: string;
  quantity: number;
  price?: number;
  imageUrl?: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedChat, setSelectedChat] = useState<ChatData | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "Budget",
    rarity: "Common",
    description: "",
    imageUrl: "",
    inStock: "1",
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (pwd: string) => {
      const response = await apiRequest("POST", "/api/admin/verify", { password: pwd });
      if (!response.ok) throw new Error("Invalid password");
      return response.json();
    },
    onSuccess: () => {
      setIsAuthenticated(true);
      toast({ title: "Access granted" });
    },
    onError: () => {
      toast({
        title: "Access denied",
        description: "Invalid password",
        variant: "destructive",
      });
    },
  });

  const { data: orders = [], isLoading, refetch } = useQuery<Order[]>({
    queryKey: ["/api/admin/orders"],
    enabled: isAuthenticated,
  });

  const { data: chats = [], refetch: refetchChats } = useQuery<ChatData[]>({
    queryKey: ["/api/admin/chats"],
    enabled: isAuthenticated,
    refetchInterval: 10000,
  });

  const { data: products = [], refetch: refetchProducts } = useQuery<Product[]>({
    queryKey: ["/api/admin/products"],
    enabled: isAuthenticated,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest("PATCH", `/api/admin/orders/${id}/status`, { status });
      if (!response.ok) throw new Error("Failed to update status");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Status updated" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      setSelectedOrder(null);
    },
    onError: () => {
      toast({
        title: "Update failed",
        variant: "destructive",
      });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ orderId, message }: { orderId: string; message: string }) => {
      const response = await apiRequest("POST", `/api/admin/orders/${orderId}/messages`, { message });
      if (!response.ok) throw new Error("Failed to send message");
      return response.json();
    },
    onSuccess: () => {
      setChatMessage("");
      refetchChats();
    },
    onError: () => {
      toast({
        title: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, price, inStock }: { id: string; price: number; inStock: number }) => {
      const response = await apiRequest("PATCH", `/api/admin/products/${id}`, { price, inStock });
      if (!response.ok) throw new Error("Failed to update product");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Product updated" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setEditingProduct(null);
    },
    onError: () => {
      toast({
        title: "Update failed",
        variant: "destructive",
      });
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (product: typeof newProduct) => {
      const response = await apiRequest("POST", "/api/admin/products", {
        name: product.name,
        price: Number(product.price),
        category: product.category,
        rarity: product.rarity,
        description: product.description || null,
        imageUrl: product.imageUrl || null,
        inStock: Number(product.inStock),
      });
      if (!response.ok) throw new Error("Failed to create product");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Product created" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setShowAddProduct(false);
      setNewProduct({
        name: "",
        price: "",
        category: "Budget",
        rarity: "Common",
        description: "",
        imageUrl: "",
        inStock: "1",
      });
    },
    onError: () => {
      toast({
        title: "Failed to create product",
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/products/${id}`);
      if (!response.ok) throw new Error("Failed to delete product");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Product deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
    onError: () => {
      toast({
        title: "Failed to delete product",
        variant: "destructive",
      });
    },
  });

  const seedProductsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admin/products/seed", { products: allProducts });
      if (!response.ok) throw new Error("Failed to seed products");
      return response.json();
    },
    onSuccess: (data) => {
      toast({ title: `Seeded ${data.count} products` });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
    onError: () => {
      toast({
        title: "Failed to seed products",
        variant: "destructive",
      });
    },
  });

  const cleanupMutation = useMutation({
    mutationFn: async (type: string) => {
      const response = await apiRequest("POST", "/api/admin/cleanup", { type });
      if (!response.ok) throw new Error("Failed to cleanup");
      return response.json();
    },
    onSuccess: (data) => {
      toast({ title: data.message });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/chats"] });
    },
    onError: () => {
      toast({
        title: "Cleanup failed",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(password);
  };

  const handleSendMessage = () => {
    if (selectedChat && chatMessage.trim()) {
      sendMessageMutation.mutate({
        orderId: selectedChat.orderId,
        message: chatMessage.trim(),
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setEditPrice(String(product.price));
    setEditStock(String(product.inStock ?? 0));
  };

  const handleSaveProduct = () => {
    if (editingProduct) {
      updateProductMutation.mutate({
        id: editingProduct.id,
        price: Number(editPrice),
        inStock: Number(editStock),
      });
    }
  };

  const handleCreateProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      toast({ title: "Name and price are required", variant: "destructive" });
      return;
    }
    createProductMutation.mutate(newProduct);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/admin/upload-product-image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Upload failed');
      }
      
      const { imageUrl } = await response.json();
      setNewProduct(prev => ({ ...prev, imageUrl }));
      toast({ title: "Image uploaded successfully" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to upload image";
      toast({ title: message, variant: "destructive" });
    } finally {
      setUploadingImage(false);
      const input = document.getElementById('product-image-upload') as HTMLInputElement;
      if (input) input.value = '';
    }
  };

  const getOrderItems = (order: Order): OrderItem[] => {
    try {
      const items = JSON.parse(order.items);
      return items.map((item: any) => {
        const product = products.find(p => p.id === item.id || p.name === item.name);
        return {
          ...item,
          price: product?.price || item.price,
          imageUrl: product?.imageUrl || item.imageUrl,
        };
      });
    } catch {
      return [];
    }
  };

  const filteredProducts = useMemo(() => {
    if (!productSearch) return products;
    const query = productSearch.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.rarity.toLowerCase().includes(query)
    );
  }, [products, productSearch]);

  const filteredOrders = useMemo(() => {
    let filtered = orders;
    
    if (orderSearch) {
      const query = orderSearch.toLowerCase();
      filtered = filtered.filter(o =>
        o.robloxUsername.toLowerCase().includes(query) ||
        o.phone.includes(query) ||
        o.id.toLowerCase().includes(query)
      );
    }
    
    if (orderStatusFilter !== "all") {
      filtered = filtered.filter(o => o.status === orderStatusFilter);
    }
    
    return filtered;
  }, [orders, orderSearch, orderStatusFilter]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <Lock className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
            <CardTitle>Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  data-testid="input-admin-password"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
                data-testid="button-admin-login"
              >
                {loginMutation.isPending ? "Verifying..." : "Access Dashboard"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completedOrders = orders.filter(o => o.status === "completed").length;
  const cancelledOrders = orders.filter(o => o.status === "cancelled").length;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Shield className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-heading text-2xl font-bold uppercase tracking-wider">
                Admin Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">Manage orders, products, and chats</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={() => { refetch(); refetchChats(); refetchProducts(); }} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsAuthenticated(false)}
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{orders.length}</div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-500">
                {orders.filter((o) => o.status === "pending").length}
              </div>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-500">
                {products.length}
              </div>
              <p className="text-sm text-muted-foreground">Products</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-500">
                {chats.length}
              </div>
              <p className="text-sm text-muted-foreground">Active Chats</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="orders" className="gap-2">
              <Package className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              Products
              {products.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {products.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="chats" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Chats
              {chats.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {chats.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="cleanup" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Cleanup
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  All Orders
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search orders..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="pl-9 w-48"
                      data-testid="input-order-search"
                    />
                  </div>
                  <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                    <SelectTrigger className="w-40" data-testid="select-order-status-filter">
                      <SelectValue placeholder="Filter status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {ORDER_STATUSES.map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="py-8 text-center">
                    <Clock className="mx-auto mb-2 h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground">Loading orders...</p>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="py-8 text-center">
                    <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground">No orders found</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-3">
                      {filteredOrders.map((order) => {
                        const items = getOrderItems(order);

                        return (
                          <div
                            key={order.id}
                            className="flex items-center justify-between gap-4 rounded-lg border p-4 flex-wrap"
                            data-testid={`admin-order-${order.id}`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-sm font-medium">
                                  #{order.id.slice(0, 8)}
                                </span>
                                <Badge className={statusColors[order.status] || ""}>
                                  {order.status}
                                </Badge>
                                {order.receiptUrl && (
                                  <Badge variant="outline" className="gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    Receipt
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {order.robloxUsername} - {order.totalAmount} EGP
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {items.length} items - {order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedOrder(order)}
                              className="gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              View
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Products
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="pl-9 w-48"
                      data-testid="input-product-search"
                    />
                  </div>
                  <Button onClick={() => setShowAddProduct(true)} className="gap-2" data-testid="button-add-product">
                    <Plus className="h-4 w-4" />
                    Add Product
                  </Button>
                  {products.length === 0 && (
                    <Button
                      variant="outline"
                      onClick={() => seedProductsMutation.mutate()}
                      disabled={seedProductsMutation.isPending}
                      data-testid="button-seed-products"
                    >
                      {seedProductsMutation.isPending ? "Seeding..." : "Seed Products"}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <div className="py-8 text-center">
                    <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">No products in database</p>
                    <p className="text-sm text-muted-foreground">Click "Seed Products" to import products or "Add Product" to create one</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-2">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between gap-4 rounded-lg border p-3 flex-wrap"
                          data-testid={`admin-product-${product.id}`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            {product.imageUrl ? (
                              <img 
                                src={product.imageUrl} 
                                alt={product.name}
                                className="h-10 w-10 rounded object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                                <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-medium truncate">{product.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {product.category} - {product.rarity}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-bold">{product.price} EGP</p>
                              <p className="text-sm text-muted-foreground">
                                Stock: {product.inStock ?? 0}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => handleEditProduct(product)}
                                data-testid={`button-edit-product-${product.id}`}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    data-testid={`button-delete-product-${product.id}`}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete "{product.name}". This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteProductMutation.mutate(product.id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chats">
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-sm">Conversations</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px]">
                    {chats.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No active chats
                      </div>
                    ) : (
                      <div className="space-y-1 p-2">
                        {chats.map((chat) => (
                          <Button
                            key={chat.orderId}
                            variant={selectedChat?.orderId === chat.orderId ? "secondary" : "ghost"}
                            className="w-full justify-start gap-2"
                            onClick={() => setSelectedChat(chat)}
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 text-left">
                              <p className="text-sm font-medium">
                                {chat.order?.robloxUsername || "Unknown"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Order #{chat.orderId.slice(0, 8)}
                              </p>
                            </div>
                            {chat.messages.length > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {chat.messages.length}
                              </Badge>
                            )}
                          </Button>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-sm">
                    {selectedChat
                      ? `Chat with ${selectedChat.order?.robloxUsername || "Customer"}`
                      : "Select a conversation"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedChat ? (
                    <div className="space-y-4">
                      <ScrollArea className="h-[300px] rounded-md border bg-muted/30 p-4">
                        {selectedChat.messages.length === 0 ? (
                          <p className="text-center text-sm text-muted-foreground">
                            No messages yet
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {selectedChat.messages.map((msg) => (
                              <div
                                key={msg.id}
                                className={`flex ${msg.senderType === "admin" ? "justify-end" : "justify-start"}`}
                              >
                                <div
                                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                                    msg.senderType === "admin"
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-secondary text-secondary-foreground"
                                  }`}
                                >
                                  {msg.senderType !== "admin" && (
                                    <p className="mb-1 text-xs font-medium opacity-70">Customer</p>
                                  )}
                                  <p>{msg.message}</p>
                                  <p className="mt-1 text-xs opacity-60">
                                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ""}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </ScrollArea>

                      <div className="flex gap-2">
                        <Input
                          placeholder="Type a reply..."
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                          data-testid="input-admin-chat"
                        />
                        <Button
                          size="icon"
                          onClick={handleSendMessage}
                          disabled={!chatMessage.trim() || sendMessageMutation.isPending}
                          data-testid="button-admin-send"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-[360px] items-center justify-center text-muted-foreground">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Select a chat to start replying
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cleanup">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5" />
                  Cleanup Orders & Chats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Remove completed or cancelled orders and their associated chat messages.
                </p>
                
                <div className="grid gap-4 sm:grid-cols-3">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-green-600">{completedOrders}</div>
                      <p className="text-sm text-muted-foreground mb-4">Completed Orders</p>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full gap-2"
                            disabled={completedOrders === 0}
                            data-testid="button-cleanup-completed"
                          >
                            <Trash2 className="h-4 w-4" />
                            Clear Completed
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Clear Completed Orders?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete {completedOrders} completed orders and their chat messages.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => cleanupMutation.mutate("completed")}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-red-500">{cancelledOrders}</div>
                      <p className="text-sm text-muted-foreground mb-4">Cancelled Orders</p>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full gap-2"
                            disabled={cancelledOrders === 0}
                            data-testid="button-cleanup-cancelled"
                          >
                            <Trash2 className="h-4 w-4" />
                            Clear Cancelled
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Clear Cancelled Orders?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete {cancelledOrders} cancelled orders and their chat messages.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => cleanupMutation.mutate("cancelled")}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{completedOrders + cancelledOrders}</div>
                      <p className="text-sm text-muted-foreground mb-4">Total Clearable</p>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            className="w-full gap-2"
                            disabled={completedOrders + cancelledOrders === 0}
                            data-testid="button-cleanup-all"
                          >
                            <Trash2 className="h-4 w-4" />
                            Clear All
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Clear All Completed & Cancelled?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete {completedOrders + cancelledOrders} orders and all their chat messages.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => cleanupMutation.mutate("all")}>
                              Delete All
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>
                Order #{selectedOrder?.id.slice(0, 8)}
              </DialogTitle>
              <DialogDescription>
                Order details and status management
              </DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between gap-4 flex-wrap">
                    <span className="text-muted-foreground">Phone</span>
                    <span>{selectedOrder.phone}</span>
                  </div>
                  <div className="flex justify-between gap-4 flex-wrap">
                    <span className="text-muted-foreground">Roblox</span>
                    <span>{selectedOrder.robloxUsername}</span>
                  </div>
                  <div className="flex justify-between gap-4 flex-wrap">
                    <span className="text-muted-foreground">Payment</span>
                    <span>{selectedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between gap-4 flex-wrap">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-bold">{selectedOrder.totalAmount} EGP</span>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium">Order Items:</p>
                  <div className="space-y-2 max-h-48 overflow-auto">
                    {getOrderItems(selectedOrder).map((item, index) => (
                      <div key={index} className="flex items-center gap-3 rounded-lg border p-2">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="h-10 w-10 rounded object-cover" />
                        ) : (
                          <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity} {item.price && `- ${item.price} EGP each`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedOrder.receiptUrl && (
                  <div>
                    <p className="mb-2 text-sm font-medium">Receipt:</p>
                    <img
                      src={selectedOrder.receiptUrl}
                      alt="Receipt"
                      className="max-h-48 rounded-lg border"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Update Status</Label>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(value) =>
                      updateStatusMutation.mutate({
                        id: selectedOrder.id,
                        status: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUSES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Update price and stock for {editingProduct?.name}
              </DialogDescription>
            </DialogHeader>
            {editingProduct && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price (EGP)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    data-testid="input-edit-price"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-stock">Stock</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    data-testid="input-edit-stock"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setEditingProduct(null)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveProduct}
                    disabled={updateProductMutation.isPending}
                    data-testid="button-save-product"
                  >
                    {updateProductMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Create a new product in the catalog
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-name">Name *</Label>
                  <Input
                    id="new-name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    data-testid="input-new-product-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-price">Price (EGP) *</Label>
                  <Input
                    id="new-price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    data-testid="input-new-product-price"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={newProduct.category} onValueChange={(v) => setNewProduct({...newProduct, category: v})}>
                    <SelectTrigger data-testid="select-new-product-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Rarity</Label>
                  <Select value={newProduct.rarity} onValueChange={(v) => setNewProduct({...newProduct, rarity: v})}>
                    <SelectTrigger data-testid="select-new-product-rarity">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RARITIES.map(r => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-description">Description</Label>
                <Textarea
                  id="new-description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  data-testid="input-new-product-description"
                />
              </div>
              <div className="space-y-2">
                <Label>Product Image</Label>
                <div className="flex gap-2 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="product-image-upload"
                    data-testid="input-product-image-file"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('product-image-upload')?.click()}
                    disabled={uploadingImage}
                    className="gap-2"
                    data-testid="button-upload-image"
                  >
                    {uploadingImage ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    {uploadingImage ? "Uploading..." : "Upload Image"}
                  </Button>
                  {newProduct.imageUrl && (
                    <div className="flex items-center gap-2">
                      <img 
                        src={newProduct.imageUrl} 
                        alt="Preview" 
                        className="h-10 w-10 rounded-md object-cover border"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setNewProduct({...newProduct, imageUrl: ""})}
                        data-testid="button-clear-image"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <Input
                  placeholder="Or paste image URL..."
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})}
                  className="mt-2"
                  data-testid="input-new-product-image"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-stock">Stock</Label>
                <Input
                  id="new-stock"
                  type="number"
                  value={newProduct.inStock}
                  onChange={(e) => setNewProduct({...newProduct, inStock: e.target.value})}
                  data-testid="input-new-product-stock"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowAddProduct(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateProduct}
                  disabled={createProductMutation.isPending}
                  data-testid="button-create-product"
                >
                  {createProductMutation.isPending ? "Creating..." : "Create Product"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
