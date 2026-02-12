"use client"
import React from 'react'
import { useSession, signOut } from 'next-auth/react'
import { User, Mail, Shield, ShoppingBag, Heart, LogOut, Clock, ArrowRight, Settings } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ProfilePage() {
    const { data: session } = useSession();

    if (!session) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                    <Shield className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-black text-gray-900 mb-2">Access Denied</h1>
                <p className="text-gray-500 mb-6 text-center max-w-xs">Please log in to your account to view your personal profile dashboard.</p>
                <Link href="/login">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 h-12 px-8 rounded-xl font-bold">Log In Now</Button>
                </Link>
            </div>
        )
    }

    const user = session.user;

    return (
        <main className="min-h-screen bg-[#fafafa] pb-20 pt-10">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Hero Profile Section */}
                    <div className="relative bg-emerald-600 rounded-[2.5rem] p-8 md:p-12 text-white mb-8 overflow-hidden shadow-2xl shadow-emerald-200">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="w-32 h-32 rounded-[2rem] bg-white p-1 shadow-xl flex-shrink-0">
                                <div className="w-full h-full rounded-[1.8rem] bg-emerald-100 flex items-center justify-center text-emerald-600">
                                    <User className="w-16 h-16" />
                                </div>
                            </div>
                            <div className="text-center md:text-left">
                                <h1 className="text-3xl md:text-4xl font-black mb-2">{user?.name}</h1>
                                <p className="text-emerald-50/80 font-medium flex items-center justify-center md:justify-start gap-2">
                                    <Mail className="w-4 h-4" /> {user?.email}
                                </p>
                                <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
                                    <Link href="/allorders">
                                        <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold backdrop-blur-sm">
                                            My Orders
                                        </Button>
                                    </Link>
                                    <Link href="/wishlist">
                                        <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold backdrop-blur-sm">
                                            Wishlist
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Account Details */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-emerald-600">
                                            <Settings className="w-5 h-5" />
                                        </div>
                                        Account Settings
                                    </h2>
                                    <Button variant="ghost" className="text-emerald-600 font-bold hover:bg-emerald-50">Edit Profile</Button>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Full Name</p>
                                            <p className="font-bold text-gray-900">{user?.name}</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                                            <p className="font-bold text-gray-900">{user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Account Role</p>
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-emerald-500" />
                                            <p className="font-bold text-gray-900">Verified Customer</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity Mock (Design only) */}
                            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-amber-500">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    Recent Activity
                                </h2>
                                <div className="space-y-4">
                                    {[1, 2].map(i => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-[#fafafa] group hover:bg-white hover:shadow-md transition-all cursor-default">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-100">
                                                    <ShoppingBag className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">Order #ORD-12{i}90 placed</p>
                                                    <p className="text-xs text-gray-500">Yesterday at 4:2{i} PM</p>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Quick Stats & Actions */}
                        <div className="space-y-6">
                            <div className="bg-gray-900 rounded-[2rem] p-8 text-white">
                                <h3 className="text-lg font-black mb-6">Experience Points</h3>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-3xl font-black">Gold</p>
                                            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Member Level</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-emerald-400 font-bold">850 XP</p>
                                            <p className="text-[10px] text-gray-500">To Platinum: 150</p>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[85%]"></div>
                                    </div>
                                    <p className="text-[10px] text-gray-500 leading-relaxed">
                                        You've saved over <span className="text-emerald-400">EGP 1,200</span> in the last month with your Gold member discounts!
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="w-full flex items-center justify-center gap-3 p-6 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 font-black hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-[0.98] group"
                            >
                                <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" /> Sign Out from Device
                            </button>

                            <div className="p-6 bg-white rounded-2xl border border-dashed border-gray-200 text-center">
                                <p className="text-xs text-gray-400 font-medium">Account ID: <span className="font-bold">USR-773482</span></p>
                                <p className="text-[10px] text-gray-300 mt-1">Member since Feb 2026</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
