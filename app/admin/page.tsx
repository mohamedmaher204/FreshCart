export const dynamic = 'force-dynamic';

import React from 'react'
import { prisma } from '@/app/_lib/prisma'
import {
    TrendingUp,
    Package,
    Users,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

async function getStats() {
    const [productCount, orderCount, userCount, totalRevenueData] = await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.user.count(),
        prisma.order.aggregate({
            _sum: { totalPrice: true }
        })
    ]);

    let recentOrders: any[] = [];
    try {
        const rawOrders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
        });

        // Manually fetch users to avoid relation errors on orphaned orders
        const userIds = [...new Set(rawOrders.map(o => o.userId).filter(Boolean))];
        const users = userIds.length > 0
            ? await prisma.user.findMany({ where: { id: { in: userIds } } })
            : [];
        const userMap = new Map(users.map(u => [u.id, u]));

        recentOrders = rawOrders.map(order => ({
            ...order,
            user: userMap.get(order.userId) ?? null,
        }));
    } catch (error) {
        console.log('Error fetching orders:', error);
        recentOrders = [];
    }

    return {
        productCount,
        orderCount,
        userCount,
        totalRevenue: totalRevenueData._sum.totalPrice || 0,
        recentOrders
    };
}

export default async function AdminOverviewPage() {
    const stats = await getStats();

    const cards = [
        { label: 'Total Revenue', value: `EGP ${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'emerald', trend: '+12%' },
        { label: 'Total Orders', value: stats.orderCount.toString(), icon: Package, color: 'blue', trend: '+5%' },
        { label: 'Customers', value: stats.userCount.toString(), icon: Users, color: 'purple', trend: '+18%' },
        { label: 'Active Products', value: stats.productCount.toString(), icon: TrendingUp, color: 'amber', trend: 'Healthy' },
    ]

    return (
        <div className="space-y-12">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-gray-900 dark:text-zinc-100 tracking-tight mb-2">DASHBOARD <span className="text-emerald-500">OVERVIEW</span></h1>
                <p className="text-gray-500 dark:text-zinc-500 font-medium">Welcome back, Admin. Here's what's happening in your store today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {cards.map((card, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-zinc-800 group hover:-translate-y-1 transition-all">
                        <div className={`w-14 h-14 rounded-2xl bg-${card.color}-100 dark:bg-${card.color}-500/10 flex items-center justify-center text-${card.color}-600 dark:text-${card.color}-400 mb-6 group-hover:scale-110 transition-transform`}>
                            <card.icon className="w-7 h-7" />
                        </div>
                        <p className="text-xs font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">{card.label}</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-zinc-100">{card.value}</h3>
                            <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${card.trend.includes('+') ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400'}`}>
                                {card.trend}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Recent Orders Table */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-zinc-800 overflow-hidden">
                    <div className="p-8 border-b border-gray-50 dark:border-zinc-800 flex items-center justify-between">
                        <h2 className="text-xl font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Recent <span className="text-emerald-600">Orders</span></h2>
                        <Link href="/admin/orders" className="text-xs font-black text-emerald-600 hover:underline uppercase tracking-widest">
                            View All
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-zinc-800/50">
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Order ID</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Customer</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Total</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                                {stats.recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/30 dark:hover:bg-zinc-800/30 transition-colors group">
                                        <td className="px-8 py-5 text-xs font-bold text-gray-400 dark:text-zinc-600 group-hover:text-emerald-600 transition-colors">#{order.id.slice(-6)}</td>
                                        <td className="px-8 py-5">
                                            <p className="text-sm font-black text-gray-900 dark:text-zinc-100">{(order as any).user?.name || 'Guest'}</p>
                                            <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium tracking-tight">{(order as any).user?.email}</p>
                                        </td>
                                        <td className="px-8 py-5 font-black text-gray-900 dark:text-zinc-100">EGP {order.totalPrice}</td>
                                        <td className="px-8 py-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.isPaid ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                                                {order.isPaid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                {order.isPaid ? 'Paid' : 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions / Activity Feed */}
                <div className="space-y-8">
                    <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-zinc-800 p-8">
                        <h2 className="text-xl font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight mb-8">Quick <span className="text-emerald-600">Actions</span></h2>
                        <div className="space-y-4">
                            <Link href="/admin/products" className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all group">
                                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Package className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-zinc-100">Add New Product</span>
                            </Link>
                            <Link href="/admin/analytics" className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all group">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-zinc-100">Review Sales Report</span>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-[#111] rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-8 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-lg font-black uppercase tracking-tight mb-2">Inventory <span className="text-emerald-500">Alert</span></h2>
                            <p className="text-xs text-gray-500 font-bold mb-6">3 items are running low on stock.</p>
                            <Link href="/admin/products?filter=low-stock">
                                <Button className="w-full bg-white text-black hover:bg-emerald-500 hover:text-white rounded-xl font-black text-[10px] uppercase tracking-widest h-12">
                                    Restock Now
                                </Button>
                            </Link>
                        </div>
                        {/* Decorative background circle */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    </div>
                </div>

            </div>
        </div>
    )
}
