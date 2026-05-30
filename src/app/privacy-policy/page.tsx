import React from 'react';

export const metadata = {
  title: 'गोपनीयता नीति (Privacy Policy) - Tech Khabar AI',
  description: 'Tech Khabar AI की गोपनीयता नीति और यूजर डेटा सुरक्षा नीतियां।',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-card text-card-foreground border border-border p-6 md:p-10 rounded-3xl transition-colors shadow-sm space-y-6">
        <h1 className="text-2xl md:text-4xl font-extrabold text-foreground pb-4 border-b border-border">
          गोपनीयता नीति (Privacy Policy)
        </h1>
        <p className="text-xs text-muted font-semibold">अंतिम अपडेट: 30 मई, 2026</p>

        <div className="prose text-xs md:text-sm text-foreground/80 leading-relaxed space-y-4">
          <p>
            टेक ख़बर AI (&quot;हम&quot;, &quot;हमारा&quot;, या &quot;हमें&quot;) पर हम अपने पाठकों की गोपनीयता (Privacy) का पूरा सम्मान करते हैं। यह गोपनीयता नीति दस्तावेज यह स्पष्ट करता है कि जब आप हमारी वेबसाइट का उपयोग करते हैं, तो हम किस प्रकार की व्यक्तिगत जानकारी एकत्र और दर्ज करते हैं, और हम उसका उपयोग कैसे करते हैं।
          </p>

          <h2 className="text-base md:text-lg font-bold text-foreground pt-4">1. हम कौन सी जानकारी एकत्र करते हैं?</h2>
          <p>
            जब आप हमारे न्यूज़लेटर की सदस्यता लेते हैं, कमेंट करते हैं, या संपर्क फ़ॉर्म के माध्यम से हमसे संपर्क करते हैं, तो हम निम्नलिखित जानकारी एकत्र कर सकते हैं:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>नाम (Name)</li>
            <li>ईमेल पता (Email Address)</li>
            <li>आपके द्वारा सबमिट किया गया कोई भी संदेश या कमेंट</li>
          </ul>

          <h2 className="text-base md:text-lg font-bold text-foreground pt-4">2. जानकारी का उपयोग</h2>
          <p>एकत्रित की गई जानकारी का उपयोग निम्नलिखित उद्देश्यों के लिए किया जा सकता है:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>हमारी वेबसाइट के संचालन और रखरखाव के लिए।</li>
            <li>आपको साप्ताहिक ईमेल न्यूज़लेटर और तकनीकी अपडेट भेजने के लिए (जिससे आप कभी भी अनसब्सक्राइब कर सकते हैं)।</li>
            <li>आपके कमेंट्स को स्वीकृत और प्रदर्शित करने के लिए।</li>
            <li>आपके प्रश्नों का उत्तर देने और सहायता प्रदान करने के लिए।</li>
          </ul>

          <h2 className="text-base md:text-lg font-bold text-foreground pt-4">3. कुकीज़ और वेब बीकन</h2>
          <p>
            हम यूजर के अनुभव को बेहतर बनाने के लिए सामान्य कुकीज़ (Cookies) का उपयोग करते हैं, जो आपके ब्राउज़र प्राथमिकताओं और वेबसाइट विज़िट के इतिहास को याद रखती हैं। आप अपने ब्राउज़र सेटिंग्स में जाकर कुकीज़ को बंद कर सकते हैं।
          </p>

          <h2 className="text-base md:text-lg font-bold text-foreground pt-4">4. डेटा सुरक्षा</h2>
          <p>
            हम आपके व्यक्तिगत डेटा की सुरक्षा सुनिश्चित करने के लिए सभी आवश्यक तकनीकी और सुरक्षा उपाय अपनाते हैं। हम आपकी अनुमति के बिना आपका डेटा किसी तीसरे पक्ष को बेचते या साझा नहीं करते हैं।
          </p>

          <h2 className="text-base md:text-lg font-bold text-foreground pt-4">5. संपर्क विवरण</h2>
          <p>
            यदि आपके पास हमारी गोपनीयता नीति से संबंधित कोई प्रश्न या सुझाव हैं, तो कृपया हमें <span className="text-primary font-semibold">support@techkhabar.ai</span> पर ईमेल करें।
          </p>
        </div>
      </div>
    </div>
  );
}
