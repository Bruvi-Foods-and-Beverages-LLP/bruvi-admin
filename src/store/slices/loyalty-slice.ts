import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { LoyaltyApi } from '@/lib/api/loyalty';
import type {
  LoyaltyDashboardData,
  LoyaltyRule,
  LoyaltyBurnRules,
  CatalogReward,
  LoyaltyTiersData,
  LoyaltyTransactionsResponse,
  CreateRewardPayload,
  UpdateRewardPayload,
  ManualAdjustPayload,
} from '@/types/loyalty';

export type LoyaltyTab = 'overview' | 'rules' | 'rewards' | 'tiers' | 'transactions';

interface LoyaltyState {
  activeTab: LoyaltyTab;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  // Overview (A100)
  dashboardData: LoyaltyDashboardData | null;

  // Rules (A101)
  earnRules: LoyaltyRule[];
  burnRules: LoyaltyBurnRules | null;
  editingRule: LoyaltyRule | null;
  isCreatingNewRule: boolean;

  // Rewards (A102, A103)
  rewards: CatalogReward[];
  rewardFilterType: string;
  rewardFilterStatus: string;
  rewardFilterStore: string;
  rewardSearchQuery: string;
  isCreateRewardOpen: boolean;
  editingReward: CatalogReward | null;

  // Tiers (A104)
  tiersData: LoyaltyTiersData | null;
  isPreviewMemberViewOpen: boolean;
  saveTierSettingsTrigger: number;

  // Transactions (A105)
  transactionsData: LoyaltyTransactionsResponse | null;
  transactionsFilterType: string;
  transactionsSearch: string;
  transactionsPage: number;
  isAdjustPointsOpen: boolean;
}

const initialState: LoyaltyState = {
  activeTab: 'overview',
  isLoading: false,
  isSubmitting: false,
  error: null,

  dashboardData: null,
  earnRules: [],
  burnRules: null,
  editingRule: null,
  isCreatingNewRule: false,

  rewards: [],
  rewardFilterType: 'all',
  rewardFilterStatus: 'all',
  rewardFilterStore: 'all',
  rewardSearchQuery: '',
  isCreateRewardOpen: false,
  editingReward: null,

  tiersData: null,
  isPreviewMemberViewOpen: false,
  saveTierSettingsTrigger: 0,

  transactionsData: null,
  transactionsFilterType: '',
  transactionsSearch: '',
  transactionsPage: 1,
  isAdjustPointsOpen: false,
};

export const fetchLoyaltyDashboard = createAsyncThunk(
  'loyalty/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      return await LoyaltyApi.getDashboard();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to load loyalty dashboard');
    }
  },
);

export const fetchLoyaltyRules = createAsyncThunk(
  'loyalty/fetchRules',
  async (_, { rejectWithValue }) => {
    try {
      return await LoyaltyApi.getRules();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to load loyalty rules');
    }
  },
);

export const updateLoyaltyRule = createAsyncThunk(
  'loyalty/updateRule',
  async ({ id, payload }: { id: string; payload: Partial<LoyaltyRule> }, { rejectWithValue }) => {
    try {
      return await LoyaltyApi.updateRule(id, payload);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update rule');
    }
  },
);

export const createLoyaltyRule = createAsyncThunk(
  'loyalty/createRule',
  async (payload: Partial<LoyaltyRule>, { rejectWithValue }) => {
    try {
      return await LoyaltyApi.createRule(payload);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to create rule');
    }
  },
);

export const fetchLoyaltyRewards = createAsyncThunk(
  'loyalty/fetchRewards',
  async (_, { rejectWithValue }) => {
    try {
      return await LoyaltyApi.getRewards();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to load rewards catalogue');
    }
  },
);

export const createLoyaltyReward = createAsyncThunk(
  'loyalty/createReward',
  async (payload: CreateRewardPayload, { rejectWithValue }) => {
    try {
      return await LoyaltyApi.createReward(payload);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to create reward');
    }
  },
);

export const updateLoyaltyReward = createAsyncThunk(
  'loyalty/updateReward',
  async ({ id, payload }: { id: string; payload: UpdateRewardPayload }, { rejectWithValue }) => {
    try {
      return await LoyaltyApi.updateReward(id, payload);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update reward');
    }
  },
);

export const archiveLoyaltyReward = createAsyncThunk(
  'loyalty/archiveReward',
  async (id: string, { rejectWithValue }) => {
    try {
      await LoyaltyApi.archiveReward(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to archive reward');
    }
  },
);

export const fetchLoyaltyTiers = createAsyncThunk(
  'loyalty/fetchTiers',
  async (_, { rejectWithValue }) => {
    try {
      return await LoyaltyApi.getTiers();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to load tiers data');
    }
  },
);

export const updateLoyaltyTierSettings = createAsyncThunk(
  'loyalty/updateTierSettings',
  async (payload: any, { rejectWithValue, dispatch }) => {
    try {
      const res = await LoyaltyApi.updateTierSettings(payload);
      dispatch(fetchLoyaltyTiers());
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update tier settings');
    }
  },
);

export const fetchLoyaltyTransactions = createAsyncThunk(
  'loyalty/fetchTransactions',
  async (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      eventType?: string;
      type?: string;
      store?: string;
      actor?: string;
      today?: boolean;
      flaggedOnly?: boolean;
    } = {},
    { rejectWithValue },
  ) => {
    try {
      return await LoyaltyApi.getTransactions(params);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to load transactions');
    }
  },
);

