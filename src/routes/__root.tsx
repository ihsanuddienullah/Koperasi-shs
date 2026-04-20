import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Koperasi SHS — Bersama Tumbuh, Bersama Sejahtera' },
      {
        name: 'description',
        content:
          'Koperasi Selaras Harmoni Sejahtera — platform digital koperasi yang menghubungkan anggota dengan pembeli secara langsung.',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-2xl font-bold">Halaman Tidak Ditemukan</h1>
      <p className="mt-2 text-muted-foreground">
        Halaman yang Anda cari tidak ada.
      </p>
      <Link to="/" className="mt-4 text-[#1a6b3c] hover:underline">
        ← Kembali ke beranda
      </Link>
    </div>
  ),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Navbar />
      <main className="min-h-[calc(100vh-3.5rem)]">
        <Outlet />
      </main>
      <Footer />
      <Toaster richColors position="top-right" />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
