import { SectionWrapper } from "./SectionWrapper";
import type { DosDonts } from "@/types/sacred-site";

interface DosDontsProps {
  data?: DosDonts | undefined;
}

export function DosDontsSection({ data }: DosDontsProps) {
  if (!data || (data.dos.length === 0 && data.donts.length === 0)) return null;

  return (
    <SectionWrapper id="dos-donts" title="Do’s & Don’ts">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {data.dos.length > 0 && (
          <div>
            <h3 className="mb-3 flex items-center gap-1.5 font-serif text-base font-semibold text-green-700 dark:text-green-400">
              <span aria-hidden="true">✓</span> Do
            </h3>
            <ul className="space-y-2">
              {data.dos.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-2 font-sans text-sm text-brand-brown dark:text-brand-cream/90"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 flex-shrink-0 rounded-full bg-green-100 text-center text-xs leading-4 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  >
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.donts.length > 0 && (
          <div>
            <h3 className="mb-3 flex items-center gap-1.5 font-serif text-base font-semibold text-red-700 dark:text-red-400">
              <span aria-hidden="true">✗</span> Don’t
            </h3>
            <ul className="space-y-2">
              {data.donts.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-2 font-sans text-sm text-brand-brown dark:text-brand-cream/90"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 flex-shrink-0 rounded-full bg-red-100 text-center text-xs leading-4 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  >
                    ✗
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
