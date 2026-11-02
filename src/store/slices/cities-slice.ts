import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface CityEntity {
  id: string;
  name: string;
  code: string;
  state: string;
  country?: string;
  timezone?: string;
  latitude?: number | null;
  longitude?: number | null;
  defaultGeofenceRadiusMeters?: number;
  isActive?: boolean;
}

interface CitiesState {
  cities: CityEntity[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: CitiesState = {
  cities: [],
  isLoading: true,
  isSubmitting: false,
  error: null,
};

/**
 * Async Thunk to fetch live cities from the central backend API
 */
export const fetchCities = createAsyncThunk(
  "cities/fetchCities",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/proxy/cities?limit=100&isActive=true");
      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        return rejectWithValue(errorJson.message || "Failed to load cities");
      }
      const json = await res.json();
      const rawCities = json?.data?.data || json?.data || [];
      const mapped: CityEntity[] = rawCities.map((c: Record<string, unknown>) => ({
        id: String(c.id || ""),
        name: String(c.name || ""),
        code: String(c.code || ""),
        state: String(c.state || ""),
        country: String(c.country || "IN"),
        timezone: String(c.timezone || "Asia/Kolkata"),
        latitude: c.latitude != null ? Number(c.latitude) : null,
        longitude: c.longitude != null ? Number(c.longitude) : null,
        defaultGeofenceRadiusMeters: Number(c.defaultGeofenceRadiusMeters || 5000),
        isActive: Boolean(c.isActive ?? true),
      }));
      return mapped;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Unable to reach cities API"
      );
    }
  }
);

/**
 * Async Thunk to create a new city in the central backend API
 */
export const createCityThunk = createAsyncThunk(
  "cities/createCity",
  async (cityPayload: Record<string, unknown>, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/proxy/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cityPayload),
      });

      const responseJson = await res.json().catch(() => null);

      if (!res.ok) {
        return rejectWithValue(responseJson || "Failed to create city");
      }

      const created = responseJson?.data || responseJson;
      const mapped: CityEntity = {
        id: created.id || `city-${Date.now()}`,
        name: created.name || cityPayload.name,
        code: created.code || cityPayload.code,
        state: created.state || cityPayload.state || "",
        country: created.country || cityPayload.country || "IN",
        timezone: created.timezone || "Asia/Kolkata",
        latitude: created.latitude ?? cityPayload.latitude ?? null,
        longitude: created.longitude ?? cityPayload.longitude ?? null,
        defaultGeofenceRadiusMeters:
          created.defaultGeofenceRadiusMeters ||
          cityPayload.defaultGeofenceRadiusMeters ||
          5000,
        isActive: true,
      };

      return mapped;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Network error creating city"
      );
    }
  }
);

export const citiesSlice = createSlice({
  name: "cities",
  initialState,
  reducers: {
    addCityLocally: (state, action: PayloadAction<CityEntity>) => {
      const exists = state.cities.some(
        (c) => c.name.toLowerCase() === action.payload.name.toLowerCase()
      );
      if (!exists) {
        state.cities.push(action.payload);
        state.cities.sort((a, b) => a.name.localeCompare(b.name));
      }
    },
  },
  extraReducers: (builder) => {
    // fetchCities
    builder.addCase(fetchCities.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchCities.fulfilled, (state, action) => {
      state.isLoading = false;
      state.cities = action.payload;
      state.error = null;
    });
    builder.addCase(fetchCities.rejected, (state, action) => {
      state.isLoading = false;
      state.error = (action.payload as string) || "Failed to load cities";
    });

    // createCityThunk
    builder.addCase(createCityThunk.pending, (state) => {
      state.isSubmitting = true;
      state.error = null;
    });
    builder.addCase(createCityThunk.fulfilled, (state, action) => {
      state.isSubmitting = false;
      state.cities = [...state.cities.filter((c) => c.id !== action.payload.id), action.payload].sort(
        (a, b) => a.name.localeCompare(b.name)
      );
      state.error = null;
    });
    builder.addCase(createCityThunk.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = typeof action.payload === "string" ? action.payload : "Error creating city";
    });
  },
});

export const { addCityLocally } = citiesSlice.actions;

export default citiesSlice.reducer;

