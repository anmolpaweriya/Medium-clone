import { Link, createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { Bookmark, MessageCircle, Share2, ThumbsUp, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import { PageShell } from "@/components/site-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useArticle,
  useComments,
  useRelatedArticles,
  useToggleLike,
  useCreateComment,
  useDeleteArticle,
} from "@/hooks/use-article";
import { useAuth, useToggleFollow, useToggleBookmark } from "@/hooks/use-auth";
import { MarkdownViewer } from "@/components/markdown-viewer";
import { getArticleDetails } from "@/lib/article";

export const Route = createFileRoute("/article/$slug")({
  loader: async ({ context: { queryClient }, params }) => {
    try {
      const article = await queryClient.ensureQueryData({
        queryKey: ["article", params.slug],
        queryFn: async () => {
          const { data } = await getArticleDetails(params.slug);
          return data;
        },
      });
      return { slug: params.slug, article };
    } catch {
      return { slug: params.slug };
    }
  },
  head: ({ loaderData }) => ({
    meta: loaderData?.article ? [
      { title: `${loaderData.article.title} — Prosely` },
      { name: "description", content: loaderData.article.excerpt },
      { property: "og:title", content: loaderData.article.title },
      { property: "og:description", content: loaderData.article.excerpt },
      { property: "og:image", content: loaderData.article.coverImage },
    ] : [{ title: "Article — Prosely" }],
  }),
  errorComponent: ({ error }) => <PageShell><div className="container-prose py-20 text-center"><p className="text-muted-foreground">{error.message}</p></div></PageShell>,
  notFoundComponent: () => <PageShell><div className="container-prose py-20 text-center"><h1 className="font-serif text-3xl">Story not found</h1></div></PageShell>,
  component: ArticleDetail,
});

function ArticleDetail() {
  const navigate = useNavigate();
  const { slug } = Route.useLoaderData();
  const [commentText, setCommentText] = useState("");

  const { data: user } = useAuth();
  const {
      data: article,
      isLoading,
      isError,
  } = useArticle(slug);

  const { data: articleComments = [] } = useComments(article?.id);
  const { data: related = [] } = useRelatedArticles(article?.tags || [], article?.slug);

  const { mutate: toggleLike, isPending: isLiking } = useToggleLike(article?.id, slug);
  const { mutate: createComment, isPending: isSubmittingComment } = useCreateComment(article?.id, slug);
  const { mutate: deleteArticle } = useDeleteArticle();
  const { mutate: toggleFollow, isPending: isFollowing } = useToggleFollow();
  const { mutate: toggleBookmark, isPending: isBookmarking } = useToggleBookmark();

  const author = article?.author;
  const pub = null;

  const isFollowingAuthor = user?.following?.includes(author?.id);
  const isLiked = article?.likesList?.includes(user?.id);
  const isBookmarked = user?.bookmarks?.includes(article?.id);
  const isOwnerOrAdmin = user && (user.id === author?.id || user.role === "admin");

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;
    createComment(commentText, {
      onSuccess: () => setCommentText(""),
    });
  };

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
        <p className="mt-4 text-xl text-muted-foreground">{article.excerpt}</p>

        <div className="mt-8 flex items-center gap-4 border-y border-border/60 py-4">
          <Avatar className="h-12 w-12"><AvatarImage src={author?.avatar} /><AvatarFallback>{author?.name?.[0] || "A"}</AvatarFallback></Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{author?.name}</span>
              {user && user.id !== author?.id && (
                <Button
                  size="sm"
                  variant="link"
                  className="h-auto p-0 text-primary"
                  onClick={() => author?.id && toggleFollow(author.id)}
                  disabled={isFollowing}
                >
                  {isFollowingAuthor ? "Following" : "Follow"}
                </Button>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {article.readTime} min read · {new Date(article.publishedAt || article.createdAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 border-b border-border/60 pb-6 text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 ${isLiked ? "text-primary font-semibold" : ""}`}
            onClick={() => article?.id && toggleLike()}
            disabled={isLiking}
          >
            <ThumbsUp className="h-4 w-4" /> {(article.likes || 0).toLocaleString()}
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <MessageCircle className="h-4 w-4" /> {article.comments || 0}
          </Button>
          <div className="ml-auto flex items-center gap-1">
            {isOwnerOrAdmin && (
              <>
                <Button asChild variant="outline" size="sm" className="rounded-full gap-1">
                  <Link to="/writer/editor" search={{ id: article.id }}>
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="rounded-full gap-1"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this story?")) {
                      deleteArticle(article.id, {
                        onSuccess: () => navigate({ to: "/writer/articles" }),
                      });
                    }
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              className={isBookmarked ? "text-primary" : ""}
              onClick={() => article?.id && toggleBookmark(article.id)}
              disabled={isBookmarking}
            >
              <Bookmark className="h-4 w-4" />
            </Button>
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
          <Avatar className="h-16 w-16"><AvatarImage src={author?.avatar} /><AvatarFallback>{author?.name?.[0] || "A"}</AvatarFallback></Avatar>
          <div className="flex-1">
            <div className="text-sm text-muted-foreground">Written by</div>
            <div className="font-serif text-xl font-semibold">{author?.name}</div>
            <div className="mt-1 text-sm text-muted-foreground">{author?.bio}</div>
          </div>
          {user && user.id !== author?.id && (
            <Button
              className="rounded-full"
              variant={isFollowingAuthor ? "outline" : "default"}
              onClick={() => author?.id && toggleFollow(author.id)}
              disabled={isFollowing}
            >
              {isFollowingAuthor ? "Following" : "Follow"}
            </Button>
          )}
        </div>

        {/* Comments */}
        <section className="mt-12">
          <h2 className="font-serif text-2xl font-semibold">Responses ({articleComments?.length || 0})</h2>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts..."
            className="mt-4 w-full resize-none rounded-lg border border-border bg-background p-4 outline-none focus:border-foreground/40"
            rows={3}
          />
          <div className="mt-2 flex justify-end">
            <Button
              size="sm"
              className="rounded-full"
              onClick={handleCommentSubmit}
              disabled={isSubmittingComment || !commentText.trim()}
            >
              {isSubmittingComment ? "Posting..." : "Respond"}
            </Button>
          </div>

          <div className="mt-8 space-y-6">
            {articleComments.map((c: any) => {
              const u = c.user || { name: "User", avatar: "" };
              return (
                <div key={c.id} className="border-b border-border/60 pb-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8"><AvatarImage src={u.avatar} /><AvatarFallback>{u.name?.[0] || "U"}</AvatarFallback></Avatar>
                    <div><div className="text-sm font-medium">{u.name}</div><div className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</div></div>
                  </div>
                  <p className="mt-3 text-foreground/90">{c.content}</p>
                </div>
              );
            })}
            {articleComments.length === 0 && (
              <p className="text-sm text-muted-foreground">Be the first to respond to this story.</p>
            )}
          </div>
        </section>

        {related?.length > 0 && (
          <section className="my-16">
            <h2 className="mb-6 font-serif text-2xl font-semibold">More like this</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((r: any) => (
                <Link key={r.id} to="/article/$slug" params={{ slug: r.slug }} className="group block">
                  {r.coverImage && <img src={r.coverImage} alt="" className="aspect-[4/3] w-full rounded-md object-cover" />}
                  <h3 className="mt-3 font-serif text-lg font-semibold leading-snug group-hover:opacity-90">{r.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </PageShell>
  );
}
