import { Link, createFileRoute } from "@tanstack/react-router";

import { PageShell } from "@/components/site-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { followingIds, publications, users } from "@/lib/mock-data";

export const Route = createFileRoute("/following")({
  head: () => ({ meta: [{ title: "Following — Prosely" }] }),
  component: Following,
});

function Following() {
  const writers = users.filter((u) => followingIds.includes(u.id));
  return (
    <PageShell>
      <div className="container-wide py-12">
        <h1 className="font-serif text-4xl font-semibold">Following</h1>
        <Tabs defaultValue="writers" className="mt-8">
          <TabsList>
            <TabsTrigger value="writers">Writers ({writers.length})</TabsTrigger>
            <TabsTrigger value="pubs">Publications ({publications.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="writers" className="mt-6 grid gap-4 sm:grid-cols-2">
            {writers.map((u) => (
              <div key={u.id} className="flex items-center gap-4 rounded-lg border border-border/60 p-4">
                <Avatar className="h-12 w-12"><AvatarImage src={u.avatar} /><AvatarFallback>{u.name[0]}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1"><div className="font-medium">{u.name}</div><div className="line-clamp-1 text-xs text-muted-foreground">{u.bio}</div><div className="text-xs text-muted-foreground">{u.followers.toLocaleString()} followers</div></div>
                <Button size="sm" variant="outline" className="rounded-full">Following</Button>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="pubs" className="mt-6 grid gap-4 sm:grid-cols-2">
            {publications.map((p) => (
              <Link key={p.id} to="/publication/$slug" params={{ slug: p.slug }} className="flex items-center gap-4 rounded-lg border border-border/60 p-4 hover:border-foreground/30">
                <Avatar className="h-12 w-12 rounded-md"><AvatarImage src={p.logo} /><AvatarFallback>{p.name[0]}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1"><div className="font-medium">{p.name}</div><div className="line-clamp-1 text-xs text-muted-foreground">{p.tagline}</div></div>
              </Link>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  );
}
