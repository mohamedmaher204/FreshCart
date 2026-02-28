"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Pencil, Trash2, Eye, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import axios from 'axios'
import { useRouter } from 'next/navigation'

interface AdminProductTableProps {
    initialProducts: any[]
}

export default function AdminProductTable({ initialProducts }: AdminProductTableProps) {
    const [products, setProducts] = useState(initialProducts)
    const [search, setSearch] = useState('')
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const router = useRouter()

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    )

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

        setDeletingId(id)
        const toastId = toast.loading(`Deleting ${title}...`)

        try {
            await axios.delete(`/api/products/${id}`)
            setProducts(prev => prev.filter(p => p.id !== id))
            toast.success("Product deleted successfully", { id: toastId })
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error("Failed to delete product", { id: toastId })
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-zinc-800 overflow-hidden">
            <div className="p-8 border-b border-gray-50 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-grow max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by title or category..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-zinc-800 border border-transparent rounded-2xl focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm font-medium dark:text-zinc-100"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest border-gray-100 dark:border-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300">Export CSV</Button>
                    <Button variant="outline" className="rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest border-gray-100 dark:border-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300">Filter</Button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 dark:bg-zinc-800/50">
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Product Info</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Category</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Pricing</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Inventory</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50/30 dark:hover:bg-zinc-800/30 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-14 h-14 bg-gray-50 dark:bg-zinc-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-700 flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                                            <Image
                                                src={product.imageCover}
                                                alt={product.title}
                                                fill
                                                className="object-contain p-2 dark:brightness-90"
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-black text-gray-900 dark:text-zinc-100 truncate max-w-[200px]">{product.title}</p>
                                            <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-widest">ID: #{product.id.slice(-6)}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-sm font-black text-gray-900 dark:text-zinc-100">EGP {product.price}</p>
                                    {product.priceAfterDiscount && (
                                        <p className="text-[10px] text-emerald-500 dark:text-emerald-400 font-bold">Disc: EGP {product.priceAfterDiscount}</p>
                                    )}
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="w-24 h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${product.quantity < 5 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                                style={{ width: `${Math.min((product.quantity / 50) * 100, 100)}%` }}
                                            />
                                        </div>
                                        <p className={`text-[10px] font-black uppercase tracking-widest ${product.quantity < 5 ? 'text-amber-600' : 'text-gray-400 dark:text-zinc-500'}`}>
                                            {product.quantity} in stock
                                        </p>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/product/${product.id}`} target="_blank">
                                            <Button size="icon" variant="ghost" className="rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Link href={`/admin/products/edit/${product.id}`}>
                                            <Button size="icon" variant="ghost" className="rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            disabled={deletingId === product.id}
                                            onClick={() => handleDelete(product.id, product.title)}
                                            className="rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-8 border-t border-gray-50 dark:border-zinc-800 flex items-center justify-between">
                <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Showing {filteredProducts.length} of {products.length} products</p>
                <div className="flex items-center gap-2">
                    <Button variant="outline" disabled className="rounded-xl dark:border-zinc-800 dark:text-zinc-500">Previous</Button>
                    <Button variant="outline" disabled className="rounded-xl dark:border-zinc-800 dark:text-zinc-500">Next</Button>
                </div>
            </div>
        </div>
    )
}
