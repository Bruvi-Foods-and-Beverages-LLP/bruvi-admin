import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface StoreEntity {
  id: string;
  name: string;
  code: string;
  type: "Flagship" | "Express" | "Kiosk" | "Roastery" | string;
  cityId?: string;
  cityName?: string;
  city: string;
  state?: string;
  postalCode?: string;
  addressLine1?: string;
  addressLine2?: string | null;
  latitude?: number;
  longitude?: number;
  geofenceRadiusMeters?: number;
  phone?: string;
  email?: string;
  gstin?: string;
  fssaiLicenceNo?: string;
  openDate?: string;
  isOpen?: boolean;
  isActive?: boolean;
  manager: string;
  hours: string;
  status: "Open" | "Busy mode" | "Closed" | "Needs attention" | string;
  statusDetail?: string;
  salesToday: number;
  rating: number;
  reviewCount?: number;
  /** Free-form outlet metadata; holds the customer-app profile (prepMinutes, publicPhone, heroImageUrl, amenities) */
  metadata?: Record<string, unknown>;
  /** ISO timestamp of the last saved change */
  updatedAt?: string;
}

export interface StoreOverviewMetrics {
  store: StoreEntity;
  kpi: {
    netSalesToday: number;
    netSalesChangePercent: number;
    netSalesRank: string;
    ordersCount: number;
    aov: number;
    queueCount: number;
    avgMakeTimeMinutes: number;
    makeTimeFormatted: string;
    makeTimeTargetFormatted: string;
    makeTimeDiffFormatted: string;
    rating: number;
    reviewCount: number;
  };
  hourlySales: {
    hour: string;
    hourNumber: number;
    actualSales: number;
    forecastSales: number;
  }[];
  peakHour: string;
  peakSales: number;
  channelBreakdown: {
    counter: { count: number; sales: number };
    appPickup: { count: number; sales: number };
    kiosk: { count: number; sales: number };
    dineInQr: { count: number; sales: number };
  };
  liveChannels: {
    counter: { status: "ONLINE" | "BUSY" | "OFFLINE" | string; detail: string };
    appPickup: { status: "ONLINE" | "PAUSED" | "OFFLINE" | string; detail: string };
    kiosk: { status: "ONLINE" | "OFFLINE" | string; detail: string };
    dineInQr: { status: "ONLINE" | "OFFLINE" | string; detail: string };
    bruviDelivery: { status: "ONLINE" | "OFFLINE" | string; detail: string };
    partnerDelivery: { status: "ONLINE" | "OFFLINE" | string; detail: string };
    updatedAt: string;
  };
  recentIssues: {
    id: string;
    title: string;
    subtitle: string;
    severity: "error" | "warning" | "info";
    status: "Open" | "In progress" | "Resolved";
  }[];
}

interface StoresState {
  stores: StoreEntity[];
  currentStoreOverview: StoreOverviewMetrics | null;
  /** Lean copy of one store for the edit form (no sales or chart queries) */
  editStore: StoreEntity | null;
  isEditLoading: boolean;
  editError: string | null;
  isLoading: boolean;
  isOverviewLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  overviewError: string | null;
  searchQuery: string;
  selectedCityFilter: string;
  selectedStatusFilter: string;
}

const initialState: StoresState = {
  stores: [],
  currentStoreOverview: null,
  editStore: null,
  isEditLoading: true,
  editError: null,
  isLoading: true,
  isOverviewLoading: true,
  isSubmitting: false,
  error: null,
  overviewError: null,
  searchQuery: "",
  selectedCityFilter: "All",
  selectedStatusFilter: "All",
};

