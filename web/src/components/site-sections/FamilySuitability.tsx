import { SectionWrapper } from "./SectionWrapper";
import { MarkdownContent } from "@/components/ui/MarkdownContent";

interface FamilySuitabilityProps {
  content?: string | undefined;
  familySuitable?: boolean;
}

export function FamilySuitabilitySection({ content, familySuitable }: FamilySuitabilityProps) {
  if (!content?.trim()) return null;
  return (
    <SectionWrapper id="family-suitability" title="Family Suitability">
      <div className="mb-3 flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${
            familySuitable
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
          }`}
        >
          {familySuitable ? "✓ Family friendly" : "⚠ Challenging for young children"}
        </span>
      </div>
      <MarkdownContent content={content} />
    </SectionWrapper>
  );
}
