"use client"
import React, { useContext, useState } from 'react'
import { cartContext } from '@/app/providers/cartContextProvider'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { toast } from 'sonner'
import { Trash2, Plus, Minus, ShoppingBag, X, Loader2, CreditCard, ArrowRight, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type CartDrawerProps = {
    isOpen: boolean
    onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { products, setNumOfCartItems, setProducts, setCartId, getData: refreshCart } = useContext(cartContext);
    const { data: session } = useSession();
    const [updatingParams, setUpdatingParams] = useState<string | null>(null);

    // Calculate total price locally
    const totalCartPrice = products?.reduce((acc: number, item: any) => acc + (item.price * item.count), 0) || 0;

    async function updateCount(id: string, count: number) {
        if (count < 1) return;
        setUpdatingParams(id);

        try {
            // @ts-ignore
            const token = session?.user?.userTokenfromBackend;
            const res = await axios.put(`https://ecommerce.routemisr.com/api/v1/cart/${id}`,
                { count },
                { headers: { token } }
            );

            if (res.data.status === 'success') {
                setNumOfCartItems(res.data.numOfCartItems);
                setProducts(res.data.data.products);
                setCartId(res.data.cartId);
                toast.success("Quantity updated", { position: "top-center" });
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update cart");
        } finally {
            setUpdatingParams(null);
        }
    }

    async function deleteItem(id: string) {
        setUpdatingParams(id);
        try {
            // @ts-ignore
            const token = session?.user?.userTokenfromBackend;
            const res = await axios.delete(`https://ecommerce.routemisr.com/api/v1/cart/${id}`,
                { headers: { token } }
            );

            if (res.data.status === 'success') {
                setNumOfCartItems(res.data.numOfCartItems);
                setProducts(res.data.data.products);
                setCartId(res.data.cartId);
                toast.success("Item removed");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to remove item");
        } finally {
            setUpdatingParams(null);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            {/* Drawer Content */}
            <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out animate-in slide-in-from-right`}>

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                            Shopping Cart
                            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">{products?.length || 0}</span>
                        </h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Review your items before checkout</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body (Scrollable) */}
                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                    {!products || products.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-6">
                            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-200">
                                <ShoppingBag className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-gray-400">Your cart is empty</h3>
                                <p className="text-sm text-gray-400 mt-2">Looks like you haven't added anything yet!</p>
                            </div>
                            <Button variant="outline" className="rounded-2xl border-2 px-8" onClick={onClose}>
                                Start Shopping
                            </Button>
                        </div>
                    ) : (
                        products.map((item: any) => (
                            <div key={item._id} className="relative group flex gap-4">
                                {updatingParams === item.product.id && (
                                    <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center backdrop-blur-[1px] rounded-2xl">
                                        <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                                    </div>
                                )}

                                <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100">
                                    <Image
                                        src={item.product.imageCover}
                                        alt={item.product.title}
                                        width={80}
                                        height={80}
                                        className="w-full h-full object-contain p-2"
                                    />
                                </div>

                                <div className="flex-grow min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="text-sm font-black text-gray-900 truncate pr-4" title={item.product.title}>{item.product.title}</h4>
                                        <button
                                            onClick={() => deleteItem(item.product.id)}
                                            className="text-gray-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{item.product.brand?.name}</p>

                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1 border border-gray-100">
                                            <button
                                                onClick={() => updateCount(item.product.id, item.count - 1)}
                                                className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-lg text-gray-500"
                                                disabled={item.count <= 1}
                                            >
                                                <Minus className="w-2 h-2" />
                                            </button>
                                            <span className="w-5 text-center text-xs font-black text-gray-900">{item.count}</span>
                                            <button
                                                onClick={() => updateCount(item.product.id, item.count + 1)}
                                                className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-lg text-gray-500"
                                            >
                                                <Plus className="w-2 h-2" />
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-emerald-600">EGP {item.price * item.count}</p>
                                            <p className="text-[10px] text-gray-400 font-bold">EGP {item.price}/ea</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer (Sticky) */}
                {products && products.length > 0 && (
                    <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-6">
                        <div className="space-y-3 px-2">
                            <div className="flex justify-between text-gray-500 font-bold text-xs uppercase tracking-widest">
                                <span>Subtotal</span>
                                <span>EGP {totalCartPrice}</span>
                            </div>
                            <div className="flex justify-between text-gray-500 font-bold text-xs uppercase tracking-widest">
                                <span>Shipping</span>
                                <span className="text-emerald-600 italic">Calculated at Checkout</span>
                            </div>
                            <div className="h-px bg-gray-200 my-4"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-black text-gray-900 uppercase">Estimated Total</span>
                                <span className="text-2xl font-black text-emerald-600">EGP {totalCartPrice}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Link href="/checkout" onClick={onClose} className="w-full">
                                <Button className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[1.25rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-500/20 group">
                                    Secure Checkout <CreditCard className="ml-2 w-5 h-5 group-hover:animate-bounce" />
                                </Button>
                            </Link>
                            <Link href="/cart" onClick={onClose} className="w-full">
                                <Button variant="outline" className="w-full h-14 rounded-[1.25rem] border-2 font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-between px-8 bg-white border-gray-200 text-gray-400 hover:text-emerald-700 hover:border-emerald-200 transition-all">
                                    <span>Expanded View</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>

                        <div className="flex items-center justify-center gap-2 opacity-50">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Safe & Secure Payment</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
