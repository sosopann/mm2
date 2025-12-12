import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Lock, Package, Eye, CheckCircle, Clock, RefreshCw, MessageCircle, Send, User, Shield, Trash2, Edit2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
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

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedChat, setSelectedChat] = useState<ChatData | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
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
      setEditingProduct(null);
    },
    onError: () => {
      toast({
        title: "Update failed",
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
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  All Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="py-8 text-center">
                    <Clock className="mx-auto mb-2 h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-8 text-center">
                    <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => {
                      let items: { name: string; quantity: number }[] = [];
                      try {
                        items = JSON.parse(order.items);
                      } catch {
                        items = [];
                      }

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
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Products
                </CardTitle>
                {products.length === 0 && (
                  <Button
                    onClick={() => seedProductsMutation.mutate()}
                    disabled={seedProductsMutation.isPending}
                    data-testid="button-seed-products"
                  >
                    {seedProductsMutation.isPending ? "Seeding..." : "Seed Products"}
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <div className="py-8 text-center">
                    <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">No products in database</p>
                    <p className="text-sm text-muted-foreground">Click "Seed Products" to import products</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-2">
                      {products.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between gap-4 rounded-lg border p-3 flex-wrap"
                          data-testid={`admin-product-${product.id}`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            {product.imageUrl && (
                              <img 
                                src={product.imageUrl} 
                                alt={product.name}
                                className="h-10 w-10 rounded object-cover"
                              />
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
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleEditProduct(product)}
                              data-testid={`button-edit-product-${product.id}`}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
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
                              This will permanently delete {completedOrders} completed orders and their chat messages. This action cannot be undone.
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
                              This will permanently delete {cancelledOrders} cancelled orders and their chat messages. This action cannot be undone.
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
                              This will permanently delete {completedOrders + cancelledOrders} orders and all their chat messages. This action cannot be undone.
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
          <DialogContent className="max-w-lg">
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
      </div>
    </div>
  );
}
