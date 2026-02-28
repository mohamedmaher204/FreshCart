"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    ShoppingCart,
    BarChart3,
    Settings,
    ArrowLeft,
    PackagePlus,
    LogOut
} from 'lucide-react'
import { signOut } from 'next-auth/react'

export default function AdminSidebar() {
    const pathname = usePathname()

    const menuItems = [
        { icon: LayoutDashboard, label: 'Overview', href: '/admin' },
        { icon: ShoppingBag, label: 'Products', href: '/admin/products' },
        { icon: ShoppingCart, label: 'Orders', href: '/admin/orders' },
        { icon: Users, label: 'Customers', href: '/admin/customers' },
        { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
    ]

    return (
        <aside className="w-72 bg-[#111] text-white h-screen sticky top-0 flex flex-col border-r border-white/5">
            {/* Admin Logo Area */}
            <div className="p-8 border-b border-white/5">
                <Link href="/admin" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-black font-black shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform">
                        FC
                    </div>
                    <div>
                        <h1 className="font-black text-lg tracking-tighter">ADMIN <span className="text-emerald-500">CONTROL</span></h1>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Management Suite</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-grow p-6 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group ${isActive
                                ? 'bg-emerald-500 text-black font-black'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-black' : 'group-hover:scale-110 transition-transform'}`} />
                            <span className="text-sm uppercase tracking-widest font-black">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-6 border-t border-white/5 space-y-4">
                <Link
                    href="/"
                    className="flex items-center gap-4 px-4 py-4 text-gray-400 hover:text-emerald-400 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-widest">Back to Store</span>
                </Link>
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center gap-4 px-4 py-4 text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest">Logout Admin</span>
                </button>
            </div>
        </aside>
    )
}
