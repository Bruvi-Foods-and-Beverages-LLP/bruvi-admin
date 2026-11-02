import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  StoreMenuFeed,
  StoreMenuItem,
  UpdateStoreMenuItemPayload,
  BulkStoreMenuPayload,
} from "@/types/store-menu";

interface StoreMenuState {
  currentStoreMenu: StoreMenuFeed | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string; // 'all' | 'vietnamese' | 'matcha' | etc.
  filterUnavailableOnly: boolean;
  selectedItemIds: string[];
  isSubmitting: boolean;
  pushStatus: {
    success: boolean;
    message: string;
    timestamp: string;
  } | null;
}

const initialState: StoreMenuState = {
  currentStoreMenu: null,
  isLoading: true,
  error: null,
  searchQuery: "",
  selectedCategory: "all",
  filterUnavailableOnly: false,
  selectedItemIds: ["SP-VBXU", "AD-VANS"], // Pre-select the 2 unavailable items as shown in Figma design
  isSubmitting: false,
  pushStatus: null,
};

export const fetchStoreMenu = createAsyncThunk(
  "storeMenu/fetchStoreMenu",
  async (idOrCode: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/proxy/stores/${encodeURIComponent(idOrCode)}/menu`);
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        return rejectWithValue(errJson.message || `Failed to fetch menu for store '${idOrCode}'`);
      }
      const json = await res.json();
      return (json.data || json) as StoreMenuFeed;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Unable to reach menu service");
    }
  }
);

export const updateStoreMenuItem = createAsyncThunk(
  "storeMenu/updateStoreMenuItem",
  async (
    {
      storeId,
      itemId,
      payload,
    }: {
      storeId: string;
      itemId: string;
      payload: UpdateStoreMenuItemPayload;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(`/api/proxy/stores/${encodeURIComponent(storeId)}/menu/${encodeURIComponent(itemId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        return rejectWithValue(errJson.message || `Failed to update menu item '${itemId}'`);
      }
      const json = await res.json();
      return (json.data || json) as StoreMenuItem;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Unable to update item");
    }
  }
);

export const bulkUpdateStoreMenu = createAsyncThunk(
  "storeMenu/bulkUpdateStoreMenu",
  async (
    {
      storeId,
      payload,
    }: {
      storeId: string;
      payload: BulkStoreMenuPayload;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(`/api/proxy/stores/${encodeURIComponent(storeId)}/menu/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        return rejectWithValue(errJson.message || "Failed to execute bulk update");
      }
      const json = await res.json();
      return (json.data || json) as { updatedCount: number; items: StoreMenuItem[] };
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Unable to execute bulk update");
    }
  }
);

export const pushStoreMenuToDevices = createAsyncThunk(
  "storeMenu/pushStoreMenuToDevices",
  async (storeId: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/proxy/stores/${encodeURIComponent(storeId)}/menu/push`, {
        method: "POST",
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        return rejectWithValue(errJson.message || "Failed to push menu to devices");
      }
      const json = await res.json();
      return (json.data || json) as { success: boolean; pushedToDevices: number; timestamp: string };
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Unable to push menu to devices");
    }
  }
);

const storeMenuSlice = createSlice({
  name: "storeMenu",
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setSelectedCategory(state, action: PayloadAction<string>) {
      state.selectedCategory = action.payload;
      state.filterUnavailableOnly = false;
    },
    setFilterUnavailableOnly(state, action: PayloadAction<boolean>) {
      state.filterUnavailableOnly = action.payload;
    },
    toggleSelectItem(state, action: PayloadAction<string>) {
      const id = action.payload;
      const idx = state.selectedItemIds.indexOf(id);
      if (idx >= 0) {
        state.selectedItemIds.splice(idx, 1);
      } else {
        state.selectedItemIds.push(id);
      }
    },
    selectAllItems(state, action: PayloadAction<string[]>) {
      state.selectedItemIds = action.payload;
    },
    clearSelection(state) {
      state.selectedItemIds = [];
    },
    dismissPushStatus(state) {
      state.pushStatus = null;
    },
  },
  extraReducers: (builder) => {
    // fetchStoreMenu
    builder
      .addCase(fetchStoreMenu.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStoreMenu.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentStoreMenu = action.payload;
      })
      .addCase(fetchStoreMenu.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // updateStoreMenuItem (optimistic or fulfilled replacement)
    builder
      .addCase(updateStoreMenuItem.fulfilled, (state, action) => {
        if (!state.currentStoreMenu) return;
        const updated = action.payload;
        const idx = state.currentStoreMenu.items.findIndex(
          (i) => i.id === updated.id || i.itemId === updated.itemId
        );
        if (idx !== -1) {
          state.currentStoreMenu.items[idx] = updated;
        }
        state.currentStoreMenu.unavailableCount = state.currentStoreMenu.items.filter(
          (i) => i.status !== "AVAILABLE"
        ).length;
      });

    // bulkUpdateStoreMenu
    builder
      .addCase(bulkUpdateStoreMenu.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(bulkUpdateStoreMenu.fulfilled, (state, action) => {
        state.isSubmitting = false;
        if (!state.currentStoreMenu) return;
        const updatedList = action.payload.items;
        const map = new Map(updatedList.map((item) => [item.itemId, item]));

        state.currentStoreMenu.items = state.currentStoreMenu.items.map((existing) =>
          map.has(existing.itemId) ? map.get(existing.itemId)! : existing
        );
        state.currentStoreMenu.unavailableCount = state.currentStoreMenu.items.filter(
          (i) => i.status !== "AVAILABLE"
        ).length;
      })
      .addCase(bulkUpdateStoreMenu.rejected, (state) => {
        state.isSubmitting = false;
      });

    // pushStoreMenuToDevices
    builder
      .addCase(pushStoreMenuToDevices.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(pushStoreMenuToDevices.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.pushStatus = {
          success: true,
          message: `Successfully pushed menu update to ${action.payload.pushedToDevices} store devices.`,
          timestamp: action.payload.timestamp,
        };
      })
      .addCase(pushStoreMenuToDevices.rejected, (state, action) => {
        state.isSubmitting = false;
        state.pushStatus = {
          success: false,
          message: (action.payload as string) || "Failed to push to devices",
          timestamp: new Date().toISOString(),
        };
      });
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  setFilterUnavailableOnly,
  toggleSelectItem,
  selectAllItems,
  clearSelection,
  dismissPushStatus,
} = storeMenuSlice.actions;

export default storeMenuSlice.reducer;
