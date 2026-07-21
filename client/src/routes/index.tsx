import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp } from "lucide-react";

import { ArticleCard } from "@/components/article-card";
import { PageShell } from "@/components/site-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth, useToggleFollow } from "@/hooks/use-auth";
import { useHome } from "@/hooks/use-home";

export default function Home() {
  const { data: user } = useAuth();
  const { mutate: toggleFollow, isPending: isFollowing } = useToggleFollow();
  const { data, isLoading } = useHome();

  if (isLoading) {
    return (
      <PageShell>
        <div className="container-wide py-24 flex justify-center">
          Loading articles...
        </div>
      </PageShell>
    );
  }
  if (!data?.hero) {
    return (
      <PageShell>
        <div className="container-wide py-24 text-center">
          <h1 className="font-serif text-4xl font-semibold">
            No articles yet
          </h1>

          <p className="mt-2 text-muted-foreground">
            Be the first person to publish a story.
          </p>

          <Button asChild className="mt-6 rounded-full">
            <Link to="/writer/editor">
              Write your first story
            </Link>
          </Button>
        </div>
      </PageShell>
    );
  }

  const {
    hero,
    featured,
    latest,
    writers,
    trendingTags,
  } = data;

  return (
    <PageShell>
      {/* Hero band */}
      <section className="border-b border-border/60 bg-accent/40">
        <div className="container-wide grid gap-10 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center">
            <h1 className="font-serif text-5xl leading-[1.05] tracking-tight md:text-7xl">
              Stay curious.
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">
              Discover stories, thinking, and expertise from writers on every topic. A quieter place on the internet to read what matters.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-6">
                <Link to="/register">Start reading</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-6">
                <Link to="/writer/editor">Start writing</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>Trending topics:</span>
              {trendingTags.map((t) => (
                <Link key={t} to="/search" className="rounded-full border border-border bg-background px-3 py-1 hover:border-foreground/40">
                  {t}
                </Link>
              ))}
            </div>
          </div>

          <Link to={`/article/${hero.slug}`} className="group block">
            <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
              <img src={hero.coverImage} alt="" className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
              <div className="p-6">
                <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Avatar className="h-6 w-6"><AvatarImage src={hero.author.avatar} /><AvatarFallback>{hero.author.name[0]}</AvatarFallback></Avatar>
                  <span className="text-foreground">{hero.author.name}</span>
                  <span>·</span>
                  <span>{hero.readTime} min read</span>
                </div>
                <h2 className="font-serif text-2xl font-semibold md:text-3xl">{hero.title}</h2>
                <p className="mt-2 line-clamp-2 text-muted-foreground">{hero.excerpt}</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <div className="container-wide grid gap-12 py-12 md:grid-cols-[1fr_300px]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold">Editor's picks</h2>
            <Link to="/trending" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              See all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featured.map((a) => {
              return (
                <Link key={a.id} to={`/article/${a.slug}`} className="group block">
                  <img src={a.coverImage} alt="" className="aspect-[4/3] w-full rounded-md object-cover" />
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Avatar className="h-5 w-5"><AvatarImage src={a.author.avatar} /><AvatarFallback>{a.author.name[0]}</AvatarFallback></Avatar>
                    <span className="text-foreground">{a.author.name}</span>
                  </div>
                  <h3 className="mt-2 font-serif text-lg font-semibold leading-snug group-hover:opacity-90">{a.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {a.excerpt}
                  </p>
                </Link>
              );
            })}
          </div>

          <div className="mt-12">
            <h2 className="mb-2 font-serif text-2xl font-semibold">Latest</h2>
            {latest.map((a) => (<ArticleCard key={a.id} article={a} />))}
          </div>
        </div>

        <aside className="space-y-10">
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Featured writers
            </h3>

            <div className="space-y-4">
              {writers.slice(0, 4).map((u) => (
                <div key={u.id} className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={u.avatar} />
                    <AvatarFallback>{u.name[0]}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="font-medium">{u.name}</div>
                    <div className="text-xs text-muted-foreground">
                      @{u.username}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Who to follow</h3>
            <div className="space-y-4">
              {writers.map((u: any) => {
                const isFollowingWriter = user?.following?.includes(u.id);
                return (
                  <div key={u.id} className="flex items-center gap-3">
                    <Avatar className="h-10 w-10"><AvatarImage src={u.avatar} /><AvatarFallback>{u.name?.[0] || "U"}</AvatarFallback></Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{u.name}</div>
                      <div className="line-clamp-1 text-xs text-muted-foreground">
                        @{u.username}
                      </div>
                    </div>
                    {user?.id !== u.id && (
                      <Button
                        size="sm"
                        variant={isFollowingWriter ? "outline" : "default"}
                        className="rounded-full"
                        onClick={() => toggleFollow(u.id)}
                        disabled={isFollowing}
                      >
                        {isFollowingWriter ? "Following" : "Follow"}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-border/60 bg-accent/40 p-5">
            <div className="mb-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
              <TrendingUp className="h-3.5 w-3.5" /> Trending now
            </div>
            <div className="space-y-3">
              {trendingTags.slice(0, 10).map((t, i) => (
                <div key={t} className="flex items-baseline gap-3">
                  <span className="font-serif text-xl text-muted-foreground/60">0{i + 1}</span>
                  <Badge variant="outline" className="rounded-full">{t}</Badge>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
