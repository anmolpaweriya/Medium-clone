import { useParams } from "react-router-dom";

import { PublicationHeader } from "@/components/publication-header";
import { PublicationNav } from "@/components/publication-nav";
import { PageShell } from "@/components/site-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { articlesByPublication, getPublication, getUser } from "@/lib/mock-data";

export default function PubWriters() {
  const { slug } = useParams<{ slug: string }>();
  const pub = slug ? getPublication(slug) : undefined;

  if (!pub) {
    return <PageShell><div className="container-prose py-20 text-center">Not found</div></PageShell>;
  }
  const writers = pub.writerIds.map(getUser);
  return (
    <PageShell>
      <PublicationHeader pub={pub} />
      <div className="container-wide mt-6"><PublicationNav slug={pub.slug} /></div>
      <div className="container-wide py-8">
        <div className="flex items-center justify-between"><h2 className="font-serif text-2xl font-semibold">Writers</h2><Button className="rounded-full">Invite writer</Button></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {writers.map((w: typeof writers[number]) => {
            const count = articlesByPublication(pub.id).filter((a) => a.authorId === w.id).length;
            return (
              <div key={w.id} className="flex items-center gap-4 rounded-lg border border-border/60 bg-card p-4">
                <Avatar className="h-14 w-14"><AvatarImage src={w.avatar} /><AvatarFallback>{w.name[0]}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0"><div className="font-medium">{w.name}</div><div className="line-clamp-1 text-xs text-muted-foreground">{w.bio}</div><div className="text-xs text-muted-foreground">{count} stories · {w.followers.toLocaleString()} followers</div></div>
                <Button size="sm" variant="outline" className="rounded-full">Manage</Button>
              </div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
