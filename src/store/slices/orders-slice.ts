import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  Order,
  OrdersCountSummary,
  OrdersListResponse,
  OrdersQueryFilters,
  OrderTab,
} from "@/types/orders";
import { OrdersApi } from "@/lib/api/orders";

interface OrdersState {
  orders: Order[];
  selectedOrder: Order | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  counts: OrdersCountSummary;
  filters: OrdersQueryFilters;
  isLoading: boolean;
  error: string | null;
  updatedAt: string;
}

const initialFilters: OrdersQueryFilters = {
  search: "",
  tab: "ALL",
  store: "All",
  channel: "All",
  status: "All",
  date: "Today",
  page: 1,
  limit: 10,
};

const initialState: OrdersState = {
  orders: [],
  selectedOrder: null,
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  counts: {
    all: 0,
    live: 0,
    delayed: 0,
    completed: 0,
    refunded: 0,
    cancelled: 0,
  },
  filters: initialFilters,
  isLoading: false,
  error: null,
  updatedAt: "Just now",
};

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (customFilters: Partial<OrdersQueryFilters> | undefined, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { orders: OrdersState };
      const mergedFilters = customFilters
        ? { ...state.orders.filters, ...customFilters }
        : state.orders.filters;
      const response = await OrdersApi.getOrders(mergedFilters);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch orders");
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (id: string, { rejectWithValue }) => {
    try {
      const order = await OrdersApi.getOrderById(id);
      return order;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch order");
    }
  }
);

export const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setTab: (state, action: PayloadAction<OrderTab>) => {
      state.filters.tab = action.payload;
      state.filters.page = 1;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      state.filters.page = 1;
    },
    setStoreFilter: (state, action: PayloadAction<string>) => {
      state.filters.store = action.payload;
      state.filters.page = 1;
    },
    setChannelFilter: (state, action: PayloadAction<string>) => {
      state.filters.channel = action.payload;
      state.filters.page = 1;
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.filters.status = action.payload;
      state.filters.page = 1;
    },
    setDateFilter: (state, action: PayloadAction<string>) => {
      state.filters.date = action.payload;
      state.filters.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<OrdersQueryFilters>>) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    clearFilters: (state) => {
      state.filters = initialFilters;
    },
    resetFilters: (state) => {
      state.filters = initialFilters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<OrdersListResponse>) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
        state.counts = {
          all: action.payload.counts?.all ?? (action.payload.counts as any)?.total ?? 0,
          live: action.payload.counts?.live ?? 0,
          delayed: action.payload.counts?.delayed ?? 0,
          completed: action.payload.counts?.completed ?? 0,
          refunded: action.payload.counts?.refunded ?? 0,
          cancelled: action.payload.counts?.cancelled ?? 0,
        };
        state.updatedAt = action.payload.updatedAt;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action: PayloadAction<Order>) => {
        state.isLoading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setTab,
  setSearch,
  setStoreFilter,
  setChannelFilter,
  setStatusFilter,
  setDateFilter,
  setPage,
  setFilters,
  clearFilters,
  resetFilters,
} = ordersSlice.actions;

export default ordersSlice.reducer;
