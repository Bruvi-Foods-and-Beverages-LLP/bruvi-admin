import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  StoreOverride,
  BulkStoreProductOverridePayload,
} from "@/types/catalog";
import { CatalogApi } from "@/lib/api/catalog";

export type OverrideFilterTab = "ALL" | "PRICE" | "AVAILABILITY" | "EXPIRING" | "ENDED";

interface StoreOverridesState {
  overrides: StoreOverride[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  activeTab: OverrideFilterTab;
  searchQuery: string;
  isDrawerOpen: boolean;
}

const initialState: StoreOverridesState = {
  overrides: [],
  isLoading: true,
  isSubmitting: false,
  error: null,
  activeTab: "ALL",
  searchQuery: "",
  isDrawerOpen: false,
};

export const fetchStoreOverrides = createAsyncThunk(
  "storeOverrides/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await CatalogApi.getStoreOverrides();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load store overrides";
      return rejectWithValue(msg);
    }
  }
);

export const createStoreOverride = createAsyncThunk(
  "storeOverrides/create",
  async (payload: BulkStoreProductOverridePayload, { dispatch, rejectWithValue }) => {
    try {
      await CatalogApi.bulkStoreOverrides(payload);
      dispatch(fetchStoreOverrides());
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create store override";
      return rejectWithValue(msg);
    }
  }
);

export const deleteStoreOverride = createAsyncThunk(
  "storeOverrides/delete",
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      await CatalogApi.deleteStoreOverride(id);
      dispatch(fetchStoreOverrides());
      return id;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete store override";
      return rejectWithValue(msg);
    }
  }
);

export const storeOverridesSlice = createSlice({
  name: "storeOverrides",
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<OverrideFilterTab>) => {
      state.activeTab = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isDrawerOpen = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchStoreOverrides.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStoreOverrides.fulfilled, (state, action) => {
        state.isLoading = false;
        state.overrides = action.payload;
      })
      .addCase(fetchStoreOverrides.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createStoreOverride.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createStoreOverride.fulfilled, (state) => {
        state.isSubmitting = false;
        state.isDrawerOpen = false;
      })
      .addCase(createStoreOverride.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
      // Delete
      .addCase(deleteStoreOverride.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(deleteStoreOverride.fulfilled, (state) => {
        state.isSubmitting = false;
      })
      .addCase(deleteStoreOverride.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });
  },
});

export const { setActiveTab, setSearchQuery, setDrawerOpen, clearError } =
  storeOverridesSlice.actions;

export default storeOverridesSlice.reducer;
