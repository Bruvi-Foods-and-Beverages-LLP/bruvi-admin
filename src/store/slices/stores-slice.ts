import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface StoreEntity {
  id: string;
  name: string;
  code: string;
  type: "Flagship" | "Express" | "Kiosk" | "Roastery" | string;
  cityId?: string;
  city: string;
  manager: string;
  hours: string;
  status: "Open" | "Busy mode" | "Closed" | "Needs attention" | string;
  statusDetail?: string;
  salesToday: number;
  rating: number;
}

interface StoresState {
  stores: StoreEntity[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  searchQuery: string;
  selectedCityFilter: string;
  selectedStatusFilter: string;
}

const initialState: StoresState = {
  stores: [],
  isLoading: true,
  isSubmitting: false,
  error: null,
  searchQuery: "",
  selectedCityFilter: "All",
  selectedStatusFilter: "All",
};

/**
 * Async Thunk to fetch live stores from the central backend API
 */
export const fetchStores = createAsyncThunk(
  "stores/fetchStores",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/proxy/stores?limit=100");
      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        return rejectWithValue(errorJson.message || "Failed to load stores");
      }
      const json = await res.json();
      const rawStores = json?.data?.data || json?.data || [];
      const mapped: StoreEntity[] = rawStores.map((s: any) => ({
        id: s.id,
        name: s.name,
        code: s.code,
        type: s.format || "Flagship",
        cityId: s.cityId || s.city_id,
        city: s.cityName || s.city || "",
        manager: s.managerName || "Lead Barista (TBD)",
        hours: s.hours || "7:00 am – 11:00 pm",
        status:
          s.status === "OPEN"
            ? "Open"
            : s.status === "BUSY"
            ? "Busy mode"
            : s.status === "NEEDS_ATTENTION"
            ? "Needs attention"
            : s.statusDetail || "Open",
        statusDetail: s.statusDetail || (s.status === "OPEN" ? "Open" : s.status),
        salesToday: Number(s.salesToday || s.sales_today || 0),
        rating: Number(s.rating || 5.0),
      }));
      return mapped;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Unable to reach store API"
      );
    }
  }
);

/**
 * Async Thunk to create a new store in the central backend API
 */
export const createStoreThunk = createAsyncThunk(
  "stores/createStore",
  async (storePayload: any, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/proxy/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storePayload),
      });

      const responseJson = await res.json().catch(() => null);

      if (!res.ok) {
        return rejectWithValue(responseJson || "Failed to create store");
      }

      const created = responseJson?.data || responseJson;
      const mapped: StoreEntity = {
        id: created.id || `store-${Date.now()}`,
        name: created.name || storePayload.name,
        code: created.code || storePayload.code,
        type: created.format || storePayload.format || "Flagship",
        cityId: created.cityId || storePayload.cityId,
        city: created.cityName || created.city || storePayload.cityName,
        manager: created.managerName || storePayload.managerName || "Lead Barista (TBD)",
        hours: created.hours || "7:00 am – 11:00 pm",
        status: "Open",
        statusDetail: "Open",
        salesToday: 0,
        rating: 5.0,
      };

      return mapped;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Network error creating store"
      );
    }
  }
);

export const storesSlice = createSlice({
  name: "stores",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCityFilter: (state, action: PayloadAction<string>) => {
      state.selectedCityFilter = action.payload;
    },
    setSelectedStatusFilter: (state, action: PayloadAction<string>) => {
      state.selectedStatusFilter = action.payload;
    },
    addStoreLocally: (state, action: PayloadAction<StoreEntity>) => {
      const exists = state.stores.some((s) => s.id === action.payload.id);
      if (!exists) {
        state.stores.unshift(action.payload);
      }
    },
    resetStoreFilters: (state) => {
      state.searchQuery = "";
      state.selectedCityFilter = "All";
      state.selectedStatusFilter = "All";
    },
  },
  extraReducers: (builder) => {
    // fetchStores
    builder.addCase(fetchStores.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchStores.fulfilled, (state, action) => {
      state.isLoading = false;
      state.stores = action.payload;
      state.error = null;
    });
    builder.addCase(fetchStores.rejected, (state, action) => {
      state.isLoading = false;
      state.error = (action.payload as string) || "Failed to load stores";
    });

    // createStoreThunk
    builder.addCase(createStoreThunk.pending, (state) => {
      state.isSubmitting = true;
      state.error = null;
    });
    builder.addCase(createStoreThunk.fulfilled, (state, action) => {
      state.isSubmitting = false;
      state.stores.unshift(action.payload);
      state.error = null;
    });
    builder.addCase(createStoreThunk.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = typeof action.payload === "string" ? action.payload : "Error creating store";
    });
  },
});

export const {
  setSearchQuery,
  setSelectedCityFilter,
  setSelectedStatusFilter,
  addStoreLocally,
  resetStoreFilters,
} = storesSlice.actions;

export default storesSlice.reducer;

