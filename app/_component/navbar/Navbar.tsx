"use client"
import React, { useContext, useState, useEffect } from 'react'
import logo from '@/images/freshcart-logo.svg'
import Image from 'next/image'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { cartContext } from '@/app/providers/cartContextProvider'
import { useWishlist } from '@/app/providers/WishlistContextProvider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingCart, User, LogOut, Menu, X, Search as SearchIcon } from 'lucide-react'
import LiveSearch from './LiveSearch'
import CartDrawer from '../cartDrawer/CartDrawer'
import ThemeToggle from '../ui/ThemeToggle'

export default function Navbar() {
  const { numOfCartItems } = useContext(cartContext)
  const { wishlistIds } = useWishlist()
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Track scroll for navbar effects and direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Fixed effects (bg color etc)
      setIsScrolled(currentScrollY > 20);

      // Visibility (Hide on scroll down, show on scroll up)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/brands', label: 'Brands' },
  ];

  return (
    <>
      <nav className={`fixed left-0 right-0 z-[100] transition-all duration-700 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        } ${isScrolled
          ? 'top-4 mx-auto w-[95%] md:w-[90%] max-w-[1400px] rounded-[2.5rem] py-2 px-6 bg-[#065f46]/80 dark:bg-zinc-900/80 backdrop-blur-2xl shadow-2xl border border-white/10'
          : 'top-0 w-full py-5 px-4 md:px-12 bg-gradient-to-r from-[#059669] to-[#0d9488] dark:from-zinc-950 dark:to-zinc-900'
        }`}>
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4 md:gap-8">

          {/* Logo Section */}
          <Link
            href={'/'}
            className='flex items-center gap-3 transition-all flex-shrink-0 group'
          >
            <div className="bg-white dark:bg-emerald-500 p-2 rounded-2xl shadow-xl group-hover:rotate-12 transition-transform duration-500">
              <Image
                src={logo}
                alt="Fresh Cart Logo"
                className='w-7 h-7 md:w-8 md:h-8 dark:invert'
              />
            </div>
            <span className='font-black text-xl md:text-2xl text-white tracking-tighter'>
              FRESH<span className="text-emerald-200">CART</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className='hidden xl:flex items-center gap-1 flex-shrink-0'>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className='px-5 py-2.5 rounded-2xl font-black text-[13px] uppercase tracking-widest text-white/80 dark:text-gray-400 hover:text-white dark:hover:text-emerald-400 hover:bg-white/10 transition-all'
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Live Search - Center Piece */}
          <LiveSearch />

          {/* Action Buttons Section */}
          <div className='flex items-center gap-2 md:gap-3 flex-shrink-0'>

            {/* Theme Toggle & Language Toggle - Desktop */}
            <div className="hidden md:flex items-center gap-1.5 p-1 bg-white/5 rounded-[1.4rem] border border-white/10">
              <ThemeToggle />
            </div>

            {/* Wishlist Link */}
            <Link href="/wishlist" className="relative p-3 text-white hover:bg-white/10 rounded-2xl transition-all group overflow-hidden">
              <Heart className={`relative z-10 w-6 h-6 transition-transform group-hover:scale-110 ${wishlistIds.length > 0 ? 'fill-rose-400 text-rose-400' : ''}`} />
              {wishlistIds.length > 0 && (
                <span className="absolute top-2 right-2 z-20 w-5 h-5 bg-rose-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-emerald-600 shadow-lg scale-100 group-hover:scale-110 transition-transform">
                  {wishlistIds.length}
                </span>
              )}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>

            {/* Cart Toggle Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 text-white hover:bg-white/10 rounded-2xl transition-all group overflow-hidden"
            >
              <ShoppingCart className="relative z-10 w-6 h-6 transition-transform group-hover:scale-110" />
              {numOfCartItems > 0 && (
                <span className="absolute top-2 right-2 z-20 w-5 h-5 bg-emerald-400 text-emerald-950 text-[10px] font-black flex items-center justify-center rounded-full border-2 border-emerald-600 shadow-lg scale-100 group-hover:scale-110 transition-transform">
                  {numOfCartItems}
                </span>
              )}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>

            {/* Auth Section */}
            <div className="hidden md:flex items-center gap-2 border-l border-white/20 pl-4 py-1">
              {status === 'loading' ? (
                <div className='w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center'>
                  <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                </div>
              ) : session ? (
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-end hidden sm:flex">
                    {(session.user as any).role === 'admin' && (
                      <Link href="/admin" className="text-[10px] text-amber-400 font-black uppercase tracking-[0.2em] mb-1 hover:text-amber-300 transition-colors">
                        Admin Suite
                      </Link>
                    )}
                    <span className="text-[9px] text-emerald-100 font-black uppercase tracking-[0.2em] opacity-60">Account</span>
                  </div>
                  <Link href="/profile" className="flex items-center gap-3 px-3 py-1.5 rounded-2xl hover:bg-white/10 transition-all group border border-transparent hover:border-white/10">
                    <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white border border-white/10 group-hover:bg-white group-hover:text-emerald-700 transition-all duration-500 shadow-lg overflow-hidden relative">
                      {(session.user as any).image ? (
                        <Image
                          src={(session.user as any).image}
                          alt={session?.user?.name || 'Profile'}
                          fill
                          className="object-cover object-top transition-transform group-hover:scale-110"
                        />
                      ) : (
                        <User className="w-6 h-6" />
                      )}
                    </div>
                  </Link>
                  <div className="h-8 w-px bg-white/10 mx-1"></div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className='p-3 rounded-2xl text-white hover:bg-red-500/20 hover:text-red-200 transition-all group'
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" className="text-white hover:bg-white/10 rounded-2xl font-black text-xs uppercase tracking-widest px-6 h-11">Login</Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-white text-emerald-700 hover:bg-emerald-50 rounded-2xl font-black text-xs uppercase tracking-widest px-6 h-11 shadow-2xl shadow-emerald-900/20 border-0 transition-all active:scale-95">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className='lg:hidden p-3 rounded-2xl text-white hover:bg-white/10 transition-all active:scale-90'
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className='absolute top-full left-0 right-0 lg:hidden bg-emerald-700 dark:bg-zinc-950 border-t border-white/10 shadow-2xl animate-in slide-in-from-top duration-500 backdrop-blur-3xl overflow-hidden rounded-b-[2.5rem]'>
            <div className='p-6'>
              {/* Mobile Header Row with Theme Toggle */}
              <div className="flex items-center justify-between mb-8">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Interface Settings</p>
                <div className="bg-white/5 rounded-2xl p-1 border border-white/10 flex items-center gap-2">
                  <ThemeToggle />
                </div>
              </div>

              {/* Mobile Search - Show on mobile inside menu */}
              <div className='mb-8 md:hidden relative'>
                <SearchIcon className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40' />
                <input
                  type="text"
                  placeholder="Search products..."
                  className='w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 text-sm focus:bg-white/10 outline-none transition-all'
                  onFocus={() => { }} // Could trigger same live search logic
                />
              </div>

              <ul className='flex flex-col gap-2'>
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className='flex items-center px-6 py-4 rounded-[1.25rem] font-black text-sm uppercase tracking-widest text-white/80 hover:text-white hover:bg-white/5 transition-all'
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}

                {/* Mobile Cart Link */}
                <li>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsCartOpen(true);
                    }}
                    className='w-full flex items-center justify-between px-6 py-4 rounded-[1.25rem] font-black text-sm uppercase tracking-widest text-white/80 hover:text-white hover:bg-white/5 transition-all'
                  >
                    <span>My Cart</span>
                    {numOfCartItems > 0 && (
                      <span className='bg-emerald-400 text-emerald-950 text-[10px] px-2 py-0.5 rounded-full'>{numOfCartItems}</span>
                    )}
                  </button>
                </li>

                <div className='h-px bg-white/10 my-4 px-6 mx-auto w-full'></div>

                {session ? (
                  <>
                    <div className="px-6 py-2 text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Authenticated Account</div>
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-4 px-6 py-4 text-white font-black text-sm rounded-[1.25rem] hover:bg-white/5"
                    >
                      <div className='w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden relative'>
                        {(session.user as any).image ? (
                          <Image
                            src={(session.user as any).image}
                            alt={session?.user?.name || 'Profile'}
                            fill
                            className="object-cover object-top"
                          />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </div> Profile Dashboard
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className='w-full flex items-center gap-4 px-6 py-4 rounded-[1.25rem] font-black text-sm text-red-100 bg-red-500/10 hover:bg-red-500/20 transition-all mt-2'
                    >
                      <div className='w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center'><LogOut className="w-5 h-5" /></div> Logout Session
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-4 p-2 mt-4">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full h-14 bg-transparent border-white/20 text-white hover:bg-white hover:text-emerald-700 rounded-[1.25rem] font-black uppercase tracking-widest text-xs">Login</Button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full h-14 bg-white text-emerald-700 hover:bg-emerald-50 rounded-[1.25rem] font-black uppercase tracking-widest text-xs border-0">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </ul>
            </div>
          </div>
        )}
      </nav>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

