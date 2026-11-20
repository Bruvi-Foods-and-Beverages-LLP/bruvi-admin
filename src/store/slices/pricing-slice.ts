import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  CatalogProduct,
  CityPriceRule,
  StoreOverride,
  PublishPricingBatchPayload,
  CategoryMetric,
} from "@/types/catalog";
import { CatalogApi } from "@/lib/api/catalog";

export interface CellChange {
  productId: string;
  productName: string;
  columnKey: string; // "base" | "mumbai" | "delhi" | "bengaluru" | "kiosk" | "app"
  columnLabel: string;
  oldPriceRupees: number;
  newPriceRupees: number;
}

interface PricingState {
  products: CatalogProduct[];
  cityRules: CityPriceRule[];
  overrides: StoreOverride[];
  categories: CategoryMetric[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string; // 'all' or category slug
  /** Map of `${productId}:${columnKey}` -> newPriceRupees */
  changedCells: Record<string, number>;
  originalCells: Record<string, number>;
  isBulkAdjustOpen: boolean;
}

const initialState: PricingState = {
  products: [],
  cityRules: [],
  overrides: [],
  categories: [],
  isLoading: true,
  isSubmitting: false,
  error: null,
  searchQuery: "",
  selectedCategory: "all",
  changedCells: {},
  originalCells: {},
  isBulkAdjustOpen: false,
};

export const fetchPricingData = createAsyncThunk(
  "pricing/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const [productsRes, cityRulesRes, overridesRes, categoriesRes] = await Promise.all([
        CatalogApi.getProducts({ limit: 100 }),
        CatalogApi.getCityPriceRules(),
        CatalogApi.getStoreOverrides(),
        CatalogApi.getCategoryMetrics(),
      ]);

      return {
        products: productsRes.items,
        cityRules: cityRulesRes,
        overrides: overridesRes,
        categories: categoriesRes,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load pricing data";
      return rejectWithValue(msg);
    }
  }
);

export const publishPricingChanges = createAsyncThunk(
  "pricing/publishChanges",
  async (
    payload: {
      isScheduled?: boolean;
      scheduledDate?: string;
    },
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      const state = getState() as { pricing: PricingState };
      const { changedCells, products, overrides } = state.pricing;

      const basePriceUpdates: NonNullable<PublishPricingBatchPayload["basePriceUpdates"]> = [];
      const storeOverridesUpdates: NonNullable<PublishPricingBatchPayload["storeOverrides"]> = [];

      // Find all outlets to know their city
      for (const [key, newRupees] of Object.entries(changedCells)) {
        const [productId, columnKey] = key.split(":");
        const product = products.find((p) => p.id === productId);
        if (!product) continue;

        const newPaise = Math.round(newRupees * 100);

        if (columnKey === "base") {
          basePriceUpdates.push({
            productId,
            basePricePaise: newPaise,
            scheduledPricePaise: payload.isScheduled ? newPaise : null,
            scheduledPriceDate: payload.isScheduled ? payload.scheduledDate : null,
          });
        } else if (columnKey === "mumbai") {
          // Find store overrides or city outlets
          // For store overrides matching Mumbai outlets:
          const mumbaiOutlets = overrides
            .filter((o) => o.outlets?.city?.toLowerCase() === "mumbai" || o.city?.toLowerCase() === "mumbai")
            .map((o) => o.outletId);

          if (mumbaiOutlets.length > 0) {
            for (const outletId of Array.from(new Set(mumbaiOutlets))) {
              storeOverridesUpdates.push({
                outletId,
                productId,
                overridePricePaise: newPaise,
                isAvailable: true,
              });
            }
          }
        } else if (columnKey === "app" || columnKey === "kiosk") {
          // Channel specific update or store overrides
          for (const o of overrides.filter((ov) => ov.productId === productId)) {
            storeOverridesUpdates.push({
              outletId: o.outletId,
              productId,
              overridePricePaise: newPaise,
              isAvailable: true,
              channelCounter: true,
              channelKiosk: columnKey === "kiosk" ? true : o.channelKiosk ?? true,
              channelApp: columnKey === "app" ? true : o.channelApp ?? true,
              channelQr: true,
            });
          }
        }
      }

      await CatalogApi.publishPricingBatch({
        basePriceUpdates,
        storeOverrides: storeOverridesUpdates,
      });

      dispatch(fetchPricingData());
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to publish pricing changes";
      return rejectWithValue(msg);
    }
  }
);

export const pricingSlice = createSlice({
  name: "pricing",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setBulkAdjustOpen: (state, action: PayloadAction<boolean>) => {
      state.isBulkAdjustOpen = action.payload;
    },
    updateCellPrice: (
      state,
      action: PayloadAction<{
        productId: string;
        columnKey: string;
        originalPriceRupees: number;
        newPriceRupees: number;
      }>
    ) => {
      const { productId, columnKey, originalPriceRupees, newPriceRupees } = action.payload;
      const key = `${productId}:${columnKey}`;

      if (state.originalCells[key] === undefined) {
        state.originalCells[key] = originalPriceRupees;
      }

      if (newPriceRupees === state.originalCells[key]) {
        delete state.changedCells[key];
        delete state.originalCells[key];
      } else {
        state.changedCells[key] = newPriceRupees;
      }
    },
    applyBulkAdjust: (
      state,
      action: PayloadAction<{
        targetColumn: string; // "base" | "mumbai" | "delhi" | "bengaluru" | "kiosk" | "app"
        adjustType: "ADD_FLAT" | "PERCENTAGE";
        adjustValue: number;
        applyScope: "ALL" | "BITES" | "DRINKS" | "SELECTED";
        selectedProductIds?: string[];
      }>
    ) => {
      const { targetColumn, adjustType, adjustValue, applyScope, selectedProductIds } =
        action.payload;

      for (const product of state.products) {
        const isBite =
          product.categoryName?.toLowerCase().includes("bite") ||
          product.categoryName?.toLowerCase().includes("food");
        const isDrink = !isBite;

        if (applyScope === "BITES" && !isBite) continue;
        if (applyScope === "DRINKS" && !isDrink) continue;
        if (applyScope === "SELECTED" && selectedProductIds && !selectedProductIds.includes(product.id)) {
          continue;
        }

        const currentRupees = product.basePriceRupees || Math.round(product.basePricePaise / 100);
        let newPrice = currentRupees;

        if (adjustType === "ADD_FLAT") {
          newPrice = Math.max(1, currentRupees + adjustValue);
        } else if (adjustType === "PERCENTAGE") {
          newPrice = Math.max(1, Math.round(currentRupees * (1 + adjustValue / 100)));
        }

        const key = `${product.id}:${targetColumn}`;
        if (state.originalCells[key] === undefined) {
          state.originalCells[key] = currentRupees;
        }
        state.changedCells[key] = newPrice;
      }
    },
    discardChanges: (state) => {
      state.changedCells = {};
      state.originalCells = {};
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchPricingData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPricingData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.cityRules = action.payload.cityRules;
        state.overrides = action.payload.overrides;
        state.categories = action.payload.categories;
        state.changedCells = {};
        state.originalCells = {};
      })
      .addCase(fetchPricingData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Publish
      .addCase(publishPricingChanges.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(publishPricingChanges.fulfilled, (state) => {
        state.isSubmitting = false;
        state.changedCells = {};
        state.originalCells = {};
      })
      .addCase(publishPricingChanges.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  setBulkAdjustOpen,
  updateCellPrice,
  applyBulkAdjust,
  discardChanges,
  clearError,
} = pricingSlice.actions;

export default pricingSlice.reducer;
