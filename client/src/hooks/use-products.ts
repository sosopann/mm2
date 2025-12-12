import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ["/api/products"],
    staleTime: 1000 * 60 * 5,
  });
}

export function useProduct(id: string) {
  return useQuery<Product>({
    queryKey: ["/api/products", id],
    enabled: !!id,
  });
}
