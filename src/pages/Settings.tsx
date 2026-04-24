import React from 'react';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Database, 
  Shield, 
  AlertCircle,
  Save,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { useSettingsStore } from '../store/useSettingsStore';
import { toast } from 'react-hot-toast';

export default function Settings() {
  const { lowStockThreshold, setLowStockThreshold } = useSettingsStore();
  const [localThreshold, setLocalThreshold] = React.useState(lowStockThreshold);

  const handleSave = () => {
    setLowStockThreshold(localThreshold);
    toast.success('Settings updated successfully', {
      icon: <CheckCircle2 className="text-emerald-400 h-5 w-5" />,
      style: { background: '#0f172a', color: '#f8fafc', border: '1px solid #1e293b' },
    });
  };

  return (
    <div className="p-8 h-screen overflow-y-auto custom-scrollbar bg-slate-950">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-slate-900 border border-slate-800 p-2 rounded-lg">
            <SettingsIcon className="h-6 w-6 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">System Configuration</h1>
        </div>
        <p className="text-slate-500 text-sm">Tune the AutoGear terminal and inventory engine parameters</p>
      </header>

      <div className="max-w-3xl space-y-6">
        {/* Inventory Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-slate-800 bg-slate-900/20 flex items-center gap-3">
            <Bell className="h-5 w-5 text-amber-500" />
            <h3 className="font-bold uppercase tracking-widest text-xs">Alerts & Notifications</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label className="text-sm font-bold text-slate-200 block mb-1">Global Low Stock Threshold</label>
                <p className="text-xs text-slate-500">Trigger real-time alerts when inventory quantity falls below this value</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <AlertCircle className="absolute left-3 top-2.5 h-4 w-4 text-slate-600" />
                  <input 
                    type="number"
                    value={localThreshold}
                    onChange={(e) => setLocalThreshold(parseInt(e.target.value) || 1)}
                    className="bg-slate-950 border border-slate-800 rounded-lg py-2 pl-9 pr-4 w-32 text-sm font-mono focus:outline-none focus:border-blue-500/50"
                  />
                </div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">Units</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Database & Security Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-slate-800 bg-slate-900/20 flex items-center gap-3">
            <Database className="h-5 w-5 text-blue-500" />
            <h3 className="font-bold uppercase tracking-widest text-xs">Environment Sync</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-4 p-4 bg-blue-900/10 border border-blue-900/20 rounded-xl">
              <Shield className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-blue-400">Database Connection Status</h4>
                <p className="text-xs text-blue-300/60 mt-1 leading-relaxed">
                  Terminal is currently connected to Supabase Instance #1042. 
                  Realtime replication is active for inventory updates.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="pt-4 flex justify-end">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-8 py-3 transition-all font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-600/20"
          >
            <Save className="h-4 w-4" /> Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
