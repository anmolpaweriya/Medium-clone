import { Flame } from "lucide-react";

import { ArticleCard } from "@/components/article-card";
import { PageShell } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { useTrendingFeed } from "@/hooks/use-article";
import { trendingTags } from "@/lib/mock-data";

export default function Trending() {
  const { data: trendingArticles = [], isLoading } = useTrendingFeed();

  if (isLoading) {
    return (
      <PageShell>
        <div className="container-wide py-12">
          Loading trending articles...
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="container-wide py-12">
        <div className="mb-8 flex items-center gap-3">
          <Flame className="h-7 w-7 text-primary" />
          <h1 className="font-serif text-4xl font-semibold">Trending this week</h1>
        </div>
        <div className="mb-8 flex flex-wrap gap-2">
          {trendingTags.map((t) => (<Badge key={t} variant="secondary" className="rounded-full">{t}</Badge>))}
        </div>
        <div className="grid gap-2 md:grid-cols-[1fr_1fr]">
          {trendingArticles.map((a: any, i: number) => (
            <div key={a.id} className="flex items-start gap-4">
              <span className="mt-6 w-8 shrink-0 font-serif text-3xl text-muted-foreground/50">{String(i + 1).padStart(2, "0")}</span>
              <div className="flex-1"><ArticleCard article={a} compact /></div>
            </div>
          ))}
          {trendingArticles.length === 0 && (
            <p className="col-span-2 text-muted-foreground">No trending articles found.</p>
          )}
        </div>
      </div>
    </PageShell>
  );
}
