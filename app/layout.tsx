import './global.css'
import type { Metadata } from 'next'
import clsx from 'clsx';
import { Varela_Round } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Tooltip from '@/app/components/tooltip';
import Footer from './components/Footer/Footer'
import { baseUrl } from './sitemap'
import Menu from './components/Menu/Menu'
import ThemeInitializerScript from './ThemeInitializerScript';

// Layout Metadata
export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Ali Farooqi | Software Engineer | China & Greater Bay Area',
    template: '%s | Ali Farooqi',
  },
  description: 'Ali Farooqi is a software engineer focused on cloud computing, IoT, and infrastructure strategy in China and the Greater Bay Area. View his projects, publications, and contact details.',
  authors: [{ name: 'Ali Farooqi', url: baseUrl }],
  creator: 'Ali Farooqi',
  applicationName: 'Ali Farooqi Portfolio',
  keywords: [
    'Ali Farooqi', 
    'cloud engineer China', 
    'IoT expert GBA', 
    'cloud infrastructure China', 
    'software engineer Hong Kong', 
    'backend engineer China', 
    'Greater Bay Area tech consultant',
  ],
  openGraph: {
    title: 'Ali Farooqi | Cloud & IoT Engineer for China & GBA',
    description: 'Helping businesses scale cloud-native and IoT solutions in China and the Greater Bay Area. View my portfolio and get in touch.',
    url: baseUrl,
    siteName: 'Ali Farooqi Portfolio',
    locale: 'en_US',
    type: 'website',
    images: [{ url: "/preview-card.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: baseUrl,
    title: "Ali Farooqi | Cloud & IoT Engineer for China & GBA",
    description: "Helping businesses scale cloud-native and IoT solutions in China and the Greater Bay Area. View my portfolio and get in touch.",
    images: [
      {
        url: "/preview-card.jpg",
        alt: "Ali Portfolio Preview",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    // Schema.org Structured Data
    "script:ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Ali Farooqi",
      description: "Software Engineer specializing in Cloud, IoT, and Security",
      url: baseUrl,
      sameAs: [
        "https://linkedin.com/in/ali-farooqi",
        "https://github.com/alifarooqi"
      ]
    })
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",

}

// Layout Fonts
// 1. Configure the font loader
const varelaRound = Varela_Round({
  weight: '400', // Varela Round typically only has a 400 weight
  subsets: ['latin'],
  display: 'swap', // Use 'swap' to ensure text is visible immediately
  variable: '--font-varela-round', // Assign a CSS variable name
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={clsx(
        varelaRound.variable
      )}
    >
      <head>
        <ThemeInitializerScript />
      </head>
      <body className="flex min-h-screen flex-col">
        <Tooltip />
        <main className="flex-1">
          <Menu />
          {children}
          <Analytics />
          <SpeedInsights />
        </main>
        <Footer />
      </body>
    </html>
  )
}
