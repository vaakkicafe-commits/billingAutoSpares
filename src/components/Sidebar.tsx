import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Receipt, 
  Monitor, 
  Settings,
  LogOut,
  Zap
} from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Monitor, label: 'Billing', path: '/' },
  { icon: Package, label: 'Inventory', path: '/inventory' },
  { icon: Receipt, label: 'Invoices', path: '/invoices' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  return (
    <aside className="w-20 lg:w-64 bg-slate-950 border-r border-slate-900 flex flex-col h-screen transition-all">
      <div className="p-6 flex items-center justify-center lg:justify-start gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Zap className="h-6 w-6 text-white fill-current" />
        </div>
        <span className="hidden lg:block font-bold text-xl tracking-tight">AutoGear</span>
      </div>

      <nav className="flex-1 px-3 space-y-2 mt-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl transition-all group",
              isActive 
                ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" 
                : "text-slate-500 hover:bg-slate-900 hover:text-slate-200"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="hidden lg:block font-medium">{item.label}</span>
            {item.label === 'Billing' && (
              <span className="hidden lg:block ml-auto text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">LIVE</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-900 space-y-4">
        <div className="hidden lg:flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-800">
          <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400 font-bold border border-blue-800">
            A
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold truncate">Admin Branch</p>
            <p className="text-[10px] text-slate-500 truncate">Store #1042</p>
          </div>
        </div>
        
        <button className="w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all">
          <LogOut className="h-5 w-5" />
          <span className="hidden lg:block font-medium">Log out</span>
        </button>
      </div>
    </aside>
  );
}
