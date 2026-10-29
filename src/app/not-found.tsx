import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Coffee, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-bg-subtle">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-navy text-white shadow-md mb-6">
        <Coffee className="h-8 w-8" />
      </div>
      <h1 className="font-serif text-3xl font-bold text-brand-navy mb-2">404 · Module Not Found</h1>
      <p className="max-w-md text-xs text-text-muted mb-8">
        The requested ERP domain route or operational resource could not be located in this cluster.
      </p>
      <Button asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Return to Executive Cockpit</span>
        </Link>
      </Button>
    </div>
  );
}

