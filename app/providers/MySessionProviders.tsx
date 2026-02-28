"use client"

import { SessionProvider } from 'next-auth/react'
import React from 'react'
import CartContextProvider from './cartContextProvider'
import WishlistContextProvider from './WishlistContextProvider'
import { ThemeProvider } from 'next-themes'

export default function MySessionProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        <CartContextProvider>
          <WishlistContextProvider>
            {children}
          </WishlistContextProvider>
        </CartContextProvider>
      </SessionProvider>
    </ThemeProvider>
  )
}
