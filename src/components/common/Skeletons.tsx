export function TripCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="h-24 bg-slate-200" />
      <div className="space-y-3 px-5 py-5">
        <div className="h-3 w-2/3 rounded bg-slate-200" />
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-5/6 rounded bg-slate-100" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-6 w-20 rounded-full bg-slate-100" />
          <div className="h-8 w-24 rounded-lg bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-slate-200" />
        <div className="space-y-2">
          <div className="h-3 w-24 rounded bg-slate-200" />
          <div className="h-2.5 w-16 rounded bg-slate-100" />
        </div>
      </div>
      <div className="mt-4 h-4 w-5/6 rounded bg-slate-200" />
      <div className="mt-2 space-y-2">
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-4/5 rounded bg-slate-100" />
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="h-3 w-20 rounded bg-slate-100" />
        <div className="h-3 w-12 rounded bg-slate-100" />
      </div>
    </div>
  );
}
