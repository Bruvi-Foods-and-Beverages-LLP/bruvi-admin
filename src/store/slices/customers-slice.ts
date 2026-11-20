import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  CustomerListItem,
  CustomersQueryFilters,
  CustomersStats,
  CustomersSegments,
  CustomerOverviewDetail,
  CustomerOrdersDetail,
  CustomerWalletDetail,
  CustomerLoyaltyDetail,
} from "@/types/customers";
import { CustomersApi } from "@/lib/api/customers";

interface CustomersState {
  customers: CustomerListItem[];
  stats: CustomersStats | null;
  segments: CustomersSegments | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: CustomersQueryFilters;
  isLoading: boolean;
  error: string | null;
  selectedCustomerIds: string[];

  // Customer Detail State
  currentCustomerOverview: CustomerOverviewDetail | null;
  ordersDetail: CustomerOrdersDetail | null;
  walletDetail: CustomerWalletDetail | null;
  loyaltyDetail: CustomerLoyaltyDetail | null;
  isDetailLoading: boolean;
  detailError: string | null;
}

const initialFilters: CustomersQueryFilters = {
  q: "",
  segment: "all",
  tier: "Any",
  page: 1,
  limit: 10,
};

const initialState: CustomersState = {
  customers: [],
  stats: null,
  segments: null,
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  filters: initialFilters,
  isLoading: false,
  error: null,
  selectedCustomerIds: [],

  currentCustomerOverview: null,
  ordersDetail: null,
  walletDetail: null,
  loyaltyDetail: null,
  isDetailLoading: false,
  detailError: null,
};

export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async (customFilters: Partial<CustomersQueryFilters> | undefined, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as any).customers as CustomersState;
      const mergedFilters: CustomersQueryFilters = {
        ...state.filters,
        ...(customFilters || {}),
      };

      const res = await CustomersApi.getCustomers(mergedFilters);
      return { response: res, filters: mergedFilters };
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to load customers intelligence stream");
    }
  }
);

export const fetchCustomerOverview = createAsyncThunk(
  "customers/fetchCustomerOverview",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await CustomersApi.getCustomerDetail(id);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to load customer profile");
    }
  }
);

export const fetchCustomerOrders = createAsyncThunk(
  "customers/fetchCustomerOrders",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await CustomersApi.getCustomerOrders(id);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to load customer orders");
    }
  }
);

export const fetchCustomerWallet = createAsyncThunk(
  "customers/fetchCustomerWallet",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await CustomersApi.getCustomerWallet(id);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to load customer wallet");
    }
  }
);

export const fetchCustomerLoyalty = createAsyncThunk(
  "customers/fetchCustomerLoyalty",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await CustomersApi.getCustomerLoyalty(id);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to load customer loyalty");
    }
  }
);

export const addCustomerPointsAction = createAsyncThunk(
  "customers/addPoints",
  async ({ id, points, reason, note }: { id: string; points: number; reason: string; note?: string }, { dispatch, rejectWithValue }) => {
    try {
      await CustomersApi.addPoints(id, { points, reason, note });
      dispatch(fetchCustomerOverview(id));
      dispatch(fetchCustomerLoyalty(id));
      return { points, reason };
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to add points");
    }
  }
);

export const adjustCustomerWalletAction = createAsyncThunk(
  "customers/adjustWallet",
  async ({ id, amount, type, reason }: { id: string; amount: number; type: "credit" | "debit"; reason: string }, { dispatch, rejectWithValue }) => {
    try {
      await CustomersApi.adjustWallet(id, { amount, type, reason });
      dispatch(fetchCustomerOverview(id));
      dispatch(fetchCustomerWallet(id));
      return { amount, type, reason };
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to adjust wallet balance");
    }
  }
);

export const issueCustomerCouponAction = createAsyncThunk(
  "customers/issueCoupon",
  async ({ id, couponType, note }: { id: string; couponType: string; note?: string }, { rejectWithValue }) => {
    try {
      const res = await CustomersApi.issueCoupon(id, { couponType, note });
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to issue coupon");
    }
  }
);

export const sendCustomerMessageAction = createAsyncThunk(
  "customers/sendMessage",
  async ({ id, channel, message }: { id: string; channel: "push" | "whatsapp" | "sms"; message: string }, { rejectWithValue }) => {
    try {
      const res = await CustomersApi.sendMessage(id, { channel, message });
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to send message");
    }
  }
);

export const addCustomerNoteAction = createAsyncThunk(
  "customers/addNote",
  async ({ id, content }: { id: string; content: string }, { dispatch, rejectWithValue }) => {
    try {
      await CustomersApi.addCustomerNote(id, { content });
      dispatch(fetchCustomerOverview(id));
      return { content };
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to save note");
    }
  }
);

export const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    setFilter<K extends keyof CustomersQueryFilters>(
      state: CustomersState,
      action: PayloadAction<{
        key: K;
        value: CustomersQueryFilters[K];
      }>
    ) {
      (state.filters as any)[action.payload.key] = action.payload.value;
      if (action.payload.key !== "page") {
        state.filters.page = 1;
      }
    },
    resetFilters(state) {
      state.filters = { ...initialFilters, limit: state.filters.limit };
    },
    setLimit(state, action: PayloadAction<number>) {
      state.filters.limit = action.payload;
      state.filters.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.filters.page = action.payload;
    },
    toggleSelectAll(state) {
      if (state.selectedCustomerIds.length === state.customers.length) {
        state.selectedCustomerIds = [];
      } else {
        state.selectedCustomerIds = state.customers.map((c) => c.id);
      }
    },
    toggleSelectCustomer(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.selectedCustomerIds.includes(id)) {
        state.selectedCustomerIds = state.selectedCustomerIds.filter((cid) => cid !== id);
      } else {
        state.selectedCustomerIds.push(id);
      }
    },
    clearCurrentCustomer(state) {
      state.currentCustomerOverview = null;
      state.ordersDetail = null;
      state.walletDetail = null;
      state.loyaltyDetail = null;
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // List
      .addCase(fetchCustomers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = action.payload.response.items || [];
        state.stats = action.payload.response.stats;
        state.segments = action.payload.response.segments;
        state.total = action.payload.response.total;
        state.page = action.payload.response.page;
        state.limit = action.payload.response.limit;
        state.totalPages = action.payload.response.totalPages;
        state.filters = action.payload.filters;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Detail Overview
      .addCase(fetchCustomerOverview.pending, (state) => {
        state.isDetailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchCustomerOverview.fulfilled, (state, action) => {
        state.isDetailLoading = false;
        state.currentCustomerOverview = action.payload;
      })
      .addCase(fetchCustomerOverview.rejected, (state, action) => {
        state.isDetailLoading = false;
        state.detailError = action.payload as string;
      })
      // Orders
      .addCase(fetchCustomerOrders.fulfilled, (state, action) => {
        state.ordersDetail = action.payload;
      })
      // Wallet
      .addCase(fetchCustomerWallet.fulfilled, (state, action) => {
        state.walletDetail = action.payload;
      })
      // Loyalty
      .addCase(fetchCustomerLoyalty.fulfilled, (state, action) => {
        state.loyaltyDetail = action.payload;
      });
  },
});

export const {
  setFilter,
  resetFilters,
  setPage,
  setLimit,
  toggleSelectAll,
  toggleSelectCustomer,
  clearCurrentCustomer,
} = customersSlice.actions;

export default customersSlice.reducer;

