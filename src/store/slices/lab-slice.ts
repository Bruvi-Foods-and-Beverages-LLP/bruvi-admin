import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  LabOverviewData,
  LabBatchDetailData,
  LabPerformanceData,
  CreateLabBatchPayload,
  ExtendLabBatchPayload,
  PromoteLabBatchPayload,
  CreateLabIdeaPayload,
} from "@/types/lab";
import { LabApi } from "@/lib/api/lab";

interface LabState {
  overview: LabOverviewData | null;
  selectedBatchDetail: LabBatchDetailData | null;
  performance: LabPerformanceData | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: LabState = {
  overview: null,
  selectedBatchDetail: null,
  performance: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
};

export const fetchLabOverview = createAsyncThunk(
  "lab/fetchOverview",
  async (_, { rejectWithValue }) => {
    try {
      const data = await LabApi.getOverview();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to load Lab overview");
    }
  }
);

export const fetchBatchDetail = createAsyncThunk(
  "lab/fetchBatchDetail",
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await LabApi.getBatchDetail(id);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to load batch detail");
    }
  }
);

export const fetchLabPerformance = createAsyncThunk(
  "lab/fetchPerformance",
  async (_, { rejectWithValue }) => {
    try {
      const data = await LabApi.getPerformance();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to load Lab performance");
    }
  }
);

export const createLabBatch = createAsyncThunk(
  "lab/createBatch",
  async (payload: CreateLabBatchPayload, { dispatch, rejectWithValue }) => {
    try {
      const res = await LabApi.createBatch(payload);
      dispatch(fetchLabOverview());
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to create Lab batch");
    }
  }
);

export const endBatchEarly = createAsyncThunk(
  "lab/endBatchEarly",
  async ({ id, reason }: { id: string; reason?: string }, { dispatch, rejectWithValue }) => {
    try {
      const res = await LabApi.endBatchEarly(id, reason);
      dispatch(fetchLabOverview());
      dispatch(fetchBatchDetail(id));
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to end batch early");
    }
  }
);

export const extendBatchWindow = createAsyncThunk(
  "lab/extendBatchWindow",
  async (
    { id, payload }: { id: string; payload: ExtendLabBatchPayload },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const res = await LabApi.extendBatchWindow(id, payload);
      dispatch(fetchLabOverview());
      dispatch(fetchBatchDetail(id));
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to extend batch window");
    }
  }
);

export const promoteBatchToMenu = createAsyncThunk(
  "lab/promoteBatchToMenu",
  async (
    { id, payload }: { id: string; payload: PromoteLabBatchPayload },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const res = await LabApi.promoteBatchToMenu(id, payload);
      dispatch(fetchLabOverview());
      dispatch(fetchBatchDetail(id));
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to promote batch to menu");
    }
  }
);

export const proposeLabIdea = createAsyncThunk(
  "lab/proposeIdea",
  async (payload: CreateLabIdeaPayload, { dispatch, rejectWithValue }) => {
    try {
      const res = await LabApi.createIdea(payload);
      dispatch(fetchLabOverview());
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to propose idea");
    }
  }
);

export const voteLabIdea = createAsyncThunk(
  "lab/voteIdea",
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      const res = await LabApi.voteIdea(id);
      dispatch(fetchLabOverview());
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to vote idea");
    }
  }
);

export const labSlice = createSlice({
  name: "lab",
  initialState,
  reducers: {
    clearSelectedBatch: (state) => {
      state.selectedBatchDetail = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Overview
    builder.addCase(fetchLabOverview.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchLabOverview.fulfilled, (state, action: PayloadAction<LabOverviewData>) => {
      state.isLoading = false;
      state.overview = action.payload;
    });
    builder.addCase(fetchLabOverview.rejected, (state, action) => {
      state.isLoading = false;
      state.error = (action.payload as string) || "Failed to fetch Lab overview";
    });

    // Batch Detail
    builder.addCase(fetchBatchDetail.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      fetchBatchDetail.fulfilled,
      (state, action: PayloadAction<LabBatchDetailData>) => {
        state.isLoading = false;
        state.selectedBatchDetail = action.payload;
      }
    );
    builder.addCase(fetchBatchDetail.rejected, (state, action) => {
      state.isLoading = false;
      state.error = (action.payload as string) || "Failed to fetch batch detail";
    });

    // Performance
    builder.addCase(fetchLabPerformance.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      fetchLabPerformance.fulfilled,
      (state, action: PayloadAction<LabPerformanceData>) => {
        state.isLoading = false;
        state.performance = action.payload;
      }
    );
    builder.addCase(fetchLabPerformance.rejected, (state, action) => {
      state.isLoading = false;
      state.error = (action.payload as string) || "Failed to fetch Lab performance";
    });

    // Submitting actions
    builder.addCase(createLabBatch.pending, (state) => {
      state.isSubmitting = true;
    });
    builder.addCase(createLabBatch.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    builder.addCase(createLabBatch.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = (action.payload as string) || "Failed to create batch";
    });
  },
});

export const { clearSelectedBatch, clearError } = labSlice.actions;
export default labSlice.reducer;

