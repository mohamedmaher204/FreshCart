"use client"
import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { cartContext } from '../providers/cartContextProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Loader2, CreditCard, Banknote, MapPin, Phone, Info, ShieldCheck, ArrowLeft, ArrowRight, ShoppingBag, UserCheck } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

type CheckoutFormValues = {
    details: string
    phone: string
    city: string
}

export default function CheckoutPage() {
    const { products, cartId, setNumOfCartItems, setProducts, setCartId: updateCartId } = useContext(cartContext);
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('cash');
    const router = useRouter();

    const totalCartPrice = products?.reduce((acc: number, item: any) => acc + (item.price * item.count), 0) || 0;

    const form = useForm<CheckoutFormValues>({
        defaultValues: {
            details: '',
            phone: '',
            city: ''
        }
    });

    async function handlePayment(values: CheckoutFormValues) {
        if (!session) {
            toast.error("Please login to complete your order", { position: "top-center" });
            router.push('/login?callbackUrl=/checkout');
            return;
        }

        if (!cartId || products?.length === 0) {
            toast.error("Your cart is empty.", { position: "top-center" });
            return;
        }

        setLoading(true);
        // @ts-ignore
        const token = session?.user?.userTokenfromBackend;
        const shippingAddress = values;

        try {
            if (paymentMethod === 'cash') {
                const res = await axios.post(`https://ecommerce.routemisr.com/api/v1/orders/${cartId}`,
                    { shippingAddress },
                    { headers: { token } }
                );

                if (res.data.status === 'success') {
                    toast.success("Order placed successfully! 🎉", { position: "top-center" });
                    setNumOfCartItems(0);
                    setProducts([]);
                    updateCartId(null);
                    router.push('/allorders');
                }
            } else {
                // Online Payment (Stripe)
                const res = await axios.post(`https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${window.location.origin}`,
                    { shippingAddress },
                    { headers: { token } }
                );

                if (res.data.status === 'success') {
                    toast.loading("Redirecting to secure payment gate...");
                    window.location.href = res.data.session.url;
                }
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to process order. Please try again.", { position: "top-center" });
        } finally {
            setLoading(false);
        }
    }

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Preparing Checkout...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#fafafa] pb-20 pt-10">
            <div className="container mx-auto px-4">

                {/* Header Context */}
                <div className="max-w-6xl mx-auto mb-10 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 font-bold transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Continue Shopping
                    </Link>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-2 text-gray-400">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs font-black uppercase tracking-widest">SSL Secure</span>
                        </div>
                        <div className="h-4 w-px bg-gray-200 hidden md:block"></div>
                        <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                            <ShoppingBag className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">{products?.length || 0} Items</span>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Side: Steps & Form */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Auth Check */}
                        {!session && (
                            <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top duration-500">
                                <div className="flex items-center gap-4 text-center md:text-left">
                                    <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
                                        <UserCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-amber-900">Signed in as Guest?</h3>
                                        <p className="text-xs text-amber-700 font-medium">To complete your purchase, please login or create an account.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Link href="/login?callbackUrl=/checkout">
                                        <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold px-6">Login Now</Button>
                                    </Link>
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                                <MapPin className="w-40 h-40 text-emerald-950" />
                            </div>

                            <div className="mb-10 relative z-10">
                                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-lg uppercase tracking-wider mb-3">Step 1 of 2</span>
                                <h1 className="text-3xl font-black text-gray-900 mb-2">Delivery Address</h1>
                                <p className="text-gray-500 font-medium">Where should we send your premium package?</p>
                            </div>

                            <form className="space-y-6 relative z-10">
                                <div className="space-y-6">
                                    <Field>
                                        <div className="flex items-center justify-between mb-2">
                                            <FieldLabel className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Full Address Details</FieldLabel>
                                            <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">Required</span>
                                        </div>
                                        <div className="relative group">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                            <Input
                                                {...form.register("details", { required: "Address details are required" })}
                                                className="h-16 pl-12 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
                                                placeholder="Street name, Building number, Apartment..."
                                            />
                                        </div>
                                        {form.formState.errors.details && <FieldError errors={[form.formState.errors.details]} />}
                                    </Field>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Field>
                                            <FieldLabel className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 mb-2 block">City / Area</FieldLabel>
                                            <div className="relative group">
                                                <Info className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                                <Input
                                                    {...form.register("city", { required: "City is required" })}
                                                    className="h-16 pl-12 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
                                                    placeholder="Cairo, Giza, etc."
                                                />
                                            </div>
                                            {form.formState.errors.city && <FieldError errors={[form.formState.errors.city]} />}
                                        </Field>

                                        <Field>
                                            <FieldLabel className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 mb-2 block">Phone Number</FieldLabel>
                                            <div className="relative group">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                                <Input
                                                    {...form.register("phone", {
                                                        required: "Phone is required",
                                                        pattern: {
                                                            value: /^01[0125][0-9]{8}$/,
                                                            message: "Invalid Egyptian phone number"
                                                        }
                                                    })}
                                                    className="h-16 pl-12 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
                                                    placeholder="01xxxxxxxxx"
                                                />
                                            </div>
                                            {form.formState.errors.phone && <FieldError errors={[form.formState.errors.phone]} />}
                                        </Field>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12 relative overflow-hidden group">
                            <div className="mb-10">
                                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-lg uppercase tracking-wider mb-3">Step 2 of 2</span>
                                <h1 className="text-3xl font-black text-gray-900 mb-2">Payment Method</h1>
                                <p className="text-gray-500 font-medium">Select your preferred way to pay</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <button
                                    onClick={() => setPaymentMethod('cash')}
                                    className={`relative flex items-center justify-between p-6 rounded-3xl border-2 transition-all group scale-100 active:scale-[0.97] ${paymentMethod === 'cash' ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-50 hover:border-emerald-200 bg-gray-50/50'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-4 rounded-2xl transition-all ${paymentMethod === 'cash' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-white text-gray-400 border border-gray-100'}`}>
                                            <Banknote className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-black text-gray-900">Cash on Delivery</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Pay at doorstep</p>
                                        </div>
                                    </div>
                                    {paymentMethod === 'cash' && <div className="w-6 h-6 rounded-full bg-emerald-600 border-[6px] border-emerald-100 animate-in zoom-in"></div>}
                                </button>

                                <button
                                    onClick={() => setPaymentMethod('online')}
                                    className={`relative flex items-center justify-between p-6 rounded-3xl border-2 transition-all group scale-100 active:scale-[0.97] ${paymentMethod === 'online' ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-50 hover:border-emerald-200 bg-gray-50/50'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-4 rounded-2xl transition-all ${paymentMethod === 'online' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-white text-gray-400 border border-gray-100'}`}>
                                            <CreditCard className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-black text-gray-900">Credit Card</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Powered by Stripe</p>
                                        </div>
                                    </div>
                                    {paymentMethod === 'online' && <div className="w-6 h-6 rounded-full bg-emerald-600 border-[6px] border-emerald-100 animate-in zoom-in"></div>}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 sticky top-24">
                            <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-2">
                                Order Summary
                                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-full">{products?.length || 0}</span>
                            </h2>

                            {/* Item List Preview */}
                            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                                {products?.map((item: any) => (
                                    <div key={item._id} className="flex gap-4 group">
                                        <div className="w-16 h-16 bg-gray-50 rounded-2xl border border-gray-100 flex-shrink-0 relative overflow-hidden">
                                            <Image
                                                src={item.product.imageCover}
                                                alt={item.product.title}
                                                fill
                                                className="object-contain p-2 group-hover:scale-110 transition-transform"
                                            />
                                            <span className="absolute top-1 right-1 bg-gray-900 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-white">
                                                {item.count}
                                            </span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[11px] font-black text-gray-900 truncate leading-tight mb-1">{item.product.title}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.product.brand?.name}</p>
                                            <p className="text-xs font-black text-emerald-600 mt-1">EGP {item.price * item.count}</p>
                                        </div>
                                    </div>
                                ))}
                                {(!products || products.length === 0) && (
                                    <div className="py-10 text-center">
                                        <ShoppingBag className="w-10 h-10 text-gray-100 mx-auto mb-2" />
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Your cart is empty</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 py-6 border-t border-gray-100 mb-8">
                                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900">EGP {totalCartPrice}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Shipping Cost</span>
                                    <span className="text-emerald-600 italic font-medium uppercase">Free Delivery</span>
                                </div>
                                <div className="h-px bg-gray-50 my-2"></div>
                                <div className="flex justify-between items-center text-gray-900">
                                    <span className="text-sm font-black uppercase tracking-wider">Total Price</span>
                                    <span className="text-2xl font-black text-emerald-600">EGP {totalCartPrice}</span>
                                </div>
                            </div>

                            <div className="space-y-4 pt-6">
                                <Button
                                    onClick={form.handleSubmit(handlePayment)}
                                    disabled={loading || !products || products.length === 0}
                                    className="w-full h-16 rounded-[1.25rem] bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin w-6 h-6" />
                                    ) : (
                                        <>
                                            {paymentMethod === 'cash' ? 'Complete Order' : 'Pay via Stripe'}
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>

                                <div className="flex items-center justify-center gap-2 py-2">
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">100% Secure Checkout</span>
                                </div>
                            </div>

                            <div className="mt-8 p-6 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-6">
                                <div className="flex justify-center items-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                                    <div className="px-3 py-1 bg-white rounded-lg border border-gray-200 text-[10px] font-black italic">VISA</div>
                                    <div className="px-3 py-1 bg-white rounded-lg border border-gray-200 text-[10px] font-black italic">MasterCard</div>
                                    <div className="px-3 py-1 bg-white rounded-lg border border-gray-200 text-[10px] font-black italic">Stripe</div>
                                </div>

                                <p className="text-[10px] text-gray-400 text-center font-bold uppercase tracking-widest leading-relaxed">
                                    Your data is protected by industry-leading 256-bit SSL encryption. We never store your card details.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
