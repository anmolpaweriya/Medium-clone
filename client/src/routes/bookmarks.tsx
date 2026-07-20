import { createFileRoute } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";

import { ArticleCard } from "@/components/article-card";
import { PageShell } from "@/components/site-header";
import { articles, bookmarkedIds } from "@/lib/mock-data";

export const Route = createFileRoute("/bookmarks")({
  head: () => ({ meta: [{ title: "Bookmarks — Prosely" }] }),
  component: Bookmarks,
});

function Bookmarks() {
  const saved = articles.filter((a) => bookmarkedIds.includes(a.id));
  return (
    <PageShell>
      <div className="container-prose py-12">
        <div className="mb-8 flex items-center gap-3"><Bookmark className="h-6 w-6" /><h1 className="font-serif text-4xl font-semibold">Your bookmarks</h1></div>
        <p className="mb-8 text-muted-foreground">{saved.length} saved stories</p>
        {saved.map((a) => <ArticleCard key={a.id} article={a} />)}
      </div>
    </PageShell>
  );
}
