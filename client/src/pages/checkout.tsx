import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, CheckCircle, Copy, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { checkoutFormSchema, type CheckoutFormData } from "@shared/schema";

const MINIMUM_ORDER_AMOUNT = 100;

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const { items, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      email: user?.email || "",
      robloxUsername: "",
      paymentMethod: "vodafone_cash",
      paymentReference: "",
    },
  });

  const selectedPayment = form.watch("paymentMethod");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Payment info copied to clipboard.",
    });
  };

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: {
      email: string;
      robloxUsername: string;
      paymentMethod: string;
      paymentReference?: string;
      totalAmount: number;
      items: string;
      status: string;
    }) => {
      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: (order) => {
      clearCart();
      toast({
        title: "Order Placed!",
        description: "Redirecting to payment page...",
      });
      setLocation(`/payment/${order.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    const orderData = {
      email: data.email,
      robloxUsername: data.robloxUsername,
      paymentMethod: data.paymentMethod,
      paymentReference: data.paymentReference || "",
      totalAmount: totalPrice,
      items: JSON.stringify(items.map(item => ({
        productId: item.productId,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      }))),
      status: "pending",
    };
    
    createOrderMutation.mutate(orderData);
  };

  const isSubmitting = createOrderMutation.isPending;

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <AlertCircle className="mb-4 h-16 w-16 text-muted-foreground" />
        <h1 className="mb-2 text-2xl font-bold">Your Cart is Empty</h1>
        <p className="mb-6 text-muted-foreground">
          Add some items to your cart before checking out.
        </p>
        <Link href="/shop">
          <Button className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go to Shop
          </Button>
        </Link>
      </div>
    );
  }

  if (totalPrice < MINIMUM_ORDER_AMOUNT) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <AlertCircle className="mb-4 h-16 w-16 text-destructive" />
        <h1 className="mb-2 text-2xl font-bold">Minimum Order Not Met</h1>
        <p className="mb-6 text-muted-foreground">
          Minimum order amount is {MINIMUM_ORDER_AMOUNT} ج.م. Add {MINIMUM_ORDER_AMOUNT - totalPrice} ج.م more to proceed.
        </p>
        <Link href="/shop">
          <Button className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Add More Items
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/cart">
            <Button variant="ghost" className="mb-4 gap-2" data-testid="button-back-to-cart">
              <ArrowLeft className="h-4 w-4" />
              Back to Cart
            </Button>
          </Link>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-wider">
            Checkout
          </h1>
          {!isAuthenticated && (
            <p className="mt-2 text-sm text-muted-foreground">
              <a href="/api/login" className="text-primary hover:underline">Sign in</a> to track your orders
            </p>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="your.email@example.com"
                              {...field}
                              data-testid="input-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="robloxUsername"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Roblox Username</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your Roblox username for item delivery"
                              {...field}
                              data-testid="input-roblox-username"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading">Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-3"
                            >
                              <div
                                className={`flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-colors ${
                                  selectedPayment === "vodafone_cash"
                                    ? "border-primary bg-primary/5"
                                    : "border-border"
                                }`}
                                onClick={() => field.onChange("vodafone_cash")}
                              >
                                <RadioGroupItem
                                  value="vodafone_cash"
                                  id="vodafone_cash"
                                  data-testid="radio-vodafone-cash"
                                />
                                <div className="flex-1">
                                  <Label
                                    htmlFor="vodafone_cash"
                                    className="flex cursor-pointer items-center gap-2 font-semibold"
                                  >
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                                      V
                                    </div>
                                    Vodafone Cash
                                  </Label>
                                  <p className="mt-1 text-sm text-muted-foreground">
                                    Pay via Vodafone Cash transfer
                                  </p>
                                </div>
                              </div>

                              <div
                                className={`flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-colors ${
                                  selectedPayment === "instapay"
                                    ? "border-primary bg-primary/5"
                                    : "border-border"
                                }`}
                                onClick={() => field.onChange("instapay")}
                              >
                                <RadioGroupItem
                                  value="instapay"
                                  id="instapay"
                                  data-testid="radio-instapay"
                                />
                                <div className="flex-1">
                                  <Label
                                    htmlFor="instapay"
                                    className="flex cursor-pointer items-center gap-2 font-semibold"
                                  >
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                      I
                                    </div>
                                    InstaPay
                                  </Label>
                                  <p className="mt-1 text-sm text-muted-foreground">
                                    Pay via InstaPay transfer
                                  </p>
                                </div>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        After placing your order, you'll see the payment details and can upload your receipt.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2 font-display uppercase tracking-wide"
                  disabled={isSubmitting}
                  data-testid="button-place-order"
                >
                  {isSubmitting ? "Processing..." : "Place Order & Pay"}
                </Button>
              </form>
            </Form>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="font-heading">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-64 space-y-3 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-2 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-xs font-bold text-primary/30">
                          {item.product.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-muted-foreground">x{item.quantity}</p>
                        </div>
                      </div>
                      <span>{item.product.price * item.quantity} ج.م</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{totalPrice} ج.م</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="text-primary">Free</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span
                    className="font-heading text-2xl font-bold text-primary"
                    data-testid="text-checkout-total"
                  >
                    {totalPrice} <span className="text-base">ج.م</span>
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
