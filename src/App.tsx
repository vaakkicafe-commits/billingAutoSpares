/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import BillingTerminal from './pages/BillingTerminal';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Settings from './pages/Settings';

const PagePlaceholder = ({ title }: { title: string }) => (
  <div className="p-8 h-screen flex items-center justify-center bg-slate-950 text-slate-800">
    <div className="text-center">
      <div className="text-8xl font-black uppercase mb-4 opacity-10">{title}</div>
      <p className="text-sm font-bold tracking-[0.4em] uppercase text-slate-700">Under Construction</p>
    </div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-slate-950 text-slate-50 overflow-hidden font-sans">
        <Sidebar />
        <main className="flex-1 relative overflow-hidden">
          <Routes>
            <Route path="/" element={<BillingTerminal />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/invoices" element={<PagePlaceholder title="Invoices" />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        {/* Global Notifications */}
        <Toaster 
          position="bottom-left"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#0f172a',
              color: '#f8fafc',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: 500
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}
