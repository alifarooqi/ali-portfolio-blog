import './global.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from './components/Footer/Footer'
import { baseUrl } from './sitemap'
import Menu from './components/Menu/Menu'

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
  },
  twitter: {
    card: "summary_large_image",
    site: baseUrl,
    title: "Ali Farooqi | Cloud & IoT Engineer for China & GBA",
    description: "Helping businesses scale cloud-native and IoT solutions in China and the Greater Bay Area. View my portfolio and get in touch.",
    images: [
      {
        url: "/og-image.png",
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
  }
}

const cx = (...classes) => classes.filter(Boolean).join(' ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cx(
        'text-black bg-white dark:text-white dark:bg-black',
        GeistSans.variable,
        GeistMono.variable
      )}
    >
      <body>
        <main>
          <Menu />
          {children}
          <Footer />
          <Analytics />
          <SpeedInsights />
        </main>
      </body>
    </html>
  )
}
