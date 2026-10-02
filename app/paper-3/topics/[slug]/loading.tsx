export default function TopicLoading() {
  return <main className="mx-auto w-full max-w-4xl p-6 py-16" aria-busy="true" aria-live="polite">
    <p className="text-sm font-semibold text-fd-muted-foreground">Paper 3 · AlgoCore</p>
    <h1 className="mt-3 text-2xl font-semibold">Loading lesson… · Đang tải bài học…</h1>
    <div className="mt-8 min-h-72 animate-pulse rounded-xl border bg-fd-muted motion-reduce:animate-none" aria-hidden="true" />
  </main>;
}
