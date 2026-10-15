import { FormEvent, useState } from 'react';
import { CreateProductInput } from './use-products';

interface CreateProductFormProps {
  onCreate: (input: CreateProductInput) => void;
  pending: boolean;
  error: string | null;
}

/** Presentational: captures a new product and reports it upward. */
export function CreateProductForm({ onCreate, pending, error }: CreateProductFormProps) {
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [unitPrice, setUnitPrice] = useState('0');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onCreate({ sku, name, unitPrice: Number(unitPrice) });
    setSku('');
    setName('');
    setUnitPrice('0');
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>Add product</h2>
      <label>
        SKU
        <input name="sku" value={sku} onChange={(e) => setSku(e.target.value)} required />
      </label>
      <label>
        Name
        <input name="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>
        Unit price (minor units)
        <input
          name="unitPrice"
          type="number"
          min="0"
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
          required
        />
      </label>
      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={pending}>
        {pending ? 'Adding…' : 'Add product'}
      </button>
    </form>
  );
}
