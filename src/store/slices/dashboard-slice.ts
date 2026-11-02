import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DashboardFeed } from "@/types/dashboard";

interface DashboardState {
  feed: DashboardFeed | null;
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: string | null;
}

const initialState: DashboardState = {
  feed: null,
  isLoading: true,
  error: null,
  lastFetchedAt: null,
};

export const fetchDashboardFeed = createAsyncThunk<DashboardFeed, void, { rejectValue: string }>(
  "dashboard/fetchFeed",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/proxy/stores/dashboard", {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load dashboard: ${response.status}`);
      }

      const json = await response.json();
      return json.data || json;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch dashboard data";
      return rejectWithValue(message);
    }
  }
);

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feed = action.payload;
        state.lastFetchedAt = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchDashboardFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch dashboard data";
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;

