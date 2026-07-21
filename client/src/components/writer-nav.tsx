import { Link, useLocation } from "react-router-dom";
import { BarChart3, FileText, LayoutDashboard, PenSquare, ScrollText, Users } from "lucide-react";

const items = [
  { to: "/writer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/writer/articles", label: "My articles", icon: ScrollText },
  { to: "/writer/drafts", label: "Drafts", icon: FileText },
  { to: "/writer/editor", label: "Editor", icon: PenSquare },
  { to: "/writer/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/writer/followers", label: "Followers", icon: Users },
];

export function WriterNav() {
  const { pathname } = useLocation();
  return (
    <nav className="flex flex-wrap gap-1 border-b border-border/60 pb-2">
      {items.map((it) => {
        const active = pathname === it.to;
        return (
          <Link key={it.to} to={it.to} className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition ${active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
            <it.icon className="h-4 w-4" />{it.label}
          </Link>
        );
      })}
    </nav>
  );
}
