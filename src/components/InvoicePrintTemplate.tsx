import React from 'react';
import { CartItem } from '../types';
import { format } from 'date-fns';
import { Zap } from 'lucide-react';

interface Props {
  cart: CartItem[];
  totals: { subtotal: number; tax: number; discount: number; total: number };
  customerName: string;
  customerPhone: string;
  invoiceNumber: string;
}

export const InvoicePrintTemplate = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { cart, totals, customerName, customerPhone, invoiceNumber } = props;

  return (
    <div ref={ref} className="p-12 bg-white text-black min-h-[297mm] w-[210mm] font-sans">
      {/* Header */}
      <div className="flex justify-between items-start mb-12 pb-8 border-b-2 border-slate-100">
        <div className="flex items-center gap-4">
          <div className="bg-slate-900 p-3 rounded-xl">
            <Zap className="h-8 w-8 text-white fill-current" />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic">AutoGear</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Performance Spares & Solutions</p>
          </div>
        </div>
        <div className="text-right uppercase">
          <h2 className="text-4xl font-black text-slate-100 absolute right-12 top-12 -z-10 select-none">INVOICE</h2>
          <div className="text-sm font-bold">INV #{invoiceNumber}</div>
          <div className="text-[10px] text-slate-500 font-bold">{format(new Date(), 'dd MMM yyyy • HH:mm')}</div>
        </div>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-2 gap-12 mb-12">
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">From:</h3>
          <p className="font-bold text-lg">AutoGear Spares Ltd.</p>
          <p className="text-sm text-slate-600 leading-relaxed">
            104, Industrial Estate, Phase II<br />
            Bangalore, KA 560058<br />
            GSTIN: 29AABCU1234F1Z5
          </p>
        </div>
        <div className="text-right">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Bill To:</h3>
          <p className="font-bold text-lg">{customerName || 'Walk-in Customer'}</p>
          <p className="text-sm text-slate-600">
            {customerPhone || 'N/A'}<br />
            Cash Sale
          </p>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-12 border-collapse">
        <thead>
          <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-widest">
            <th className="px-4 py-3 text-left">Description</th>
            <th className="px-4 py-3 text-center">Qty</th>
            <th className="px-4 py-3 text-right">Rate</th>
            <th className="px-4 py-3 text-right">GST</th>
            <th className="px-4 py-3 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {cart.map((item) => {
            const lineSubtotal = (item.market_price - item.discount) * item.cartQuantity;
            const lineTax = lineSubtotal * (item.gst_rate / 100);
            return (
              <tr key={item.id} className="text-sm">
                <td className="px-4 py-4">
                  <div className="font-bold">{item.part_name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">OEM: {item.oem_number} | {item.brand}</div>
                </td>
                <td className="px-4 py-4 text-center font-mono">{item.cartQuantity}</td>
                <td className="px-4 py-4 text-right font-mono">₹{item.market_price.toFixed(2)}</td>
                <td className="px-4 py-4 text-right font-mono text-[10px] text-slate-500 italic">
                  ₹{lineTax.toFixed(2)} ({item.gst_rate}%)
                </td>
                <td className="px-4 py-4 text-right font-bold font-mono italic">
                  ₹{(lineSubtotal + lineTax).toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Summary */}
      <div className="flex justify-end">
        <div className="w-80 space-y-3 pt-6 border-t font-bold">
          <div className="flex justify-between text-xs text-slate-500 uppercase tracking-widest">
            <span>Subtotal</span>
            <span className="font-mono text-black">₹{totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-500 uppercase tracking-widest">
            <span>Tax (GST)</span>
            <span className="font-mono text-black">₹{totals.tax.toFixed(2)}</span>
          </div>
          {totals.discount > 0 && (
            <div className="flex justify-between text-xs text-emerald-600 uppercase tracking-widest italic">
              <span>Discounts</span>
              <span className="font-mono">-₹{totals.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-xl border-t-2 border-black pt-4">
            <span className="uppercase tracking-tighter italic">Total Due</span>
            <span className="font-black italic">₹{totals.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer Details */}
      <div className="absolute bottom-12 left-12 right-12 border-t pt-8">
        <div className="grid grid-cols-2 gap-8 text-[9px] uppercase tracking-widest font-bold text-slate-400">
          <div>
            <p className="mb-2 text-slate-800">Terms & Conditions</p>
            <p className="font-normal leading-relaxed">
              1. Goods once sold will not be taken back.<br />
              2. Warranty as per manufacturer's policy.<br />
              3. Disputes are subject to Bangalore jurisdiction only.
            </p>
          </div>
          <div className="text-right flex flex-col justify-end">
            <div className="h-16 w-32 ml-auto mb-2 border-b border-dashed border-slate-300"></div>
            <p className="text-slate-800 italic">Authorized Signatory</p>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center text-[8px] font-bold text-slate-300 uppercase tracking-[0.4em]">
          <span>Powered by AutoGear System</span>
          <span>Thank you for your business</span>
        </div>
      </div>
    </div>
  );
});

InvoicePrintTemplate.displayName = 'InvoicePrintTemplate';
