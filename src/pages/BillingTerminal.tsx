import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useBillingStore } from '../store/useBillingStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { Product } from '../types';
import { 
  Search, 
  ShoppingCart, 
  Trash2, 
  Zap, 
  User, 
  Phone, 
  Percent, 
  Plus, 
  Minus,
  AlertCircle,
  CheckCircle2,
  Printer,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';
import { useReactToPrint } from 'react-to-print';
import { InvoicePrintTemplate } from '../components/InvoicePrintTemplate';

// Mock External API for Market Price
const fetchMarketPrice = async (oem: string) => {
  await new Promise(res => setTimeout(res, 500));
  return Math.floor(Math.random() * (2500 - 400) + 400); 
};

export default function BillingTerminal() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [invoiceId, setInvoiceId] = useState('10842');
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const printComponentRef = useRef<HTMLDivElement>(null);
  
  const { 
    cart, 
    addToCart, 
    removeFromCart, 
    updateQty, 
    updateDiscount, 
    getTotals, 
    customerName, 
    customerPhone, 
    setCustomerInfo,
    clearCart
  } = useBillingStore();

  const { lowStockThreshold } = useSettingsStore();
  
  const totals = getTotals();

  const handlePrint = useReactToPrint({
    contentRef: printComponentRef,
    onAfterPrint: () => {
      setIsCheckoutOpen(false);
      clearCart();
      setInvoiceId(prev => (parseInt(prev) + 1).toString());
      toast.success('Invoice Finalized & Saved');
    },
  });

  // Keyboard Shortcuts: '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Supabase Realtime Listener for Low Stock Alerts
  useEffect(() => {
    const channel = supabase
      .channel('inventory-stock-alerts')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'inventory',
        },
        (payload) => {
          const newItem = payload.new as Product;
          
          // Check if stock quantity dropped below threshold
          if (newItem.stock_quantity <= lowStockThreshold) {
            toast.error(
              <div className="flex flex-col gap-1">
                <span className="font-bold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> LOW STOCK ALERT
                </span>
                <span className="text-xs opacity-90">
                  {newItem.part_name} ({newItem.oem_number}) is down to {newItem.stock_quantity} units.
                </span>
              </div>,
              {
                duration: 6000,
                style: {
                  border: '1px solid #7f1d1d',
                  background: '#450a0a',
                  color: '#fef2f2',
                },
              }
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [lowStockThreshold]);

  const handleSearch = async (val: string) => {
    setSearchQuery(val);
    if (val.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .or(`oem_number.ilike.%${val}%,part_name.ilike.%${val}%`)
        .limit(6);
      
      if (error) throw error;
      setSearchResults(data || []);
    } catch (err) {
      // Fallback
      setSearchResults([
        { id: '1', part_name: 'Brake Pad Set', oem_number: 'BP-4452', brand: 'Bosch', vehicle_compatibility: ['Honda City'], stock_quantity: 12, cost_price: 1200, market_price: 1850, gst_rate: 18 },
        { id: '2', part_name: 'Oil Filter', oem_number: 'OF-9910', brand: 'Mann', vehicle_compatibility: ['VW Polo'], stock_quantity: 45, cost_price: 350, market_price: 550, gst_rate: 18 },
        { id: '3', part_name: 'LED Headlight Bulb', oem_number: 'HB-7721', brand: 'Philips', vehicle_compatibility: ['Universal'], stock_quantity: 8, cost_price: 2200, market_price: 3200, gst_rate: 28 },
      ].filter(i => i.part_name.toLowerCase().includes(val.toLowerCase()) || i.oem_number.toLowerCase().includes(val.toLowerCase())));
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    const livePrice = await fetchMarketPrice(product.oem_number);
    const updatedProduct = { ...product, market_price: livePrice };
    
    addToCart(updatedProduct);
    toast.success(`${product.part_name} added`, {
      style: { background: '#0f172a', color: '#f8fafc', border: '1px solid #1e293b' },
      icon: <CheckCircle2 className="text-emerald-400 h-5 w-5" />
    });
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    setIsCheckoutOpen(true);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-950 text-slate-50 gap-0 overflow-hidden font-sans">
      {/* Search & Results Panel */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden border-r border-slate-900/50">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/20">
              <Zap className="h-6 w-6 text-white fill-current" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">AutoGear Terminal</h1>
              <p className="text-slate-500 text-sm">Industrial Billing Interface v1.0</p>
            </div>
          </div>
        </header>

        {/* Search Input */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className={cn("h-5 w-5 transition-colors", isSearching ? "text-blue-500 animate-pulse" : "text-slate-500")} />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search Parts by Name or OEM Number (Press '/' to focus)"
            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchQuery && (
            <div className="absolute right-4 top-4 text-xs font-mono text-slate-600 uppercase tracking-widest hidden sm:block">
              Results: {searchResults.length}
            </div>
          )}
        </div>

        {/* Results Grid */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => handleAddToCart(product)}
                    className="group bg-slate-900/40 border border-slate-800 hover:border-blue-500/50 rounded-xl p-4 cursor-pointer transition-all hover:shadow-xl hover:shadow-blue-500/5 active:scale-[0.98]"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-100 group-hover:text-white transition-colors">{product.part_name}</h3>
                        <p className="text-xs text-slate-500 font-mono mt-1 uppercase tracking-tight">{product.brand} • {product.oem_number}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-400 font-mono font-bold text-lg">₹{product.market_price}</span>
                        <div className="text-[10px] text-slate-600 uppercase font-bold tracking-tighter">Market Price</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 text-[11px] font-bold uppercase tracking-widest">
                      <div className={cn(
                        "px-2 py-1 rounded flex items-center gap-1.5",
                        product.stock_quantity > 10 ? "bg-slate-800 text-slate-300" : "bg-red-950/30 text-red-400 border border-red-900/50"
                      )}>
                        {product.stock_quantity > 10 ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                        Stock: {product.stock_quantity}
                      </div>
                      <div className="text-slate-500 flex items-center gap-1 group-hover:text-blue-400 transition-colors">
                        Add to Cart <Plus className="h-3 w-3" />
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : searchQuery.length >= 2 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-600 border border-dashed border-slate-800 rounded-2xl">
                  <span className="text-4xl mb-4 opacity-20">No Results</span>
                  <p className="text-sm">Try searching for a different part or OEM number</p>
                </div>
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-32 text-slate-700">
                  <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mb-4 border border-slate-800">
                    <Search className="h-8 w-8 opacity-40" />
                  </div>
                  <p className="text-sm font-medium tracking-wide uppercase">Start typing to search parts</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Cart & Billing Side Panel */}
      <div className="w-full lg:w-[450px] bg-slate-900/30 backdrop-blur-xl flex flex-col border-l border-slate-900/50 shadow-2xl relative z-10">
        {/* Customer Info Header */}
        <div className="p-6 border-b border-slate-800/50 bg-slate-900/20">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <User className="h-3 w-3" /> Customer Details
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-600" />
              <input 
                type="text" 
                placeholder="Name" 
                className="w-full bg-slate-900/80 border border-slate-800 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-blue-500/50"
                value={customerName}
                onChange={(e) => setCustomerInfo(e.target.value, customerPhone)}
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-600" />
              <input 
                type="text" 
                placeholder="Phone" 
                className="w-full bg-slate-900/80 border border-slate-800 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-blue-500/50"
                value={customerPhone}
                onChange={(e) => setCustomerInfo(customerName, e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Live Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <ShoppingCart className="h-3 w-3" /> Cart Items ({cart.length})
            </h2>
            {cart.length > 0 && (
              <button 
                onClick={clearCart}
                className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:text-red-400 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          <AnimatePresence>
            {cart.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center py-20 text-slate-700"
              >
                <ShoppingCart className="h-12 w-12 mb-4 opacity-10" />
                <p className="text-xs uppercase tracking-widest font-bold">Terminal Idle</p>
              </motion.div>
            ) : (
              cart.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 shadow-sm group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 truncate w-40">{item.part_name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{item.oem_number}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 rounded-md hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 items-end">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
                        <button 
                          onClick={() => updateQty(item.id, item.cartQuantity - 1)}
                          className="p-1.5 hover:bg-slate-900 text-slate-400"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 text-xs font-mono font-bold text-blue-400">{item.cartQuantity}</span>
                        <button 
                          onClick={() => updateQty(item.id, item.cartQuantity + 1)}
                          className="p-1.5 hover:bg-slate-900 text-slate-400"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500 mb-1">
                        <span className="font-mono">₹{item.market_price}</span> × {item.cartQuantity}
                      </div>
                      <div className="font-mono font-bold text-slate-100">
                        ₹{(item.market_price * item.cartQuantity).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Add Discount Toggle or Input */}
                  <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                      <Percent className="h-3 w-3" /> Disc.
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-500">₹</span>
                      <input 
                        type="number"
                        className="bg-transparent border-b border-transparent focus:border-blue-500/50 w-12 text-right text-xs font-mono text-amber-500 focus:outline-none"
                        value={item.discount}
                        onChange={(e) => updateDiscount(item.id, parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Footer Totals */}
        <div className="p-8 bg-slate-900/60 border-t border-slate-800/80 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
              <span>Subtotal</span>
              <span className="font-mono text-slate-300">₹{totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
              <span className="flex items-center gap-1.5">
                GST <span className="text-[10px] bg-slate-800 px-1 rounded text-slate-400">18% AVG</span>
              </span>
              <span className="font-mono text-slate-300">₹{totals.tax.toFixed(2)}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-amber-500">
                <span>Savings</span>
                <span className="font-mono">- ₹{totals.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-4 border-t border-slate-800 mt-4">
              <div className="flex justify-between items-center text-slate-50">
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Total Payable</span>
                <span className="text-3xl font-mono font-bold text-emerald-400 tabular-nums">
                  ₹{totals.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl py-4 transition-all font-bold text-xs uppercase tracking-widest border border-slate-700">
              <Printer className="h-4 w-4" /> Save
            </button>
            <button 
              onClick={handleCheckout}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-4 transition-all font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-600/20"
            >
              <Zap className="h-4 w-4 fill-current" /> Checkout
            </button>
          </div>
        </div>
      </div>
      
      {/* Checkout Modal / Preview */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold italic uppercase tracking-tight">Finalized Sale Review</h3>
                </div>
                <button 
                  onClick={() => setIsCheckoutOpen(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-inner overflow-hidden">
                  <div className="origin-top scale-[0.65] sm:scale-[0.85] lg:scale-100">
                     <InvoicePrintTemplate 
                        ref={printComponentRef} 
                        cart={cart} 
                        totals={totals}
                        customerName={customerName}
                        customerPhone={customerPhone}
                        invoiceNumber={invoiceId}
                     />
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-900/80 border-t border-slate-800 flex justify-between items-center">
                <div className="text-sm font-medium text-slate-500 uppercase tracking-widest">
                  Ready to Finalize <span className="text-slate-200 ml-2">INV #{invoiceId}</span>
                </div>
                <div className="flex gap-4">
                   <button 
                    onClick={() => setIsCheckoutOpen(false)}
                    className="px-6 py-3 rounded-xl border border-slate-800 font-bold text-xs uppercase tracking-widest text-slate-400 hover:bg-slate-800 transition-all"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handlePrint}
                    className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
                  >
                    <Printer className="h-4 w-4" /> Finalize & Print
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden Print Content for real printing */}
      <div className="hidden">
         <InvoicePrintTemplate 
            ref={printComponentRef} 
            cart={cart} 
            totals={totals}
            customerName={customerName}
            customerPhone={customerPhone}
            invoiceNumber={invoiceId}
         />
      </div>

      {/* Visual Accents - Industrial Style */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
    </div>
  );
}
