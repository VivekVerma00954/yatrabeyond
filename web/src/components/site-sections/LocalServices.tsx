import { SectionWrapper } from "./SectionWrapper";
import { MarkdownContent } from "@/components/ui/MarkdownContent";

interface LocalServicesProps {
  content?: string | undefined;
}

export function LocalServicesSection({ content }: LocalServicesProps) {
  if (!content?.trim()) return null;
  return (
    <SectionWrapper id="local-services" title="Local Services">
      <MarkdownContent content={content} />
    </SectionWrapper>
  );
}
