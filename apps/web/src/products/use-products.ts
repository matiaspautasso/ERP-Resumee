import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { Product, Stock } from '../api/types';

export interface CreateProductInput {
  sku: string;
  name: string;
  unitPrice: number;
}

export function useProducts() {
  return useQuery({ queryKey: ['products'], queryFn: () => api<Product[]>('/products') });
}

export function useStock(productId: string) {
  return useQuery({
    queryKey: ['stock', productId],
    queryFn: () => api<Stock>(`/products/${productId}/stock`),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProductInput) =>
      api<Product>('/products', { method: 'POST', body: JSON.stringify(input) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
}
