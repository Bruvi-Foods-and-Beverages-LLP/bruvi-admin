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
  isLoading: true,
  isOverviewLoading: true,
  isSubmitting: false,
  error: null,
  overviewError: null,
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
      const mapped: StoreEntity[] = rawStores.map((rawItem: unknown) => {
        const s = rawItem as Record<string, unknown>;
        return {
          id: String(s.id || ""),
          name: String(s.name || ""),
          code: String(s.code || ""),
          type: (s.format as string) || "Flagship",
          cityId: (s.cityId || s.city_id) as string | undefined,
          cityName: String(s.cityName || s.city || ""),
          city: String(s.cityName || s.city || ""),
          state: (s.state as string) || "Karnataka",
          postalCode: String(s.postalCode || s.postal_code || ""),
          addressLine1: String(s.addressLine1 || s.address_line1 || ""),
          addressLine2: (s.addressLine2 || s.address_line2 || null) as string | null,
          latitude: s.latitude ? Number(s.latitude) : undefined,
          longitude: s.longitude ? Number(s.longitude) : undefined,
          geofenceRadiusMeters: Number(s.geofenceRadiusMeters || 50),
          phone: String(s.phone || ""),
          email: String(s.email || ""),
          gstin: String(s.gstin || ""),
          fssaiLicenceNo: String(s.fssaiLicenceNo || s.fssai_licence_no || ""),
          openDate: String(s.openDate || s.open_date || ""),
          isOpen: (s.isOpen as boolean) ?? (s.status === "OPEN" || s.status === "BUSY"),
          isActive: (s.isActive as boolean) ?? true,
          manager: String(s.managerName || s.manager || "Lead Barista (TBD)"),
          hours: String(s.hours || "7:00 am – 11:00 pm"),
          status:
            s.status === "OPEN"
              ? "Open"
              : s.status === "BUSY"
              ? "Busy mode"
              : s.status === "NEEDS_ATTENTION"
              ? "Needs attention"
              : String(s.statusDetail || "Open"),
          statusDetail: String(s.statusDetail || (s.status === "OPEN" ? "Open" : s.status || "Open")),
          salesToday: Number(s.salesToday || s.sales_today || 0),
          rating: Number(s.rating || 5.0),
        };
      });
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
        id: s.id,
        name: s.name,
        code: s.code,
        type: s.format || "Flagship",
        cityId: s.cityId || s.city_id,
        cityName: s.cityName || s.city || "",
        city: s.cityName || s.city || "",
        state: s.state || "Karnataka",
        postalCode: s.postalCode || s.postal_code || "",
        addressLine1: s.addressLine1 || s.address_line1 || "",
        addressLine2: s.addressLine2 || s.address_line2 || null,
        latitude: s.latitude ? Number(s.latitude) : 12.9784,
        longitude: s.longitude ? Number(s.longitude) : 77.6408,
        geofenceRadiusMeters: s.geofenceRadiusMeters || 50,
        phone: s.phone || "",
        email: s.email || "",
        gstin: s.gstin || "",
        fssaiLicenceNo: s.fssaiLicenceNo || s.fssai_licence_no || "",
        openDate: s.openDate || s.open_date || "",
        metadata: s.metadata && typeof s.metadata === "object" ? (s.metadata as Record<string, unknown>) : {},
        isOpen: s.isOpen ?? (s.status === "OPEN" || s.status === "BUSY"),
        isActive: s.isActive ?? true,
        manager: s.managerName || s.manager || "Lead Barista (TBD)",
        hours: s.hours || "7:00 am – 11:00 pm",
        status:
          s.status === "OPEN"
            ? "Open"
            : s.status === "BUSY"
            ? "Busy mode"
            : s.status === "NEEDS_ATTENTION"
            ? "Needs attention"
            : s.statusDetail || "Open",
        statusDetail: s.statusDetail || "Open",
        salesToday: Number(s.salesToday || s.sales_today || 0),
        rating: Number(s.rating || 5.0),
        reviewCount: data.kpi?.reviewCount || 0,
      };

      const overview: StoreOverviewMetrics = {
        store: mappedStore,
        kpi: data.kpi || {
          netSalesToday: 0,
          netSalesChangePercent: 0,
          netSalesRank: "New",
          ordersCount: 0,
          aov: 0,
          queueCount: 0,
          avgMakeTimeMinutes: 0,
          makeTimeFormatted: "--",
          makeTimeTargetFormatted: "4:30",
          makeTimeDiffFormatted: "Target: 4:30",
          rating: 5.0,
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
          counter: { status: "ONLINE", detail: "2 of 2 POS online" },
          appPickup: { status: "ONLINE", detail: "Active" },
          kiosk: { status: "ONLINE", detail: "K1 · K2 online" },
          dineInQr: { status: "ONLINE", detail: "14 tables · 3 occupied" },
          bruviDelivery: { status: "ONLINE", detail: "On · 3 out now · 8 riders" },
          partnerDelivery: { status: "OFFLINE", detail: "Off" },
          updatedAt: "Just now",
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
        state: created.state || storePayload.state || "Karnataka",
        postalCode: created.postalCode || storePayload.postalCode || "",
        addressLine1: created.addressLine1 || storePayload.addressLine1 || "",
        addressLine2: created.addressLine2 || storePayload.addressLine2 || null,
        latitude: created.latitude || storePayload.latitude,
        longitude: created.longitude || storePayload.longitude,
        geofenceRadiusMeters: created.geofenceRadiusMeters || 50,
        phone: created.phone || storePayload.phone || "",
        email: created.email || storePayload.email || "",
        gstin: created.gstin || storePayload.gstin || "",
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

    // fetchStoreOverview
    builder.addCase(fetchStoreOverview.pending, (state) => {
      state.isOverviewLoading = true;
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
      const updated = action.payload;
      const idx = state.stores.findIndex((s) => s.id === updated.id);
      if (idx !== -1) {
        state.stores[idx] = {
          ...state.stores[idx],
          name: updated.name || state.stores[idx].name,
          code: updated.code || state.stores[idx].code,
          type: updated.format || state.stores[idx].type,
          city: updated.city || updated.cityName || state.stores[idx].city,
          addressLine1: updated.addressLine1 || state.stores[idx].addressLine1,
          phone: updated.phone || state.stores[idx].phone,
          email: updated.email || state.stores[idx].email,
          manager: updated.managerName || state.stores[idx].manager,
          status: updated.status || state.stores[idx].status,
        };
      }
      if (state.currentStoreOverview && state.currentStoreOverview.store.id === updated.id) {
        state.currentStoreOverview.store = {
          ...state.currentStoreOverview.store,
          name: updated.name || state.currentStoreOverview.store.name,
          code: updated.code || state.currentStoreOverview.store.code,
          type: updated.format || state.currentStoreOverview.store.type,
          city: updated.city || updated.cityName || state.currentStoreOverview.store.city,
          addressLine1: updated.addressLine1 || state.currentStoreOverview.store.addressLine1,
          phone: updated.phone || state.currentStoreOverview.store.phone,
          email: updated.email || state.currentStoreOverview.store.email,
          manager: updated.managerName || state.currentStoreOverview.store.manager,
          status: updated.status || state.currentStoreOverview.store.status,
        };
      }
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
