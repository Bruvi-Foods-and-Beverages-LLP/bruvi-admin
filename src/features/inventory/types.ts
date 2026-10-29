export type UnitOfMeasure = "GRAM" | "MILLIGRAM" | "MILLILITER" | "LITER" | "PIECE" | "PACK";

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: "COFFEE_BEANS" | "DAIRY_MILK" | "SYRUP_SAUCE" | "PACKAGING" | "BAKERY";
  uom: UnitOfMeasure;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  parLevel: number;
  reorderQuantity: number;
  unitCost: number;
  lastAuditedAt?: string;
  isLowStock: boolean;
}

