// Shared dummy data for the Medium-style clone.

export type User = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  role: "reader" | "writer" | "admin";
};

export type Publication = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  cover: string;
  logo: string;
  subscribers: number;
  writerIds: string[];
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  cover: string;
  authorId: string;
  publicationId?: string;
  tags: string[];
  readMinutes: number;
  claps: number;
  views: number;
  responses: number;
  publishedAt: string;
  status: "published" | "draft";
  body: string;
};

export type Comment = {
  id: string;
  articleId: string;
  userId: string;
  content: string;
  createdAt: string;
  likes: number;
};

export type Notification = {
  id: string;
  kind: "clap" | "follow" | "comment" | "publish" | "mention";
  actorId: string;
  articleId?: string;
  createdAt: string;
  read: boolean;
};

const IMG = (seed: string, w = 1200, h = 600) =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
const AVATAR = (seed: string) => `https://i.pravatar.cc/200?u=${seed}`;

export const users: User[] = [
  { id: "u1", name: "Amelia Chen", handle: "amelia", avatar: AVATAR("amelia"), bio: "Product designer writing about craft, systems and calm software.", followers: 12480, following: 184, role: "writer" },
  { id: "u2", name: "Marcus Reed", handle: "marcus", avatar: AVATAR("marcus"), bio: "Staff engineer. Distributed systems, databases, and the occasional rant.", followers: 8320, following: 92, role: "writer" },
  { id: "u3", name: "Priya Natarajan", handle: "priya", avatar: AVATAR("priya"), bio: "Founder @ Ember. Writing about early-stage startups.", followers: 21450, following: 310, role: "writer" },
  { id: "u4", name: "Jonas Vetter", handle: "jonas", avatar: AVATAR("jonas"), bio: "Climate researcher & essayist.", followers: 3110, following: 220, role: "writer" },
  { id: "u5", name: "Sofia Alvarez", handle: "sofia", avatar: AVATAR("sofia"), bio: "Curious reader. Occasional writer.", followers: 240, following: 512, role: "reader" },
  { id: "u6", name: "Kenji Park", handle: "kenji", avatar: AVATAR("kenji"), bio: "ML engineer. Notes on models and taste.", followers: 5820, following: 140, role: "writer" },
  { id: "admin", name: "Platform Admin", handle: "admin", avatar: AVATAR("admin"), bio: "Keeping things civil.", followers: 0, following: 0, role: "admin" },
];

export const currentUser: User = users[0]; // Amelia — acts as writer + reader for demo

export const publications: Publication[] = [
  { id: "p1", name: "The Signal", slug: "the-signal", tagline: "Essays on product, craft, and the quiet parts of building.", cover: IMG("1499750310107-5fef28a66643"), logo: AVATAR("thesignal"), subscribers: 48210, writerIds: ["u1", "u3", "u6"] },
  { id: "p2", name: "Bytecraft", slug: "bytecraft", tagline: "Deep-dives into systems, databases, and the tools we build with.", cover: IMG("1504384308090-c894fdcc538d"), logo: AVATAR("bytecraft"), subscribers: 22140, writerIds: ["u2", "u6"] },
  { id: "p3", name: "Ground Level", slug: "ground-level", tagline: "Climate, cities, and the messy work of change.", cover: IMG("1441974231531-c6227db76b6e"), logo: AVATAR("groundlevel"), subscribers: 9840, writerIds: ["u4"] },
];

const LOREM = `
There is a particular kind of quiet that settles over a project the moment you decide to ship it. Not the frantic silence of a deadline, but something more considered — the pause before a first sentence, when everything is still possible.

## The shape of the work

Most of what we call "product thinking" is really just paying attention. Attention to the shape of a workflow, to the words a user reaches for first, to the tiny moments of friction we've stopped noticing.

> Good tools disappear. Great tools disappear and leave you smarter than they found you.

### Three habits worth keeping

1. Write the changelog before the code.
2. Talk to the person who will hate this the most.
3. Ship the ugly version on Friday and read it on Monday.

## Why it matters

Software is a conversation with the future. Every default you choose is a small argument about what the world should look like. Make those arguments carefully — and then, when the moment comes, make them boldly.
`.trim();

