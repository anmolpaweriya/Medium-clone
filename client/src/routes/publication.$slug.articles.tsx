import { useParams } from "react-router-dom";

import { ArticleCard } from "@/components/article-card";
import { PublicationHeader } from "@/components/publication-header";
import { PublicationNav } from "@/components/publication-nav";
import { PageShell } from "@/components/site-header";
import { articlesByPublication, getPublication } from "@/lib/mock-data";

export default function PubArticles() {
  const { slug } = useParams<{ slug: string }>();
  const pub = slug ? getPublication(slug) : undefined;

  if (!pub) {
    return <PageShell><div className="container-prose py-20 text-center">Not found</div></PageShell>;
  }

  const arts = articlesByPublication(pub.id);
  return (
    <PageShell>
      <PublicationHeader pub={pub} />
      <div className="container-wide mt-6"><PublicationNav slug={pub.slug} /></div>
      <div className="container-wide py-8">
        <h2 className="font-serif text-2xl font-semibold">All articles ({arts.length})</h2>
        <div className="mt-4">{arts.map((a) => <ArticleCard key={a.id} article={a} />)}</div>
      </div>
    </PageShell>
  );
}
