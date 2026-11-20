import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  MarketingState,
  MarketingTab,
  CampaignListItem,
} from "@/types/marketing";
import {
  MarketingApi,
  FALLBACK_MARKETING_OVERVIEW,
  FALLBACK_CAMPAIGNS_LIST,
} from "@/lib/api/marketing";

const initialState: MarketingState = {
  activeTab: "overview",
  kpis: FALLBACK_MARKETING_OVERVIEW.kpis,
  timelineEvents: FALLBACK_MARKETING_OVERVIEW.timelineEvents,
  liveCampaigns: FALLBACK_MARKETING_OVERVIEW.liveCampaigns,
  channelPerformance: FALLBACK_MARKETING_OVERVIEW.channelPerformance,
  campaignsList: FALLBACK_CAMPAIGNS_LIST,
  selectedMonth: FALLBACK_MARKETING_OVERVIEW.selectedMonth,
  currentDay: FALLBACK_MARKETING_OVERVIEW.currentDay,
  totalDaysInMonth: FALLBACK_MARKETING_OVERVIEW.totalDaysInMonth,
  isCreateCampaignOpen: false,
  isLoading: false,
  error: null,
};

export const fetchMarketingOverview = createAsyncThunk(
  "marketing/fetchOverview",
  async () => {
    return await MarketingApi.getOverview();
  },
);

export const fetchMarketingCampaigns = createAsyncThunk(
  "marketing/fetchCampaigns",
  async () => {
    return await MarketingApi.getCampaigns();
  },
);

export const createMarketingCampaign = createAsyncThunk(
  "marketing/createCampaign",
  async (payload: Partial<CampaignListItem>) => {
    return await MarketingApi.createCampaign(payload);
  },
);

export const marketingSlice = createSlice({
  name: "marketing",
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<MarketingTab>) => {
      state.activeTab = action.payload;
    },
    setIsCreateCampaignOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateCampaignOpen = action.payload;
    },
    setSelectedMonth: (state, action: PayloadAction<string>) => {
      state.selectedMonth = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Overview
      .addCase(fetchMarketingOverview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMarketingOverview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.kpis = action.payload.kpis;
        state.timelineEvents = action.payload.timelineEvents;
        state.liveCampaigns = action.payload.liveCampaigns;
        state.channelPerformance = action.payload.channelPerformance;
        state.selectedMonth = action.payload.selectedMonth;
        state.currentDay = action.payload.currentDay;
        state.totalDaysInMonth = action.payload.totalDaysInMonth;
      })
      .addCase(fetchMarketingOverview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to load marketing overview";
      })
      // Campaigns List
      .addCase(fetchMarketingCampaigns.fulfilled, (state, action) => {
        state.campaignsList = action.payload;
      })
      // Create Campaign
      .addCase(createMarketingCampaign.fulfilled, (state, action) => {
        state.campaignsList.unshift(action.payload);
        state.isCreateCampaignOpen = false;
      });
  },
});

export const {
  setActiveTab,
  setIsCreateCampaignOpen,
  setSelectedMonth,
} = marketingSlice.actions;

export default marketingSlice.reducer;

