import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";

import Home from "./routes/index";
import Login from "./routes/login";
import Register from "./routes/register";
import Feed from "./routes/feed";
import Following from "./routes/following";
import Trending from "./routes/trending";
import SearchPage from "./routes/search";
import Bookmarks from "./routes/bookmarks";
import Notifications from "./routes/notifications";
import Profile from "./routes/profile";
import EditProfile from "./routes/profile.edit";
import ArticleDetail from "./routes/article.$slug";
import PubHome from "./routes/publication.$slug";
import PubArticles from "./routes/publication.$slug.articles";
import Subs from "./routes/publication.$slug.subscribers";
import PubWriters from "./routes/publication.$slug.writers";
import PubAnalytics from "./routes/publication.$slug.analytics";
import WriterDashboard from "./routes/writer.dashboard";
import MyArticles from "./routes/writer.articles";
import Drafts from "./routes/writer.drafts";
import Editor from "./routes/writer.editor";
import WriterAnalytics from "./routes/writer.analytics";
import Followers from "./routes/writer.followers";
import Settings from "./routes/settings";
import Admin from "./routes/admin";

const queryClient = new QueryClient();

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/following" element={<Following />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/article/:slug" element={<ArticleDetail />} />
          <Route path="/publication/:slug" element={<PubHome />} />
          <Route path="/publication/:slug/articles" element={<PubArticles />} />
          <Route path="/publication/:slug/subscribers" element={<Subs />} />
          <Route path="/publication/:slug/writers" element={<PubWriters />} />
          <Route path="/publication/:slug/analytics" element={<PubAnalytics />} />
          <Route path="/writer/dashboard" element={<WriterDashboard />} />
          <Route path="/writer/articles" element={<MyArticles />} />
          <Route path="/writer/drafts" element={<Drafts />} />
          <Route path="/writer/editor" element={<Editor />} />
          <Route path="/writer/analytics" element={<WriterAnalytics />} />
          <Route path="/writer/followers" element={<Followers />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFoundComponent />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
