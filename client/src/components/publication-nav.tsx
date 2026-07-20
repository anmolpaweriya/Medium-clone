import { Link, useRouterState } from "@tanstack/react-router";

const items = [
  { key: "home", label: "Home", path: "" },
  { key: "articles", label: "Articles", path: "/articles" },
  { key: "writers", label: "Writers", path: "/writers" },
  { key: "subscribers", label: "Subscribers", path: "/subscribers" },
  { key: "analytics", label: "Analytics", path: "/analytics" },
];

export function PublicationNav({ slug }: { slug: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const base = `/publication/${slug}`;
  return (
    <nav className="flex flex-wrap gap-6 border-b border-border/60 text-sm">
      {items.map((it) => {
        const to = `${base}${it.path}` || base;
        const active = pathname === to || (it.path === "" && pathname === base);
        return (
          <Link key={it.key} to={to} className={`-mb-px border-b-2 py-3 transition ${active ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
