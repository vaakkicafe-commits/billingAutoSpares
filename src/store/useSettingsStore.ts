import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  lowStockThreshold: number;
  setLowStockThreshold: (threshold: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      lowStockThreshold: 5,
      setLowStockThreshold: (threshold) => set({ lowStockThreshold: Math.max(1, threshold) }),
    }),
    {
      name: 'autogear-settings',
    }
  )
);
