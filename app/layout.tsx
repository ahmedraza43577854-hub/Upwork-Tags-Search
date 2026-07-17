import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Job Tag Tracker | Track MERN, AI & Blockchain Job Skills',
  description:
    'Organize and track your job search skills with tags, categories, and progress insights for MERN, full stack, AI, and blockchain roles.',
  applicationName: 'Job Tag Tracker',
  keywords: [
    'job tag tracker',
    'MERN stack jobs',
    'full stack developer',
    'AI developer skills',
    'blockchain jobs',
    'web3 careers',
    'freelance skills tracker',
  ],
  icons: {
    icon: '/Logo.png',
    apple: '/Logo.png',
  },
  openGraph: {
    title: 'Job Tag Tracker',
    description:
      'Track job-ready skills across MERN, AI, and blockchain with tags, filters, and progress tracking.',
    type: 'website',
    images: [{ url: '/Logo.png', alt: 'Job Tag Tracker logo' }],
  },
  twitter: {
    card: 'summary',
    title: 'Job Tag Tracker',
    description:
      'Track job-ready skills across MERN, AI, and blockchain with tags, filters, and progress tracking.',
    images: ['/Logo.png'],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#4CAF50' },
    { media: '(prefers-color-scheme: dark)', color: '#1e293b' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
