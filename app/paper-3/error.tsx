"use client";

import Link from "next/link";

export default function Paper3Error({ reset }: { readonly error: Error & { digest?: string }; readonly reset: () => void }) {
  return <main className="mx-auto w-full max-w-3xl p-6 py-16" role="alert">
    <p className="text-sm font-semibold text-fd-muted-foreground">Paper 3 · AlgoCore</p>
    <h1 className="mt-3 text-2xl font-semibold">This learning page could not be loaded · Không thể tải trang học</h1>
    <p className="mt-4 text-fd-muted-foreground">Your saved progress on this device is safe. Try again, or return to the Study Map and continue with another topic.</p>
    <p className="mt-2 text-fd-muted-foreground">Tiến độ đã lưu trên thiết bị vẫn được giữ. Hãy thử lại hoặc quay về Bản đồ học tập.</p>
    <div className="mt-7 flex flex-wrap gap-3">
      <button type="button" className="min-h-11 rounded-lg bg-fd-primary px-4 font-semibold text-fd-primary-foreground" onClick={reset}>Try again · Thử lại</button>
      <Link className="inline-flex min-h-11 items-center rounded-lg border px-4 font-semibold" href="/paper-3?lang=en">Study Map · Bản đồ học tập</Link>
    </div>
  </main>;
}
