import { Link } from "react-router-dom";
import { Eye, MessageCircle, Pencil, ThumbsUp, Trash2 } from "lucide-react";

import { PageShell } from "@/components/site-header";
import { WriterNav } from "@/components/writer-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMyArticles, useDeleteArticle } from "@/hooks/use-article";

export default function MyArticles() {
  const { data: allArticles = [], isLoading } = useMyArticles();
  const { mutate: deleteArticle, isPending: isDeleting } = useDeleteArticle();
  const arts = allArticles.filter((a: any) => a.status === "published");

  if (isLoading) {
    return (
      <PageShell>
        <div className="container-wide py-10">
          Loading articles...
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="container-wide py-10">
        <div className="flex items-center justify-between"><h1 className="font-serif text-4xl font-semibold">My articles</h1><Button asChild className="rounded-full"><Link to="/writer/editor">New story</Link></Button></div>
        <div className="mt-6"><WriterNav /></div>

        <div className="mt-8 rounded-lg border border-border/60 bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right"><Eye className="ml-auto h-4 w-4" /></TableHead>
                <TableHead className="text-right"><ThumbsUp className="ml-auto h-4 w-4" /></TableHead>
                <TableHead className="text-right"><MessageCircle className="ml-auto h-4 w-4" /></TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {arts.map((a: any) => (
                <TableRow key={a.id}>
                  <TableCell className="max-w-md">
                    <Link to={`/article/${a.slug}`} className="font-medium hover:underline">{a.title}</Link>
                    <div className="line-clamp-1 text-xs text-muted-foreground">{a.excerpt}</div>
                  </TableCell>
                  <TableCell><Badge className="rounded-full" variant="secondary">Published</Badge></TableCell>
                  <TableCell className="text-right tabular-nums">{(a.views || 0).toLocaleString()}</TableCell>
                  <TableCell className="text-right tabular-nums">{(a.likes || 0).toLocaleString()}</TableCell>
                  <TableCell className="text-right tabular-nums">{a.comments || 0}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : "Draft"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button asChild variant="ghost" size="icon" title="Edit story">
                        <Link to={`/writer/editor?id=${a.id}`}><Pencil className="h-4 w-4" /></Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete story"
                        onClick={() => deleteArticle(a.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {arts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                    You haven't published any stories yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageShell>
  );
}
