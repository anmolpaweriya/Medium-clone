import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Publication } from "@/lib/mock-data";

export function PublicationHeader({ pub }: { pub: Publication }) {
  return (
    <div>
      <div className="h-48 w-full overflow-hidden md:h-64">
        <img src={pub.cover} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="container-wide -mt-12 flex flex-col items-start gap-4 md:flex-row md:items-end md:gap-6">
        <Avatar className="h-24 w-24 rounded-lg border-4 border-background"><AvatarImage src={pub.logo} className="rounded-lg" /><AvatarFallback>{pub.name[0]}</AvatarFallback></Avatar>
        <div className="flex-1 pb-2">
          <h1 className="font-serif text-4xl font-semibold">{pub.name}</h1>
          <p className="mt-1 max-w-xl text-muted-foreground">{pub.tagline}</p>
          <p className="mt-1 text-sm text-muted-foreground">{pub.subscribers.toLocaleString()} subscribers</p>
        </div>
        <Button className="rounded-full">Subscribe</Button>
      </div>
    </div>
  );
}
