import { SectionWrapper } from "./SectionWrapper";
import { MarkdownContent } from "@/components/ui/MarkdownContent";

interface HistoryProps {
  content?: string | undefined;
}

export function History({ content }: HistoryProps) {
  if (!content?.trim()) return null;
  return (
    <SectionWrapper id="history" title="History">
      <MarkdownContent content={content} />
    </SectionWrapper>
  );
}
