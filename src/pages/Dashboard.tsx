import React from 'react';
import { 
  TrendingUp, 
  Package, 
  Receipt, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Layers,
  PlusCircle,
  Activity,
  History,
  ArrowRight,
  Zap,
  ShoppingBag,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const data = [
  { name: '09:00', sales: 4000 },
  { name: '11:00', sales: 3000 },
  { name: '13:00', sales: 2000 },
  { name: '15:00', sales: 6000 },
  { name: '17:00', sales: 8000 },
  { name: '19:00', sales: 5000 },
];

const categoryData = [
  { name: 'Engine', value: 45 },
  { name: 'Electrical', value: 25 },
  { name: 'Filters', value: 15 },
  { name: 'Brakes', value: 10 },
  { name: 'Suspension', value: 5 },
];

const RECENT_TRANSACTIONS = [
  { id: '1', customer: 'Aryan Sharma', total: '₹4,250', time: '12 mins ago', type: 'Credit' },
  { id: '2', customer: 'Global Auto Trans', total: '₹12,800', time: '24 mins ago', type: 'Cash' },
  { id: '3', customer: 'Priya Verma', total: '₹850', time: '1 hour ago', type: 'Cash' },
  { id: '4', customer: 'Rahul K.', total: '₹2,100', time: '2 hours ago', type: 'UPI' },
];

const LOW_STOCK_ITEMS = [
  { id: '1', name: 'Fuel Pump Assembly', oem: 'FP-2201', stock: 3 },
  { id: '2', name: 'Timing Belt Kit', oem: 'TB-9904', stock: 2 },
  { id: '3', name: 'Head Gasket Set', oem: 'HG-4412', stock: 5 },
];

export default function Dashboard() {
  return (
    <div className="p-8 h-screen overflow-y-auto custom-scrollbar bg-slate-950">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Command Center</h1>
          <p className="text-slate-500 text-sm">Real-time Operations & Financial Oversight</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 py-2.5 px-5 rounded-2xl">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-bold tracking-tight">Today: Apr 24, 2026</span>
          </div>
        </div>
      </header>

      {/* Quick Actions Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <Link to="/" className="group">
          <div className="bg-blue-600 hover:bg-blue-500 p-5 rounded-2xl flex items-center justify-between transition-all shadow-lg shadow-blue-900/20">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-2 rounded-xl group-hover:bg-white/30 transition-all">
                <PlusCircle className="h-6 w-6 text-white" />
              </div>
              <div className="text-white">
                <div className="text-sm font-bold uppercase tracking-widest opacity-80">New Transaction</div>
                <div className="text-xl font-bold italic">Open Bill Terminal</div>
              </div>
            </div>
            <ArrowRight className="h-6 w-6 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        <Link to="/inventory" className="group">
          <div className="bg-emerald-600 hover:bg-emerald-500 p-5 rounded-2xl flex items-center justify-between transition-all shadow-lg shadow-emerald-900/20">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-2 rounded-xl group-hover:bg-white/30 transition-all">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div className="text-white">
                <div className="text-sm font-bold uppercase tracking-widest opacity-80">Inventory Focus</div>
                <div className="text-xl font-bold italic">Add New Spare Part</div>
              </div>
            </div>
            <ArrowRight className="h-6 w-6 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl group cursor-pointer hover:border-slate-700 transition-all">
          <div className="flex items-center gap-4">
            <div className="bg-slate-800 p-2 rounded-xl border border-slate-700">
              <Activity className="h-6 w-6 text-slate-400 group-hover:text-emerald-400 transition-colors" />
            </div>
            <div>
              <div className="text-sm font-bold uppercase tracking-widest text-slate-500">Live Health</div>
              <div className="text-xl font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                System Nominal
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { icon: TrendingUp, label: "Today's Revenue", value: "₹42,850", trend: "+12.5%", positive: true },
          { icon: ShoppingBag, label: "Total Orders", value: "84 Units", trend: "Active", positive: true },
          { icon: History, label: "Pending Invoices", value: "7 Items", trend: "Review", positive: false },
          { icon: AlertTriangle, label: "Low Stock Alert", value: "12 Parts", trend: "Attention", positive: false },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <stat.icon className="h-12 w-12" />
            </div>
            <div className="flex items-start justify-between mb-4">
              <div className={cn("p-2 rounded-lg", stat.positive ? "bg-blue-500/10" : "bg-amber-500/10")}>
                <stat.icon className={cn("h-5 w-5", stat.positive ? "text-blue-500" : "text-amber-500")} />
              </div>
              <div className={cn(
                "text-[10px] font-bold uppercase py-0.5 px-2 rounded-full",
                stat.positive ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
              )}>
                {stat.trend}
              </div>
            </div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</h3>
            <p className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h3 className="font-bold flex items-center gap-2 italic uppercase tracking-tight">
              <Zap className="h-4 w-4 text-blue-500" /> Revenue Stream
            </h3>
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button className="text-[10px] uppercase tracking-widest font-bold px-4 py-1.5 bg-blue-600 rounded-lg text-white">Live</button>
              <button className="text-[10px] uppercase tracking-widest font-bold px-4 py-1.5 text-slate-500 hover:text-slate-200">Historical</button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#1e293b" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }}
                />
                <Tooltip 
                  contentStyle={{ background: '#020617', border: '1px solid #1e293b', borderRadius: '12px', padding: '12px' }}
                  itemStyle={{ color: '#f8fafc', fontSize: '12px', fontWeight: 'bold' }}
                  cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sidebar Actions/Info */}
        <div className="space-y-6">
          {/* Critical Stock Monitor */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2 text-amber-500 italic uppercase">
                <AlertTriangle className="h-4 w-4" /> Critical Stock
              </h3>
              <Link to="/inventory" className="text-[10px] font-bold text-blue-500 hover:text-blue-400 uppercase tracking-widest">Restock All</Link>
            </div>
            <div className="p-4 space-y-3">
              {LOW_STOCK_ITEMS.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800/50 group">
                  <div>
                    <div className="text-xs font-bold text-slate-100 group-hover:text-amber-500 transition-colors uppercase tracking-tight">{item.name}</div>
                    <div className="text-[10px] text-slate-600 font-mono mt-0.5">OEM: {item.oem}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-amber-400">{item.stock}</div>
                    <div className="text-[8px] text-slate-700 uppercase font-black">Holdings</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
            <h3 className="font-bold text-sm flex items-center gap-2 text-slate-400 mb-6 uppercase italic">
              <History className="h-4 w-4" /> Recent Activity
            </h3>
            <div className="space-y-4">
              {RECENT_TRANSACTIONS.map((tx) => (
                <div key={tx.id} className="flex items-center gap-3">
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <Clock className="h-3.5 w-3.5 text-slate-600" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="text-xs font-bold truncate">{tx.customer}</div>
                    <div className="text-[10px] text-slate-600 flex items-center gap-1">
                      {tx.time} • <span className="text-emerald-500">{tx.type}</span>
                    </div>
                  </div>
                  <div className="text-sm font-mono font-bold text-slate-300">
                    {tx.total}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

