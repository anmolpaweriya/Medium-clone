import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Eye, Flag, TrendingUp, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { PageShell } from "@/components/site-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { articles, getUser, publications, users, viewsSeries } from "@/lib/mock-data";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin console — Prosely" }, { name: "robots", content: "noindex" }] }),
  component: Admin,
});

const flagged = [
  { id: "f1", articleId: "a3", reason: "Spam / self-promotion", reporter: "u5", severity: "low" },
  { id: "f2", articleId: "a2", reason: "Copyright claim", reporter: "u4", severity: "high" },
  { id: "f3", articleId: "a5", reason: "Misinformation", reporter: "u3", severity: "medium" },
];

function Admin() {
  const stats = [
    { label: "Total users", value: "24,180", icon: Users, delta: "+412 this week" },
    { label: "Articles published", value: "8,942", icon: TrendingUp, delta: "+128 this week" },
    { label: "Daily active readers", value: "62,540", icon: Eye, delta: "+3.2%" },
    { label: "Open reports", value: String(flagged.length), icon: Flag, delta: "Needs review" },
  ];
  return (
    <PageShell>
      <div className="container-wide py-10">
        <div className="flex items-center gap-3">
          <Badge className="rounded-full" variant="outline">Admin</Badge>
          <h1 className="font-serif text-4xl font-semibold">Platform console</h1>
        </div>
        <p className="mt-1 text-muted-foreground">Manage users, moderate content, and monitor platform activity.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="font-serif text-3xl font-semibold">{s.value}</div><div className="mt-1 text-xs text-muted-foreground">{s.delta}</div></CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="activity" className="mt-8">
          <TabsList>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="mod">Moderation ({flagged.length})</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="pubs">Publications</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardHeader><CardTitle>Platform views (7d)</CardTitle></CardHeader>
              <CardContent>
                <ChartContainer config={{ views: { label: "Views", color: "var(--chart-1)" }, reads: { label: "Reads", color: "var(--chart-2)" } }} className="h-80 w-full">
                  <BarChart data={viewsSeries}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="views" fill="var(--color-views)" radius={4} />
                    <Bar dataKey="reads" fill="var(--color-reads)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mod" className="mt-6">
            <Card>
              <CardHeader><CardTitle>Flagged content</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {flagged.map((f) => {
                  const a = articles.find((x) => x.id === f.articleId)!;
                  const reporter = getUser(f.reporter);
                  return (
                    <div key={f.id} className="flex flex-wrap items-center gap-4 rounded-lg border border-border/60 p-4">
                      <img src={a.cover} alt="" className="h-14 w-20 rounded object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="line-clamp-1 font-medium">{a.title}</div>
                        <div className="text-xs text-muted-foreground">Reported by {reporter.name} · {f.reason}</div>
                      </div>
                      <Badge variant={f.severity === "high" ? "destructive" : "secondary"} className="rounded-full capitalize">
                        <AlertTriangle className="mr-1 h-3 w-3" />{f.severity}
                      </Badge>
                      <div className="flex gap-2"><Button size="sm" variant="outline">Dismiss</Button><Button size="sm">Review</Button></div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Role</TableHead><TableHead className="text-right">Followers</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell><div className="flex items-center gap-3"><Avatar className="h-8 w-8"><AvatarImage src={u.avatar} /><AvatarFallback>{u.name[0]}</AvatarFallback></Avatar><div><div className="text-sm font-medium">{u.name}</div><div className="text-xs text-muted-foreground">@{u.handle}</div></div></div></TableCell>
                        <TableCell><Badge variant="outline" className="rounded-full capitalize">{u.role}</Badge></TableCell>
                        <TableCell className="text-right tabular-nums">{u.followers.toLocaleString()}</TableCell>
                        <TableCell><span className="inline-flex items-center gap-1 text-xs text-primary"><CheckCircle2 className="h-3.5 w-3.5" /> Active</span></TableCell>
                        <TableCell><Button size="sm" variant="ghost">Manage</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pubs" className="mt-6 grid gap-4 sm:grid-cols-2">
            {publications.map((p) => (
              <div key={p.id} className="flex items-center gap-4 rounded-lg border border-border/60 bg-card p-4">
                <Avatar className="h-12 w-12 rounded-md"><AvatarImage src={p.logo} /><AvatarFallback>{p.name[0]}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1"><div className="font-medium">{p.name}</div><div className="text-xs text-muted-foreground">{p.subscribers.toLocaleString()} subscribers · {p.writerIds.length} writers</div></div>
                <Button size="sm" variant="outline">Manage</Button>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  );
}
