import React from 'react'
import { prisma } from '@/app/_lib/prisma'
import {
    Users,
    Search,
    Mail,
    User as UserIcon,
    ShieldCheck,
    UserCheck,
    Calendar,
    MoreVertical,
    MinusCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

async function getCustomers() {
    return await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { orders: true } } }
    });
}

export default async function AdminCustomersPage() {
    const customers = await getCustomers();

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-zinc-100 tracking-tight mb-2">CUSTOMER <span className="text-emerald-500">BASE</span></h1>
                    <p className="text-gray-500 dark:text-zinc-500 font-medium tracking-tight">Manage your registered users and their permissions.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 dark:text-zinc-100 rounded-2xl px-6 h-14 font-black uppercase tracking-widest text-xs shadow-sm">
                        Export Users
                    </Button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-xl shadow-gray-200/50 dark:shadow-none flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
                        <Users className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Total Registered</p>
                        <h4 className="text-2xl font-black text-gray-900 dark:text-zinc-100">{customers.length}</h4>
                    </div>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-xl shadow-gray-200/50 dark:shadow-none flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Admins / Staff</p>
                        <h4 className="text-2xl font-black text-blue-600 dark:text-blue-400">{customers.filter(c => c.role === 'admin').length}</h4>
                    </div>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-xl shadow-gray-200/50 dark:shadow-none flex items-center gap-6">
                    <div className="w-16 h-16 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center">
                        <UserCheck className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Active This Month</p>
                        <h4 className="text-2xl font-black text-amber-600 dark:text-amber-400">{customers.length}</h4>
                    </div>
                </div>
            </div>

            {/* Customers Table (Client Component) */}
            <AdminCustomerTable initialCustomers={JSON.parse(JSON.stringify(customers))} />
        </div>
    )
}

import AdminCustomerTable from '@/app/_component/admin/AdminCustomerTable';
