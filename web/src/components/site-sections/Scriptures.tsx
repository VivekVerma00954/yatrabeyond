import { SectionWrapper } from "./SectionWrapper";
import { MarkdownContent } from "@/components/ui/MarkdownContent";

interface ScripturesProps {
  content?: string | undefined;
}

export function Scriptures({ content }: ScripturesProps) {
  if (!content?.trim()) return null;
  return (
    <SectionWrapper id="scriptures" title="Scriptures & Texts">
      {/* Editorial note rendered prominently for this section */}
      <p className="mb-4 rounded-md border border-brand-gold/30 bg-brand-gold/10 px-4 py-2.5 font-sans text-sm text-brand-brown/80 dark:text-brand-cream/80">
        <strong>Editorial note:</strong> Scripture references below are based on widely cited
        scholarly and traditional sources. Specific verse citations should be independently
        verified before publication.
      </p>
      <MarkdownContent content={content} />
    </SectionWrapper>
  );
}
