import { Link, createFileRoute } from "@tanstack/react-router";
import { Image as ImageIcon, Bold, Heading2, Italic, Link2, List, Quote, X } from "lucide-react";
import { useRef, useState, type ComponentType } from "react";

import { PageShell } from "@/components/site-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/mock-data";

import { useCreateArticle } from "@/hooks/use-article";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/writer/editor")({
  head: () => ({ meta: [{ title: "New story — Prosely" }] }),
  component: Editor,
});

type ToolId = "bold" | "italic" | "h2" | "quote" | "list" | "link" | "image";
const TOOLS: { id: ToolId; icon: ComponentType<{ className?: string }>; label: string }[] = [
  { id: "bold", icon: Bold, label: "Bold" },
  { id: "italic", icon: Italic, label: "Italic" },
  { id: "h2", icon: Heading2, label: "Heading" },
  { id: "quote", icon: Quote, label: "Quote" },
  { id: "list", icon: List, label: "List" },
  { id: "link", icon: Link2, label: "Link" },
  { id: "image", icon: ImageIcon, label: "Image" },
];

function Editor() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [cover, setCover] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [body, setBody] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const words = body.trim().split(/\s+/).filter(Boolean).length;

  const navigate = useNavigate();

  const { mutateAsync: createArticle, isPending } =
    useCreateArticle();

  function insertAtCursor(before: string, after = "", placeholder = "") {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart ?? body.length;
    const end = el.selectionEnd ?? body.length;
    const selected = body.slice(start, end) || placeholder;
    const next = body.slice(0, start) + before + selected + after + body.slice(end);
    setBody(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + before.length + selected.length;
      el.setSelectionRange(pos, pos);
    });
  }

  function applyTool(id: ToolId) {
    switch (id) {
      case "bold": return insertAtCursor("**", "**", "bold text");
      case "italic": return insertAtCursor("_", "_", "italic text");
      case "h2": return insertAtCursor("\n## ", "", "Heading");
      case "quote": return insertAtCursor("\n> ", "", "quote");
      case "list": return insertAtCursor("\n- ", "", "list item");
      case "link": {
        const url = window.prompt("Link URL", "https://");
        if (!url) return;
        return insertAtCursor("[", `](${url})`, "link text");
      }
      case "image": {
        const url = window.prompt("Image URL (paste a link to an image)", "https://");
        if (!url) return;
        const alt = window.prompt("Alt text (optional)", "") || "";
        insertAtCursor(`\n![${alt}](${url})\n`, "", "");
        return;
      }
    }
  }

  function addTag(raw: string) {
    const t = raw.trim().replace(/,$/, "");
    if (!t || tags.includes(t) || tags.length >= 5) return;
    setTags([...tags, t]);
  }

  const publishArticle = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!body.trim()) {
      toast.error("Content is required");
      return;
    }

    try {
      const { data } = await createArticle({
        title,
        excerpt: subtitle,
        content: body,
        coverImage: cover,
        tags,
        status: "published",
      });

      navigate({
        to: `/article/${data.slug}`,
      });
    } catch {}
  };

  const saveDraft = async () => {
    try {
      await createArticle({
        title,
        excerpt: subtitle,
        content: body,
        coverImage: cover,
        tags,
        status: "draft",
      });

      toast.success("Draft saved");
    } catch {}
  };
  return (
    <PageShell>
      <div className="container-prose py-8">
        <div className="mb-6 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8"><AvatarImage src={currentUser.avatar} /><AvatarFallback>{currentUser.name[0]}</AvatarFallback></Avatar>
            <span>Draft by <span className="text-foreground">{currentUser.name}</span></span>
            <span>· Saved just now</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline">{words} words</span>
            <Button
                variant="ghost"
                size="sm"
                onClick={saveDraft}
                disabled={isPending}
            >
                Save Draft
            </Button>

            <Button
                size="sm"
                className="rounded-full"
                onClick={publishArticle}
                disabled={isPending}
            >
                {isPending ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </div>

        {/* Cover image */}
        {cover ? (
          <div className="relative mb-6 overflow-hidden rounded-xl border border-border/60">
            <img src={cover} alt="Cover" className="h-64 w-full object-cover" />
            <button
              onClick={() => setCover("")}
              className="absolute right-3 top-3 rounded-full bg-background/90 p-1.5 text-foreground shadow hover:bg-background"
              aria-label="Remove cover"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              const url = window.prompt("Cover image URL", "https://");
              if (url) setCover(url);
            }}
            className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border/60 py-8 text-sm text-muted-foreground hover:bg-muted"
          >
            <ImageIcon className="h-4 w-4" /> Add a cover image
          </button>
        )}

        {/* Toolbar */}
        <div className="sticky top-16 z-10 mb-4 flex flex-wrap items-center gap-1 rounded-full border border-border/60 bg-card p-1 text-muted-foreground shadow-sm">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => applyTool(t.id)}
              title={t.label}
              aria-label={t.label}
              className="rounded-full p-2 transition hover:bg-muted hover:text-foreground"
            >
              <t.icon className="h-4 w-4" />
            </button>
          ))}
          <span className="ml-auto pr-3 text-xs">Markdown supported</span>
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border-none bg-transparent font-serif text-4xl font-bold outline-none placeholder:text-muted-foreground md:text-5xl"
        />
        <input
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="A short subtitle..."
          className="mt-2 w-full border-none bg-transparent font-serif text-xl text-muted-foreground outline-none placeholder:text-muted-foreground"
        />
        <textarea
          ref={textareaRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Tell your story... use the toolbar to add images, links, and formatting."
          rows={20}
          className="mt-6 w-full resize-none border-none bg-transparent text-lg leading-relaxed outline-none placeholder:text-muted-foreground"
        />

        {/* Tags */}
        <div className="mt-8 border-t border-border/60 pt-6">
          <label className="text-sm font-medium">Tags <span className="text-muted-foreground">(up to 5)</span></label>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {tags.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm">
                {t}
                <button onClick={() => setTags(tags.filter((x) => x !== t))} aria-label={`Remove ${t}`}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {tags.length < 5 && (
              <input
                value={tagInput}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v.endsWith(",")) { addTag(v); setTagInput(""); } else setTagInput(v);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); addTag(tagInput); setTagInput(""); }
                  if (e.key === "Backspace" && !tagInput && tags.length) setTags(tags.slice(0, -1));
                }}
                placeholder="Add a tag..."
                className="min-w-32 flex-1 bg-transparent text-sm outline-none"
              />
            )}
          </div>
        </div>

        {/* Preview */}
        {body && (
          <div className="mt-10 rounded-xl border border-border/60 bg-card/50 p-6">
            <div className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">Preview</div>
            <MarkdownPreview text={body} />
          </div>
        )}
      </div>
    </PageShell>
  );
}

function MarkdownPreview({ text }: { text: string }) {
  // Minimal markdown renderer for preview (images, links, headings, quotes, lists, bold/italic).
  const html = text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" class="my-4 rounded-lg max-w-full" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="underline" target="_blank" rel="noreferrer">$1</a>')
    .replace(/^## (.*)$/gm, '<h2 class="mt-4 font-serif text-2xl font-semibold">$1</h2>')
    .replace(/^&gt; (.*)$/gm, '<blockquote class="border-l-2 border-border pl-4 italic text-muted-foreground">$1</blockquote>')
    .replace(/^- (.*)$/gm, '<li class="ml-6 list-disc">$1</li>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/_([^_]+)_/g, '<em>$1</em>')
    .replace(/\n\n/g, '<br/><br/>');
  return <div className="prose prose-neutral max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
}
