"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
    Search,
    Mail,
    User as UserIcon,
    ShieldCheck,
    Calendar,
    ArrowUpCircle,
    ArrowDownCircle,
    Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import axios from 'axios'
import { useRouter } from 'next/navigation'

interface AdminCustomerTableProps {
    initialCustomers: any[]
}

export default function AdminCustomerTable({ initialCustomers }: AdminCustomerTableProps) {
    const [customers, setCustomers] = useState(initialCustomers)
    const [search, setSearch] = useState('')
    const [updatingId, setUpdatingId] = useState<string | null>(null)
    const router = useRouter()

    const filtered = customers.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.role?.toLowerCase() === search.toLowerCase()
    )

    async function toggleRole(id: string, currentRole: 'user' | 'admin', name: string) {
        const newRole = currentRole === 'admin' ? 'user' : 'admin'
        if (!confirm(`Are you sure you want to change ${name}'s role to ${newRole.toUpperCase()}?`)) return;

        setUpdatingId(id)
        const toastId = toast.loading(`Updating ${name}'s permission...`)

        try {
            const { data } = await axios.patch(`/api/admin/users/${id}/role`, {
                role: newRole
            });

            if (data.status === 'success') {
                setCustomers(prev => prev.map(c => c.id === id ? { ...c, role: newRole } : c))
                toast.success(`${name} is now an ${newRole.toUpperCase()}`, { id: toastId })
                router.refresh()
            }
        } catch (error: any) {
            console.error(error)
            toast.error(error.response?.data?.message || "Role update failed", { id: toastId })
        } finally {
            setUpdatingId(null)
        }
    }

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-zinc-800 overflow-hidden">
            <div className="p-10 border-b border-gray-50 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="relative flex-grow max-w-lg group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search users by name, email or role..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-zinc-800 border-2 border-transparent rounded-[1.5rem] focus:bg-white dark:focus:bg-zinc-800 focus:border-emerald-500 outline-none transition-all text-sm font-bold placeholder:text-gray-400 dark:text-zinc-100"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 dark:bg-zinc-800/50">
                            <th className="px-10 py-6 text-[11px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Customer</th>
                            <th className="px-10 py-6 text-[11px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Contact</th>
                            <th className="px-10 py-6 text-[11px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Role Status</th>
                            <th className="px-10 py-6 text-[11px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Orders</th>
                            <th className="px-10 py-6 text-[11px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                        {filtered.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50/20 dark:hover:bg-zinc-800/30 transition-colors group">
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-gray-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-gray-400 dark:text-zinc-500 border border-gray-100 dark:border-zinc-700 shadow-sm relative overflow-hidden group-hover:scale-110 transition-transform">
                                            {user.image ? (
                                                <Image src={user.image} alt={user.name || ''} fill className="object-cover" />
                                            ) : (
                                                <UserIcon className="w-7 h-7" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-base font-black text-gray-900 dark:text-zinc-100 leading-tight">{user.name || 'Incognito User'}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Calendar className="w-3 h-3 text-gray-400 dark:text-zinc-500" />
                                                <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-widest">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-zinc-400">
                                        <Mail className="w-4 h-4 text-gray-300 dark:text-zinc-600" />
                                        <span className="text-sm font-medium">{user.email}</span>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${user.role === 'admin' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900 shadow-sm shadow-amber-100 dark:shadow-none' : 'bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border border-gray-100 dark:border-zinc-700'}`}>
                                        {user.role === 'admin' && <ShieldCheck className="w-3.5 h-3.5" />}
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-gray-900 dark:text-zinc-100">{(user as any)._count?.orders || 0} Orders</span>
                                        <Link href={`/admin/orders?userId=${user.id}`} className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 uppercase tracking-widest mt-1">
                                            History Tracking
                                        </Link>
                                    </div>
                                </td>
                                <td className="px-10 py-8 text-right">
                                    <Button
                                        onClick={() => toggleRole(user.id, user.role, user.name || user.email)}
                                        disabled={updatingId === user.id}
                                        size="icon"
                                        variant="ghost"
                                        className={`rounded-xl transition-all ${user.role === 'admin' ? 'hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400' : 'hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400'}`}
                                    >
                                        {updatingId === user.id ? (
                                            <Loader2 className="w-5 h-5 animate-spin text-emerald-500 dark:text-emerald-400" />
                                        ) : user.role === 'admin' ? (
                                            <ArrowDownCircle className="w-5 h-5" />
                                        ) : (
                                            <ArrowUpCircle className="w-5 h-5" />
                                        )}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-10 bg-gray-50/10 dark:bg-zinc-800/10 border-t border-gray-50 dark:border-zinc-800 flex items-center justify-between">
                <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Showing {filtered.length} of {customers.length} users</p>
                <div className="flex gap-4">
                    <Link href="/" className="text-[10px] font-black text-gray-300 dark:text-zinc-600 hover:text-emerald-500 dark:hover:text-emerald-400 uppercase tracking-widest transition-colors">Portal Home</Link>
                    <span className="text-gray-100 dark:text-zinc-800 h-3 w-px"></span>
                    <Link href="/admin" className="text-[10px] font-black text-gray-300 dark:text-zinc-600 hover:text-emerald-500 dark:hover:text-emerald-400 uppercase tracking-widest transition-colors">Admin Dashboard</Link>
                </div>
            </div>
        </div>
    )
}
