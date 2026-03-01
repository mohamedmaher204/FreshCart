export const dynamic = 'force-dynamic';

import React from 'react'
import { prisma } from '@/app/_lib/prisma'
import {
    ShoppingBag,
    Search,
    Filter,
    Eye,
    Truck,
    CreditCard,
    CheckCircle2,
    Clock,
    ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

async function getOrders() {
    try {
        // Fetch orders without include to avoid relation errors with orphaned records
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
        });

        // Manually fetch users for the orders that have a userId
        const userIds = [...new Set(orders.map(o => o.userId).filter(Boolean))];
        const users = userIds.length > 0
            ? await prisma.user.findMany({ where: { id: { in: userIds } } })
            : [];

        const userMap = new Map(users.map(u => [u.id, u]));

        // Merge user data into each order
        return orders.map(order => ({
            ...order,
            user: userMap.get(order.userId) ?? null,
        }));
    } catch (error) {
        console.error("Error fetching admin orders:", error);
        return [];
    }
}

export default async function AdminOrdersPage() {
    const orders = await getOrders();

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-zinc-100 tracking-tight mb-2">ORDER <span className="text-emerald-500">MANAGEMENT</span></h1>
                    <p className="text-gray-500 dark:text-zinc-500 font-medium">Track and fulfill customer orders globally.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 dark:text-zinc-100 rounded-2xl px-6 h-14 font-black uppercase tracking-widest text-xs shadow-sm">
                        Export Orders
                    </Button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Total Orders</p>
                    <h4 className="text-2xl font-black text-gray-900 dark:text-zinc-100">{orders.length}</h4>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Unpaid (COD)</p>
                    <h4 className="text-2xl font-black text-amber-600 dark:text-amber-400">{orders.filter(o => !o.isPaid).length}</h4>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Completed</p>
                    <h4 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{orders.filter(o => o.isDelivered).length}</h4>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Revenue</p>
                    <h4 className="text-2xl font-black text-gray-900 dark:text-zinc-100">EGP {orders.reduce((acc, current) => acc + current.totalPrice, 0).toLocaleString()}</h4>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-zinc-800 overflow-hidden">
                <div className="p-8 border-b border-gray-50 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-center">
                    <div className="relative flex-grow max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by Order ID or Customer..."
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-zinc-800 border border-transparent rounded-2xl focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm font-medium dark:text-zinc-100"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" className="rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10">Filter: All Time</Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-zinc-800/50">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Order Detail</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Customer Info</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Amount</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Payment Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Fulfillment</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] text-right">View</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/30 dark:hover:bg-zinc-800/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-black text-gray-900 dark:text-zinc-100">#{(order.id as string).slice(-8).toUpperCase()}</p>
                                        <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="min-w-[150px]">
                                            <p className="text-sm font-black text-gray-900 dark:text-zinc-100">{(order as any).user?.name || 'Guest'}</p>
                                            <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium truncate max-w-[150px]">{(order as any).user?.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-black text-gray-900 dark:text-zinc-100">EGP {order.totalPrice}</p>
                                        <div className="flex items-center gap-1 text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-tighter">
                                            {order.paymentMethod === 'online' ? <CreditCard className="w-3 h-3 text-blue-500 dark:text-blue-400" /> : <ShoppingBag className="w-3 h-3 text-amber-500 dark:text-amber-400" />}
                                            {order.paymentMethod}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${order.isPaid ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                                            {order.isPaid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                            {order.isPaid ? 'Paid' : 'Unpaid'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <Truck className={`w-4 h-4 ${order.isDelivered ? 'text-emerald-500 dark:text-emerald-400' : 'text-gray-300 dark:text-zinc-700'}`} />
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${order.isDelivered ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-zinc-500'}`}>
                                                {order.isDelivered ? 'Delivered' : 'Processing'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <Link href={`/admin/orders/${order.id}`}>
                                            <Button size="icon" variant="ghost" className="rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
