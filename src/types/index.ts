export interface Product {
  id: string;
  part_name: string;
  oem_number: string;
  brand: string;
  vehicle_compatibility: string[];
  stock_quantity: number;
  cost_price: number;
  market_price: number;
  gst_rate: number;
  updated_at?: string;
}

export interface CartItem extends Product {
  cartQuantity: number;
  discount: number;
}

export interface Invoice {
  id: string;
  invoice_number: number;
  customer_name: string;
  customer_phone: string;
  subtotal: number;
  tax_total: number;
  discount_total: number;
  grand_total: number;
  created_at: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  inventory_id: string;
  quantity: number;
  unit_price: number;
  gst_amount: number;
  part_name?: string; // virtual field for convenience
}
