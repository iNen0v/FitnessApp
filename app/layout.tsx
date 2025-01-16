import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextAuthProvider } from './providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
 title: 'Fitness AI App',
 description: 'AI-powered fitness and nutrition tracking',
}

export default function RootLayout({
 children,
}: {
 children: React.ReactNode
}) {
 return (
   <html lang="en">
     <body className={inter.className}>
       <NextAuthProvider>
         <main className="min-h-screen bg-gray-50">
           {children}
         </main>
       </NextAuthProvider>
     </body>
   </html>
 )
}