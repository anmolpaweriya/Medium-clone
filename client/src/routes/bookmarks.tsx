import { createFileRoute } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";

import { ArticleCard } from "@/components/article-card";
import { PageShell } from "@/components/site-header";
import { useBookmarks } from "@/hooks/use-auth";

export const Route = createFileRoute("/bookmarks")({
  head: () => ({ meta: [{ title: "Bookmarks — Prosely" }] }),
  component: Bookmarks,
});

function Bookmarks() {
  const { data: saved = [], isLoading } = useBookmarks();

  if (isLoading) {
    return (
      <PageShell>
        <div className="container-prose py-12">
          Loading bookmarks...
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="container-prose py-12">
        <div className="mb-8 flex items-center gap-3"><Bookmark className="h-6 w-6" /><h1 className="font-serif text-4xl font-semibold">Your bookmarks</h1></div>
        <p className="mb-8 text-muted-foreground">{saved.length} saved stories</p>
        {saved.map((a: any) => <ArticleCard key={a.id} article={a} />)}
        {saved.length === 0 && (
          <p className="text-muted-foreground">You have no bookmarked stories yet.</p>
        )}
      </div>
    </PageShell>
  );
}
