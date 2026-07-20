import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { Bookmark, MessageCircle, Share2, ThumbsUp } from "lucide-react";

import { PageShell } from "@/components/site-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useArticle, useComments, useRelatedArticles } from "@/hooks/use-article";
import { getUser } from "@/lib/mock-data";
import { MarkdownViewer } from "@/components/markdown-viewer";

export const Route = createFileRoute("/article/$slug")({
  loader: ({ params }) => ({
      slug: params.slug
  }),
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.article.title} — Prosely` },
      { name: "description", content: loaderData.article.subtitle },
      { property: "og:title", content: loaderData.article.title },
      { property: "og:description", content: loaderData.article.subtitle },
      { property: "og:image", content: loaderData.article.cover },
    ] : [{ title: "Article — Prosely" }],
  }),
  errorComponent: ({ error }) => <PageShell><div className="container-prose py-20 text-center"><p className="text-muted-foreground">{error.message}</p></div></PageShell>,
  notFoundComponent: () => <PageShell><div className="container-prose py-20 text-center"><h1 className="font-serif text-3xl">Story not found</h1></div></PageShell>,
  component: ArticleDetail,
});

function ArticleDetail() {
  const { slug } = Route.useLoaderData();

  const {
      data: article,
      isLoading,
      isError,
  } = useArticle(slug);


  const author = article?.author;
  const pub = null
  // const { data: articleComments = [] } = useComments(article?.id);
  // const { data: related = [] } =
  //     useRelatedArticles(article?.tags, article?.slug);
  const articleComments = []
  const related = []

  if (isLoading) {
      return (
          <PageShell>
              <div className="container-prose py-20">
                  Loading...
              </div>
          </PageShell>
      );
  }

  if (isError || !article) {
      throw notFound();
  }

  return (
    <PageShell>
      <article className="container-prose pt-10">
        {pub && (
          <Link to="/publication/$slug" params={{ slug: pub.slug }} className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <Avatar className="h-6 w-6 rounded-md"><AvatarImage src={pub.logo} /><AvatarFallback>{pub.name[0]}</AvatarFallback></Avatar>
            <span>Published in <span className="text-foreground">{pub.name}</span></span>
          </Link>
        )}
        <h1 className="font-serif text-4xl font-bold leading-tight md:text-5xl">{article?.title}</h1>
        <p className="mt-4 text-xl text-muted-foreground">{article.subtitle}</p>

        <div className="mt-8 flex items-center gap-4 border-y border-border/60 py-4">
          <Avatar className="h-12 w-12"><AvatarImage src={author.avatar} /><AvatarFallback>{author.name[0]}</AvatarFallback></Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{author.name}</span>
              <Button size="sm" variant="link" className="h-auto p-0 text-primary">Follow</Button>
            </div>
            <div className="text-xs text-muted-foreground">
              {article.readTime} min read · {new Date(article.publishedAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 border-b border-border/60 pb-6 text-muted-foreground">
          <Button variant="ghost" size="sm" className="gap-2"><ThumbsUp className="h-4 w-4" /> {article.likes?.toLocaleString()}</Button>
          <Button variant="ghost" size="sm" className="gap-2"><MessageCircle className="h-4 w-4" /> {article.comments}</Button>
          <div className="ml-auto flex gap-1">
            <Button variant="ghost" size="icon"><Bookmark className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon"><Share2 className="h-4 w-4" /></Button>
          </div>
        </div>
        <img
            src={article.coverImage}
            alt={article.title}
            className="mt-8 aspect-[16/9] w-full rounded-lg object-cover"
        />

        <div className="mt-8">
            <MarkdownViewer
                content={article.content}
            />
        </div>


        <div className="mt-10 flex flex-wrap gap-2 border-b border-border/60 pb-8">
          {article.tags.map((t: string) => <Badge key={t} variant="secondary" className="rounded-full">{t}</Badge>)}
        </div>

        {/* Author card */}
        <div className="mt-10 flex flex-col gap-4 rounded-xl border border-border/60 bg-card p-6 sm:flex-row sm:items-center">
          <Avatar className="h-16 w-16"><AvatarImage src={author.avatar} /><AvatarFallback>{author.name[0]}</AvatarFallback></Avatar>
          <div className="flex-1">
            <div className="text-sm text-muted-foreground">Written by</div>
            <div className="font-serif text-xl font-semibold">{author.name}</div>
            <div className="mt-1 text-sm text-muted-foreground">{author.bio}</div>
            <div className="mt-1 text-xs text-muted-foreground">{author.followers?.toLocaleString()} followers</div>
          </div>
          <Button className="rounded-full">Follow</Button>
        </div>

        {/* Comments */}
        <section className="mt-12">
          <h2 className="font-serif text-2xl font-semibold">Responses ({articleComments?.length})</h2>
          <textarea placeholder="Share your thoughts..." className="mt-4 w-full resize-none rounded-lg border border-border bg-background p-4 outline-none focus:border-foreground/40" rows={3} />
          <div className="mt-2 flex justify-end"><Button size="sm" className="rounded-full">Respond</Button></div>

          <div className="mt-8 space-y-6">
            {articleComments.map((c) => {
              const u = getUser(c.userId);
              return (
                <div key={c.id} className="border-b border-border/60 pb-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8"><AvatarImage src={u.avatar} /><AvatarFallback>{u.name[0]}</AvatarFallback></Avatar>
                    <div><div className="text-sm font-medium">{u.name}</div><div className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</div></div>
                  </div>
                  <p className="mt-3 text-foreground/90">{c.content}</p>
                  <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                    <button className="inline-flex items-center gap-1 hover:text-foreground"><ThumbsUp className="h-3.5 w-3.5" /> {c.likes}</button>
                    <button className="hover:text-foreground">Reply</button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {related?.length > 0 && (
          <section className="my-16">
            <h2 className="mb-6 font-serif text-2xl font-semibold">More like this</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <Link key={r.id} to="/article/$slug" params={{ slug: r.slug }} className="group block">
                  <img src={r.cover} alt="" className="aspect-[4/3] w-full rounded-md object-cover" />
                  <h3 className="mt-3 font-serif text-lg font-semibold leading-snug group-hover:opacity-90">{r.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.subtitle}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </PageShell>
  );
}
