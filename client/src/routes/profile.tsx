import { Link } from "react-router-dom";

import { ArticleCard } from "@/components/article-card";
import { PageShell } from "@/components/site-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useAuth } from "@/hooks/use-auth";
import { useMyArticles } from "@/hooks/use-article";

export default function Profile() {
  const { data: user, isLoading } = useAuth();

  const { data: articles = [], isLoading: articlesLoading } =
    useMyArticles();

  if (isLoading) {
    return (
      <PageShell>
        <div className="container-wide py-12">
          Loading...
        </div>
      </PageShell>
    );
  }

  if (!user) {
    return (
      <PageShell>
        <div className="container-wide py-12">
          <h1 className="text-2xl font-semibold">
            Please sign in to view your profile.
          </h1>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="container-wide grid gap-12 py-12 md:grid-cols-[1fr_280px]">
        <div>
          <h1 className="font-serif text-5xl font-semibold">
            {user.name}
          </h1>

          <p className="mt-2 text-muted-foreground">
            @{user.username}
          </p>

          <Tabs defaultValue="stories" className="mt-8">
            <TabsList>
              <TabsTrigger value="stories">
                Stories ({articles.length})
              </TabsTrigger>

              <TabsTrigger value="about">
                About
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stories">
              {articlesLoading ?
                <>Loading ... </>
                :
               ( articles.length === 0 ? (
                <div className="py-8 text-muted-foreground">
                  You haven't published any stories yet.
                </div>
              ) : (
                articles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                  />
                ))
              ))}
            </TabsContent>

            <TabsContent
              value="about"
              className="prose prose-neutral mt-6 max-w-none"
            >
              <p className="text-lg">
                {user.bio || "No bio added yet."}
              </p>

              <p className="text-muted-foreground">
                Member of Prosely.
              </p>
            </TabsContent>
          </Tabs>
        </div>

        <aside className="order-first md:order-last">
          <div className="sticky top-24 rounded-xl border border-border/60 bg-card p-6 text-center">
            <Avatar className="mx-auto h-24 w-24">
              <AvatarImage
                src={user?.avatar}
                alt={user?.name}
              />

              <AvatarFallback>
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <h2 className="mt-4 font-serif text-xl font-semibold">
              {user.name}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {user.bio || "No bio added yet."}
            </p>

            <div className="mt-4 flex justify-center gap-6 text-sm">
              <div>
                <div className="font-semibold">
                  {user.followers?.length ?? 0}
                </div>

                <div className="text-xs text-muted-foreground">
                  Followers
                </div>
              </div>

              <div>
                <div className="font-semibold">
                  {user.following?.length ?? 0}
                </div>

                <div className="text-xs text-muted-foreground">
                  Following
                </div>
              </div>
            </div>

            <Button
              asChild
              className="mt-4 w-full rounded-full"
              variant="outline"
            >
              <Link to="/profile/edit">
                Edit profile
              </Link>
            </Button>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
