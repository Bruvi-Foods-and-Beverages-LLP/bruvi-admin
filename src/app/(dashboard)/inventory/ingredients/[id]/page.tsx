import type { Metadata } from "next";
import { IngredientDetailView } from "@/components/inventory/ingredient-detail-view";

export const metadata: Metadata = {
  title: "Ingredient Detail · Inventory · BRUVI HQ",
  description:
    "Network stock distribution, 14-day usage, FEFO batches, and recipe/modifier links.",
};

export default async function IngredientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <IngredientDetailView ingredientId={id} />;
}