export const articles: Article[] = [
  { id: "a1", slug: "the-quiet-craft-of-shipping", title: "The Quiet Craft of Shipping", subtitle: "Why the best product teams treat launches like the beginning, not the end.", cover: IMG("1499750310107-5fef28a66643"), authorId: "u1", publicationId: "p1", tags: ["Product", "Design", "Craft"], readMinutes: 7, claps: 4820, views: 38210, responses: 84, publishedAt: "2026-07-14", status: "published", body: LOREM },
  { id: "a2", slug: "postgres-is-still-underrated", title: "Postgres Is Still Underrated in 2026", subtitle: "A love letter to the database you're probably already running.", cover: IMG("1518770660439-4636190af475"), authorId: "u2", publicationId: "p2", tags: ["Engineering", "Databases", "Postgres"], readMinutes: 11, claps: 6210, views: 51002, responses: 143, publishedAt: "2026-07-10", status: "published", body: LOREM },
  { id: "a3", slug: "seed-round-in-a-cold-market", title: "Raising a Seed Round in a Cold Market", subtitle: "What actually worked for us — and what we'd never do again.", cover: IMG("1454165804606-c3d57bc86b40"), authorId: "u3", publicationId: "p1", tags: ["Startups", "Fundraising"], readMinutes: 9, claps: 8940, views: 72100, responses: 210, publishedAt: "2026-07-05", status: "published", body: LOREM },
  { id: "a4", slug: "cities-that-cool-themselves", title: "Cities That Cool Themselves", subtitle: "How three neighborhoods dropped 4°C without touching a thermostat.", cover: IMG("1441974231531-c6227db76b6e"), authorId: "u4", publicationId: "p3", tags: ["Climate", "Cities"], readMinutes: 13, claps: 3120, views: 22840, responses: 67, publishedAt: "2026-07-02", status: "published", body: LOREM },
  { id: "a5", slug: "small-models-big-taste", title: "Small Models, Big Taste", subtitle: "Why the interesting ML work in 2026 is happening under 3B parameters.", cover: IMG("1620712943543-bcc4688e7485"), authorId: "u6", publicationId: "p2", tags: ["AI", "Engineering"], readMinutes: 8, claps: 5410, views: 41220, responses: 118, publishedAt: "2026-06-28", status: "published", body: LOREM },
  { id: "a6", slug: "designing-for-boredom", title: "Designing for Boredom", subtitle: "The most valuable feeling you can give a user is calm.", cover: IMG("1483058712412-4245e9b90334"), authorId: "u1", publicationId: "p1", tags: ["Design"], readMinutes: 6, claps: 2110, views: 18720, responses: 41, publishedAt: "2026-06-22", status: "published", body: LOREM },
  { id: "a7", slug: "why-we-killed-our-roadmap", title: "Why We Killed Our Roadmap", subtitle: "And what replaced it, six months in.", cover: IMG("1517245386807-bb43f82c33c4"), authorId: "u3", tags: ["Startups", "Product"], readMinutes: 10, claps: 4020, views: 31450, responses: 92, publishedAt: "2026-06-18", status: "published", body: LOREM },
  { id: "a8", slug: "reading-list-summer-2026", title: "My Reading List, Summer 2026", subtitle: "Twelve books on attention, cities, and machines that make things.", cover: IMG("1512820790803-83ca734da794"), authorId: "u1", tags: ["Books", "Personal"], readMinutes: 4, claps: 980, views: 8420, responses: 22, publishedAt: "2026-06-12", status: "published", body: LOREM },
  { id: "d1", slug: "draft-notes-on-typography", title: "Notes on Typography (draft)", subtitle: "Rough thoughts from a week of redrawing our display face.", cover: IMG("1499336315816-097655dcfbda"), authorId: "u1", tags: ["Design", "Typography"], readMinutes: 5, claps: 0, views: 0, responses: 0, publishedAt: "2026-07-18", status: "draft", body: LOREM },
  { id: "d2", slug: "draft-caching-strategies", title: "Caching Strategies I Keep Reaching For (draft)", subtitle: "Work in progress.", cover: IMG("1498050108023-c5249f4df085"), authorId: "u1", tags: ["Engineering"], readMinutes: 8, claps: 0, views: 0, responses: 0, publishedAt: "2026-07-17", status: "draft", body: LOREM },
];

export const comments: Comment[] = [
  { id: "c1", articleId: "a1", userId: "u5", content: "This resonated. The 'ship the ugly version on Friday' line is going on my wall.", createdAt: "2026-07-15", likes: 24 },
  { id: "c2", articleId: "a1", userId: "u2", content: "Would love to hear more about how you handle post-launch attention.", createdAt: "2026-07-15", likes: 11 },
  { id: "c3", articleId: "a1", userId: "u3", content: "Sharing this with our team tomorrow.", createdAt: "2026-07-16", likes: 8 },
  { id: "c4", articleId: "a2", userId: "u6", content: "Row-level security is such a superpower once it clicks.", createdAt: "2026-07-11", likes: 42 },
];

export const notifications: Notification[] = [
  { id: "n1", kind: "clap", actorId: "u5", articleId: "a1", createdAt: "2h ago", read: false },
  { id: "n2", kind: "follow", actorId: "u2", createdAt: "5h ago", read: false },
  { id: "n3", kind: "comment", actorId: "u3", articleId: "a1", createdAt: "1d ago", read: false },
  { id: "n4", kind: "clap", actorId: "u6", articleId: "a6", createdAt: "2d ago", read: true },
  { id: "n5", kind: "mention", actorId: "u4", articleId: "a3", createdAt: "3d ago", read: true },
  { id: "n6", kind: "publish", actorId: "u2", articleId: "a2", createdAt: "4d ago", read: true },
];

export const bookmarkedIds = ["a2", "a4", "a6"];
export const followingIds = ["u2", "u3", "u4", "u6"];
export const tags = ["Product", "Design", "Engineering", "Startups", "AI", "Climate", "Databases", "Books", "Craft"];

export const trendingTags = tags.slice(0, 6);

// Helpers
export const getUser = (id: string) => users.find((u) => u.id === id)!;
export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
export const getPublication = (slug: string) => publications.find((p) => p.slug === slug);
export const publishedArticles = () => articles.filter((a) => a.status === "published");
export const articlesByAuthor = (id: string) => articles.filter((a) => a.authorId === id && a.status === "published");
export const articlesByPublication = (id: string) => articles.filter((a) => a.publicationId === id && a.status === "published");
export const draftsByAuthor = (id: string) => articles.filter((a) => a.authorId === id && a.status === "draft");

// Analytics dummy series
export const viewsSeries = [
  { day: "Mon", views: 1240, reads: 820 },
  { day: "Tue", views: 1580, reads: 990 },
  { day: "Wed", views: 2210, reads: 1440 },
  { day: "Thu", views: 1890, reads: 1210 },
  { day: "Fri", views: 2680, reads: 1720 },
  { day: "Sat", views: 3120, reads: 2040 },
  { day: "Sun", views: 2450, reads: 1620 },
];
