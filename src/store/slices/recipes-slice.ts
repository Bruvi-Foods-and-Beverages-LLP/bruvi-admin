import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RecipesApi } from "@/lib/api/recipes";
import {
  RecipeFilters,
  RecipeItem,
  RecipeListResponse,
  RecipeOverviewMetrics,
} from "@/types/recipes";

export interface RecipesState {
  recipes: RecipeItem[];
  metrics: RecipeOverviewMetrics;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  categories: string[];
  stations: string[];
  owners: string[];
  filters: RecipeFilters;
  isLoading: boolean;
  error: string | null;
  selectedRecipeId: string | null;
}

const initialFilters: RecipeFilters = {
  search: "",
  tab: "ALL",
  category: "ALL",
  station: "ALL",
  owner: "ALL",
};

const initialState: RecipesState = {
  recipes: [],
  metrics: {
    totalCount: 0,
    draftsCount: 0,
    avgMargin: 0,
    targetMargin: 75.0,
    updatedAt: "",
  },
  total: 0,
  page: 1,
  limit: 9,
  totalPages: 1,
  categories: [],
  stations: [],
  owners: [],
  filters: initialFilters,
  isLoading: false,
  error: null,
  selectedRecipeId: null,
};

export const fetchRecipes = createAsyncThunk<
  RecipeListResponse,
  { page?: number; limit?: number } | undefined,
  { state: { recipes: RecipesState } }
>("recipes/fetchRecipes", async (params, { getState }) => {
  const state = getState().recipes;
  const currentPage = params?.page ?? state.page;
  const currentLimit = params?.limit ?? state.limit;

  return await RecipesApi.getRecipes(state.filters, currentPage, currentLimit);
});

export const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setFilterSearch(state, action: PayloadAction<string>) {
      state.filters.search = action.payload;
      state.page = 1;
    },
    setFilterTab(state, action: PayloadAction<"ALL" | "DRAFTS">) {
      state.filters.tab = action.payload;
      state.page = 1;
    },
    setFilterCategory(state, action: PayloadAction<string>) {
      state.filters.category = action.payload;
      state.page = 1;
    },
    setFilterStation(state, action: PayloadAction<string>) {
      state.filters.station = action.payload;
      state.page = 1;
    },
    setFilterOwner(state, action: PayloadAction<string>) {
      state.filters.owner = action.payload;
      state.page = 1;
    },
    resetFilters(state) {
      state.filters = initialFilters;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setSelectedRecipeId(state, action: PayloadAction<string | null>) {
      state.selectedRecipeId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recipes = action.payload.recipes;
        state.metrics = action.payload.metrics;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
        state.categories = action.payload.categories;
        state.stations = action.payload.stations;
        state.owners = action.payload.owners;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to load recipes";
      });
  },
});

export const {
  setFilterSearch,
  setFilterTab,
  setFilterCategory,
  setFilterStation,
  setFilterOwner,
  resetFilters,
  setPage,
  setSelectedRecipeId,
} = recipesSlice.actions;

export default recipesSlice.reducer;
