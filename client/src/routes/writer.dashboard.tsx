import { Link, createFileRoute } from "@tanstack/react-router";
import { Eye, MessageCircle, ThumbsUp, Users } from "lucide-react";

import { PageShell } from "@/components/site-header";
import { WriterNav } from "@/components/writer-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { articlesByAuthor, currentUser, draftsByAuthor } from "@/lib/mock-data";

export const Route = createFileRoute("/writer/dashboard")({
  head: () => ({ meta: [{ title: "Writer dashboard — Prosely" }] }),
  component: Dashboard,
});

function Dashboard() {
  const arts = articlesByAuthor(currentUser.id);
  const drafts = draftsByAuthor(currentUser.id);
  const totalViews = arts.reduce((s, a) => s + a.views, 0);
  const totalClaps = arts.reduce((s, a) => s + a.claps, 0);
  const totalResponses = arts.reduce((s, a) => s + a.responses, 0);

  const stats = [
    { label: "Total views", value: totalViews.toLocaleString(), icon: Eye },
    { label: "Total claps", value: totalClaps.toLocaleString(), icon: ThumbsUp },
    { label: "Responses", value: totalResponses.toLocaleString(), icon: MessageCircle },
    { label: "Followers", value: currentUser.followers.toLocaleString(), icon: Users },
  ];

  return (
    <PageShell>
      <div className="container-wide py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl font-semibold">Welcome back, {currentUser.name.split(" ")[0]}</h1>
            <p className="mt-1 text-muted-foreground">Here's how your writing is doing.</p>
          </div>
          <Button asChild className="rounded-full"><Link to="/writer/editor">Write a story</Link></Button>
        </div>
        <div className="mt-6"><WriterNav /></div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="font-serif text-3xl font-semibold">{s.value}</div></CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Recent stories</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {arts.slice(0, 4).map((a) => (
                <Link key={a.id} to="/article/$slug" params={{ slug: a.slug }} className="flex items-center gap-4 rounded-md p-2 hover:bg-muted">
                  <img src={a.cover} alt="" className="h-14 w-20 shrink-0 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-1 font-medium">{a.title}</div>
                    <div className="text-xs text-muted-foreground">{a.views.toLocaleString()} views · {a.claps.toLocaleString()} claps</div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Drafts in progress</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {drafts.map((d) => (
                <div key={d.id} className="flex items-center justify-between rounded-md p-2 hover:bg-muted">
                  <div className="min-w-0"><div className="line-clamp-1 font-medium">{d.title}</div><div className="text-xs text-muted-foreground">Last edited {new Date(d.publishedAt).toLocaleDateString()}</div></div>
                  <Button asChild variant="ghost" size="sm"><Link to="/writer/editor">Continue</Link></Button>
                </div>
              ))}
              {drafts.length === 0 && <p className="text-sm text-muted-foreground">No drafts yet.</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
