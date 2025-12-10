import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User, Package, Clock, CheckCircle, AlertCircle, ArrowRight, LogOut, MessageCircle, Send, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Order, ChatMessage } from "@shared/schema";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500",
  awaiting_payment: "bg-orange-500/10 text-orange-500",
  payment_uploaded: "bg-blue-500/10 text-blue-500",
  confirmed: "bg-green-500/10 text-green-500",
  processing: "bg-purple-500/10 text-purple-500",
  completed: "bg-green-600/10 text-green-600",
  cancelled: "bg-red-500/10 text-red-500",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  awaiting_payment: "Awaiting Payment",
  payment_uploaded: "Receipt Uploaded",
  confirmed: "Confirmed",
  processing: "Processing",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusIcons: Record<string, typeof Clock> = {
  pending: Clock,
  awaiting_payment: AlertCircle,
  payment_uploaded: Clock,
  confirmed: CheckCircle,
  processing: Package,
  completed: CheckCircle,
  cancelled: AlertCircle,
};

const statusProgress: Record<string, number> = {
  pending: 10,
  awaiting_payment: 20,
  payment_uploaded: 40,
  confirmed: 60,
  processing: 80,
  completed: 100,
  cancelled: 0,
};

function OrderChat({ orderId }: { orderId: string }) {
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const { data: messages = [], isLoading } = useQuery<ChatMessage[]>({
    queryKey: ["/api/orders", orderId, "messages"],
    queryFn: async () => {
      const response = await fetch(`/api/orders/${orderId}/messages`);
      if (!response.ok) throw new Error("Failed to fetch messages");
      return response.json();
    },
    enabled: isOpen,
    refetchInterval: isOpen ? 5000 : false,
  });

  const sendMutation = useMutation({
    mutationFn: async (msg: string) => {
      const response = await apiRequest("POST", `/api/orders/${orderId}/messages`, { message: msg });
      return response.json();
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/orders", orderId, "messages"] });
    },
    onError: () => {
      toast({
        title: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const handleSend = () => {
    if (message.trim()) {
      sendMutation.mutate(message.trim());
    }
  };

  return (
    <div className="mt-3 border-t pt-3">
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-between gap-2"
        onClick={() => setIsOpen(!isOpen)}
        data-testid={`button-toggle-chat-${orderId}`}
      >
        <span className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Chat with Support
        </span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>

      {isOpen && (
        <div className="mt-3 space-y-3">
          <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border bg-muted/30 p-3">
            {isLoading ? (
              <p className="text-center text-sm text-muted-foreground">Loading...</p>
            ) : messages.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">No messages yet. Start the conversation!</p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderType === "admin" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      msg.senderType === "admin"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {msg.senderType === "admin" && (
                      <p className="mb-1 text-xs font-medium opacity-70">Support</p>
                    )}
                    <p>{msg.message}</p>
                    <p className="mt-1 text-xs opacity-60">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ""}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              data-testid={`input-chat-message-${orderId}`}
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!message.trim() || sendMutation.isPending}
              data-testid={`button-send-message-${orderId}`}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AccountPage() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const { data: orders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/my-orders"],
    enabled: isAuthenticated,
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/logout", {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      setLocation("/");
    },
  });

  if (authLoading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <Clock className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <User className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-semibold">Sign in to view your account</h2>
            <p className="mb-4 text-muted-foreground">
              Create an account or sign in to track your orders
            </p>
            <Link href="/auth">
              <Button className="gap-2" data-testid="button-goto-auth">
                Sign Up / Sign In
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold uppercase tracking-wider">
            My Account
          </h1>
          <p className="text-muted-foreground">Manage your orders and profile</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Avatar className="mx-auto mb-4 h-20 w-20">
                  <AvatarImage src={user?.profileImageUrl || undefined} />
                  <AvatarFallback className="text-xl">
                    {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-medium" data-testid="text-user-name">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-sm text-muted-foreground" data-testid="text-user-email">
                  {user?.email}
                </p>
                {user?.robloxUsername && (
                  <p className="mt-1 text-sm text-muted-foreground" data-testid="text-roblox-username">
                    Roblox: {user.robloxUsername}
                  </p>
                )}
                <Separator className="my-4" />
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  data-testid="button-logout"
                >
                  <LogOut className="h-4 w-4" />
                  {logoutMutation.isPending ? "Signing Out..." : "Sign Out"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="py-8 text-center">
                    <Clock className="mx-auto mb-2 h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-8 text-center">
                    <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="mb-4 text-muted-foreground">No orders yet</p>
                    <Link href="/shop">
                      <Button className="gap-2">
                        Start Shopping
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const StatusIcon = statusIcons[order.status] || Clock;
                      let items: { name: string; quantity: number }[] = [];
                      try {
                        items = JSON.parse(order.items);
                      } catch {
                        items = [];
                      }

                      return (
                        <div
                          key={order.id}
                          className="rounded-lg border p-4"
                          data-testid={`order-item-${order.id}`}
                        >
                          <div className="mb-3 flex items-start justify-between gap-4 flex-wrap">
                            <div>
                              <p className="font-medium">
                                Order #{order.id.slice(0, 8)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {order.createdAt
                                  ? new Date(order.createdAt).toLocaleDateString()
                                  : ""}
                              </p>
                            </div>
                            <Badge className={statusColors[order.status] || ""}>
                              <StatusIcon className="mr-1 h-3 w-3" />
                              {statusLabels[order.status] || order.status}
                            </Badge>
                          </div>

                          <div className="mb-3">
                            <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                              <span>Order Progress</span>
                              <span>{statusProgress[order.status] || 0}%</span>
                            </div>
                            <Progress value={statusProgress[order.status] || 0} className="h-2" />
                          </div>

                          <div className="mb-3 text-sm text-muted-foreground">
                            {items.slice(0, 3).map((item, i) => (
                              <span key={i}>
                                {item.name} x{item.quantity}
                                {i < Math.min(items.length, 3) - 1 && ", "}
                              </span>
                            ))}
                            {items.length > 3 && (
                              <span> +{items.length - 3} more</span>
                            )}
                          </div>

                          <div className="flex items-center justify-between gap-4 flex-wrap">
                            <span className="font-heading text-lg font-bold text-primary">
                              {order.totalAmount} EGP
                            </span>
                            <Link href={`/payment/${order.id}`}>
                              <Button size="sm" variant="outline" className="gap-1">
                                View Order
                                <ArrowRight className="h-3 w-3" />
                              </Button>
                            </Link>
                          </div>

                          <OrderChat orderId={order.id} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
