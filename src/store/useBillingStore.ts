import { create } from 'zustand';
import { CartItem, Product } from '../types';

interface Totals {
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
}

interface BillingState {
  cart: CartItem[];
  customerName: string;
  customerPhone: string;
  setCustomerInfo: (name: string, phone: string) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  updateDiscount: (id: string, discount: number) => void;
  clearCart: () => void;
  getTotals: () => Totals;
}

export const useBillingStore = create<BillingState>((set, get) => ({
  cart: [],
  customerName: '',
  customerPhone: '',
  
  setCustomerInfo: (name, phone) => set({ customerName: name, customerPhone: phone }),
  
  addToCart: (product) => {
    const existing = get().cart.find(item => item.id === product.id);
    if (existing) {
      set({ cart: get().cart.map(item => 
        item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item
      )});
    } else {
      set({ cart: [...get().cart, { ...product, cartQuantity: 1, discount: 0 }] });
    }
  },
  
  removeFromCart: (id) => set({ cart: get().cart.filter(item => item.id !== id) }),
  
  updateQty: (id, qty) => set({
    cart: get().cart.map(item => item.id === id ? { ...item, cartQuantity: Math.max(1, qty) } : item)
  }),
  
  updateDiscount: (id, discount) => set({
    cart: get().cart.map(item => item.id === id ? { ...item, discount: Math.max(0, discount) } : item)
  }),
  
  clearCart: () => set({ cart: [], customerName: '', customerPhone: '' }),
  
  getTotals: () => {
    const cart = get().cart;
    let subtotal = 0;
    let tax = 0;
    let discountTotal = 0;

    cart.forEach(item => {
      const priceAfterDiscount = item.market_price - item.discount;
      const lineSubtotal = priceAfterDiscount * item.cartQuantity;
      const lineTax = lineSubtotal * (item.gst_rate / 100);
      
      subtotal += lineSubtotal;
      tax += lineTax;
      discountTotal += (item.discount * item.cartQuantity);
    });

    return {
      subtotal,
      tax,
      discount: discountTotal,
      total: subtotal + tax
    };
  }
}));
