import { SectionWrapper } from "./SectionWrapper";
import { MarkdownContent } from "@/components/ui/MarkdownContent";

interface GivingBackProps {
  content?: string | undefined;
}

export function GivingBackSection({ content }: GivingBackProps) {
  if (!content?.trim()) return null;
  return (
    <SectionWrapper id="giving-back" title="Giving Back">
      <MarkdownContent content={content} />
    </SectionWrapper>
  );
}
