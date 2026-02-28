"use client"
import React, { useState } from 'react'
import {
    CheckCircle2,
    Clock,
    Truck,
    CreditCard,
    Loader2,
    ShoppingBag,
    MapPin,
    Phone,
    ArrowLeft,
    User as UserIcon,
    AlertCircle
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface OrderManagerProps {
    order: any
}

export default function OrderManager({ order: initialOrder }: OrderManagerProps) {
    const [order, setOrder] = useState(initialOrder)
    const [updatingPaid, setUpdatingPaid] = useState(false)
    const [updatingDelivered, setUpdatingDelivered] = useState(false)
    const router = useRouter()

    async function updateStatus(field: 'isPaid' | 'isDelivered', value: boolean) {
        if (field === 'isPaid') setUpdatingPaid(true);
        else setUpdatingDelivered(true);

        try {
            const { data } = await axios.patch(`/api/orders/${order.id}`, {
                [field]: value
            });

            if (data.status === 'success') {
                setOrder(data.data);
                toast.success(`Order ${field === 'isPaid' ? 'Payment' : 'Delivery'} updated!`);
                router.refresh();
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update order status.");
        } finally {
            setUpdatingPaid(false);
            setUpdatingDelivered(false);
        }
    }

    if (!order) return null;

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header & Back Link */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Link
                        href="/admin/orders"
                        className="inline-flex items-center gap-2 text-gray-400 dark:text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 font-black uppercase tracking-[0.2em] text-[10px] mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to orders
                    </Link>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-zinc-100 tracking-tight uppercase">
                        ORDER <span className="text-emerald-500">#{order.id.slice(-8).toUpperCase()}</span>
                    </h1>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button
                        onClick={() => updateStatus('isPaid', !order.isPaid)}
                        disabled={updatingPaid}
                        className={`h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${order.isPaid
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900'
                            : 'bg-amber-600 text-white shadow-xl shadow-amber-200 dark:shadow-none hover:bg-amber-700'
                            }`}
                        variant={order.isPaid ? 'ghost' : 'default'}
                    >
                        {updatingPaid ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : order.isPaid ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <CreditCard className="w-4 h-4 mr-2" />}
                        {order.isPaid ? 'Payment Confirmed' : 'Mark as Paid'}
                    </Button>

                    <Button
                        onClick={() => updateStatus('isDelivered', !order.isDelivered)}
                        disabled={updatingDelivered}
                        className={`h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${order.isDelivered
                            ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-200 dark:shadow-none hover:bg-emerald-700'
                            : 'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400'
                            }`}
                        variant={order.isDelivered ? 'default' : 'ghost'}
                    >
                        {updatingDelivered ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : order.isDelivered ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Truck className="w-4 h-4 mr-2" />}
                        {order.isDelivered ? 'Order Delivered' : 'Mark as Delivered'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Information Column */}
                <div className="lg:col-span-8 space-y-10">

                    {/* Items Section */}
                    <div className="bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-zinc-800 overflow-hidden">
                        <div className="p-8 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-800/30">
                            <h2 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight flex items-center gap-3">
                                <ShoppingBag className="w-5 h-5 text-emerald-500" />
                                Order Items
                                <span className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] px-2 py-0.5 rounded-full ml-1">
                                    {(order.items as any[]).length}
                                </span>
                            </h2>
                        </div>
                        <div className="p-0 overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50/50 dark:bg-zinc-800/50">
                                    <tr>
                                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest text-left">Product</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest text-center">Qty</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest text-right">Unit Price</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                                    {(order.items as any[]).map((item, i) => (
                                        <tr key={i} className="group hover:bg-gray-50/30 dark:hover:bg-zinc-800/30 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 flex-shrink-0 relative p-2 overflow-hidden group-hover:scale-105 transition-transform">
                                                        <Image
                                                            src={item.product?.imageCover || '/placeholder-image.png'}
                                                            alt={item.product?.title || 'Product'}
                                                            fill
                                                            className="object-contain dark:brightness-90"
                                                        />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-black text-gray-900 dark:text-zinc-100 truncate max-w-[200px]">{item.product?.title}</p>
                                                        <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">{item.product?.brand}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="text-sm font-black text-gray-900 dark:text-zinc-100">x{item.quantity}</span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className="text-sm font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-tighter">EGP</span>
                                                <span className="text-sm font-black text-gray-900 dark:text-zinc-100 ml-1">{(item.product?.price || 0).toLocaleString()}</span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">EGP {(item.quantity * (item.product?.price || 0)).toLocaleString()}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50/50 dark:bg-zinc-800/50">
                                    <tr>
                                        <td colSpan={3} className="px-8 py-6 text-right text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Total Order Value</td>
                                        <td className="px-8 py-6 text-right">
                                            <span className="text-xl font-black text-gray-900 dark:text-zinc-100 leading-none">EGP {order.totalPrice.toLocaleString()}</span>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Shipping & Log section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-xl shadow-gray-200/50 dark:shadow-none">
                            <h3 className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-blue-500" />
                                Fulfillment Info
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Shipping Address</p>
                                    <p className="text-sm font-bold text-gray-800 dark:text-zinc-300 leading-relaxed">
                                        {(order.shippingAddress as any)?.details || 'No address provided'}
                                    </p>
                                    <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                                        {(order.shippingAddress as any)?.city || ''}
                                    </p>
                                </div>
                                <div className="pt-4 border-t border-gray-50 dark:border-zinc-800 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5">Contact Number</p>
                                        <p className="text-sm font-black text-gray-900 dark:text-zinc-100">{(order.shippingAddress as any)?.phone || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-900 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden group">
                            {/* Decorative glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-[60px] -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-1000"></div>

                            <h3 className="text-xs font-black uppercase tracking-widest mb-8 relative z-10 flex items-center gap-2 text-emerald-400">
                                <AlertCircle className="w-4 h-4" />
                                Admin Logistics Note
                            </h3>
                            <div className="space-y-6 relative z-10">
                                <div className="space-y-4">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Order Timeline</p>
                                    <div className="flex items-center gap-4 text-xs font-medium">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        <span>Placed on: {new Date(order.createdAt).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-medium">
                                        <div className={`w-2 h-2 rounded-full ${order.isPaid ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                                        <span>Payment: {order.isPaid ? 'Completed' : 'Awaiting Payment'}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-medium">
                                        <div className={`w-2 h-2 rounded-full ${order.isDelivered ? 'bg-emerald-500' : 'bg-gray-700'}`}></div>
                                        <span>Fulfillment: {order.isDelivered ? 'Shipped & Delivered' : 'Processing Center'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer Details */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-zinc-800 p-8">
                        <h2 className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-widest mb-8">Customer Profiling</h2>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-gray-50 dark:bg-zinc-800 rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-zinc-700 flex items-center justify-center text-gray-300 dark:text-zinc-600 relative overflow-hidden mb-6">
                                {order.user?.image ? (
                                    <Image src={order.user?.image} alt={order.user?.name || ''} fill className="object-cover" />
                                ) : (
                                    <UserIcon className="w-10 h-10" />
                                )}
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-zinc-100 leading-tight mb-1">{order.user?.name || 'Guest User'}</h3>
                            <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-6">{order.user?.role || 'Customer'}</p>

                            <div className="w-full space-y-3 pt-6 border-t border-gray-50 dark:border-zinc-800">
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500">
                                    <span>Registered Email</span>
                                </div>
                                <div className="bg-gray-50 dark:bg-zinc-800 p-3 rounded-xl border border-gray-100 dark:border-zinc-700 flex items-center gap-3 overflow-hidden">
                                    <div className="w-8 h-8 bg-white dark:bg-zinc-700 rounded-lg flex items-center justify-center text-gray-400 dark:text-zinc-500 flex-shrink-0 shadow-sm">
                                        @
                                    </div>
                                    <span className="text-[11px] font-bold text-gray-700 dark:text-zinc-300 truncate">{order.user?.email || 'N/A'}</span>
                                </div>
                            </div>

                            <Link href={`/admin/customers?userId=${order.userId}`} className="w-full mt-10">
                                <Button variant="outline" className="w-full rounded-xl h-12 text-[10px] font-black uppercase tracking-widest border-2 border-gray-100 dark:border-zinc-800 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-100 dark:hover:border-emerald-900 transition-all dark:text-zinc-300">
                                    View Customer Profile
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-zinc-800 p-8 space-y-6">
                        <h3 className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-widest mb-2">Financial Breakdown</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-[0.1em]">
                                <span>Cart Subtotal</span>
                                <span className="text-gray-900 dark:text-zinc-100">EGP {order.totalPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-[0.1em]">
                                <span>Processing Fee</span>
                                <span className="text-emerald-500 dark:text-emerald-400 font-extrabold">Incl.</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-[0.1em]">
                                <span>Shipping Fee</span>
                                <span className="text-emerald-500 dark:text-emerald-400 font-extrabold uppercase">Premium Free</span>
                            </div>
                            <div className="h-px bg-gray-50 dark:bg-zinc-800 my-2"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-base font-black uppercase tracking-tight text-gray-900 dark:text-zinc-100">Final Total</span>
                                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-500 leading-none">EGP {order.totalPrice.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="pt-4">
                            <div className={`p-4 rounded-2xl flex items-center gap-4 border ${order.paymentMethod === 'online' ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-900 text-blue-700 dark:text-blue-400' : 'bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-900 text-amber-700 dark:text-amber-400'}`}>
                                <CreditCard className="w-5 h-5" />
                                <div className="text-[10px] font-black uppercase tracking-[0.15em] leading-tight">
                                    {order.paymentMethod === 'online' ? 'Stripe Gateway' : 'Cash On Delivery'}
                                    <p className="opacity-60 dark:opacity-40 text-[8px] mt-0.5">{order.isPaid ? 'Electronic Receipt Issued' : 'Manual Receipt Required'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
