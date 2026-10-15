import { useAuth } from '../auth/auth-context';
import { CreateProductForm } from './create-product-form';
import { ProductTable } from './product-table';
import { useCreateProduct, useProducts } from './use-products';

/** Container: composes the products dashboard from data hooks and presentational pieces. */
export function ProductsPage() {
  const { logout } = useAuth();
  const products = useProducts();
  const createProduct = useCreateProduct();

  return (
    <main>
      <header className="topbar">
        <h1>Products</h1>
        <button type="button" onClick={logout}>
          Sign out
        </button>
      </header>

      <CreateProductForm
        onCreate={(input) => createProduct.mutate(input)}
        pending={createProduct.isPending}
        error={createProduct.error instanceof Error ? createProduct.error.message : null}
      />

      {products.isLoading && <p>Loading…</p>}
      {products.error && <p role="alert">Failed to load products.</p>}
      {products.data && <ProductTable products={products.data} />}
    </main>
  );
}
