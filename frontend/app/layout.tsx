import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Providers } from './providers'
import { LanguageSync } from '@/components/LanguageSync'
import { AdManager } from '@/components/ads'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FLIXORA - Premium Movie Streaming',
  description: 'Stream thousands of movies in premium quality on FLIXORA - Your ultimate movie experience',
  other: {
    '6a97888e-site-verification': 'ba9f139b08e5f8aac7c2847b5df4a6'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <LanguageSync />
          <AdManager 
            enablePopunders={true}
            enablePushNotifications={true}
            enableSocialBar={false}
            enableVignette={false}
          />
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}