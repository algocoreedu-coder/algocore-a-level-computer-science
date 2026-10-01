import { redirect } from "next/navigation";

function resolveLocale(value: string | string[] | undefined) {
  return value === "vi" ? "vi" : "en";
}

export default async function LegacyDocsPage({
  searchParams,
}: {
  readonly searchParams: Promise<{ lang?: string | string[] }>;
}) {
  const locale = resolveLocale((await searchParams).lang);
  redirect(`/paper-3?lang=${locale}`);
}
