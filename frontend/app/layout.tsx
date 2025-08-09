import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Providers } from './providers'
import { LanguageSync } from '@/components/LanguageSync'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hypertube - Stream Movies',
  description: 'Watch your favorite movies online',
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