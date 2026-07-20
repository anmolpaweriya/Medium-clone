import { createFileRoute, notFound } from "@tanstack/react-router";

import { PublicationHeader } from "@/components/publication-header";
import { PublicationNav } from "@/components/publication-nav";
import { PageShell } from "@/components/site-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublication, users } from "@/lib/mock-data";

export const Route = createFileRoute("/publication/$slug/subscribers")({
  loader: ({ params }) => { const pub = getPublication(params.slug); if (!pub) throw notFound(); return { pub }; },
  errorComponent: ({ error }) => <PageShell><div className="container-prose py-20 text-center">{error.message}</div></PageShell>,
  notFoundComponent: () => <PageShell><div className="container-prose py-20 text-center">Not found</div></PageShell>,
  component: Subs,
});

function Subs() {
  const { pub } = Route.useLoaderData();
  const sample = users.filter((u) => u.role !== "admin");
  return (
    <PageShell>
      <PublicationHeader pub={pub} />
      <div className="container-wide mt-6"><PublicationNav slug={pub.slug} /></div>
      <div className="container-wide py-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Subscribers</CardTitle></CardHeader><CardContent><div className="font-serif text-3xl font-semibold">{pub.subscribers.toLocaleString()}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Growth (30d)</CardTitle></CardHeader><CardContent><div className="font-serif text-3xl font-semibold text-primary">+2,410</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Open rate</CardTitle></CardHeader><CardContent><div className="font-serif text-3xl font-semibold">62.4%</div></CardContent></Card>
        </div>
        <h2 className="mt-8 font-serif text-2xl font-semibold">Recent subscribers</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {sample.map((u) => (
            <div key={u.id} className="flex items-center gap-3 rounded-lg border border-border/60 bg-card p-3">
              <Avatar className="h-10 w-10"><AvatarImage src={u.avatar} /><AvatarFallback>{u.name[0]}</AvatarFallback></Avatar>
              <div className="min-w-0"><div className="text-sm font-medium">{u.name}</div><div className="text-xs text-muted-foreground">Subscribed 2d ago</div></div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
