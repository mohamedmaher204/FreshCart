"use client"
import React, { useContext, useState } from 'react'
import { cartContext } from '../providers/cartContextProvider'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { toast } from 'sonner'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2, CreditCard } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function CartPage() {
    const { products, setNumOfCartItems, setProducts, setCartId, getData: refreshCart } = useContext(cartContext);
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
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
                toast.success("Cart updated successfully");
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
                toast.success("Item removed from cart");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to remove item");
        } finally {
            setUpdatingParams(null);
        }
    }

    async function clearCart() {
        if (!confirm("Are you sure you want to clear your cart?")) return;
        setLoading(true);
        try {
            // @ts-ignore
            const token = session?.user?.userTokenfromBackend;
            const res = await axios.delete(`https://ecommerce.routemisr.com/api/v1/cart`,
                { headers: { token } }
            );

            if (res.data.message === 'success') {
                setNumOfCartItems(0);
                setProducts([]);
                setCartId(null);
                refreshCart(); // Ensure global state is synced
                toast.success("Cart cleared successfully");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to clear cart");
        } finally {
            setLoading(false);
        }
    }

    if (!products && !loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-gray-50/50">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                <h2 className="text-xl font-semibold text-gray-700">Loading your cart...</h2>
            </div>
        );
    }

    if (products?.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-gray-50/50 animate-in fade-in zoom-in duration-500">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-gray-100">
                    <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
                    <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                    <Link href="/product">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200" size="lg">
                            Start Shopping <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <section className="bg-gray-50 py-8 md:py-12 min-h-screen">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                            Shopping Cart
                            <span className="text-base font-medium text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                                {products?.length} Items
                            </span>
                        </h1>
                        <p className="text-gray-500">Manage your items and proceed to checkout</p>
                    </div>
                    <Button
                        variant="destructive"
                        onClick={clearCart}
                        disabled={loading || products?.length === 0}
                        className="shadow-sm hover:shadow-md transition-all"
                    >
                        <Trash2 className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Clear Cart</span>
                    </Button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items List */}
                    <div className="lg:w-2/3 space-y-4">
                        {products?.map((item: any) => (
                            <div key={item._id} className="group bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 relative overflow-hidden">
                                {updatingParams === item.product.id && (
                                    <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center backdrop-blur-[1px]">
                                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-6">
                                    {/* Product Image */}
                                    <div className="w-full sm:w-32 h-32 sm:h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden relative">
                                        <Image
                                            src={item.product.imageCover}
                                            alt={item.product.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-grow flex flex-col justify-between">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-1" title={item.product.title}>
                                                    {item.product.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 font-medium mb-1">{item.product.brand?.name}</p>
                                                <p className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded w-fit">
                                                    {item.product.category?.name}
                                                </p>
                                            </div>
                                            <p className="text-xl font-bold text-emerald-600 whitespace-nowrap">
                                                ${item.price}
                                            </p>
                                        </div>

                                        <div className="flex justify-between items-end mt-4 sm:mt-0">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                                                <button
                                                    onClick={() => updateCount(item.product.id, item.count - 1)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm text-gray-600 transition-all disabled:opacity-50"
                                                    disabled={item.count <= 1}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="w-8 text-center font-semibold text-gray-900 text-sm">{item.count}</span>
                                                <button
                                                    onClick={() => updateCount(item.product.id, item.count + 1)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm text-gray-600 transition-all"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => deleteItem(item.product.id)}
                                                className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="mt-6 flex justify-start">
                            <Link href="/product">
                                <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 pl-0">
                                    <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> Continue Shopping
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({products?.length} items)</span>
                                    <span className="font-medium text-gray-900">${totalCartPrice}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping Estimate</span>
                                    <span className="font-medium text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax Estimate</span>
                                    <span className="font-medium text-gray-900">$0</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4 mb-8">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">Total Price</span>
                                    <span className="text-2xl font-bold text-emerald-600">${totalCartPrice}</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1 text-right">Taxes and shipping calculated at checkout</p>
                            </div>

                            <Link href="/checkout" className='block w-full'>
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-lg shadow-lg shadow-emerald-200 transform hover:-translate-y-0.5 transition-all duration-200">
                                    Checkout <CreditCard className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}