import { createFileRoute } from "@tanstack/react-router";
import { Search as SearchIcon } from "lucide-react";
import { useState } from "react";

import { ArticleCard } from "@/components/article-card";
import { PageShell } from "@/components/site-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { publications, publishedArticles, tags, users } from "@/lib/mock-data";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "Search — Prosely" }] }),
  component: SearchPage,
});

function SearchPage() {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const filterArt = publishedArticles().filter((a) => !query || a.title.toLowerCase().includes(query) || a.tags.join(" ").toLowerCase().includes(query));
  const filterUsers = users.filter((u) => u.role !== "admin" && (!query || u.name.toLowerCase().includes(query) || u.handle.includes(query)));
  const filterPubs = publications.filter((p) => !query || p.name.toLowerCase().includes(query));

  return (
    <PageShell>
      <div className="container-wide py-10">
        <h1 className="font-serif text-4xl font-semibold">Search</h1>
        <div className="relative mt-6 max-w-2xl">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search stories, writers, publications, tags..."
            className="h-12 w-full rounded-full border border-border bg-background pl-11 pr-4 text-base outline-none focus:border-foreground/40"
            autoFocus
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground">Popular:</span>
          {tags.slice(0, 8).map((t) => (
            <button key={t} onClick={() => setQ(t)}>
              <Badge variant="secondary" className="rounded-full">{t}</Badge>
            </button>
          ))}
        </div>

        <Tabs defaultValue="stories" className="mt-8">
          <TabsList>
            <TabsTrigger value="stories">Stories ({filterArt.length})</TabsTrigger>
            <TabsTrigger value="people">People ({filterUsers.length})</TabsTrigger>
            <TabsTrigger value="pubs">Publications ({filterPubs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="stories" className="mt-4">
            {filterArt.length === 0 ? <p className="py-16 text-center text-muted-foreground">No stories match.</p> : filterArt.map((a) => <ArticleCard key={a.id} article={a} />)}
          </TabsContent>
          <TabsContent value="people" className="mt-6 grid gap-4 sm:grid-cols-2">
            {filterUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-3 rounded-lg border border-border/60 p-4">
                <Avatar className="h-12 w-12"><AvatarImage src={u.avatar} /><AvatarFallback>{u.name[0]}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{u.name}</div>
                  <div className="line-clamp-1 text-xs text-muted-foreground">{u.bio}</div>
                </div>
                <Button size="sm" variant="outline" className="rounded-full">Follow</Button>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="pubs" className="mt-6 grid gap-4 sm:grid-cols-2">
            {filterPubs.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-lg border border-border/60 p-4">
                <Avatar className="h-12 w-12 rounded-md"><AvatarImage src={p.logo} /><AvatarFallback>{p.name[0]}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1"><div className="font-medium">{p.name}</div><div className="line-clamp-1 text-xs text-muted-foreground">{p.tagline}</div></div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  );
}
