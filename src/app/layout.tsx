import type { Metadata } from 'next'
import { IBM_Plex_Serif } from 'next/font/google'
import './globals.css'
import { AppConfig } from 'config/app'
import { TRPCProvider } from './TRPCProvider'
import { EventListeners } from '@/server/events/listeners'
import { env } from 'config/env'

if (env.REGISTER_EVENTS === '1') {
  EventListeners.register()
}

const ibmPlexSerif = IBM_Plex_Serif({ subsets: ['latin'] , weight: '400'})

export const metadata: Metadata = {
  title: AppConfig.name,
  description: 'A social network for people who believe studying together can be way more fun',
  icons: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🦧</text></svg>'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={ibmPlexSerif.className}>
        <TRPCProvider>
          {children}
        </TRPCProvider>
      </body>
    </html>
  )
}