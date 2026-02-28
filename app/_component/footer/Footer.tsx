import React from 'react'
import logo from '@/images/freshcart-logo.svg'
import Image from 'next/image'
import Link from 'next/link'
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Mail,
    Phone,
    MapPin,
    ArrowRight,
    ShieldCheck,
    CreditCard,
    Truck
} from 'lucide-react'

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#111] dark:bg-zinc-950 text-white pt-20 pb-10 overflow-hidden relative transition-colors duration-500">
            {/* Decorative background element */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>

            <div className="container mx-auto px-4 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="bg-white dark:bg-emerald-500 p-2 rounded-2xl shadow-xl transition-transform duration-500 group-hover:rotate-12">
                                <Image src={logo} alt="FreshCart Logo" className="w-8 h-8 dark:invert" />
                            </div>
                            <span className="font-black text-2xl tracking-tighter">
                                FRESH<span className="text-emerald-500">CART</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed font-medium">
                            Elevating your shopping experience with premium curated products, fast global delivery, and 100% secure transactions. Join our community of savvy shoppers today.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-emerald-600 hover:text-white transition-all">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-emerald-600 hover:text-white transition-all">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-emerald-600 hover:text-white transition-all">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-emerald-600 hover:text-white transition-all">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-8">Shop Selection</h4>
                        <ul className="space-y-4">
                            {['All Products', 'Featured Categories', 'Limited Offers', 'New Arrivals', 'Best Sellers'].map((item) => (
                                <li key={item}>
                                    <Link href="/products" className="text-sm font-bold text-gray-400 hover:text-white hover:translate-x-2 transition-all flex items-center gap-2 group">
                                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-emerald-500" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Section */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-8">Customer Care</h4>
                        <ul className="space-y-4">
                            {['Terms of Service', 'Privacy Policy', 'Shipping Guide', 'Easy Returns', 'Help Center'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-sm font-bold text-gray-400 hover:text-white hover:translate-x-2 transition-all flex items-center gap-2 group">
                                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-emerald-500" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter / Contact Section */}
                    <div className="space-y-8">
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-6">Stay Inspired</h4>
                            <div className="relative group">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-12 text-sm text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-emerald-500 outline-none transition-all"
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20">
                                    <Mail className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-gray-400">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-500">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Call Support</p>
                                    <p className="text-sm font-bold text-white">+20 0127 141 0168</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-gray-400">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-500">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Main Office</p>
                                    <p className="text-sm font-bold text-white">Cairo, Egypt</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle Bar: Trust Indicators */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-y border-white/5">
                    <div className="flex items-center gap-3 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700 cursor-default">
                        <ShieldCheck className="w-6 h-6 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Authentic Products</span>
                    </div>
                    <div className="flex items-center gap-3 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700 cursor-default">
                        <Truck className="w-6 h-6 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Global Shipping</span>
                    </div>
                    <div className="flex items-center gap-3 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700 cursor-default">
                        <CreditCard className="w-6 h-6 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure Payments</span>
                    </div>
                    <div className="flex items-center gap-3 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700 cursor-default">
                        <ArrowRight className="w-6 h-6 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">30-Day Returns</span>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                        © {currentYear} <span className="text-white">FreshCart</span>. Engineered by Premium Devs.
                    </p>

                    <div className="flex items-center gap-6 opacity-30">
                        {/* These would ideally be svgs of payment brands */}
                        <div className="text-[9px] font-black border border-white/20 px-3 py-1 rounded">VISA</div>
                        <div className="text-[9px] font-black border border-white/20 px-3 py-1 rounded">STRIPE</div>
                        <div className="text-[9px] font-black border border-white/20 px-3 py-1 rounded">MASTERCARD</div>
                        <div className="text-[9px] font-black border border-white/20 px-3 py-1 rounded">AMEX</div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
