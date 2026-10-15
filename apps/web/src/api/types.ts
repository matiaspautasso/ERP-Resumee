export interface Product {
  id: string;
  sku: string;
  name: string;
  unitPrice: number;
}

export interface Stock {
  productId: string;
  quantityOnHand: number;
}

export interface Customer {
  id: string;
}

export interface SalesOrder {
  id: string;
  status: string;
}
