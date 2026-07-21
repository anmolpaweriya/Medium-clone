import { PageShell } from "@/components/site-header";
import { WriterNav } from "@/components/writer-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { currentUser, users } from "@/lib/mock-data";

export default function Followers() {
  const followers = users.filter((u) => u.id !== currentUser.id && u.role !== "admin");
  return (
    <PageShell>
      <div className="container-wide py-10">
        <h1 className="font-serif text-4xl font-semibold">Followers</h1>
        <p className="mt-1 text-muted-foreground">{currentUser.followers.toLocaleString()} people follow your writing.</p>
        <div className="mt-6"><WriterNav /></div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {followers.map((u) => (
            <div key={u.id} className="flex items-center gap-4 rounded-lg border border-border/60 bg-card p-4">
              <Avatar className="h-12 w-12"><AvatarImage src={u.avatar} /><AvatarFallback>{u.name[0]}</AvatarFallback></Avatar>
              <div className="min-w-0 flex-1"><div className="font-medium">{u.name}</div><div className="line-clamp-1 text-xs text-muted-foreground">{u.bio}</div></div>
              <Button size="sm" variant="outline" className="rounded-full">Follow back</Button>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
