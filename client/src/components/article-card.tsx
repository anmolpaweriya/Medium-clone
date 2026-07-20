import { Link } from "@tanstack/react-router";
import { Bookmark, MessageCircle, ThumbsUp } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { useAuth, useToggleBookmark } from "@/hooks/use-auth";

interface ArticleCardProps {
  article: {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    coverImage: string;
    publishedAt?: string;
    readTime: number;
    tags: string[];
    views?: number;
    likes?: number;
    comments?: number;
    author: {
      id: string;
      name: string;
      username: string;
      avatar: string;
    };
  };
  compact?: boolean;
}

function fmt(n = 0) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

export function ArticleCard({
  article,
  compact = false,
}: ArticleCardProps) {
  const { data: user } = useAuth();
  const { mutate: toggleBookmark, isPending } = useToggleBookmark();
  const isBookmarked = user?.bookmarks?.includes(article.id);

  return (
    <article className="group grid grid-cols-1 gap-6 border-b border-border/60 py-6 sm:grid-cols-[1fr_180px] sm:gap-8">
      <div className="min-w-0">
        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={article.author.avatar}
              alt={article.author.name}
            />
            <AvatarFallback>
              {article.author.name[0]}
            </AvatarFallback>
          </Avatar>

          <span className="text-foreground">
            {article.author.name}
          </span>

          <span>·</span>

          <span>@{article.author.username}</span>
        </div>

        <Link
          to="/article/$slug"
          params={{ slug: article.slug }}
        >
          <h3
            className={`font-serif font-bold group-hover:opacity-90 ${
              compact ? "text-lg" : "text-2xl"
            }`}
          >
            {article.title}
          </h3>

          {!compact && (
            <p className="mt-2 line-clamp-2 text-muted-foreground">
              {article.excerpt}
            </p>
          )}
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {article.publishedAt && (
            <>
              <span>
                {new Date(
                  article.publishedAt
                ).toLocaleDateString()}
              </span>

              <span>•</span>
            </>
          )}

          <span>{article.readTime} min read</span>

          {article.tags.length > 0 && (
            <Badge
              variant="secondary"
              className="rounded-full"
            >
              {article.tags[0]}
            </Badge>
          )}

          <span className="ml-auto flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <ThumbsUp className="h-3.5 w-3.5" />
              {fmt(article.likes)}
            </span>

            <span className="inline-flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />
              {fmt(article.comments)}
            </span>

            <Bookmark
              className={`h-4 w-4 cursor-pointer hover:text-foreground ${isBookmarked ? "fill-primary text-primary" : ""}`}
              onClick={() => !isPending && toggleBookmark(article.id)}
            />
          </span>
        </div>
      </div>

      {!compact && article.coverImage && (
        <Link
          to="/article/$slug"
          params={{ slug: article.slug }}
        >
          <img
            src={article.coverImage}
            alt={article.title}
            className="aspect-[4/3] w-full rounded-md object-cover sm:aspect-square"
            loading="lazy"
          />
        </Link>
      )}
    </article>
  );
}
