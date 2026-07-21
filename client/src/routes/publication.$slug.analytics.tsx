import { useParams } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { PublicationHeader } from "@/components/publication-header";
import { PublicationNav } from "@/components/publication-nav";
import { PageShell } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { articlesByPublication, getPublication, viewsSeries } from "@/lib/mock-data";

export default function PubAnalytics() {
  const { slug } = useParams<{ slug: string }>();
  const pub = slug ? getPublication(slug) : undefined;

  if (!pub) {
    return <PageShell><div className="container-prose py-20 text-center">Not found</div></PageShell>;
  }
  const arts = articlesByPublication(pub.id);
  const total = arts.reduce((s, a) => s + a.views, 0);
  return (
    <PageShell>
      <PublicationHeader pub={pub} />
      <div className="container-wide mt-6"><PublicationNav slug={pub.slug} /></div>
      <div className="container-wide py-8">
        <div className="grid gap-4 sm:grid-cols-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Views</CardTitle></CardHeader><CardContent><div className="font-serif text-3xl font-semibold">{total.toLocaleString()}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Stories</CardTitle></CardHeader><CardContent><div className="font-serif text-3xl font-semibold">{arts.length}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Avg. read time</CardTitle></CardHeader><CardContent><div className="font-serif text-3xl font-semibold">4:12</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Subscribers</CardTitle></CardHeader><CardContent><div className="font-serif text-3xl font-semibold">{pub.subscribers.toLocaleString()}</div></CardContent></Card>
        </div>

        <Card className="mt-6">
          <CardHeader><CardTitle>Weekly views</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={{ views: { label: "Views", color: "var(--chart-1)" } }} className="h-72 w-full">
              <BarChart data={viewsSeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="views" fill="var(--color-views)" radius={6} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
