"use client";

import * as React from "react";
import { ProductEditor } from "@/components/catalog/product-editor/product-editor";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: PageProps) {
  const unwrappedParams = React.use(params);
  const productId = unwrappedParams.id;

  return <ProductEditor mode="edit" productId={productId} />;
}
