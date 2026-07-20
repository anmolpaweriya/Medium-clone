import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { ArticleCard } from "@/components/article-card";
import { PublicationHeader } from "@/components/publication-header";
import { PublicationNav } from "@/components/publication-nav";
import { PageShell } from "@/components/site-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { articlesByPublication, getPublication, getUser } from "@/lib/mock-data";

export const Route = createFileRoute("/publication/$slug")({
  loader: ({ params }) => {
    const pub = getPublication(params.slug);
    if (!pub) throw notFound();
    return { pub };
  },
  head: ({ loaderData }) => ({ meta: loaderData ? [{ title: `${loaderData.pub.name} — Prosely` }, { name: "description", content: loaderData.pub.tagline }] : [] }),
  errorComponent: ({ error }) => <PageShell><div className="container-prose py-20 text-center"><p className="text-muted-foreground">{error.message}</p></div></PageShell>,
  notFoundComponent: () => <PageShell><div className="container-prose py-20 text-center"><h1 className="font-serif text-3xl">Publication not found</h1></div></PageShell>,
  component: PubHome,
});

function PubHome() {
  const { pub } = Route.useLoaderData();
  const arts = articlesByPublication(pub.id);
  const [feature, ...rest] = arts;
  const writers = pub.writerIds.map(getUser);

  return (
    <PageShell>
      <PublicationHeader pub={pub} />
      <div className="container-wide mt-6"><PublicationNav slug={pub.slug} /></div>

      <div className="container-wide grid gap-10 py-10 md:grid-cols-[1fr_280px]">
        <div>
          {feature && (
            <Link to="/article/$slug" params={{ slug: feature.slug }} className="group mb-10 block">
              <img src={feature.cover} alt="" className="aspect-[16/8] w-full rounded-lg object-cover" />
              <h2 className="mt-4 font-serif text-3xl font-semibold group-hover:opacity-90">{feature.title}</h2>
              <p className="mt-2 text-muted-foreground">{feature.subtitle}</p>
            </Link>
          )}
          {rest.map((a) => <ArticleCard key={a.id} article={a} />)}
        </div>
        <aside className="space-y-6">
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Writers</h3>
            <div className="space-y-3">
              {writers.map((w: typeof writers[number]) => (
                <div key={w.id} className="flex items-center gap-3">
                  <Avatar className="h-9 w-9"><AvatarImage src={w.avatar} /><AvatarFallback>{w.name[0]}</AvatarFallback></Avatar>
                  <div className="min-w-0"><div className="truncate text-sm font-medium">{w.name}</div><div className="text-xs text-muted-foreground">{w.followers.toLocaleString()} followers</div></div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
