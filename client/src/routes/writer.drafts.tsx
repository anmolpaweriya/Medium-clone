import { Link, createFileRoute } from "@tanstack/react-router";
import { FileText, Trash2 } from "lucide-react";

import { PageShell } from "@/components/site-header";
import { WriterNav } from "@/components/writer-nav";
import { Button } from "@/components/ui/button";
import { useMyArticles, useDeleteArticle } from "@/hooks/use-article";

export const Route = createFileRoute("/writer/drafts")({
  head: () => ({ meta: [{ title: "Drafts — Prosely" }] }),
  component: Drafts,
});

function Drafts() {
  const { data: allArticles = [], isLoading } = useMyArticles();
  const { mutate: deleteArticle, isPending: isDeleting } = useDeleteArticle();
  const drafts = allArticles.filter((d: any) => d.status === "draft");

  if (isLoading) {
    return (
      <PageShell>
        <div className="container-wide py-10">
          Loading drafts...
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="container-wide py-10">
        <h1 className="font-serif text-4xl font-semibold">Drafts</h1>
        <div className="mt-6"><WriterNav /></div>
        <div className="mt-8 space-y-3">
          {drafts.map((d: any) => (
            <div key={d.id} className="flex items-center gap-4 rounded-lg border border-border/60 bg-card p-4">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <div className="font-medium">{d.title || "Untitled Draft"}</div>
                <div className="text-xs text-muted-foreground">Last edited {new Date(d.updatedAt || d.createdAt).toLocaleDateString()} · {d.readTime || 1} min read</div>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <Link to="/writer/editor" search={{ id: d.id }}>Continue writing</Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteArticle(d.id)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {drafts.length === 0 && <p className="text-muted-foreground">You have no drafts.</p>}
        </div>
      </div>
    </PageShell>
  );
}
