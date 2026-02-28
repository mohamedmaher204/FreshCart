"use client"
import React from 'react'
import { useSession, signOut } from 'next-auth/react'
import { User, Mail, Shield, ShoppingBag, Heart, LogOut, Clock, ArrowRight, Settings, Camera, Check, X as Cancel, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import PageLoader from '../_component/ui/PageLoader'
import ImageUpload from '../_component/admin/ImageUpload'
import { toast } from 'sonner'
import axios from 'axios'
import Image from 'next/image'

export default function ProfilePage() {
    const { data: session, status, update } = useSession();
    const [isEditing, setIsEditing] = React.useState(false);
    const [name, setName] = React.useState('');
    const [image, setImage] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    // Initialize state from session
    React.useEffect(() => {
        if (session?.user) {
            setName(session.user.name || '');
            setImage(session.user.image || '');
        }
    }, [session]);

    const handleSave = async () => {
        setLoading(true);
        const toastId = toast.loading("Updating profile...");
        try {
            const res = await axios.put('/api/user/profile', { name, image });
            if (res.status === 200) {
                // Refresh session to show new data
                await update({ name, image });
                toast.success("Profile updated!", { id: toastId });
                setIsEditing(false);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading') return <PageLoader />;

    if (!session) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
                <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center text-gray-400 mb-6 shadow-inner">
                    <Shield className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight uppercase">Access Denied</h1>
                <p className="text-gray-500 mb-8 text-center max-w-xs font-medium">Please log in to your account to view your personal premium dashboard.</p>
                <Link href="/login">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 h-14 px-12 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-100 transition-transform active:scale-95">Log In Now</Button>
                </Link>
            </div>
        )
    }

    const user = session.user;

    return (
        <main className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 pb-24 transition-colors duration-500">
            {/* Premium Hero Profile Section */}
            <div className="relative bg-emerald-600 py-20 overflow-hidden mb-12">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-white rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-emerald-400 rounded-full blur-[120px] animate-pulse delay-700"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
                        <div className="relative group flex-shrink-0">
                            <div className="w-36 h-36 rounded-[2.5rem] bg-white p-1.5 shadow-2xl relative overflow-hidden transition-transform group-hover:scale-105 duration-500">
                                <div className="w-full h-full rounded-[2.2rem] bg-emerald-50 flex items-center justify-center text-emerald-600 relative overflow-hidden">
                                    {image || user?.image ? (
                                        <Image
                                            src={image || user?.image!}
                                            alt={user?.name || 'Profile'}
                                            fill
                                            className="object-cover object-top"
                                        />
                                    ) : (
                                        <User className="w-16 h-16" />
                                    )}
                                </div>
                                {isEditing && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
                                        <div className="w-full h-full scale-[0.6] opacity-0 hover:opacity-100">
                                            <ImageUpload
                                                value={image}
                                                onChange={(val) => setImage(val as string)}
                                            />
                                        </div>
                                        <Camera className="w-8 h-8 text-white pointer-events-none absolute" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="text-center md:text-left">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-widest mb-4 border border-white/20">
                                <Shield className="w-3 h-3" /> Verified Member
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight uppercase">{user?.name}</h1>
                            <p className="text-emerald-50/70 font-bold text-lg">{user?.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Account Details */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100 dark:border-zinc-800 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <div className="flex items-center justify-between mb-10">
                                    <h2 className="text-2xl font-black text-gray-900 dark:text-zinc-100 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                            <Settings className="w-6 h-6" />
                                        </div>
                                        Personal Hub
                                    </h2>
                                    {isEditing ? (
                                        <div className="flex items-center gap-2">
                                            <Button
                                                onClick={() => setIsEditing(false)}
                                                variant="ghost"
                                                className="rounded-xl font-black text-[10px] uppercase tracking-widest h-10 px-4 text-gray-400"
                                            >
                                                <Cancel className="w-4 h-4 mr-2" /> Cancel
                                            </Button>
                                            <Button
                                                onClick={handleSave}
                                                disabled={loading}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest h-10 px-6 shadow-xl shadow-emerald-500/20 dark:shadow-none"
                                            >
                                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4 mr-2" /> Save Changes</>}
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={() => setIsEditing(true)}
                                            variant="outline"
                                            className="rounded-xl border-gray-100 dark:border-zinc-800 font-black text-[10px] uppercase tracking-widest h-10 px-6 dark:bg-zinc-800 dark:text-zinc-100"
                                        >
                                            Edit Info
                                        </Button>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-6 rounded-3xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-lg transition-all duration-500">
                                            <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-2">Display Name</p>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl px-4 py-2 font-black text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                                />
                                            ) : (
                                                <p className="font-black text-gray-900 dark:text-zinc-100 text-lg">{user?.name}</p>
                                            )}
                                        </div>
                                        <div className="p-6 rounded-3xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-lg transition-all duration-500">
                                            <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-2">Primary Email</p>
                                            <p className="font-black text-gray-900 dark:text-zinc-100 text-lg truncate">{user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="p-6 rounded-3xl bg-emerald-600 text-white shadow-xl shadow-emerald-200 dark:shadow-none">
                                        <p className="text-[10px] font-black text-emerald-200 uppercase tracking-[0.2em] mb-2">Account Prestige</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Shield className="w-6 h-6" />
                                                <p className="font-black text-xl">Verified VIP Customer</p>
                                            </div>
                                            <div className="px-3 py-1 bg-white/20 rounded-lg text-[9px] font-black uppercase">Level 42</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity Section */}
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                                <h2 className="text-xl font-black text-gray-900 dark:text-zinc-100 px-4 flex items-center gap-3 uppercase tracking-tighter">
                                    <Clock className="w-5 h-5 text-amber-500" /> Recent Actions
                                </h2>
                                <div className="grid grid-cols-1 gap-4">
                                    {[1, 2].map(i => (
                                        <div key={i} className="flex items-center justify-between p-6 rounded-[2rem] bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 hover:shadow-xl hover:scale-[1.01] transition-all cursor-default group">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 flex items-center justify-center border border-gray-100 dark:border-zinc-800 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 transition-colors">
                                                    <ShoppingBag className="w-6 h-6 text-gray-400 dark:text-zinc-500 group-hover:text-emerald-500 transition-colors" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 dark:text-zinc-100">New Purchase Processed</p>
                                                    <p className="text-xs text-gray-400 dark:text-zinc-500 font-medium">Order #ORD-FRESH-{120 + i} • Finished 2h ago</p>
                                                </div>
                                            </div>
                                            <div className="w-10 h-10 rounded-full border border-gray-100 dark:border-zinc-800 flex items-center justify-center text-gray-300 dark:text-zinc-500 group-hover:border-emerald-500 group-hover:text-emerald-500 transition-all">
                                                <ArrowRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Experience & Quick Actions */}
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
                            <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500 mb-8">Loyalty Program</h3>
                                <div className="space-y-8">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-4xl font-black tracking-tighter">GOLD</p>
                                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">Status Level</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-emerald-400 font-black text-xl">2.4k XP</p>
                                        </div>
                                    </div>
                                    <div className="h-2.5 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                                        <div className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 w-[78%] rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                                    </div>
                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-gray-500">
                                        <span>Silver</span>
                                        <span className="text-emerald-500">Platinum</span>
                                    </div>
                                    <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                                        You've unlocked <span className="text-emerald-400">Exclusive 15% VIP Discounts</span> on all electronics categories!
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Link href="/allorders" className="block">
                                    <Button className="w-full h-16 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-zinc-100 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all shadow-sm flex items-center justify-between px-8 group">
                                        Track Orders <ArrowRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Link href="/wishlist" className="block">
                                    <Button className="w-full h-16 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-zinc-100 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all shadow-sm flex items-center justify-between px-8 group">
                                        My Favorites <Heart className="w-4 h-4 text-rose-500 group-hover:scale-125 transition-transform" />
                                    </Button>
                                </Link>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="w-full flex items-center justify-center gap-3 h-16 rounded-2xl bg-rose-500 text-white font-black uppercase tracking-widest text-[10px] hover:bg-rose-600 transition-all shadow-xl shadow-rose-200 mt-4 group"
                                >
                                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Sign Out from Device
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
