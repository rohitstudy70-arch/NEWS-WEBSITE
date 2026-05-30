import React from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  if (!faqs || faqs.length === 0) return null;

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  };

  return (
    <section className="bg-card text-card-foreground rounded-2xl border border-border p-6 my-8 transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <h3 className="text-lg font-bold text-foreground mb-4 border-l-4 border-primary pl-3">
        अक्सर पूछे जाने वाले सवाल (FAQs)
      </h3>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-border pb-4 last:border-0 last:pb-0">
            <h4 className="text-sm md:text-base font-bold text-foreground mb-1.5 flex items-start">
              <span className="text-primary font-extrabold mr-2">Q.</span>
              <span>{faq.question}</span>
            </h4>
            <p className="text-xs md:text-sm text-muted-foreground pl-5 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
