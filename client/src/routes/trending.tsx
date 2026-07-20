import { createFileRoute } from "@tanstack/react-router";
import { Flame } from "lucide-react";

import { ArticleCard } from "@/components/article-card";
import { PageShell } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { publishedArticles, trendingTags } from "@/lib/mock-data";

export const Route = createFileRoute("/trending")({
  head: () => ({ meta: [{ title: "Trending — Prosely" }, { name: "description", content: "The most-read articles on Prosely this week." }] }),
  component: Trending,
});

function Trending() {
  const sorted = [...publishedArticles()].sort((a, b) => b.claps - a.claps);
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
          {sorted.map((a, i) => (
            <div key={a.id} className="flex items-start gap-4">
              <span className="mt-6 w-8 shrink-0 font-serif text-3xl text-muted-foreground/50">{String(i + 1).padStart(2, "0")}</span>
              <div className="flex-1"><ArticleCard article={a} compact /></div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
