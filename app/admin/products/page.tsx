export const dynamic = 'force-dynamic';

import React from 'react'
import { prisma } from '@/app/_lib/prisma'
import { Plus, Package, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import AdminProductTable from '@/app/_component/admin/AdminProductTable'

async function getProducts() {
    return await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
    });
}

export default async function AdminProductsPage() {
    const products = await getProducts();

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-zinc-100 tracking-tight mb-2">PRODUCT <span className="text-emerald-500">INVENTORY</span></h1>
                    <p className="text-gray-500 dark:text-zinc-500 font-medium">Manage your store's catalog, stock levels, and pricing.</p>
                </div>
                <Link href="/admin/products/new">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-6 h-14 font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl shadow-emerald-500/20">
                        <Plus className="w-5 h-5" /> Add New Product
                    </Button>
                </Link>
            </div>

            {/* Stats Summary for Products */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Total Items</p>
                        <h4 className="text-xl font-black text-gray-900 dark:text-zinc-100">{products.length}</h4>
                    </div>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Low Stock</p>
                        <h4 className="text-xl font-black text-gray-900 dark:text-zinc-100">
                            {products.filter(p => p.quantity < 5).length} Items
                        </h4>
                    </div>
                </div>
            </div>

            {/* Products Table (Client Component) */}
            <AdminProductTable initialProducts={JSON.parse(JSON.stringify(products))} />
        </div>
    )
}
