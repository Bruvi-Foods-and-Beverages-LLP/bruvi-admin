"use client";

import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setPage, setLimit, fetchCustomers } from "@/store/slices/customers-slice";
import { Pagination } from "@/components/ui/pagination";

/** Customers pagination footer (Figma 225:103546) — server-side, 10 rows by default. */
export function CustomersPaginationFooter() {
  const dispatch = useAppDispatch();
  const { total, page, limit, isLoading } = useAppSelector((state) => state.customers);

  return (
    <Pagination
      page={page}
      pageSize={limit}
      total={total}
      label="customers"
      disabled={isLoading}
      onPageChange={(p) => {
        dispatch(setPage(p));
        dispatch(fetchCustomers({ page: p }));
      }}
      onPageSizeChange={(s) => {
        dispatch(setLimit(s));
        dispatch(fetchCustomers({ page: 1, limit: s }));
      }}
    />
  );
}
