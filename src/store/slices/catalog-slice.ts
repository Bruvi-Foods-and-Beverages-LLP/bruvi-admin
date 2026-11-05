import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  CatalogProduct,
  ProductDetail,
  CategoryMetric,
  CatalogQueryFilters,
  CategoryItem,
  ProductCreatePayload,
  ProductUpdatePayload,
  BulkActionPayload,
} from "@/types/catalog";
import { CatalogApi } from "@/lib/api/catalog";

interface CatalogState {
  products: CatalogProduct[];
  categories: CategoryMetric[];
  allCategories: CategoryItem[];
  selectedProduct: ProductDetail | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  counts: {
    all: number;
    active: number;
    hiddenInStore: number;
    draft: number;
    archived: number;
  };
  filters: CatalogQueryFilters;
  selectedProductIds: string[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: CatalogState = {
  products: [],
  categories: [],
  allCategories: [],
  selectedProduct: null,
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1,
  counts: {
    all: 0,
    active: 0,
    hiddenInStore: 0,
    draft: 0,
    archived: 0,
  },
  filters: {
    search: "",
    category: undefined,
    status: "ALL",
    channel: "ALL",
    prepStation: "ALL",
    page: 1,
    limit: 20,
    sortBy: "display_order",
    sortOrder: "asc",
  },
  selectedProductIds: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
};

export const fetchCatalogProducts = createAsyncThunk(
  "catalog/fetchProducts",
  async (filters: CatalogQueryFilters | undefined, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { catalog: CatalogState };
      const mergedFilters = { ...state.catalog.filters, ...filters };
      return await CatalogApi.getProducts(mergedFilters);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to fetch catalog products";
      return rejectWithValue(msg);
    }
  }
);

export const fetchCatalogCategories = createAsyncThunk(
  "catalog/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const [metrics, masterCategories] = await Promise.all([
        CatalogApi.getCategoryMetrics(),
        CatalogApi.getCategories(),
      ]);
      return { metrics, masterCategories };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to fetch categories";
      return rejectWithValue(msg);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "catalog/fetchProductById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await CatalogApi.getProductById(id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load product details";
      return rejectWithValue(msg);
    }
  }
);

export const createProduct = createAsyncThunk(
  "catalog/createProduct",
  async (payload: ProductCreatePayload, { dispatch, rejectWithValue }) => {
    try {
      const created = await CatalogApi.createProduct(payload);
      dispatch(fetchCatalogProducts());
      return created;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create product";
      return rejectWithValue(msg);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "catalog/updateProduct",
  async ({ id, payload }: { id: string; payload: ProductUpdatePayload }, { dispatch, rejectWithValue }) => {
    try {
      const updated = await CatalogApi.updateProduct(id, payload);
      dispatch(fetchCatalogProducts());
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update product";
      return rejectWithValue(msg);
    }
  }
);

export const archiveProduct = createAsyncThunk(
  "catalog/archiveProduct",
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      const res = await CatalogApi.archiveProduct(id);
      dispatch(fetchCatalogProducts());
      return res;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to archive product";
      return rejectWithValue(msg);
    }
  }
);

export const restoreProduct = createAsyncThunk(
  "catalog/restoreProduct",
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      const restored = await CatalogApi.restoreProduct(id);
      dispatch(fetchCatalogProducts());
      return restored;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to restore product";
      return rejectWithValue(msg);
    }
  }
);

export const executeBulkAction = createAsyncThunk(
  "catalog/bulkAction",
  async (payload: BulkActionPayload, { dispatch, rejectWithValue }) => {
    try {
      const res = await CatalogApi.bulkAction(payload);
      dispatch(fetchCatalogProducts());
      return res;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to perform bulk action";
      return rejectWithValue(msg);
    }
  }
);

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {
    setFilterSearch(state, action: PayloadAction<string>) {
      state.filters.search = action.payload;
      state.filters.page = 1;
    },
    setFilterCategory(state, action: PayloadAction<string | undefined>) {
      state.filters.category = action.payload;
      state.filters.page = 1;
    },
    setFilterStatus(state, action: PayloadAction<CatalogQueryFilters["status"]>) {
      state.filters.status = action.payload;
      state.filters.page = 1;
    },
    setFilterChannel(state, action: PayloadAction<CatalogQueryFilters["channel"]>) {
      state.filters.channel = action.payload;
      state.filters.page = 1;
    },
    setFilterPrepStation(state, action: PayloadAction<CatalogQueryFilters["prepStation"]>) {
      state.filters.prepStation = action.payload;
      state.filters.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.filters.page = action.payload;
    },
    toggleSelectProduct(state, action: PayloadAction<string>) {
      const id = action.payload;
      const idx = state.selectedProductIds.indexOf(id);
      if (idx > -1) {
        state.selectedProductIds.splice(idx, 1);
      } else {
        state.selectedProductIds.push(id);
      }
    },
    selectAllVisibleProducts(state) {
      state.selectedProductIds = state.products.map((p) => p.id);
    },
    clearSelection(state) {
      state.selectedProductIds = [];
    },
    clearSelectedProduct(state) {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchCatalogProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCatalogProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload;
        state.products = payload.items || payload.products || [];
        state.total = payload.total ?? state.products.length;
        state.page = payload.page || 1;
        state.limit = payload.limit || 20;
        state.totalPages = payload.totalPages || 1;
        state.categories = payload.categories || [];
        if (payload.counts) {
          state.counts = payload.counts;
        } else if (payload.summary) {
          const totalAll = payload.summary.totalProducts ?? state.total;
          const hidden = payload.summary.hiddenInStoreCount ?? 0;
          const draft = payload.summary.draftCount ?? 0;
          state.counts = {
            all: totalAll,
            active: Math.max(0, totalAll - hidden - draft),
            hiddenInStore: hidden,
            draft: draft,
            archived: 0,
          };
        }
      })
      .addCase(fetchCatalogProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to fetch products";
      })
      // Fetch Categories
      .addCase(fetchCatalogCategories.fulfilled, (state, action) => {
        state.categories = action.payload.metrics || [];
        state.allCategories = action.payload.masterCategories || [];
      })
      // Fetch Single Product
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to load product details";
      })
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.selectedProduct = action.payload;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = (action.payload as string) || "Failed to create product";
      })
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.selectedProduct = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = (action.payload as string) || "Failed to update product";
      })
      // Archive Product
      .addCase(archiveProduct.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(archiveProduct.fulfilled, (state) => {
        state.isSubmitting = false;
        state.selectedProduct = null;
      })
      .addCase(archiveProduct.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = (action.payload as string) || "Failed to archive product";
      })
      // Restore Product
      .addCase(restoreProduct.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(restoreProduct.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.selectedProduct = action.payload;
      })
      .addCase(restoreProduct.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = (action.payload as string) || "Failed to restore product";
      })
      // Bulk Actions
      .addCase(executeBulkAction.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(executeBulkAction.fulfilled, (state) => {
        state.isSubmitting = false;
        state.selectedProductIds = [];
      })
      .addCase(executeBulkAction.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = (action.payload as string) || "Failed to perform bulk action";
      });
  },
});

export const {
  setFilterSearch,
  setFilterCategory,
  setFilterStatus,
  setFilterChannel,
  setFilterPrepStation,
  setPage,
  toggleSelectProduct,
  selectAllVisibleProducts,
  clearSelection,
  clearSelectedProduct,
} = catalogSlice.actions;

export default catalogSlice.reducer;
