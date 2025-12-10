import { Link, useLocation } from "wouter";
import { ShoppingCart, Search, Menu, X, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { CATEGORIES } from "@shared/schema";
import logoImg from "@assets/R_1765403937787.png";

export function Header() {
  const [location] = useLocation();
  const { totalItems } = useCart();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2">
          <img src={logoImg} alt="MM2 Club" className="h-12 w-auto" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <Link href="/">
            <Button
              variant={location === "/" ? "secondary" : "ghost"}
              size="sm"
              data-testid="link-home"
            >
              Home
            </Button>
          </Link>
          <Link href="/shop">
            <Button
              variant={location === "/shop" ? "secondary" : "ghost"}
              size="sm"
              data-testid="link-shop"
            >
              Shop
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              variant={location === "/contact" ? "secondary" : "ghost"}
              size="sm"
              data-testid="link-contact"
            >
              Contact
            </Button>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {searchOpen ? (
            <div className="relative hidden md:block">
              <Input
                type="search"
                placeholder="Search items..."
                className="w-48 pr-8 lg:w-64"
                autoFocus
                onBlur={() => setSearchOpen(false)}
                data-testid="input-search"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0"
                onClick={() => setSearchOpen(false)}
                data-testid="button-close-search"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              size="icon"
              variant="ghost"
              className="hidden md:flex"
              onClick={() => setSearchOpen(true)}
              data-testid="button-open-search"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}

          <Link href="/cart">
            <Button
              size="icon"
              variant="ghost"
              className="relative"
              data-testid="button-cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge
                  variant="default"
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-xs"
                  data-testid="badge-cart-count"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>

          {!isLoading && (
            isAuthenticated ? (
              <Link href="/account">
                <Button
                  size="icon"
                  variant="ghost"
                  className="relative"
                  data-testid="button-account"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImageUrl || undefined} />
                    <AvatarFallback className="text-xs">
                      {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </Link>
            ) : (
              <a href="/api/login">
                <Button
                  size="sm"
                  variant="outline"
                  className="hidden gap-2 sm:flex"
                  data-testid="button-login"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="sm:hidden"
                  data-testid="button-login-mobile"
                >
                  <User className="h-5 w-5" />
                </Button>
              </a>
            )
          )}

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="lg:hidden"
                data-testid="button-mobile-menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-4 pt-8">
                <Input
                  type="search"
                  placeholder="Search items..."
                  className="w-full"
                  data-testid="input-mobile-search"
                />
                <nav className="flex flex-col gap-2">
                  <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant={location === "/" ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      data-testid="mobile-link-home"
                    >
                      Home
                    </Button>
                  </Link>
                  <Link href="/shop" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant={location === "/shop" ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      data-testid="mobile-link-shop"
                    >
                      All Items
                    </Button>
                  </Link>
                  <div className="border-t border-border pt-2">
                    <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Categories
                    </p>
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat}
                        href={`/shop?category=${cat}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          data-testid={`mobile-link-category-${cat.toLowerCase()}`}
                        >
                          {cat}
                        </Button>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-border pt-2">
                    <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        variant={location === "/contact" ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        data-testid="mobile-link-contact"
                      >
                        Contact
                      </Button>
                    </Link>
                    {isAuthenticated ? (
                      <Link href="/account" onClick={() => setMobileMenuOpen(false)}>
                        <Button
                          variant={location === "/account" ? "secondary" : "ghost"}
                          className="w-full justify-start gap-2"
                          data-testid="mobile-link-account"
                        >
                          <User className="h-4 w-4" />
                          My Account
                        </Button>
                      </Link>
                    ) : (
                      <a href="/api/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2"
                          data-testid="mobile-link-login"
                        >
                          <LogIn className="h-4 w-4" />
                          Sign In
                        </Button>
                      </a>
                    )}
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
