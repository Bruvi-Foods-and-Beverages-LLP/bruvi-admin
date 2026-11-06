import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  StoreHoursEntity,
  DayOfWeek,
  UpdateStoreHoursPayload,
  AddSpecialDatePayload,
} from "@/types/store-hours";

function parseTimeToMinutes(timeStr: string): number {
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3].toLowerCase();

  if (meridiem === "pm" && hours !== 12) {
    hours += 12;
  } else if (meridiem === "am" && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}

function calculateTotalDuration(opens: string, closes: string): string {
  const openMins = parseTimeToMinutes(opens);
  const closeMins = parseTimeToMinutes(closes);
  let diff = closeMins - openMins;
  if (diff < 0) {
    diff += 24 * 60; // Crosses midnight
  }

  const h = Math.floor(diff / 60);
  const m = diff % 60;

  if (m === 0) {
    return `${h} h`;
  }
  return `${h} h ${m} m`;
}

interface StoreHoursState {
  currentStoreHours: StoreHoursEntity | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  isDirty: boolean;
  saveError: string | null;
  copyModalOpen: boolean;
  addSpecialDateModalOpen: boolean;
}

const initialState: StoreHoursState = {
  currentStoreHours: null,
  isLoading: true,
  isSaving: false,
  error: null,
  isDirty: false,
  saveError: null,
  copyModalOpen: false,
  addSpecialDateModalOpen: false,
};

export const fetchStoreHours = createAsyncThunk(
  "storeHours/fetchStoreHours",
  async (idOrCode: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/proxy/stores/${encodeURIComponent(idOrCode)}/hours`);
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        return rejectWithValue(errJson.message || `Failed to fetch hours for store '${idOrCode}'`);
      }
      const json = await res.json();
      return (json.data || json) as StoreHoursEntity;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Unable to reach hours service");
    }
  }
);

export const saveStoreHours = createAsyncThunk(
  "storeHours/saveStoreHours",
  async (
    {
      storeIdOrCode,
      payload,
    }: {
      storeIdOrCode: string;
      payload: UpdateStoreHoursPayload;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(`/api/proxy/stores/${encodeURIComponent(storeIdOrCode)}/hours`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        return rejectWithValue(errJson.message || `Failed to update hours for store '${storeIdOrCode}'`);
      }
      const json = await res.json();
      return (json.data || json) as StoreHoursEntity;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Unable to save hours");
    }
  }
);

export const copyHoursToStores = createAsyncThunk(
  "storeHours/copyHoursToStores",
  async (
    {
      storeIdOrCode,
      targetStoreCodes,
    }: {
      storeIdOrCode: string;
      targetStoreCodes: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(
        `/api/proxy/stores/${encodeURIComponent(storeIdOrCode)}/hours/copy-to-stores`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetStoreCodes }),
        }
      );
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        return rejectWithValue(errJson.message || "Failed to copy hours to selected stores");
      }
      return await res.json();
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Unable to copy hours");
    }
  }
);

export const addSpecialDate = createAsyncThunk(
  "storeHours/addSpecialDate",
  async (
    {
      storeIdOrCode,
      payload,
    }: {
      storeIdOrCode: string;
      payload: AddSpecialDatePayload;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(
        `/api/proxy/stores/${encodeURIComponent(storeIdOrCode)}/hours/special-dates`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        return rejectWithValue(errJson.message || "Failed to add special date");
      }
      const json = await res.json();
      return (json.data || json) as StoreHoursEntity;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Unable to add special date");
    }
  }
);

export const removeSpecialDate = createAsyncThunk(
  "storeHours/removeSpecialDate",
  async (
    { storeIdOrCode, specialDateId }: { storeIdOrCode: string; specialDateId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(
        `/api/proxy/stores/${encodeURIComponent(storeIdOrCode)}/hours/special-dates/${encodeURIComponent(specialDateId)}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        return rejectWithValue(errJson.message || "Failed to remove special date");
      }
      const json = await res.json();
      return (json.data || json) as StoreHoursEntity;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Unable to remove special date");
    }
  }
);

