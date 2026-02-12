"use client"

import { SessionProvider } from 'next-auth/react'
import React from 'react'
import CartContextProvider from './cartContextProvider'
import WishlistContextProvider from './WishlistContextProvider'

export default function MySessionProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartContextProvider>
        <WishlistContextProvider>
          {children}
        </WishlistContextProvider>
      </CartContextProvider>
    </SessionProvider>
  )
}
