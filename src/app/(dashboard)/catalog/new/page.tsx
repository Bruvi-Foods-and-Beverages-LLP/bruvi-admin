"use client";

import * as React from "react";
import { ProductEditor } from "@/components/catalog/product-editor/product-editor";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function NewProductPage({ searchParams }: PageProps) {
  const { duplicate } = React.use(searchParams);
  const duplicateFromId = typeof duplicate === "string" ? duplicate : undefined;

  return <ProductEditor mode="create" duplicateFromId={duplicateFromId} />;
}
