import { AlertCircle, Check } from "lucide-react";
import type { ReadinessItem } from "@/lib/catalog/product-form";

/** "Ready to publish" checklist (Figma 225:91446). */
export function ReadinessCard({ items }: { items: ReadinessItem[] }) {
  const done = items.filter((i) => i.done).length;
  return (
    <div className="flex w-full flex-col gap-3 rounded-[16px] border border-border bg-white p-6 shadow-2xs">
      <div className="flex items-center justify-between">
        <h2 className="text-title font-extrabold text-text">Ready to publish</h2>
        <span className="text-label text-text-secondary tnum">{done} of {items.length}</span>
      </div>
      <div
        role="progressbar"
        aria-label="Publish readiness"
        aria-valuemin={0}
        aria-valuemax={items.length}
        aria-valuenow={done}
        className="h-2 w-full overflow-hidden rounded-full bg-track"
      >
        <div className="h-full rounded-full bg-success transition-all duration-300" style={{ width: `${(done / items.length) * 100}%` }} />
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.key} className="flex items-center gap-2 text-body-s text-text">
            {item.done ? (
              <Check className="h-4 w-4 shrink-0 text-success" strokeWidth={2.5} />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-warning" />
            )}
            {item.label}
          </li>
        ))}
      </ul>
      <p className="text-caption text-text-muted">You can save as a draft now and finish the rest before launch.</p>
    </div>
  );
}
