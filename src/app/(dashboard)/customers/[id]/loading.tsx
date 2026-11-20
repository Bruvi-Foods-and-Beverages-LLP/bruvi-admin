import { CustomerDetailSkeleton } from "@/components/customers/detail/customer-detail-skeleton";

export default function CustomerDetailLoading() {
  return (
    <div className="flex flex-col gap-6 max-w-[1136px] w-full mx-auto pb-10">
      <CustomerDetailSkeleton />
    </div>
  );
}

