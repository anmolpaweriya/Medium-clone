import { Link, createFileRoute } from "@tanstack/react-router";
import { Eye, MessageCircle, MoreHorizontal, ThumbsUp } from "lucide-react";

import { PageShell } from "@/components/site-header";
import { WriterNav } from "@/components/writer-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { articlesByAuthor, currentUser } from "@/lib/mock-data";

export const Route = createFileRoute("/writer/articles")({
  head: () => ({ meta: [{ title: "My articles — Prosely" }] }),
  component: MyArticles,
});

function MyArticles() {
  const arts = articlesByAuthor(currentUser.id);
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
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {arts.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="max-w-md">
                    <Link to="/article/$slug" params={{ slug: a.slug }} className="font-medium hover:underline">{a.title}</Link>
                    <div className="line-clamp-1 text-xs text-muted-foreground">{a.subtitle}</div>
                  </TableCell>
                  <TableCell><Badge className="rounded-full" variant="secondary">Published</Badge></TableCell>
                  <TableCell className="text-right tabular-nums">{a.views.toLocaleString()}</TableCell>
                  <TableCell className="text-right tabular-nums">{a.claps.toLocaleString()}</TableCell>
                  <TableCell className="text-right tabular-nums">{a.responses}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(a.publishedAt).toLocaleDateString()}</TableCell>
                  <TableCell><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageShell>
  );
}
