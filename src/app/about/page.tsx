import React from 'react';
import { Award, Eye, Heart, Shield } from 'lucide-react';

export const metadata = {
  title: 'हमारे बारे में (About Us) - Tech Khabar AI',
  description: 'हिन्दी में तकनीक और आर्टिफिशियल इंटेलिजेंस की दुनिया से जुडी नवीनतम ख़बरें, समीक्षाएं और विश्लेषण प्रदान करने वाला प्रमुख मंच।',
};

const cards = [
  { icon: Eye, title: 'हमारा दृष्टिकोण (Vision)', desc: 'भारत के हर कोने तक सरल, स्पष्ट और सटीक हिन्दी भाषा में तकनीकी ज्ञान पहुँचाना ताकि प्रत्येक व्यक्ति डिजिटल युग में सशक्त बन सके।' },
  { icon: Shield, title: 'विश्वसनीयता (Integrity)', desc: 'हम निष्पक्ष पत्रकारिता में विश्वास करते हैं। हमारे द्वारा दी गई प्रत्येक न्यूज़ और ट्यूटोरियल पूरी रिसर्च और तथ्यों पर आधारित होते हैं।' },
  { icon: Heart, title: 'एआई-फोकस (AI Focus)', desc: 'आर्टिफिशियल इंटेलिजेंस भविष्य है। हमारा उद्देश्य नवीनतम एआई खोजों (जैसे ChatGPT, LLMs, रोबोटिक्स) को बहुत ही सरल बनाकर पाठकों के सामने पेश करना है।' },
  { icon: Award, title: 'गुणवत्ता (Quality)', desc: 'हम पाठकों को बिना किसी जटिलता के केवल काम की जानकारी प्रदान करते हैं। गुणवत्तापूर्ण अनुभव हमारी सर्वोच्च प्राथमिकता है।' }
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Intro Header */}
      <div className="text-center space-y-4">
        <span className="text-primary text-xs font-bold uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
          हमारे बारे में (About Us)
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">
          सरल हिन्दी में तकनीक और <span className="text-primary">एआई (AI)</span> की जानकारी
        </h1>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          टेक ख़बर AI हिन्दी पाठकों के लिए एक ऐसा मंच है जहाँ हम जटिल टेक्नोलॉजी और कृत्रिम बुद्धिमत्ता (Artificial Intelligence) से जुड़ी नवीनतम घटनाओं को सरल और व्यावहारिक भाषा में समझाते हैं।
        </p>
      </div>

      {/* Main Image */}
      <div className="aspect-video w-full rounded-3xl overflow-hidden border border-border bg-accent">
        <img
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop"
          alt="Tech Khabar AI Team Workspace"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Mission details */}
      <section className="space-y-4 leading-relaxed text-sm md:text-base text-foreground/90">
        <h2 className="text-xl md:text-2xl font-bold text-foreground">हम कौन हैं?</h2>
        <p>
          हमारी शुरुआत वर्ष 2026 में हुई थी। हमने देखा कि इंटरनेट पर अधिकांश तकनीकी और एआई से जुड़े शोध पत्र, ख़बरें और ट्यूटोरियल्स केवल अंग्रेजी में ही उपलब्ध हैं। हिन्दी भाषियों के लिए इस ज्ञान की कमी को पूरा करने के लिए हमने <strong>टेक ख़बर AI (Tech Khabar AI)</strong> की नींव रखी।
        </p>
        <p>
          हमारी टीम में एआई इंजीनियर्स, तकनीकी लेखक और गैजेट्स विश्लेषक शामिल हैं जो दुनिया भर से तकनीकी समाचारों को एकत्रित करते हैं, उनका परीक्षण करते हैं और फिर आपके लिए सरल हिन्दी शब्दों में तैयार करते हैं।
        </p>
      </section>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-card text-card-foreground border border-border p-6 rounded-2xl flex items-start space-x-4 shadow-sm transition-colors">
              <div className="bg-primary/10 p-3 rounded-xl flex-shrink-0 text-primary">
                <Icon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">{card.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{card.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
