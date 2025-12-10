import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { User, Package, Clock, CheckCircle, AlertCircle, ArrowRight, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { Order } from "@shared/schema";

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

export default function AccountPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const { data: orders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/my-orders"],
    enabled: isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to view your account.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

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
    return null;
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
                <Separator className="my-4" />
                <a href="/api/logout">
                  <Button variant="outline" className="w-full gap-2" data-testid="button-logout">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </a>
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
                          className="rounded-lg border p-4 hover-elevate"
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
                              {order.totalAmount} ج.م
                            </span>
                            <Link href={`/payment/${order.id}`}>
                              <Button size="sm" variant="outline" className="gap-1">
                                View Order
                                <ArrowRight className="h-3 w-3" />
                              </Button>
                            </Link>
                          </div>
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
