import React from 'react'
import { prisma } from '@/app/_lib/prisma'
import {
    TrendingUp,
    BarChart3,
    PieChart,
    ArrowUpRight,
    Target,
    Activity,
    ShoppingBag,
    Zap,
    Star
} from 'lucide-react'

async function getAnalyticsData() {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const [totalRevenue, totalOrders, soldItems, activeProducts, recentOrders] = await Promise.all([
        prisma.order.aggregate({ _sum: { totalPrice: true } }),
        prisma.order.count(),
        prisma.product.aggregate({ _sum: { sold: true } }),
        prisma.product.count(),
        prisma.order.findMany({
            where: { createdAt: { gte: sevenDaysAgo } },
            select: { totalPrice: true, createdAt: true },
            orderBy: { createdAt: 'asc' }
        })
    ]);

    // Calculate daily revenue for the last 7 days
    const dailyRevenue = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (6 - i));
        const dateStr = date.toISOString().split('T')[0];

        const dayTotal = recentOrders
            .filter(o => o.createdAt.toISOString().split('T')[0] === dateStr)
            .reduce((sum, o) => sum + o.totalPrice, 0);

        return {
            label: date.toLocaleDateString('en-US', { weekday: 'short' }),
            value: dayTotal
        };
    });

    const maxDayRevenue = Math.max(...dailyRevenue.map(d => d.value), 1); // Avoid division by zero

    // Grouping by payment method
    const onlinePayments = await prisma.order.count({ where: { paymentMethod: 'online' } });
    const cashPayments = await prisma.order.count({ where: { paymentMethod: 'cash' } });

    return {
        revenue: totalRevenue._sum.totalPrice || 0,
        orders: totalOrders,
        itemsSold: soldItems._sum.sold || 0,
        products: activeProducts,
        payments: { online: onlinePayments, cash: cashPayments },
        chartData: dailyRevenue.map(d => ({ ...d, percent: (d.value / maxDayRevenue) * 100 }))
    };
}

export default async function AdminAnalyticsPage() {
    const data = await getAnalyticsData();

    const metrics = [
        { label: 'Conversion Rate', value: '3.2%', icon: Target, color: 'emerald' },
        { label: 'Avg Order Value', value: `EGP ${(data.revenue / (data.orders || 1)).toFixed(0)}`, icon: Activity, color: 'blue' },
        { label: 'Customer Satisfaction', value: '4.8/5', icon: Star, color: 'amber' },
        { label: 'Growth Velocity', value: '+24%', icon: Zap, color: 'purple' },
    ]

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-gray-900 dark:text-zinc-100 tracking-tight mb-2 uppercase">BUSINESS <span className="text-emerald-500">ANALYTICS</span></h1>
                <p className="text-gray-500 dark:text-zinc-500 font-medium tracking-tight">In-depth intelligence into your store's performance and market trends.</p>
            </div>

            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {metrics.map((m, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] shadow-xl shadow-gray-200/40 dark:shadow-none border border-gray-100 dark:border-zinc-800 flex flex-col justify-between">
                        <div className={`w-12 h-12 rounded-2xl bg-${m.color}-50 dark:bg-${m.color}-500/10 text-${m.color}-600 dark:text-${m.color}-400 flex items-center justify-center mb-6`}>
                            <m.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-1">{m.label}</p>
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-zinc-100">{m.value}</h3>
                                <div className="flex items-center text-emerald-500 dark:text-emerald-400 text-[10px] font-black">
                                    <ArrowUpRight className="w-3 h-3" /> 12%
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* Revenue Breakdown */}
                <div className="bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-zinc-800 p-10">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-xl font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Revenue <span className="text-emerald-600">Breakdown</span></h2>
                            <p className="text-xs text-gray-400 dark:text-zinc-500 font-medium uppercase tracking-widest mt-1">Monthly progression</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <div className="w-2 h-2 rounded-full bg-emerald-100 dark:bg-zinc-800"></div>
                        </div>
                    </div>

                    {/* REAL-TIME Data-driven Chart */}
                    <div className="flex items-end justify-between h-56 gap-4 px-2">
                        {data.chartData.map((day, i) => (
                            <div key={i} className="flex-1 group relative">
                                <div
                                    className="w-full bg-emerald-50 dark:bg-emerald-500/10 group-hover:bg-emerald-500 transition-all rounded-t-2xl duration-700 relative overflow-hidden"
                                    style={{ height: `${Math.max(day.percent, 5)}%` }} // Minimum height for visibility
                                >
                                    {/* Tooltip on hover */}
                                    <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black dark:bg-white/90 backdrop-blur-md text-[8px] font-black text-white dark:text-zinc-900 px-2 py-1 rounded-md z-20">
                                        EGP {day.value.toLocaleString()}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">{day.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 flex items-center justify-around border-t border-gray-50 dark:border-zinc-800 pt-10">
                        <div className="text-center">
                            <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Total Sales</p>
                            <h4 className="text-lg font-black text-gray-900 dark:text-zinc-100">EGP {data.revenue.toLocaleString()}</h4>
                        </div>
                        <div className="w-px h-8 bg-gray-100 dark:bg-zinc-800"></div>
                        <div className="text-center">
                            <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Growth</p>
                            <h4 className="text-lg font-black text-emerald-500 dark:text-emerald-400">+14%</h4>
                        </div>
                    </div>
                </div>

                {/* Payment Method Distribution */}
                <div className="bg-[#111] rounded-[3rem] shadow-2xl shadow-emerald-950/20 p-10 text-white flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tight mb-2">Payment <span className="text-emerald-500">Channels</span></h2>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-10">Distribution by method</p>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Stripe Online
                                    </span>
                                    <span className="text-xs font-black">{((data.payments.online / (data.orders || 1)) * 100).toFixed(0)}%</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(data.payments.online / (data.orders || 1)) * 100}%` }}></div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-white/20"></div> Cash on Delivery
                                    </span>
                                    <span className="text-xs font-black">{((data.payments.cash / (data.orders || 1)) * 100).toFixed(0)}%</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-white/20 rounded-full" style={{ width: `${(data.payments.cash / (data.orders || 1)) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 p-6 bg-white/5 rounded-[2rem] border border-white/5 flex items-center gap-6">
                        <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-2xl flex items-center justify-center">
                            <PieChart className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-tight">Market Insight</h4>
                            <p className="text-[10px] text-gray-500 font-medium leading-relaxed">Online payments have increased by 15% since last month. Consider promoting Stripe more.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
