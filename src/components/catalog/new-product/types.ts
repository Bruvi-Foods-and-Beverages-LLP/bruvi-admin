import type { ProductFormState } from "@/lib/catalog/product-form";

export type SetField = <K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) => void;
