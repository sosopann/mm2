import { Link } from "wouter";
import { ShoppingCart, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-context";
import { rarityColors } from "@/lib/products";
import type { Product } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const rarityClass = rarityColors[product.rarity] || rarityColors.Common;

  return (
    <Link href={`/product/${product.id}`}>
      <Card
        className="group relative overflow-visible border-border/50 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50"
        data-testid={`card-product-${product.id}`}
      >
        <div className="absolute -inset-px -z-10 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 blur-sm transition-opacity group-hover:opacity-100" />
        
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden rounded-t-lg bg-muted/30">
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted/50 to-muted">
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-primary/20">
                  {product.name.charAt(0)}
                </div>
                <p className="text-xs text-muted-foreground">MM2 Item</p>
              </div>
            </div>
            
            <Badge
              className={`absolute right-2 top-2 ${rarityClass}`}
              data-testid={`badge-rarity-${product.id}`}
            >
              {product.rarity}
            </Badge>

            <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" data-testid={`button-view-${product.id}`}>
                  <Eye className="mr-1 h-4 w-4" />
                  View
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  data-testid={`button-add-cart-${product.id}`}
                >
                  <ShoppingCart className="mr-1 h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4">
            <h3
              className="mb-1 truncate font-display text-lg font-semibold"
              data-testid={`text-product-name-${product.id}`}
            >
              {product.name}
            </h3>
            <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
              {product.description}
            </p>
            <div className="flex items-center justify-between gap-2">
              <span
                className="font-heading text-xl font-bold text-primary"
                data-testid={`text-price-${product.id}`}
              >
                {product.price} <span className="text-sm">ج.م</span>
              </span>
              <Badge variant="outline" className="text-xs">
                {product.category}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
