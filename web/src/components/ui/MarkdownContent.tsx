"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import { cn } from "@/lib/cn";

// Extend the default sanitize schema to allow id attributes on headings
// (added by rehype-slug) while keeping everything else locked down.
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    "*": [...(defaultSchema.attributes?.["*"] ?? []), "id"],
  },
};

interface MarkdownContentProps {
  content: string;
  className?: string;
}

/**
 * Secure markdown renderer.
 * - rehype-sanitize strips any dangerous HTML (XSS-safe).
 * - No raw HTML is injected; remark/rehype plugins only.
 */
export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div
      className={cn(
        "prose prose-stone max-w-none",
        "prose-headings:font-serif prose-headings:text-brand-brown dark:prose-headings:text-brand-cream",
        "prose-p:text-brand-brown dark:prose-p:text-brand-cream/90",
        "prose-a:text-brand-terracotta prose-a:no-underline hover:prose-a:underline",
        "prose-strong:text-brand-brown dark:prose-strong:text-brand-cream",
        "prose-li:text-brand-brown dark:prose-li:text-brand-cream/90",
        "prose-blockquote:border-brand-terracotta prose-blockquote:text-brand-brown/80 dark:prose-blockquote:text-brand-cream/70",
        "dark:prose-invert",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [rehypeSanitize, sanitizeSchema],
        ]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
