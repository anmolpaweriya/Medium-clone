import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export function MarkdownViewer({
  content,
}: {
  content: string;
}) {
  return (
    <div className="prose prose-neutral max-w-none dark:prose-invert prose-img:rounded-lg prose-img:w-full">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
