import { createFileRoute } from "@tanstack/react-router";

import { ArticleCard } from "@/components/article-card";
import { PageShell } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  useFeed,
  useFollowingFeed,
  useTopicsFeed,
} from "@/hooks/use-article";

export const Route = createFileRoute("/feed")({
  head: () => ({
    meta: [{ title: "Your feed — Prosely" }],
  }),
  component: Feed,
});

function Feed() {
  const {
    data: feed = [],
    isLoading,
  } = useFeed();

  const {
    data: following = [],
    isLoading: followingLoading,
  } = useFollowingFeed();

  const {
    data: topics = [],
    isLoading: topicsLoading,
  } = useTopicsFeed();

  if (
    isLoading ||
    followingLoading ||
    topicsLoading
  ) {
    return (
      <PageShell>
        <div className="container-wide py-10">
          Loading...
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="container-wide py-10">
        <h1 className="font-serif text-4xl font-semibold">
          Your feed
        </h1>

        <p className="mt-2 text-muted-foreground">
          Stories from writers and topics you follow.
        </p>

        <Tabs
          defaultValue="for-you"
          className="mt-8"
        >
          <TabsList>
            <TabsTrigger value="for-you">
              For You
            </TabsTrigger>

            <TabsTrigger value="following">
              Following ({following.length})
            </TabsTrigger>

            <TabsTrigger value="topics">
              Topics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="for-you">
            {feed.length ? (
              feed.map((article: any) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                />
              ))
            ) : (
              <p className="py-10 text-muted-foreground">
                No stories yet.
              </p>
            )}
          </TabsContent>

          <TabsContent value="following">
            {following.length ? (
              following.map((article: any) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                />
              ))
            ) : (
              <p className="py-10 text-muted-foreground">
                Follow some writers to personalize your
                feed.
              </p>
            )}
          </TabsContent>

          <TabsContent value="topics">
            <div className="mb-6 flex flex-wrap gap-2">
              {[...new Set(topics.flatMap((a: any) => a.tags))]
                .slice(0, 10)
                .map((tag: string) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="rounded-full"
                  >
                    {tag}
                  </Badge>
                ))}
            </div>

            {topics.length ? (
              topics.map((article: any) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                />
              ))
            ) : (
              <p className="py-10 text-muted-foreground">
                No topic recommendations yet.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  );
}
