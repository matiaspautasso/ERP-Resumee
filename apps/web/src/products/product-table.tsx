import { Money } from '@erp/shared';
import { Product } from '../api/types';
import { useStock } from './use-products';

function StockCell({ productId }: { productId: string }) {
  const { data, isLoading } = useStock(productId);
  return (
    <span data-testid={`stock-${productId}`}>{isLoading ? '…' : (data?.quantityOnHand ?? 0)}</span>
  );
}

/** Presentational: lists products and their current stock on hand. */
export function ProductTable({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <p>No products yet.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>SKU</th>
          <th>Name</th>
          <th>Unit price</th>
          <th>On hand</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id} data-testid={`product-${product.sku}`}>
            <td>{product.sku}</td>
            <td>{product.name}</td>
            <td>{Money.fromMinorUnits(product.unitPrice).format()}</td>
            <td>
              <StockCell productId={product.id} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
