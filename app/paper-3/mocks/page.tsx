import mockAData from "@/content/paper3/mocks/mock-paper-3-a.json";
import mockBData from "@/content/paper3/mocks/mock-paper-3-b.json";
import { MockPaperWorkspace } from "@/app/components/paper3-learning/MockPaperWorkspace";
import { resolveLocale, type PageQuery } from "@/app/lib/paper3/catalog";
import type { MockPaper } from "@/app/lib/paper3/mock-types";

export default async function Paper3MocksPage({ searchParams }: { readonly searchParams: Promise<PageQuery> }) {
  const locale = resolveLocale(await searchParams);
  return <MockPaperWorkspace papers={[mockAData as MockPaper, mockBData as MockPaper]} locale={locale} />;
}
