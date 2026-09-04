import { useState } from "react";

export default function FAQAccordion({ faqs = [] }) {
  const [open, setOpen] = useState(null);
  if (!faqs.length) return null;

  return (
    <div className="faq-accordion">
      <h2 className="section-heading">FAQ</h2>
      {faqs.map((faq, idx) => {
        const isOpen = open === idx;
        return (
          <div className="faq-item" key={idx}>
            <button
              type="button"
              className="faq-item__q"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : idx)}
            >
              {faq.question}
            </button>
            {isOpen && <p className="faq-item__a">{faq.answer}</p>}
          </div>
        );
      })}
    </div>
  );
}
