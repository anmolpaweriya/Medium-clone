import { createFileRoute } from "@tanstack/react-router";
import { AtSign, Bell, MessageCircle, ThumbsUp, UserPlus } from "lucide-react";

import { PageShell } from "@/components/site-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { articles, getUser, notifications } from "@/lib/mock-data";

const iconFor = { clap: ThumbsUp, follow: UserPlus, comment: MessageCircle, publish: Bell, mention: AtSign };

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Prosely" }] }),
  component: Notifs,
});

function Notifs() {
  return (
    <PageShell>
      <div className="container-prose py-12">
        <h1 className="font-serif text-4xl font-semibold">Notifications</h1>
        <div className="mt-8 divide-y divide-border/60 rounded-lg border border-border/60">
          {notifications.map((n) => {
            const actor = getUser(n.actorId);
            const art = n.articleId ? articles.find((a) => a.id === n.articleId) : null;
            const Icon = iconFor[n.kind];
            const label = {
              clap: "clapped for your story",
              follow: "started following you",
              comment: "responded to your story",
              publish: "published a new story",
              mention: "mentioned you in a story",
            }[n.kind];
            return (
              <div key={n.id} className={`flex items-start gap-4 p-4 ${n.read ? "" : "bg-accent/30"}`}>
                <div className="relative">
                  <Avatar className="h-10 w-10"><AvatarImage src={actor.avatar} /><AvatarFallback>{actor.name[0]}</AvatarFallback></Avatar>
                  <span className="absolute -bottom-1 -right-1 rounded-full bg-primary p-1 text-primary-foreground"><Icon className="h-3 w-3" /></span>
                </div>
                <div className="flex-1">
                  <p className="text-sm"><span className="font-medium">{actor.name}</span> <span className="text-muted-foreground">{label}</span>{art && <> · <span className="text-foreground/80">{art.title}</span></>}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{n.createdAt}</p>
                </div>
                {!n.read && <span className="mt-2 h-2 w-2 rounded-full bg-primary" />}
              </div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
