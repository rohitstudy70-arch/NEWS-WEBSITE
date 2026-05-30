import React from 'react';

export const metadata = {
  title: 'नियम व शर्तें (Terms & Conditions) - Tech Khabar AI',
  description: 'Tech Khabar AI न्यूज़ पोर्टल के उपयोग के नियम और शर्तें।',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-card text-card-foreground border border-border p-6 md:p-10 rounded-3xl transition-colors shadow-sm space-y-6">
        <h1 className="text-2xl md:text-4xl font-extrabold text-foreground pb-4 border-b border-border">
          नियम व शर्तें (Terms & Conditions)
        </h1>
        <p className="text-xs text-muted font-semibold">अंतिम अपडेट: 30 मई, 2026</p>

        <div className="prose text-xs md:text-sm text-foreground/80 leading-relaxed space-y-4">
          <p>
            टेक ख़बर AI (&quot;वेबसाइट&quot;) में आपका स्वागत है। इस वेबसाइट का उपयोग करके, आप निम्नलिखित नियमों और शर्तों (Terms and Conditions) का पालन करने के लिए अपनी सहमति प्रदान करते हैं। यदि आप इन शर्तों से सहमत नहीं हैं, तो कृपया हमारी वेबसाइट का उपयोग न करें।
          </p>

          <h2 className="text-base md:text-lg font-bold text-foreground pt-4">1. बौद्धिक संपदा अधिकार (Intellectual Property)</h2>
          <p>
            इस वेबसाइट पर उपलब्ध सभी सामग्री, जिसमें लेख (Articles), चित्र, ग्राफ़िक्स, लोगो और लेआउट शामिल हैं, टेक ख़बर AI की संपत्ति हैं। हमारे लिखित अनुमति के बिना इस सामग्री को कॉपी करना, पुनः प्रकाशित करना या किसी व्यावसायिक उद्देश्य के लिए उपयोग करना पूरी तरह से वर्जित है।
          </p>

          <h2 className="text-base md:text-lg font-bold text-foreground pt-4">2. यूजर आचरण (User Conduct)</h2>
          <p>हमारी वेबसाइट के कमेंट बॉक्स का उपयोग करते समय, आप निम्नलिखित के लिए सहमत हैं:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>आप किसी भी प्रकार की अभद्र, अश्लील, अपमानजनक या गैर-कानूनी भाषा का उपयोग नहीं करेंगे।</li>
            <li>आप कमेंट्स में किसी अन्य वेबसाइट या उत्पाद का स्पैम (Spamming) लिंक शेयर नहीं करेंगे।</li>
            <li>हम बिना किसी पूर्व सूचना के किसी भी कमेंट को डिलीट या ब्लॉक करने का पूरा अधिकार सुरक्षित रखते हैं।</li>
          </ul>

          <h2 className="text-base md:text-lg font-bold text-foreground pt-4">3. अस्वीकरण (Disclaimer)</h2>
          <p>
            इस वेबसाइट पर दी गई जानकारी केवल सामान्य ज्ञान और शिक्षा के उद्देश्य से है। यद्यपि हम नवीनतम और सटीक जानकारी प्रदान करने का पूरा प्रयास करते हैं, फिर भी हम सामग्री की पूर्णता, सटीकता या विश्वसनीयता के संबंध में कोई गारंटी नहीं देते हैं। किसी भी सलाह या उत्पाद को आजमाने से पहले स्वयं जांच अवश्य करें।
          </p>

          <h2 className="text-base md:text-lg font-bold text-foreground pt-4">4. नियमों में परिवर्तन</h2>
          <p>
            हम समय-समय पर इन नियमों और शर्तों में बदलाव कर सकते हैं। परिवर्तनों के बाद वेबसाइट का निरंतर उपयोग करना यह दर्शाता है कि आपने नए नियमों को स्वीकार कर लिया है।
          </p>

          <h2 className="text-base md:text-lg font-bold text-foreground pt-4">5. संपर्क करें</h2>
          <p>
            यदि इन शर्तों के संबंध में आपका कोई प्रश्न है, तो आप हमसे <span className="text-primary font-semibold">support@techkhabar.ai</span> पर संपर्क कर सकते हैं।
          </p>
        </div>
      </div>
    </div>
  );
}
