import type { Metadata } from 'next';
import { Noto_Sans_Devanagari, Outfit } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const notoHindi = Noto_Sans_Devanagari({
  variable: '--font-hindi',
  subsets: ['devanagari', 'latin'],
  weight: ['300', '400', '500', '700', '900'],
  display: 'swap',
});

const outfit = Outfit({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Tech Khabar | हिन्दी में टेक्नोलॉजी और इंटरनेट की ख़बरें',
    template: '%s | Tech Khabar',
  },
  description: 'टेक ख़बर हिन्दी में तकनीक और इंटरनेट की दुनिया से जुडी नवीनतम ख़बरें, समीक्षाएं, विश्लेषण और मार्गदर्शिकाएं प्रदान करने वाला अग्रणी पोर्टल है।',
  keywords: ['Tech News in Hindi', 'Internet News in Hindi', 'Mobile reviews', 'Cyber Security', 'How to guides in Hindi'],
  metadataBase: new URL('http://localhost:3000'), // Fallback base URL for dev
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'hi_IN',
    url: '/',
    siteName: 'Tech Khabar',
    title: 'Tech Khabar | हिन्दी में टेक्नोलॉजी और इंटरनेट की ख़बरें',
    description: 'नवीनतम तकनीक और इंटरनेट समाचार, स्मार्टफोन समीक्षाएं और टेक्नोलॉजी गाइड्स हिन्दी में।',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&h=630&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Tech Khabar Logo Banner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tech Khabar | हिन्दी में टेक्नोलॉजी और इंटरनेट समाचार',
    description: 'नवीनतम तकनीक और इंटरनेट समाचार, स्मार्टफोन समीक्षाएं और टेक्नोलॉजी गाइड्स हिन्दी में।',
    images: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&h=630&auto=format&fit=crop'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" className={`${notoHindi.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="antialiased font-hindi flex flex-col min-h-screen bg-background text-foreground transition-colors">
        <ThemeProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
