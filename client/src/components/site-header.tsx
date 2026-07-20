import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Bell, Bookmark, Feather, Search, Settings, User } from "lucide-react";
import type { ReactNode } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useQueryClient } from "@tanstack/react-query";

export function SiteHeader() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data: user, isLoading} = useAuth();
  const queryClient = useQueryClient();
  const handleLogout = () => {
    localStorage.removeItem("token");

    queryClient.removeQueries({
      queryKey: ["me"],
    });

    window.location.href = "/login";
  };



  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="container-wide flex h-16 items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <Feather className="h-6 w-6 text-primary" />
          <span className="font-serif text-2xl font-semibold tracking-tight">Prosely</span>
        </Link>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const input = form.querySelector("input") as HTMLInputElement;
            if (input && input.value.trim()) {
              navigate({ to: "/search", search: { q: input.value.trim() } });
            }
          }}
          className="relative ml-4 hidden flex-1 max-w-md md:block"
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search articles, writers, publications"
            className="h-10 w-full rounded-full border border-transparent bg-muted pl-10 pr-4 text-sm outline-none transition focus:border-border focus:bg-background"
          />
        </form>

        <nav className="ml-auto hidden items-center gap-1 text-sm text-muted-foreground lg:flex">
          <HeaderLink to="/" label="Home" active={pathname === "/"} />
          <HeaderLink to="/trending" label="Trending" active={pathname.startsWith("/trending")} />
          <HeaderLink to="/feed" label="Feed" active={pathname.startsWith("/feed")} />
          <HeaderLink to="/writer/dashboard" label="Write" active={pathname.startsWith("/writer")} />
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:ml-2">
          <Button asChild variant="ghost" size="icon" aria-label="Notifications">
            <Link to="/notifications">
              <Bell className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Bookmarks" className="hidden sm:inline-flex">
            <Link to="/bookmarks">
              <Bookmark className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="sm" className="hidden rounded-full sm:inline-flex">
            <Link to="/writer/editor">
              <Feather className="mr-1.5 h-4 w-4" /> Write
            </Link>
          </Button>
          {
            isLoading ? <>Loading ...</>:
(
            !user ?
            <>
                   <Button asChild variant="ghost">
                       <Link to="/login">
                           Sign in
                       </Link>
                   </Button>

                   <Button asChild>
                       <Link to="/register">
                           Get started
                       </Link>
                   </Button>
               </>
          :
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="ml-1 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={user?.avatar}
                    alt={user?.name}
                  />

                  <AvatarFallback>
                    {user?.name?.charAt(0).toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex flex-col">
                <span>{user?.name}</span>

                <span className="text-xs font-normal text-muted-foreground">
                    @{user?.username}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link to="/profile"><User className="mr-2 h-4 w-4" />Profile</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/bookmarks">Bookmarks</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/following">Following</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/settings"><Settings className="mr-2 h-4 w-4" />Settings</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">Writer</DropdownMenuLabel>
              <DropdownMenuItem asChild><Link to="/writer/dashboard">Dashboard</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/writer/articles">My articles</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/writer/drafts">Drafts</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/writer/analytics">Analytics</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link to="/admin">Admin console</Link></DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                  Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>)
          }
        </div>
      </div>
    </header>
  );
}

function HeaderLink({ to, label, active }: { to: string; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={`rounded-full px-3 py-1.5 transition ${active ? "text-foreground" : "hover:text-foreground"}`}
    >
      {label}
    </Link>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>{children}</main>
      <footer className="mt-20 border-t border-border/60 py-10 text-sm text-muted-foreground">
        <div className="container-wide flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Feather className="h-4 w-4" />
            <span className="font-serif text-base text-foreground">Prosely</span>
            <span>· A place to read, write, and think out loud.</span>
          </div>
          <div className="flex gap-4">
            <Link to="/">Home</Link>
            <Link to="/trending">Trending</Link>
            <Link to="/search">Search</Link>
            <Link to="/admin">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
