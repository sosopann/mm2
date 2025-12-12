import { Link } from "wouter";
import { Zap, Shield, Clock, ArrowRight, Sword, Target, Package, Crown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product-card";
import { useProducts } from "@/hooks/use-products";
import { CATEGORIES } from "@shared/schema";
import { useMemo } from "react";

const categoryIcons: Record<string, typeof Sword> = {
  Budget: Package,
  Standard: Sword,
  Godly: Crown,
  Ancient: Target,
  Bundles: Package,
  Royal: Crown,
};

export default function HomePage() {
  const { data: products = [], isLoading } = useProducts();

  const categoryInfo = useMemo(() => {
    const info: Record<string, { description: string; itemCount: number }> = {
      Budget: { description: "Affordable items for beginners", itemCount: 0 },
      Standard: { description: "Popular items with great value", itemCount: 0 },
      Godly: { description: "Rare and powerful godly items", itemCount: 0 },
      Ancient: { description: "Legendary ancient artifacts", itemCount: 0 },
      Bundles: { description: "Value bundles and sets", itemCount: 0 },
      Royal: { description: "Premium exclusive collections", itemCount: 0 },
    };
    products.forEach((p) => {
      if (info[p.category]) {
        info[p.category].itemCount++;
      }
    });
    return info;
  }, [products]);

  const topSelling = useMemo(() => {
    return products.filter(p => p.rarity === "Godly" || p.rarity === "Ancient").slice(0, 8);
  }, [products]);

  const featured = useMemo(() => {
    return products.filter(p => p.category === "Bundles" || p.category === "Royal").slice(0, 6);
  }, [products]);

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-24 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
        
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6 px-4 py-1.5" variant="secondary">
              <Zap className="mr-1 h-3 w-3" />
              Instant Delivery - Egyptian Payments
            </Badge>
            
            <h1 className="mb-6 font-heading text-4xl font-bold uppercase tracking-wider md:text-5xl lg:text-6xl">
              Premium{" "}
              <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
                MM2
              </span>{" "}
              Digital Items
            </h1>
            
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Your trusted Egyptian shop for Murder Mystery 2 items. 
              Knives, Guns, Godlys, Bundles & more with instant delivery.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/shop">
                <Button size="lg" className="gap-2 font-display uppercase tracking-wide" data-testid="button-browse-shop">
                  Browse Shop
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/shop?category=Bundles">
                <Button size="lg" variant="outline" className="gap-2 font-display uppercase tracking-wide" data-testid="button-view-bundles">
                  View Bundles
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 text-center md:grid-cols-4">
            {[
              { icon: Package, label: `${products.length}+ Items`, desc: "Huge Collection" },
              { icon: Zap, label: "Instant Delivery", desc: "5-30 Minutes" },
              { icon: Shield, label: "Secure", desc: "Safe Transactions" },
              { icon: Clock, label: "24/7", desc: "Always Available" },
            ].map((item, i) => (
              <div key={i} className="rounded-lg border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
                <item.icon className="mx-auto mb-2 h-6 w-6 text-primary" />
                <p className="font-display font-semibold">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-heading text-3xl font-bold uppercase tracking-wider">
              Shop by Category
            </h2>
            <p className="text-muted-foreground">
              Browse our collection of premium MM2 items
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category) => {
              const Icon = categoryIcons[category] || Package;
              const info = categoryInfo[category];
              return (
                <Link key={category} href={`/shop?category=${category}`}>
                  <Card
                    className="group relative overflow-visible border-border/50 transition-all hover:-translate-y-1 hover:border-primary/50"
                    data-testid={`card-category-${category.toLowerCase()}`}
                  >
                    <div className="absolute -inset-px -z-10 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 blur-sm transition-opacity group-hover:opacity-100" />
                    <CardContent className="flex items-center gap-4 p-6">
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 font-display text-xl font-semibold">{category}</h3>
                        <p className="text-sm text-muted-foreground">{info.itemCount} items</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-card/50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h2 className="mb-2 font-heading text-3xl font-bold uppercase tracking-wider">
                Top Selling Items
              </h2>
              <p className="text-muted-foreground">
                Most popular items among our customers
              </p>
            </div>
            <Link href="/shop">
              <Button variant="outline" className="gap-2" data-testid="button-view-all-items">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {topSelling.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-heading text-3xl font-bold uppercase tracking-wider">
              Featured Bundles
            </h2>
            <p className="text-muted-foreground">
              Get more value with our exclusive bundles
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-gradient-to-r from-primary/10 via-background to-accent/10 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 font-heading text-3xl font-bold uppercase tracking-wider">
              Why Choose MM2 Shop?
            </h2>
            <p className="mb-12 text-muted-foreground">
              The trusted Egyptian destination for MM2 digital items
            </p>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: Zap,
                  title: "Instant Delivery",
                  desc: "Get your items within 5-30 minutes after payment confirmation",
                },
                {
                  icon: Shield,
                  title: "Secure Checkout",
                  desc: "Safe payments via Vodafone Cash and InstaPay",
                },
                {
                  icon: Clock,
                  title: "24/7 Support",
                  desc: "We're always here to help with any questions or issues",
                },
              ].map((feature, i) => (
                <div key={i} className="rounded-lg border border-border/50 bg-card p-6">
                  <feature.icon className="mx-auto mb-4 h-10 w-10 text-primary" />
                  <h3 className="mb-2 font-display text-xl font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold uppercase tracking-wider">
            Ready to Upgrade Your Inventory?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Browse our collection of {products.length}+ premium MM2 items
          </p>
          <Link href="/shop">
            <Button size="lg" className="gap-2 font-display uppercase tracking-wide" data-testid="button-start-shopping">
              Start Shopping
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
