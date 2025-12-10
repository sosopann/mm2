import { Link } from "wouter";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground" />
        <h1 className="mb-2 text-2xl font-bold">Your Cart is Empty</h1>
        <p className="mb-6 text-muted-foreground">
          Add some amazing MM2 items to your cart!
        </p>
        <Link href="/shop">
          <Button className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold uppercase tracking-wider">
              Your Cart
            </h1>
            <p className="text-muted-foreground">{totalItems} items in your cart</p>
          </div>
          <Button
            variant="outline"
            onClick={clearCart}
            className="gap-2"
            data-testid="button-clear-cart"
          >
            <Trash2 className="h-4 w-4" />
            Clear Cart
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="divide-y divide-border p-0">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4"
                    data-testid={`cart-item-${item.productId}`}
                  >
                    <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-muted">
                      <span className="text-2xl font-bold text-primary/30">
                        {item.product.name.charAt(0)}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <Link href={`/product/${item.productId}`}>
                          <h3
                            className="font-display text-lg font-semibold hover:text-primary"
                            data-testid={`text-item-name-${item.productId}`}
                          >
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {item.product.category} • {item.product.rarity}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            data-testid={`button-decrease-${item.productId}`}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span
                            className="w-8 text-center font-semibold"
                            data-testid={`text-quantity-${item.productId}`}
                          >
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            data-testid={`button-increase-${item.productId}`}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-4">
                          <span
                            className="font-heading text-lg font-bold text-primary"
                            data-testid={`text-item-total-${item.productId}`}
                          >
                            {item.product.price * item.quantity}{" "}
                            <span className="text-sm">ج.م</span>
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.productId)}
                            data-testid={`button-remove-${item.productId}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="mt-4">
              <Link href="/shop">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="font-heading">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
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
                    data-testid="text-cart-total"
                  >
                    {totalPrice} <span className="text-base">ج.م</span>
                  </span>
                </div>

                <Link href="/checkout">
                  <Button
                    size="lg"
                    className="w-full gap-2 font-display uppercase tracking-wide"
                    data-testid="button-checkout"
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-center text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">Secure checkout</span> with
                    Vodafone Cash & InstaPay
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  <div className="flex items-center gap-1 rounded-md bg-muted/50 px-2 py-1">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                      V
                    </div>
                    <span className="text-xs">Vodafone Cash</span>
                  </div>
                  <div className="flex items-center gap-1 rounded-md bg-muted/50 px-2 py-1">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                      I
                    </div>
                    <span className="text-xs">InstaPay</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
