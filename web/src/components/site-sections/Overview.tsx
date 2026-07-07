import { SectionWrapper } from "./SectionWrapper";
import { MarkdownContent } from "@/components/ui/MarkdownContent";

interface OverviewProps {
  content?: string | undefined;
}

export function Overview({ content }: OverviewProps) {
  if (!content?.trim()) return null;
  return (
    <SectionWrapper id="overview" title="Overview">
      <MarkdownContent content={content} className="text-lg leading-relaxed" />
    </SectionWrapper>
  );
}
