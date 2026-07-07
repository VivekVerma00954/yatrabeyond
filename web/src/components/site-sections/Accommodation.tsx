import { SectionWrapper } from "./SectionWrapper";
import { MarkdownContent } from "@/components/ui/MarkdownContent";

interface AccommodationProps {
  content?: string | undefined;
}

export function AccommodationSection({ content }: AccommodationProps) {
  if (!content?.trim()) return null;
  return (
    <SectionWrapper id="accommodation" title="Accommodation">
      <MarkdownContent content={content} />
    </SectionWrapper>
  );
}