export const storeHoursSlice = createSlice({
  name: "storeHours",
  initialState,
  reducers: {
    setCopyModalOpen: (state, action: PayloadAction<boolean>) => {
      state.copyModalOpen = action.payload;
    },
    setAddSpecialDateModalOpen: (state, action: PayloadAction<boolean>) => {
      state.addSpecialDateModalOpen = action.payload;
    },
    toggleDayOpen: (state, action: PayloadAction<DayOfWeek>) => {
      if (!state.currentStoreHours) return;
      const day = state.currentStoreHours.weeklyHours.find((d) => d.day === action.payload);
      if (day) {
        day.isOpen = !day.isOpen;
        state.isDirty = true;
      }
    },
    updateDayHours: (
      state,
      action: PayloadAction<{ day: DayOfWeek; opens?: string; closes?: string }>
    ) => {
      if (!state.currentStoreHours) return;
      const day = state.currentStoreHours.weeklyHours.find((d) => d.day === action.payload.day);
      if (day) {
        if (action.payload.opens !== undefined) day.opens = action.payload.opens;
        if (action.payload.closes !== undefined) day.closes = action.payload.closes;
        day.totalFormatted = calculateTotalDuration(day.opens, day.closes);
        state.isDirty = true;
      }
    },
    applyMondayToAllDays: (state) => {
      if (!state.currentStoreHours) return;
      const monday = state.currentStoreHours.weeklyHours.find((d) => d.day === "Monday");
      if (!monday) return;
      state.currentStoreHours.weeklyHours.forEach((d) => {
        d.isOpen = monday.isOpen;
        d.opens = monday.opens;
        d.closes = monday.closes;
        d.totalFormatted = monday.totalFormatted;
      });
      state.isDirty = true;
    },
    updateChannelCutoff: (
      state,
      action: PayloadAction<{ channelId: string; minutes: number }>
    ) => {
      if (!state.currentStoreHours) return;
      const ch = state.currentStoreHours.channelHours.find((c) => c.channelId === action.payload.channelId);
      if (ch) {
        ch.cutoffMinutesBeforeClose = action.payload.minutes;
        state.isDirty = true;
      }
    },
    clearSaveError: (state) => {
      state.saveError = null;
    },
    updateTimezone: (state, action: PayloadAction<{ timezone: string; label: string }>) => {
      if (!state.currentStoreHours) return;
      state.currentStoreHours.timezone = action.payload.timezone;
      state.currentStoreHours.timezoneLabel = action.payload.label;
      state.isDirty = true;
    },
    resetDirty: (state) => {
      state.isDirty = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch
    builder.addCase(fetchStoreHours.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchStoreHours.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentStoreHours = action.payload;
      state.isDirty = false;
    });
    builder.addCase(fetchStoreHours.rejected, (state, action) => {
      state.isLoading = false;
      state.error = (action.payload as string) || "Failed to load store hours";
    });

    // Save
    builder.addCase(saveStoreHours.pending, (state) => {
      state.isSaving = true;
      state.saveError = null;
    });
    builder.addCase(saveStoreHours.fulfilled, (state, action) => {
      state.isSaving = false;
      state.currentStoreHours = action.payload;
      state.isDirty = false;
    });
    builder.addCase(saveStoreHours.rejected, (state, action) => {
      state.isSaving = false;
      state.saveError = (action.payload as string) || "Failed to save store hours";
    });

    // Add Special Date
    builder.addCase(addSpecialDate.pending, (state) => {
      state.saveError = null;
    });
    builder.addCase(addSpecialDate.fulfilled, (state, action) => {
      // Take only the special dates from the server so unsaved weekly edits survive.
      if (state.currentStoreHours) state.currentStoreHours.specialDates = action.payload.specialDates;
      else state.currentStoreHours = action.payload;
      state.addSpecialDateModalOpen = false;
    });
    builder.addCase(addSpecialDate.rejected, (state, action) => {
      state.saveError = (action.payload as string) || "Failed to add special date";
    });
    builder.addCase(removeSpecialDate.fulfilled, (state, action) => {
      if (state.currentStoreHours) state.currentStoreHours.specialDates = action.payload.specialDates;
    });
    builder.addCase(removeSpecialDate.rejected, (state, action) => {
      state.saveError = (action.payload as string) || "Failed to remove special date";
    });
  },
});

export const {
  setCopyModalOpen,
  setAddSpecialDateModalOpen,
  toggleDayOpen,
  updateDayHours,
  applyMondayToAllDays,
  updateChannelCutoff,
  clearSaveError,
  updateTimezone,
  resetDirty,
} = storeHoursSlice.actions;

export default storeHoursSlice.reducer;

