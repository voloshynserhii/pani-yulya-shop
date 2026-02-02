import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Nunito } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pani-yulya.kids'),
  title: "Pani Yulya Kids",
  description: "Привіт! Я — Юля, мама і творчиня контенту для малят. Мій проєкт «Пані Юля» створений для того, щоб дитина не просто дивилася відео, а рухалася, співає, грала і розвивалася. Я сама пишу сценарії, створюю пісні та продумую ігри, поєднуючи досвід у спорті, танцях та відеомонтажі. Моя місія — відео, що активізують, а не «зомбують», даруючи дітям безпечний та веселий час навчання та руху.",
  keywords: ['пані юля сайт', 'відеопривітання', 'діти', 'розвиток дитини', 'руханки', 'пані юля', 'український ютуб', 'подарунок дитині', 'день народження', 'навчальні відео', 'українська мова', 'виховання дітей', 'розвиваючий контент', 'пісні Пані Юлі', 'ігри для дітей', 'здоровий розвиток', 'творчий підхід', 'батьки і діти'],
  openGraph: {
    title: 'Pani Yulya Kids',
    description: 'Привіт! Я — Юля, мама і творчиня контенту для малят. Мій проєкт «Пані Юля» створений для того, щоб дитина не просто дивилася відео, а рухалася, співає, грала і розвивалася. Я сама пишу сценарії, створюю пісні та продумую ігри, поєднуючи досвід у спорті, танцях та відеомонтажі. Моя місія — відео, що активізують, а не «зомбують», даруючи дітям безпечний та веселий час навчання та руху.',
    url: './',
    siteName: 'Pani Yulya Kids',
    images: ['/images/logo.png'],
    locale: 'uk_UA',
    type: 'website',
  },
  alternates: {
    canonical: './',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: '/apple-touch-icon.png',
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nunito.variable} antialiased pt-16`}
      >
        {children}
        <Analytics />
      </body>
      <Script id="clarity-script" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
            c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/XXXX";
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "XXXX");
        `}
      </Script>
      <Script
        id="schema-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Pani Yulya Kids",
            url: "https://pani-yulya.kids",
            logo: "https://pani-yulya.kids/images/logo.png",
            description: "Пані Юля Kids — Музика для дітей та відео привітання",
          }),
        }}
      />
    </html>
  );
}
