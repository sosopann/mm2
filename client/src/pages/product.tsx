import { useParams, Link } from "wouter";
import { ArrowLeft, ShoppingCart, Zap, Shield, Clock, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/product-card";
import { useCart } from "@/lib/cart-context";
import { getProductById, allProducts, rarityColors } from "@/lib/products";
import { useToast } from "@/hooks/use-toast";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { toast } = useToast();

  const product = getProductById(id || "");

  if (!product) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <Package className="mb-4 h-16 w-16 text-muted-foreground" />
        <h1 className="mb-2 text-2xl font-bold">Product Not Found</h1>
        <p className="mb-6 text-muted-foreground">
          The item you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/shop">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const relatedProducts = allProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category || p.rarity === product.rarity)
    )
    .slice(0, 4);

  const rarityClass = rarityColors[product.rarity] || rarityColors.Common;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-foreground">
            Shop
          </Link>
          <span>/</span>
          <Link
            href={`/shop?category=${product.category}`}
            className="hover:text-foreground"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted/30">
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted/50 to-muted">
              <div className="text-center">
                <div className="mb-4 text-8xl font-bold text-primary/20">
                  {product.name.charAt(0)}
                </div>
                <p className="text-lg text-muted-foreground">MM2 Item</p>
              </div>
            </div>
            <Badge className={`absolute right-4 top-4 ${rarityClass}`}>
              {product.rarity}
            </Badge>
          </div>

          <div className="flex flex-col">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="outline">{product.category}</Badge>
              <Badge className={rarityClass}>{product.rarity}</Badge>
            </div>

            <h1
              className="mb-4 font-heading text-3xl font-bold md:text-4xl"
              data-testid="text-product-title"
            >
              {product.name}
            </h1>

            <p className="mb-6 text-lg text-muted-foreground" data-testid="text-product-description">
              {product.description}
            </p>

            <div className="mb-6">
              <span
                className="font-heading text-4xl font-bold text-primary md:text-5xl"
                data-testid="text-product-price"
              >
                {product.price}{" "}
                <span className="text-2xl text-muted-foreground">ج.م</span>
              </span>
            </div>

            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="flex-1 gap-2 font-display uppercase tracking-wide"
                onClick={handleAddToCart}
                data-testid="button-add-to-cart"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
              <Link href="/cart" className="flex-1">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full gap-2 font-display uppercase tracking-wide"
                  onClick={handleAddToCart}
                  data-testid="button-buy-now"
                >
                  Buy Now
                </Button>
              </Link>
            </div>

            <Separator className="my-6" />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                <Zap className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Instant Delivery</p>
                  <p className="text-sm text-muted-foreground">5-30 minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Secure Payment</p>
                  <p className="text-sm text-muted-foreground">100% Safe</p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-border bg-card p-4">
              <h4 className="mb-3 font-display font-semibold">
                Accepted Payment Methods
              </h4>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                    V
                  </div>
                  <span className="text-sm">Vodafone Cash</span>
                </div>
                <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    I
                  </div>
                  <span className="text-sm">InstaPay</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-8 font-heading text-2xl font-bold uppercase tracking-wider">
              You May Also Like
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
