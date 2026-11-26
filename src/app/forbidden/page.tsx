import { NoPermissionView } from "@/components/feedback/no-permission-view";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-bg-subtle px-4 py-10 md:px-8 flex items-center justify-center">
      <NoPermissionView
        showPageHeader={false}
        resourceName="this resource"
        description="Your current staff role does not include the required permissions to view or modify this page."
        errorCode="ACCESS-DENIED"
        pathname="/forbidden"
        primaryReturnHref="/"
        primaryReturnLabel="Go to Dashboard"
      />
    </div>
  );
}
