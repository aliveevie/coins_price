'use client'

import React from 'react'
import Link from 'next/link'
import { ConnectKitButton } from 'connectkit'

export default function PageWithNavbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            React to Web3
          </Link>
          <nav className="flex space-x-4 items-center">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/projects" className="text-foreground hover:text-primary transition-colors">
              Projects
            </Link>
            <ConnectKitButton />
          </nav>
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 py-4 text-center text-foreground">
          © 2023 React to Web3 Bootcamp. All rights reserved.
        </div>
      </footer>
    </div>
  )
}