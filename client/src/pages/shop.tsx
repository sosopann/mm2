import { useState, useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ProductCard } from "@/components/product-card";
import { allProducts, categoryInfo } from "@/lib/products";
import { CATEGORIES, RARITIES, type Category, type Rarity } from "@shared/schema";

type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc";

export default function ShopPage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialCategory = params.get("category") as Category | null;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedRarities, setSelectedRarities] = useState<Rarity[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 6000]);

  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.category as Category)
      );
    }

    if (selectedRarities.length > 0) {
      filtered = filtered.filter((p) =>
        selectedRarities.includes(p.rarity as Rarity)
      );
    }

    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sortBy) {
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategories, selectedRarities, sortBy, priceRange]);

  const toggleCategory = (category: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleRarity = (rarity: Rarity) => {
    setSelectedRarities((prev) =>
      prev.includes(rarity)
        ? prev.filter((r) => r !== rarity)
        : [...prev, rarity]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedRarities([]);
    setPriceRange([0, 6000]);
    setSearchQuery("");
  };

  const hasFilters =
    selectedCategories.length > 0 ||
    selectedRarities.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 6000 ||
    searchQuery;

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-3 font-display font-semibold">Categories</h4>
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <div key={category} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
                data-testid={`checkbox-category-${category.toLowerCase()}`}
              />
              <Label
                htmlFor={`cat-${category}`}
                className="flex flex-1 cursor-pointer items-center justify-between text-sm"
              >
                <span>{category}</span>
                <span className="text-muted-foreground">
                  ({categoryInfo[category].itemCount})
                </span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 font-display font-semibold">Rarity</h4>
        <div className="space-y-2">
          {RARITIES.map((rarity) => (
            <div key={rarity} className="flex items-center gap-2">
              <Checkbox
                id={`rarity-${rarity}`}
                checked={selectedRarities.includes(rarity)}
                onCheckedChange={() => toggleRarity(rarity)}
                data-testid={`checkbox-rarity-${rarity.toLowerCase()}`}
              />
              <Label
                htmlFor={`rarity-${rarity}`}
                className="cursor-pointer text-sm"
              >
                {rarity}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 font-display font-semibold">Price Range</h4>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={priceRange[0]}
            onChange={(e) =>
              setPriceRange([Number(e.target.value) || 0, priceRange[1]])
            }
            className="w-24"
            data-testid="input-price-min"
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value) || 6000])
            }
            className="w-24"
            data-testid="input-price-max"
          />
          <span className="text-sm text-muted-foreground">ج.م</span>
        </div>
      </div>

      {hasFilters && (
        <Button
          variant="outline"
          className="w-full"
          onClick={clearFilters}
          data-testid="button-clear-filters"
        >
          <X className="mr-2 h-4 w-4" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="mb-2 font-heading text-3xl font-bold uppercase tracking-wider md:text-4xl">
            {selectedCategories.length === 1
              ? `${selectedCategories[0]} Items`
              : "All Items"}
          </h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} items found
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search-shop"
            />
          </div>

          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 lg:hidden" data-testid="button-filters">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {hasFilters && (
                    <Badge variant="secondary" className="ml-1">
                      {selectedCategories.length + selectedRarities.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterPanel />
                </div>
              </SheetContent>
            </Sheet>

            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortOption)}
            >
              <SelectTrigger className="w-48" data-testid="select-sort">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasFilters && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {selectedCategories.map((cat) => (
              <Badge
                key={cat}
                variant="secondary"
                className="cursor-pointer gap-1"
                onClick={() => toggleCategory(cat)}
              >
                {cat}
                <X className="h-3 w-3" />
              </Badge>
            ))}
            {selectedRarities.map((rarity) => (
              <Badge
                key={rarity}
                variant="secondary"
                className="cursor-pointer gap-1"
                onClick={() => toggleRarity(rarity)}
              >
                {rarity}
                <X className="h-3 w-3" />
              </Badge>
            ))}
            {(priceRange[0] > 0 || priceRange[1] < 6000) && (
              <Badge
                variant="secondary"
                className="cursor-pointer gap-1"
                onClick={() => setPriceRange([0, 6000])}
              >
                {priceRange[0]}-{priceRange[1]} ج.م
                <X className="h-3 w-3" />
              </Badge>
            )}
          </div>
        )}

        <div className="flex gap-8">
          <aside className="hidden w-64 shrink-0 lg:block">
            <Card>
              <CardContent className="p-4">
                <FilterPanel />
              </CardContent>
            </Card>
          </aside>

          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Search className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-xl font-semibold">No items found</h3>
                <p className="mb-4 text-muted-foreground">
                  Try adjusting your filters or search query
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
