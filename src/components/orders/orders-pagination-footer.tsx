"use client";

import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setPage, setLimit, fetchOrders } from "@/store/slices/orders-slice";
import { Pagination } from "@/components/ui/pagination";

/** Orders pagination footer (Figma 225:101312) — server-side, 10 rows by default. */
export function OrdersPaginationFooter() {
  const dispatch = useAppDispatch();
  const { total, page, limit, isLoading } = useAppSelector((state) => state.orders);

  return (
    <Pagination
      page={page}
      pageSize={limit}
      total={total}
      label="orders"
      disabled={isLoading}
      onPageChange={(p) => {
        dispatch(setPage(p));
        dispatch(fetchOrders({ page: p }));
      }}
      onPageSizeChange={(n) => {
        dispatch(setLimit(n));
        dispatch(fetchOrders({ page: 1, limit: n }));
      }}
    />
  );
}
