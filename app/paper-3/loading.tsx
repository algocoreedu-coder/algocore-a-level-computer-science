export default function Paper3Loading() {
  return <main className="mx-auto w-full max-w-5xl p-6 py-16" aria-busy="true" aria-live="polite">
    <p className="text-sm font-semibold text-fd-muted-foreground">Paper 3 · AlgoCore</p>
    <h1 className="mt-3 text-2xl font-semibold">Loading your study route… · Đang tải lộ trình học…</h1>
    <p className="mt-3 max-w-2xl text-fd-muted-foreground">Your lesson, section or mock-paper workspace will appear here.</p>
    <div className="mt-8 grid gap-4 motion-reduce:animate-none md:grid-cols-3" aria-hidden="true">
      <div className="min-h-32 animate-pulse rounded-xl border bg-fd-muted motion-reduce:animate-none" />
      <div className="min-h-32 animate-pulse rounded-xl border bg-fd-muted motion-reduce:animate-none" />
      <div className="min-h-32 animate-pulse rounded-xl border bg-fd-muted motion-reduce:animate-none" />
    </div>
  </main>;
}