/** Maps one store payload from the API into the admin's store shape. Missing values stay empty. */
export function mapStoreFromApi(s: Record<string, unknown>): StoreEntity {
  const num = (v: unknown): number | undefined => {
    const n = Number(v);
    return v === null || v === undefined || v === "" || !Number.isFinite(n) ? undefined : n;
  };
  const status = s.status;
  return {
    id: String(s.id || ""),
    name: String(s.name || ""),
    code: String(s.code || ""),
    type: (s.format as string) || "Flagship",
    cityId: (s.cityId || s.city_id) as string | undefined,
    cityName: String(s.cityName || s.city || ""),
    city: String(s.cityName || s.city || ""),
    state: String(s.state || ""),
    postalCode: String(s.postalCode || s.postal_code || ""),
    addressLine1: String(s.addressLine1 || s.address_line1 || ""),
    addressLine2: (s.addressLine2 || s.address_line2 || null) as string | null,
    latitude: num(s.latitude),
    longitude: num(s.longitude),
    geofenceRadiusMeters: num(s.geofenceRadiusMeters) ?? 50,
    phone: String(s.phone || ""),
    email: String(s.email || ""),
    gstin: String(s.gstin || ""),
    fssaiLicenceNo: String(s.fssaiLicenceNo || s.fssai_licence_no || ""),
    openDate: String(s.openDate || s.open_date || ""),
    metadata: s.metadata && typeof s.metadata === "object" ? (s.metadata as Record<string, unknown>) : {},
    isOpen: (s.isOpen as boolean) ?? (status === "OPEN" || status === "BUSY"),
    isActive: (s.isActive as boolean) ?? true,
    manager: String(s.managerName || s.manager || ""),
    hours: String(s.hours || "Hours not set"),
    // The label follows the real status; a stale free-text note ("Open") must never override it
    status:
      status === "OPEN"
        ? "Open"
        : status === "BUSY"
        ? "Busy mode"
        : status === "NEEDS_ATTENTION"
        ? "Needs attention"
        : status === "CLOSED"
        ? "Closed"
        : status === "DRAFT"
        ? "Draft"
        : String(s.statusDetail || "Open"),
    statusDetail: String(
      status === "OPEN" || !status
        ? s.statusDetail || "Open"
        : String(s.statusDetail || "").toLowerCase() === "open" || !s.statusDetail
        ? String(status).charAt(0) + String(status).slice(1).toLowerCase().replace("_", " ")
        : s.statusDetail,
    ),
    salesToday: Number(s.salesToday || s.sales_today || 0),
    rating: Number(s.rating) || 0,
    updatedAt: s.updatedAt ? String(s.updatedAt) : undefined,
  };
}

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
      const mapped: StoreEntity[] = rawStores.map((rawItem: unknown) =>
        mapStoreFromApi(rawItem as Record<string, unknown>)
      );
      return mapped;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Unable to reach store API"
      );
    }
  }
);

/**
 * Async Thunk to fetch detailed store overview and metrics by ID or Code
 */
export const fetchStoreOverview = createAsyncThunk(
  "stores/fetchStoreOverview",
  async (idOrCode: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/proxy/stores/${encodeURIComponent(idOrCode)}/overview`);
      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        return rejectWithValue(errorJson.message || `Store '${idOrCode}' not found`);
      }
      const json = await res.json();
      const data = json?.data || json;
      const s = data.store || {};

      const mappedStore: StoreEntity = {
        ...mapStoreFromApi(s),
        reviewCount: data.kpi?.reviewCount || 0,
      };

      const overview: StoreOverviewMetrics = {
        store: mappedStore,
        kpi: data.kpi || {
          netSalesToday: 0,
          netSalesChangePercent: 0,
          netSalesRank: "No sales yet",
          ordersCount: 0,
          aov: 0,
          queueCount: 0,
          avgMakeTimeMinutes: 0,
          makeTimeFormatted: "--",
          makeTimeTargetFormatted: "4:30",
          makeTimeDiffFormatted: "Target: 4:30",
          rating: 0,
          reviewCount: 0,
        },
        hourlySales: data.hourlySales || [],
        peakHour: data.peakHour || "None",
        peakSales: data.peakSales || 0,
        channelBreakdown: data.channelBreakdown || {
          counter: { count: 0, sales: 0 },
          appPickup: { count: 0, sales: 0 },
          kiosk: { count: 0, sales: 0 },
          dineInQr: { count: 0, sales: 0 },
        },
        liveChannels: data.liveChannels || {
          counter: { status: "OFFLINE", detail: "Not set up yet" },
          appPickup: { status: "OFFLINE", detail: "Unavailable" },
          kiosk: { status: "OFFLINE", detail: "Not set up yet" },
          dineInQr: { status: "OFFLINE", detail: "Not set up yet" },
          bruviDelivery: { status: "OFFLINE", detail: "Not set up yet" },
          partnerDelivery: { status: "OFFLINE", detail: "Not set up yet" },
          updatedAt: "",
        },
        recentIssues: data.recentIssues || [],
      };

      return overview;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Unable to reach store overview API"
      );
    }
  }
);

/**
 * Fetches just the store record for the edit form. The overview endpoint also computes live sales,
 * hourly charts and ranking, none of which the form needs.
 */
export const fetchStoreForEdit = createAsyncThunk(
  "stores/fetchStoreForEdit",
  async (idOrCode: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/proxy/stores/${encodeURIComponent(idOrCode)}`);
      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        return rejectWithValue(errorJson.message || `Store '${idOrCode}' not found`);
      }
      const json = await res.json();
      return mapStoreFromApi((json?.data || json) as Record<string, unknown>);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Unable to reach store API");
    }
  }
);

/**
 * Async Thunk to create a new store in the central backend API
 */
