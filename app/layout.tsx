import type { Metadata } from 'next'
import './globals.css'
import WhatsAppButton from './components/WhatsAppButton'

export const metadata: Metadata = {
  title: 'Swargufan Music Institute - Learn Music Online',
  description: 'Live online music classes with expert faculty. Learn Classical, Playback Singing, and more.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <WhatsAppButton />
      </body>
    </html>
  )
}

