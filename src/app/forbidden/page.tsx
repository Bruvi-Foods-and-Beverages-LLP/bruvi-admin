import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldX, ArrowLeft, KeyRound } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-bg-subtle">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 shadow-md mb-6">
        <ShieldX className="h-8 w-8" />
      </div>
      <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">403 · Access Restricted</h1>
      <p className="max-w-md text-xs text-text-muted mb-4">
        Your current staff role does not possess the cryptographic capabilities or permissions required to view or mutate this operational resource.
      </p>
      <div className="rounded-lg bg-white border border-border p-4 max-w-sm w-full text-left text-xs mb-8">
        <div className="flex items-center space-x-2 text-text font-semibold mb-1">
          <KeyRound className="h-4 w-4 text-brand-navy" />
          <span>Elevated Access Required</span>
        </div>
        <p className="text-[11px] text-text-muted">
          Contact your Store General Manager or HQ Operations team to request an updated role assignment.
        </p>
      </div>
      <Button asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Return to Executive Cockpit</span>
        </Link>
      </Button>
    </div>
  );
}

