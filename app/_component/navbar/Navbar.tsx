"use client"
import React, { useContext, useState } from 'react'
import logo from '@/images/freshcart-logo.svg'
import Image from 'next/image'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { cartContext } from '@/app/providers/cartContextProvider'
import { useWishlist } from '@/app/providers/WishlistContextProvider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingCart, User, LogOut, Menu, X } from 'lucide-react'

export default function Navbar() {
  const { numOfCartItems } = useContext(cartContext)
  const { wishlistIds } = useWishlist()
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/brands', label: 'Brands' },
  ];

  return (
    <nav className='sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 py-3 md:py-4 shadow-lg bg-gradient-to-r from-emerald-500 to-teal-600 backdrop-blur-md'>
      {/* Logo */}
      <Link
        href={'/'}
        className='flex items-center gap-2 hover:opacity-90 transition-all flex-shrink-0 group'
      >
        <div className="bg-white p-1.5 rounded-xl shadow-inner group-hover:rotate-12 transition-transform">
          <Image
            src={logo}
            alt="Fresh Cart Logo"
            className='w-7 h-7 md:w-8 md:h-8'
          />
        </div>
        <span className='font-black text-xl md:text-2xl text-white tracking-tighter'>FRESH<span className="text-emerald-200">CART</span></span>
      </Link>

      {/* Desktop Navigation Links */}
      <ul className='hidden lg:flex items-center gap-2'>
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className='px-4 py-2 rounded-xl font-bold text-sm text-white/90 hover:text-white hover:bg-white/10 transition-all'
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Action Buttons */}
      <div className='flex items-center gap-2 md:gap-4'>
        {/* Wishlist Link */}
        <Link href="/wishlist" className="relative p-2.5 text-white hover:bg-white/10 rounded-full transition-all group">
          <Heart className={`w-6 h-6 ${wishlistIds.length > 0 ? 'fill-rose-400 text-rose-400' : ''}`} />
          {wishlistIds.length > 0 && (
            <span className="absolute top-1 right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-emerald-500 animate-in zoom-in">
              {wishlistIds.length}
            </span>
          )}
        </Link>

        {/* Cart Link */}
        <Link href="/cart" className="relative p-2.5 text-white hover:bg-white/10 rounded-full transition-all group">
          <ShoppingCart className="w-6 h-6" />
          {numOfCartItems > 0 && (
            <span className="absolute top-1 right-1 w-5 h-5 bg-emerald-400 text-emerald-950 text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-emerald-500 animate-in zoom-in">
              {numOfCartItems}
            </span>
          )}
        </Link>

        {/* Auth Section */}
        <div className="hidden md:flex items-center gap-2 border-l border-white/20 pl-4">
          {status === 'loading' ? (
            <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
          ) : session ? (
            <div className="flex items-center gap-2">
              <Link href="/profile" className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-white/10 transition-all group">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-[10px] text-emerald-100 font-bold uppercase tracking-widest opacity-80">My Account</span>
                  <span className="text-sm text-white font-black">{session.user?.name?.split(' ')[0]}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white border border-white/10 group-hover:bg-white group-hover:text-emerald-600 transition-all">
                  <User className="w-6 h-6" />
                </div>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className='p-2.5 rounded-xl text-white hover:bg-red-500/20 hover:text-red-200 transition-all'
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:bg-white/10 rounded-xl font-bold">Login</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-white text-emerald-600 hover:bg-emerald-50 rounded-xl font-bold shadow-lg">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className='lg:hidden p-2.5 rounded-xl text-white hover:bg-white/10 transition-all'
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className='absolute top-full left-0 right-0 lg:hidden bg-emerald-600 border-t border-white/10 shadow-2xl animate-in slide-in-from-top duration-300'>
          <ul className='flex flex-col p-6 gap-3'>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className='flex items-center px-4 py-3 rounded-xl font-bold text-white hover:bg-white/10 transition-all'
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <hr className='my-2 border-white/10' />
            {session ? (
              <>
                <div className="px-4 py-2 text-white/60 text-xs font-bold uppercase tracking-widest">Account</div>
                <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-white font-bold"><User className="w-5 h-5" /> Profile</Link>
                <button
                  onClick={() => signOut()}
                  className='w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-200 bg-red-500/10 hover:bg-red-500/20 transition-all'
                >
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 p-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full bg-transparent border-white text-white hover:bg-white hover:text-emerald-600 rounded-xl font-bold">Login</Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-white text-emerald-600 hover:bg-emerald-50 rounded-xl font-bold">Sign Up</Button>
                </Link>
              </div>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
