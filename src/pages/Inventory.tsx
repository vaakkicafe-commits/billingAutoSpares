import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

// Mock Data
const PRODUCTS = [
  { id: '1', part_name: 'Brake Pad Set', oem: 'BP-4452', brand: 'Bosch', category: 'Brakes', stock: 12, price: 1850, compatibility: 'Honda City' },
  { id: '2', part_name: 'Oil Filter', oem: 'OF-9910', brand: 'Mann', category: 'Filters', stock: 45, price: 550, compatibility: 'VW Polo' },
  { id: '3', part_name: 'LED Headlight Bulb', oem: 'HB-7721', brand: 'Philips', category: 'Electrical', stock: 8, price: 3200, compatibility: 'Universal' },
  { id: '4', part_name: 'Fuel Pump Assembly', oem: 'FP-2201', brand: 'Delphi', category: 'Engine', stock: 3, price: 5400, compatibility: 'Toyota Corolla' },
  { id: '5', part_name: 'Spark Plug Set (4pcs)', oem: 'SP-8820', brand: 'NGK', category: 'Engine', stock: 24, price: 1200, compatibility: 'Maruti Suzuki' },
  { id: '6', part_name: 'Air Filter', oem: 'AF-3321', brand: 'Wix', category: 'Filters', stock: 30, price: 850, compatibility: 'Hyundai Creta' },
  { id: '7', part_name: 'Wiper Blade Set', oem: 'WB-1102', brand: 'Valeo', category: 'Exterior', stock: 15, price: 1100, compatibility: 'Common' },
];

export default function Inventory() {
  const [search, setSearch] = useState('');
  
  return (
    <div className="p-8 h-screen flex flex-col overflow-hidden">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Inventory Control</h1>
          <p className="text-slate-500 text-sm">Managing 1,208 unique SKUs across 5 warehouses</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all">
          <Plus className="h-4 w-4" /> Register New Part
        </button>
      </header>

      {/* Control Bar */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by OEM, Part Name or Brand..." 
              className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-800 rounded-lg text-xs font-bold text-slate-400 hover:bg-slate-800 transition-all">
            <Filter className="h-3 w-3" /> Filters
          </button>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <button className="p-2 border border-slate-800 rounded-lg text-slate-500 hover:bg-slate-800">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest px-2">Page 1 of 42</span>
          <button className="p-2 border border-slate-800 rounded-lg text-slate-500 hover:bg-slate-800">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Modern Industrial Table */}
      <div className="flex-1 overflow-hidden bg-slate-900/30 border border-slate-800 rounded-3xl flex flex-col">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Product Details</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Category</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Stock</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Market Price</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {PRODUCTS.filter(p => 
                p.part_name.toLowerCase().includes(search.toLowerCase()) || 
                p.oem.toLowerCase().includes(search.toLowerCase())
              ).map((product) => (
                <motion.tr 
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
                        <Package className="h-5 w-5 text-slate-400" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors">{product.part_name}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{product.brand} • OEM: {product.oem}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <span className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-[10px] font-bold uppercase">
                        {product.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "font-bold text-sm",
                        product.stock > 10 ? "text-slate-300" : "text-amber-400"
                      )}>
                        {product.stock} Units
                      </div>
                      {product.stock <= 5 && (
                        <div className="flex items-center gap-1 text-[8px] font-bold text-red-500 uppercase tracking-tighter mt-1">
                          <AlertCircle className="h-2 w-2" /> Low Stock
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right font-mono font-bold text-slate-100 italic">
                    ₹{product.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-500 hover:text-white transition-all">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-400 transition-all">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
