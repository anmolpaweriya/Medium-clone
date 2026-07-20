import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Eye, Flag, Shield, Trash2, TrendingUp, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useEffect } from "react";
import { toast } from "sonner";

import { PageShell } from "@/components/site-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAdminArticles,
  useAdminStats,
  useAdminUsers,
  useDeleteAdminArticle,
  useDeleteAdminUser,
  useToggleUserRole,
} from "@/hooks/use-admin";
import { useAuth } from "@/hooks/use-auth";
import { viewsSeries } from "@/lib/mock-data";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin console — Prosely" }, { name: "robots", content: "noindex" }] }),
  component: Admin,
});

function Admin() {
  const navigate = useNavigate();
  const { data: user, isLoading: isAuthLoading } = useAuth();

  const { data: statsData } = useAdminStats();
  const { data: adminUsers = [], isLoading: isUsersLoading } = useAdminUsers();
  const { data: adminArticles = [], isLoading: isArticlesLoading } = useAdminArticles();

  const { mutate: deleteUser, isPending: isDeletingUser } = useDeleteAdminUser();
  const { mutate: deleteArticle, isPending: isDeletingArticle } = useDeleteAdminArticle();
  const { mutate: toggleRole, isPending: isTogglingRole } = useToggleUserRole();

  useEffect(() => {
    if (!isAuthLoading && (!user || user.role !== "admin")) {
      toast.error("Access denied. Admin privileges required.");
      navigate({ to: "/" });
    }
  }, [user, isAuthLoading, navigate]);

  if (isAuthLoading || !user || user.role !== "admin") {
    return (
      <PageShell>
        <div className="container-wide py-20 text-center text-muted-foreground">
          Checking authorization...
        </div>
      </PageShell>
    );
  }

  const stats = [
    { label: "Total registered users", value: (statsData?.totalUsers || adminUsers.length || 0).toLocaleString(), icon: Users, delta: "Active platform users" },
    { label: "Articles published", value: (statsData?.publishedArticles || 0).toLocaleString(), icon: TrendingUp, delta: `Out of ${statsData?.totalArticles || 0} total stories` },
    { label: "Total article views", value: (statsData?.totalViews || 0).toLocaleString(), icon: Eye, delta: "Across all stories" },
    { label: "Total comments", value: (statsData?.totalComments || 0).toLocaleString(), icon: Flag, delta: "Community engagements" },
  ];

  const handleDeleteUserClick = (targetUser: any) => {
    if (targetUser.id === user.id) {
      toast.error("You cannot delete your own admin account.");
      return;
    }
    if (window.confirm(`Are you sure you want to delete user "${targetUser.name}" (@${targetUser.username})? All their published stories and comments will be permanently deleted.`)) {
      deleteUser(targetUser.id);
    }
  };

  const handleToggleRoleClick = (targetUser: any) => {
    if (targetUser.id === user.id) {
      toast.error("You cannot change your own admin role.");
      return;
    }
    const nextRole = targetUser.role === "admin" ? "user" : "admin";
    if (window.confirm(`Are you sure you want to change "${targetUser.name}" role to ${nextRole}?`)) {
      toggleRole(targetUser.id);
    }
  };

  const handleDeleteArticleClick = (targetArticle: any) => {
    if (window.confirm(`Are you sure you want to delete story "${targetArticle.title}"?`)) {
      deleteArticle(targetArticle.id);
    }
  };

  return (
    <PageShell>
      <div className="container-wide py-10">
        <div className="flex items-center gap-3">
          <Badge className="rounded-full bg-primary text-primary-foreground">Admin Console</Badge>
          <h1 className="font-serif text-4xl font-semibold">Platform Management</h1>
        </div>
        <p className="mt-1 text-muted-foreground">Manage user accounts, moderate platform articles, and monitor system metrics.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-serif text-3xl font-semibold">{s.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.delta}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="users" className="mt-8">
          <TabsList>
            <TabsTrigger value="users">Users ({adminUsers.length})</TabsTrigger>
            <TabsTrigger value="articles">Articles Moderation ({adminArticles.length})</TabsTrigger>
            <TabsTrigger value="activity">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Registered Users</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Stories</TableHead>
                      <TableHead className="text-right">Followers</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminUsers.map((u: any) => (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={u.avatar} />
                              <AvatarFallback>{u.name?.[0] || "U"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-1 text-sm font-medium">
                                {u.name}
                                {u.role === "admin" && <Shield className="h-3.5 w-3.5 text-primary" />}
                              </div>
                              <div className="text-xs text-muted-foreground">@{u.username} · {u.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={u.role === "admin" ? "default" : "outline"} className="rounded-full capitalize">
                            {u.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{u.articlesCount || 0}</TableCell>
                        <TableCell className="text-right tabular-nums">{(u.followers || 0).toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {u.id !== user.id && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleToggleRoleClick(u)}
                                  disabled={isTogglingRole}
                                >
                                  {u.role === "admin" ? "Demote to User" : "Make Admin"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteUserClick(u)}
                                  disabled={isDeletingUser}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {u.id === user.id && (
                              <span className="text-xs text-muted-foreground italic py-1">Current User</span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {adminUsers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                          No users found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="articles" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Article Moderation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {adminArticles.map((a: any) => (
                  <div key={a.id} className="flex flex-wrap items-center gap-4 rounded-lg border border-border/60 p-4">
                    <img src={a.coverImage || "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400"} alt="" className="h-14 w-20 rounded object-cover" />
                    <div className="min-w-0 flex-1">
                      <Link to="/article/$slug" params={{ slug: a.slug }} className="line-clamp-1 font-medium hover:underline">
                        {a.title}
                      </Link>
                      <div className="text-xs text-muted-foreground">
                        By {a.author?.name} (@{a.author?.username}) · {a.views || 0} views · {a.likes || 0} likes · {a.comments || 0} comments
                      </div>
                    </div>
                    <Badge variant={a.status === "published" ? "secondary" : "outline"} className="rounded-full capitalize">
                      {a.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteArticleClick(a)}
                      disabled={isDeletingArticle}
                    >
                      <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete Article
                    </Button>
                  </div>
                ))}
                {adminArticles.length === 0 && (
                  <p className="py-8 text-center text-muted-foreground">No articles published yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardHeader><CardTitle>Platform Views Analytics</CardTitle></CardHeader>
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
        </Tabs>
      </div>
    </PageShell>
  );
}
