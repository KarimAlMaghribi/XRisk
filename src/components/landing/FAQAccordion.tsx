import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

interface FAQAccordionProps {
  faqs: FAQItem[];
  defaultExpanded?: number;
}

export function FAQAccordion({ faqs, defaultExpanded = 0 }: FAQAccordionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(defaultExpanded);

  const toggleAccordion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col">
      {faqs.map((faq, index) => (
        <div key={index}>
          <div className="h-0 w-full relative">
            <div className="absolute bottom-0 left-0 right-0 top-[-2px]">
              <svg className="block w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 504 2">
                <line stroke="#CECACA" strokeWidth="2" x2="100%" y1="1" y2="1" />
              </svg>
            </div>
          </div>

          <button
            onClick={() => toggleAccordion(index)}
            className="w-full py-4 flex items-center justify-between cursor-pointer bg-transparent border-none text-left"
            aria-expanded={expandedIndex === index}
            aria-controls={`faq-answer-${index}`}
          >
            <p
              className="text-lg-medium text-primary transition-colors duration-300"
              style={{
                color: expandedIndex === index ? "#ff671f" : "#353131",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "18px",
                lineHeight: "1.5",
              }}
            >
              {faq.question}
            </p>
            <ChevronDown
              className="transition-transform duration-300 ease-in-out shrink-0"
              size={24}
              strokeWidth={2}
              style={{
                transform: expandedIndex === index ? "rotate(180deg)" : "rotate(0deg)",
                color: expandedIndex === index ? "#ff671f" : "#353131",
              }}
            />
          </button>

          <div
            id={`faq-answer-${index}`}
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{
              maxHeight: expandedIndex === index ? "1000px" : "0",
              opacity: expandedIndex === index ? 1 : 0,
            }}
            aria-hidden={expandedIndex !== index}
          >
            <div className="pb-4">
              {typeof faq.answer === "string" ? (
                <p
                  className="body-base text-primary"
                  style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "16px",
                    lineHeight: "1.3",
                    color: "#353131",
                    fontVariationSettings: "'wdth' 100",
                  }}
                >
                  {faq.answer}
                </p>
              ) : (
                <div
                  className="body-base text-primary"
                  style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "16px",
                    lineHeight: "1.3",
                    color: "#353131",
                    fontVariationSettings: "'wdth' 100",
                  }}
                >
                  {faq.answer}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
