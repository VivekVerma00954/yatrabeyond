import { SectionWrapper } from "./SectionWrapper";
import { MarkdownContent } from "@/components/ui/MarkdownContent";

interface PilgrimageInfoProps {
  content?: string | undefined;
}

export function PilgrimageInfo({ content }: PilgrimageInfoProps) {
  if (!content?.trim()) return null;
  return (
    <SectionWrapper id="pilgrimage-info" title="Pilgrimage Information">
      <MarkdownContent content={content} />
    </SectionWrapper>
  );
}
