import React from "react";
import { FAQAccordion } from "./FAQAccordion";

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

interface FAQSectionProps {
  title: string | React.ReactNode;
  subtitle?: string;
  faqs: FAQItem[];
  defaultExpanded?: number;
}

export function FAQSection({ title, subtitle, faqs, defaultExpanded = 0 }: FAQSectionProps) {
  return (
    <div id="faq" className="w-full section-spacing">
      <div className="container-grid">
        <div className="grid-12">
          <div className="col-span-6 tablet-full flex flex-col gap-4 items-start">
            <div className="flex flex-col gap-2 items-start w-full">
              {typeof title === "string" ? (
                <h2 className="display-large text-primary" dangerouslySetInnerHTML={{ __html: title }} />
              ) : (
                <h2 className="display-large text-primary">{title}</h2>
              )}
            </div>
            {subtitle && <p className="font-semibold text-primary text-[18px] leading-[1.5]">{subtitle}</p>}
          </div>

          <div className="col-span-6 tablet-full">
            <FAQAccordion faqs={faqs} defaultExpanded={defaultExpanded} />
          </div>
        </div>
      </div>
    </div>
  );
}
