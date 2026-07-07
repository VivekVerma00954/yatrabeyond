import { cn } from "@/lib/cn";

interface SectionWrapperProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string | undefined;
  /** Icon or decorative element in the heading area */
  icon?: React.ReactNode;
}

/**
 * Shared wrapper for all 12 sacred site sections.
 * - Provides consistent spacing, heading style, and anchor ID for in-page nav.
 * - Renders nothing extra if children is null/undefined (graceful empty-section handling
 *   is the caller's responsibility — pass null to skip rendering entirely).
 */
export function SectionWrapper({ id, title, children, className, icon }: SectionWrapperProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn("scroll-mt-20 py-8 border-b border-brand-brown/10 dark:border-brand-cream/10 last:border-b-0", className)}
    >
      <h2
        id={`${id}-heading`}
        className="mb-4 flex items-center gap-2 font-serif text-2xl font-semibold text-brand-brown dark:text-brand-cream"
      >
        {icon && <span aria-hidden="true">{icon}</span>}
        {title}
      </h2>
      {children}
    </section>
  );
}
