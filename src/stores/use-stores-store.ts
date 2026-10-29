import { create } from "zustand";

export interface StoreModel {
  id: string;
  name: string;
  code: string;
  type: "Flagship" | "Express" | "Kiosk" | "Roastery";
  cityId?: string;
  city: string;
  manager: string;
  hours: string;
  status: "Open" | "Busy mode" | "Closed" | "Needs attention";
  statusDetail?: string; // e.g. "KDS offline · 4 min" or "Closed till 12 pm"
  salesToday: number;
  rating: number;
}

interface StoresState {
  stores: StoreModel[];
  setStores: (stores: StoreModel[]) => void;
  addStore: (store: Omit<StoreModel, "id">) => void;
  removeStore: (id: string) => void;
  clearAllStores: () => void;
  loadDemoStores: () => void;
}

// Clear legacy persistent storage key if present in browser
if (typeof window !== "undefined") {
  try {
    localStorage.removeItem("bruvi-stores-registry");
  } catch {
    // Ignore storage access errors
  }
}

// Initial state is strictly empty (0 stores) - single source of truth is the backend API
export const useStoresStore = create<StoresState>((set) => ({
  stores: [],

  setStores: (stores) => set({ stores }),

  addStore: (newStore) =>
    set((state) => ({
      stores: [
        {
          ...newStore,
          id: `store-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        },
        ...state.stores,
      ],
    })),

  removeStore: (id) =>
    set((state) => ({
      stores: state.stores.filter((s) => s.id !== id),
    })),

  clearAllStores: () => set({ stores: [] }),

  loadDemoStores: () => set({ stores: [] }),
}));
