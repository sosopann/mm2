import { Link } from "wouter";
import { Home, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="relative mb-8">
        <span className="font-heading text-9xl font-bold text-primary/20">404</span>
        <div className="absolute inset-0 flex items-center justify-center">
          <ShoppingBag className="h-20 w-20 text-primary" />
        </div>
      </div>
      
      <h1 className="mb-4 font-heading text-3xl font-bold uppercase tracking-wider">
        Page Not Found
      </h1>
      
      <p className="mb-8 max-w-md text-muted-foreground">
        Oops! The page you're looking for doesn't exist or has been moved. 
        Let's get you back to shopping for amazing MM2 items!
      </p>
      
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </Link>
        <Link href="/shop">
          <Button className="gap-2">
            <ShoppingBag className="h-4 w-4" />
            Browse Shop
          </Button>
        </Link>
      </div>
    </div>
  );
}