export const createStoreThunk = createAsyncThunk(
  "stores/createStore",
  async (storePayload: Record<string, unknown>, { rejectWithValue }) => {
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
        cityName: created.cityName || created.city || storePayload.cityName,
        city: created.cityName || created.city || storePayload.cityName,
        state: created.state || storePayload.state || "",
        postalCode: created.postalCode || storePayload.postalCode || "",
        addressLine1: created.addressLine1 || storePayload.addressLine1 || "",
        addressLine2: created.addressLine2 || storePayload.addressLine2 || null,
        latitude: created.latitude || storePayload.latitude,
        longitude: created.longitude || storePayload.longitude,
        geofenceRadiusMeters: created.geofenceRadiusMeters || 50,
        phone: created.phone || storePayload.phone || "",
        email: created.email || storePayload.email || "",
        gstin: created.gstin || storePayload.gstin || "",
        manager: created.managerName || storePayload.managerName || "",
        hours: created.hours || "Hours not set",
        status: "Open",
        statusDetail: "Open",
        salesToday: 0,
        rating: 0,
      };

      return mapped;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Network error creating store"
      );
    }
  }
);

/**
 * Async Thunk to update an existing store via PATCH /api/proxy/stores/:id
 */
export const updateStoreThunk = createAsyncThunk(
  "stores/updateStore",
  async (
    { id, payload }: { id: string; payload: Record<string, unknown> },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(`/api/proxy/stores/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseJson = await res.json().catch(() => null);

      if (!res.ok) {
        return rejectWithValue(
          responseJson?.message || responseJson || "Failed to update store"
        );
      }

      const updated = responseJson?.data || responseJson;
      return updated;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Network error updating store"
      );
    }
  }
);

/**
 * Async Thunk to delete or archive a store via DELETE /api/proxy/stores/:id
 */
export const deleteStoreThunk = createAsyncThunk(
  "stores/deleteStore",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/proxy/stores/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      const responseJson = await res.json().catch(() => null);

      if (!res.ok) {
        return rejectWithValue(
          responseJson?.message || responseJson || "Failed to delete store"
        );
      }

      return id;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Network error deleting store"
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
      // Background refreshes keep the current rows on screen instead of flashing a skeleton
      if (state.stores.length === 0) state.isLoading = true;
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

    // fetchStoreOverview
    builder.addCase(fetchStoreOverview.pending, (state, action) => {
      const current = state.currentStoreOverview?.store;
      const isSameStore =
        current && [current.id, current.code].includes(action.meta.arg);
      if (!isSameStore) state.isOverviewLoading = true;
      state.overviewError = null;
    });
    builder.addCase(fetchStoreOverview.fulfilled, (state, action) => {
      state.isOverviewLoading = false;
      state.currentStoreOverview = action.payload;
      state.overviewError = null;
    });
    builder.addCase(fetchStoreOverview.rejected, (state, action) => {
      state.isOverviewLoading = false;
      state.overviewError = (action.payload as string) || "Failed to load store overview";
    });

    // fetchStoreForEdit
    builder.addCase(fetchStoreForEdit.pending, (state, action) => {
      const current = state.editStore;
      if (!current || ![current.id, current.code].includes(action.meta.arg)) {
        state.editStore = null;
        state.isEditLoading = true;
      }
      state.editError = null;
    });
    builder.addCase(fetchStoreForEdit.fulfilled, (state, action) => {
      state.isEditLoading = false;
      state.editStore = action.payload;
    });
    builder.addCase(fetchStoreForEdit.rejected, (state, action) => {
      state.isEditLoading = false;
      state.editError = (action.payload as string) || "Failed to load store";
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

    // updateStoreThunk
    builder.addCase(updateStoreThunk.pending, (state) => {
      state.isSubmitting = true;
      state.error = null;
    });
    builder.addCase(updateStoreThunk.fulfilled, (state, action) => {
      state.isSubmitting = false;
      const saved = mapStoreFromApi(action.payload as Record<string, unknown>);
      // Keep list-only live figures (sales, hours label, rating) that the save response doesn't carry
      const merge = (prev: StoreEntity): StoreEntity => ({
        ...prev,
        ...saved,
        hours: prev.hours,
        salesToday: prev.salesToday,
        rating: prev.rating,
        reviewCount: prev.reviewCount,
      });
      const idx = state.stores.findIndex((s) => s.id === saved.id);
      if (idx !== -1) state.stores[idx] = merge(state.stores[idx]);
      if (state.currentStoreOverview?.store.id === saved.id) {
        state.currentStoreOverview.store = merge(state.currentStoreOverview.store);
      }
      if (state.editStore?.id === saved.id) state.editStore = merge(state.editStore);
      state.error = null;
    });
    builder.addCase(updateStoreThunk.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = typeof action.payload === "string" ? action.payload : "Error updating store";
    });

    // deleteStoreThunk
    builder.addCase(deleteStoreThunk.pending, (state) => {
      state.isSubmitting = true;
      state.error = null;
    });
    builder.addCase(deleteStoreThunk.fulfilled, (state, action) => {
      state.isSubmitting = false;
      state.stores = state.stores.filter((s) => s.id !== action.payload);
      if (state.currentStoreOverview && state.currentStoreOverview.store.id === action.payload) {
        state.currentStoreOverview = null;
      }
      state.error = null;
    });
    builder.addCase(deleteStoreThunk.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = typeof action.payload === "string" ? action.payload : "Error deleting store";
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
