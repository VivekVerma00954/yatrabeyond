import { SectionWrapper } from "./SectionWrapper";
import { MarkdownContent } from "@/components/ui/MarkdownContent";

interface PreservationProps {
  content?: string | undefined;
}

export function PreservationSection({ content }: PreservationProps) {
  if (!content?.trim()) return null;
  return (
    <SectionWrapper id="preservation" title="Preservation">
      <MarkdownContent content={content} />
    </SectionWrapper>
  );
}