export const freezeStaffAdjustmentsThunk = createAsyncThunk(
  'loyalty/freezeStaff',
  async (
    payload: { actorName: string; reason?: string; storeName?: string },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const res = await LoyaltyApi.freezeStaffAdjustments(payload);
      dispatch(fetchLoyaltyTransactions({ page: 1 }));
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to freeze staff adjustments');
    }
  },
);

export const adjustCustomerPoints = createAsyncThunk(
  'loyalty/adjustPoints',
  async (payload: ManualAdjustPayload, { dispatch, rejectWithValue }) => {
    try {
      const res = await LoyaltyApi.adjustPoints(payload);
      // Refresh transactions after adjustment
      dispatch(fetchLoyaltyTransactions({ page: 1 }));
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to adjust points');
    }
  },
);

export const loyaltySlice = createSlice({
  name: 'loyalty',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<LoyaltyTab>) {
      state.activeTab = action.payload;
    },
    setRewardFilterType(state, action: PayloadAction<string>) {
      state.rewardFilterType = action.payload;
    },
    setRewardFilterStatus(state, action: PayloadAction<string>) {
      state.rewardFilterStatus = action.payload;
    },
    setRewardFilterStore(state, action: PayloadAction<string>) {
      state.rewardFilterStore = action.payload;
    },
    setRewardSearchQuery(state, action: PayloadAction<string>) {
      state.rewardSearchQuery = action.payload;
    },
    setIsCreateRewardOpen(state, action: PayloadAction<boolean>) {
      state.isCreateRewardOpen = action.payload;
      if (!action.payload) state.editingReward = null;
    },
    setEditingReward(state, action: PayloadAction<CatalogReward | null>) {
      state.editingReward = action.payload;
      state.isCreateRewardOpen = !!action.payload;
    },
    setIsAdjustPointsOpen(state, action: PayloadAction<boolean>) {
      state.isAdjustPointsOpen = action.payload;
    },
    setIsPreviewMemberViewOpen(state, action: PayloadAction<boolean>) {
      state.isPreviewMemberViewOpen = action.payload;
    },
    triggerSaveTierSettings(state) {
      state.saveTierSettingsTrigger += 1;
    },
    setEditingRule(state, action: PayloadAction<LoyaltyRule | null>) {
      state.editingRule = action.payload;
    },
    setIsCreatingNewRule(state, action: PayloadAction<boolean>) {
      state.isCreatingNewRule = action.payload;
    },
    setTransactionsFilterType(state, action: PayloadAction<string>) {
      state.transactionsFilterType = action.payload;
    },
    setTransactionsSearch(state, action: PayloadAction<string>) {
      state.transactionsSearch = action.payload;
    },
    setTransactionsPage(state, action: PayloadAction<number>) {
      state.transactionsPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Dashboard
    builder.addCase(fetchLoyaltyDashboard.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchLoyaltyDashboard.fulfilled, (state, action) => {
      state.isLoading = false;
      state.dashboardData = action.payload;
    });
    builder.addCase(fetchLoyaltyDashboard.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Rules
    builder.addCase(fetchLoyaltyRules.fulfilled, (state, action) => {
      state.earnRules = action.payload.earnRules;
      state.burnRules = action.payload.burnRules;
    });
    builder.addCase(createLoyaltyRule.fulfilled, (state, action) => {
      state.earnRules.push(action.payload);
      state.editingRule = null;
    });
    builder.addCase(updateLoyaltyRule.fulfilled, (state, action) => {
      const idx = state.earnRules.findIndex((r) => r.id === action.payload.id);
      if (idx !== -1) {
        state.earnRules[idx] = action.payload;
      }
      state.editingRule = null;
    });

    // Rewards
    builder.addCase(fetchLoyaltyRewards.fulfilled, (state, action) => {
      state.rewards = action.payload;
    });
    builder.addCase(createLoyaltyReward.fulfilled, (state, action) => {
      state.rewards.push(action.payload);
      state.isCreateRewardOpen = false;
    });
    builder.addCase(updateLoyaltyReward.fulfilled, (state, action) => {
      const idx = state.rewards.findIndex((r) => r.id === action.payload.id);
      if (idx !== -1) {
        state.rewards[idx] = action.payload;
      }
      state.isCreateRewardOpen = false;
      state.editingReward = null;
    });
    builder.addCase(archiveLoyaltyReward.fulfilled, (state, action) => {
      const idx = state.rewards.findIndex((r) => r.id === action.payload);
      if (idx !== -1) {
        state.rewards[idx].status = 'ARCHIVED';
      }
    });

    // Tiers
    builder.addCase(fetchLoyaltyTiers.fulfilled, (state, action) => {
      state.tiersData = action.payload;
    });

    // Transactions
    builder.addCase(fetchLoyaltyTransactions.fulfilled, (state, action) => {
      state.transactionsData = action.payload;
    });
  },
});

export const {
  setActiveTab,
  setRewardFilterType,
  setRewardFilterStatus,
  setRewardFilterStore,
  setRewardSearchQuery,
  setIsCreateRewardOpen,
  setEditingReward,
  setIsAdjustPointsOpen,
  setIsCreatingNewRule,
  setIsPreviewMemberViewOpen,
  triggerSaveTierSettings,
  setEditingRule,
  setTransactionsFilterType,
  setTransactionsSearch,
  setTransactionsPage,
} = loyaltySlice.actions;

export default loyaltySlice.reducer;

