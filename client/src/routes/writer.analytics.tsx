import { createFileRoute } from "@tanstack/react-router";

import { PageShell } from "@/components/site-header";
import { WriterNav } from "@/components/writer-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { articlesByAuthor, currentUser, viewsSeries } from "@/lib/mock-data";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/writer/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Prosely" }] }),
  component: Analytics,
});

function Analytics() {
  const arts = articlesByAuthor(currentUser.id);
  const totalViews = arts.reduce((s, a) => s + a.views, 0);
  const totalReads = Math.round(totalViews * 0.62);
  const readRatio = ((totalReads / totalViews) * 100).toFixed(1);

  return (
    <PageShell>
      <div className="container-wide py-10">
        <h1 className="font-serif text-4xl font-semibold">Analytics</h1>
        <div className="mt-6"><WriterNav /></div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Views (7d)</CardTitle></CardHeader><CardContent><div className="font-serif text-3xl font-semibold">{totalViews.toLocaleString()}</div><div className="mt-1 text-xs text-primary">+18.2% vs last week</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Reads (7d)</CardTitle></CardHeader><CardContent><div className="font-serif text-3xl font-semibold">{totalReads.toLocaleString()}</div><div className="mt-1 text-xs text-primary">+12.4% vs last week</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Read ratio</CardTitle></CardHeader><CardContent><div className="font-serif text-3xl font-semibold">{readRatio}%</div><div className="mt-1 text-xs text-muted-foreground">Industry avg. 48%</div></CardContent></Card>
        </div>

        <Card className="mt-8">
          <CardHeader><CardTitle>Views & reads over time</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={{ views: { label: "Views", color: "var(--chart-1)" }, reads: { label: "Reads", color: "var(--chart-3)" } }} className="h-72 w-full">
              <AreaChart data={viewsSeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="views" stroke="var(--color-views)" fill="var(--color-views)" fillOpacity={0.2} />
                <Area type="monotone" dataKey="reads" stroke="var(--color-reads)" fill="var(--color-reads)" fillOpacity={0.2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader><CardTitle>Top performing stories</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[...arts].sort((a, b) => b.views - a.views).slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0">
                <div className="min-w-0 flex-1"><div className="line-clamp-1 font-medium">{a.title}</div><div className="text-xs text-muted-foreground">{a.readMinutes} min read · {new Date(a.publishedAt).toLocaleDateString()}</div></div>
                <div className="ml-4 text-right"><div className="font-semibold tabular-nums">{a.views.toLocaleString()}</div><div className="text-xs text-muted-foreground">views</div></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
