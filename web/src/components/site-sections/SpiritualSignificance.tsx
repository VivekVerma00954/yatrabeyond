import { SectionWrapper } from "./SectionWrapper";
import { MarkdownContent } from "@/components/ui/MarkdownContent";

interface SpiritualSignificanceProps {
  content?: string | undefined;
}

export function SpiritualSignificance({ content }: SpiritualSignificanceProps) {
  if (!content?.trim()) return null;
  return (
    <SectionWrapper id="spiritual-significance" title="Spiritual Significance">
      <MarkdownContent content={content} />
    </SectionWrapper>
  );
}
