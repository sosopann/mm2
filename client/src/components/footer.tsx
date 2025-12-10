import { Link } from "wouter";
import { Sword, Mail, MessageCircle, Shield, Zap, Clock } from "lucide-react";
import { CATEGORIES } from "@shared/schema";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <Sword className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-heading text-lg font-bold tracking-wider">
                MM2<span className="text-primary">SHOP</span>
              </span>
            </Link>
            <p className="mb-4 text-sm text-muted-foreground">
              Your trusted Egyptian shop for premium MM2 digital items. Fast delivery, secure payments.
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Zap className="h-4 w-4 text-primary" />
                <span>Instant</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                data-testid="footer-link-home"
              >
                Home
              </Link>
              <Link
                href="/shop"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                data-testid="footer-link-shop"
              >
                Shop All Items
              </Link>
              <Link
                href="/cart"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                data-testid="footer-link-cart"
              >
                Cart
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                data-testid="footer-link-contact"
              >
                Contact Us
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider">
              Categories
            </h4>
            <nav className="flex flex-col gap-2">
              {CATEGORIES.map((category) => (
                <Link
                  key={category}
                  href={`/shop?category=${category}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  data-testid={`footer-link-${category.toLowerCase()}`}
                >
                  {category}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider">
              Payment Methods
            </h4>
            <div className="mb-4 space-y-3">
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
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Delivery: 5-30 minutes</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2024 MM2 Shop Egypt. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Trusted Egyptian MM2 Digital Items Shop
          </p>
        </div>
      </div>
    </footer>
  );
}
