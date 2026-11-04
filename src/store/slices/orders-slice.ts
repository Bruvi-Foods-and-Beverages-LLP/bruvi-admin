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
  isDrawerOpen: boolean;
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
  store: "All 12",
  channel: "All",
  status: "All",
  date: "Today · Fri 2 Oct",
  page: 1,
  limit: 10,
};

const initialState: OrdersState = {
  orders: [],
  selectedOrder: null,
  isDrawerOpen: false,
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  counts: {
    all: 1284,
    live: 41,
    delayed: 3,
    completed: 1222,
    refunded: 6,
    cancelled: 15,
  },
  filters: initialFilters,
  isLoading: false,
  error: null,
  updatedAt: "9:41 am",
};

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (customFilters: OrdersQueryFilters | undefined, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { orders: OrdersState };
      const mergedFilters = { ...state.orders.filters, ...customFilters };
      return await OrdersApi.getOrders(mergedFilters);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to fetch orders";
      return rejectWithValue(msg);
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await OrdersApi.getOrderById(id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : `Failed to fetch order ${id}`;
      return rejectWithValue(msg);
    }
  }
);

export const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<OrdersQueryFilters>>) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    setTab: (state, action: PayloadAction<OrderTab>) => {
      state.filters.tab = action.payload;
      state.filters.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
      state.page = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        ...initialFilters,
        tab: state.filters.tab, // preserve active tab
      };
    },
    setSelectedOrder: (state, action: PayloadAction<Order | null>) => {
      state.selectedOrder = action.payload;
      state.isDrawerOpen = action.payload !== null;
    },
    setIsDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isDrawerOpen = action.payload;
      if (!action.payload) {
        state.selectedOrder = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchOrders
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
        state.counts = action.payload.counts;
        state.updatedAt = action.payload.updatedAt;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to load orders";
      })
      // fetchOrderById
      .addCase(fetchOrderById.fulfilled, (state, action: PayloadAction<Order>) => {
        state.selectedOrder = action.payload;
        state.isDrawerOpen = true;
      });
  },
});

export const {
  setFilters,
  setTab,
  setPage,
  clearFilters,
  setSelectedOrder,
  setIsDrawerOpen,
} = ordersSlice.actions;

export default ordersSlice.reducer;

