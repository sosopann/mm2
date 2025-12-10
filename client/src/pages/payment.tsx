import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Copy, Upload, CheckCircle, Clock, ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Order } from "@shared/schema";

const PAYMENT_INFO = {
  number: "01027996144",
  name: "محمد أحمد",
  whatsapp: "01027996144",
};

export default function PaymentPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ["/api/orders", id],
    enabled: !!id,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("receipt", file);
      const response = await fetch(`/api/orders/${id}/receipt`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Receipt uploaded!",
        description: "We'll verify your payment and deliver your items soon.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/orders", id] });
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`,
    });
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <Clock className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold">Order Not Found</h1>
        <Link href="/shop">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

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
    confirmed: "Payment Confirmed",
    processing: "Processing",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/shop">
            <Button variant="ghost" className="gap-2" data-testid="button-back-shop">
              <ArrowLeft className="h-4 w-4" />
              Back to Shop
            </Button>
          </Link>
        </div>

        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
            <h1 className="font-heading text-3xl font-bold uppercase tracking-wider">
              Order Placed!
            </h1>
            <p className="mt-2 text-muted-foreground">
              Complete your payment to receive your items
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <CardTitle>Order #{order.id.slice(0, 8)}</CardTitle>
                <Badge className={statusColors[order.status] || ""} data-testid="badge-order-status">
                  {statusLabels[order.status] || order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between gap-4 flex-wrap">
                <span className="text-muted-foreground">Roblox Username</span>
                <span className="font-medium" data-testid="text-roblox-username">{order.robloxUsername}</span>
              </div>
              <div className="flex justify-between gap-4 flex-wrap">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="font-heading text-xl font-bold text-primary" data-testid="text-total-amount">
                  {order.totalAmount} ج.م
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Vodafone Cash Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg bg-card p-4 text-center">
                <p className="mb-2 text-sm text-muted-foreground">Transfer to:</p>
                <div className="mb-2 flex items-center justify-center gap-2">
                  <span className="font-mono text-2xl font-bold" data-testid="text-payment-number">
                    {PAYMENT_INFO.number}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => copyToClipboard(PAYMENT_INFO.number, "Number")}
                    data-testid="button-copy-number"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-lg font-medium" data-testid="text-payment-name">
                  {PAYMENT_INFO.name}
                </p>
              </div>

              <Separator />

              <div className="space-y-3 text-center">
                <p className="text-sm text-muted-foreground">
                  After payment, send the receipt screenshot on WhatsApp:
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-lg font-medium" data-testid="text-whatsapp">
                    {PAYMENT_INFO.whatsapp}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => copyToClipboard(PAYMENT_INFO.whatsapp, "WhatsApp")}
                    data-testid="button-copy-whatsapp"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <a
                  href={`https://wa.me/2${PAYMENT_INFO.whatsapp}?text=Order%20%23${order.id.slice(0, 8)}%20-%20${order.totalAmount}%20EGP`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="mt-2 gap-2" data-testid="button-whatsapp-link">
                    <MessageCircle className="h-4 w-4" />
                    Open WhatsApp
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Payment Receipt
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.receiptUrl ? (
                <div className="text-center">
                  <CheckCircle className="mx-auto mb-2 h-10 w-10 text-green-500" />
                  <p className="font-medium text-green-600">Receipt uploaded!</p>
                  <p className="text-sm text-muted-foreground">
                    We'll verify your payment soon.
                  </p>
                  <img
                    src={order.receiptUrl}
                    alt="Payment receipt"
                    className="mx-auto mt-4 max-h-64 rounded-lg border"
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="receipt">Select receipt image</Label>
                    <Input
                      id="receipt"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      data-testid="input-receipt-file"
                    />
                  </div>

                  {previewUrl && (
                    <div className="text-center">
                      <img
                        src={previewUrl}
                        alt="Receipt preview"
                        className="mx-auto max-h-48 rounded-lg border"
                      />
                    </div>
                  )}

                  <Button
                    onClick={handleUpload}
                    disabled={!selectedFile || uploadMutation.isPending}
                    className="w-full gap-2"
                    data-testid="button-upload-receipt"
                  >
                    <Upload className="h-4 w-4" />
                    {uploadMutation.isPending ? "Uploading..." : "Upload Receipt"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
