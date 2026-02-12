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
import { Loader2, CreditCard, Banknote, MapPin, Phone, Info, ShieldCheck, ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'

type CheckoutFormValues = {
    details: string
    phone: string
    city: string
}

export default function CheckoutPage() {
    const { cartId, setNumOfCartItems, setProducts, setCartId: updateCartId } = useContext(cartContext);
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('cash');
    const router = useRouter();

    const form = useForm<CheckoutFormValues>({
        defaultValues: {
            details: '',
            phone: '',
            city: ''
        }
    });

    async function handlePayment(values: CheckoutFormValues) {
        if (!cartId) {
            toast.error("Your cart is empty. Add some items before checking out.", { position: "top-center" });
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

    return (
        <main className="min-h-screen bg-[#fafafa] pb-20 pt-10">
            <div className="container mx-auto px-4">
                {/* Header Context */}
                <div className="max-w-4xl mx-auto mb-10 flex items-center justify-between">
                    <Link href="/cart" className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 font-bold transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Cart
                    </Link>
                    <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Secure Checkout</span>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10">
                    {/* Left Side: Form */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12">
                            <div className="mb-10">
                                <h1 className="text-3xl font-black text-gray-900 mb-2">Shipping Details</h1>
                                <p className="text-gray-500 font-medium">Where should we deliver your order?</p>
                            </div>

                            <form className="space-y-6">
                                <div className="space-y-6">
                                    <Field>
                                        <FieldLabel className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 mb-2 block">Full Address Details</FieldLabel>
                                        <div className="relative group">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                            <Input
                                                {...form.register("details", { required: "Address details are required" })}
                                                className="h-14 pl-12 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
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
                                                    className="h-14 pl-12 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
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
                                                    className="h-14 pl-12 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                                                    placeholder="01xxxxxxxxx"
                                                />
                                            </div>
                                            {form.formState.errors.phone && <FieldError errors={[form.formState.errors.phone]} />}
                                        </Field>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Side: Payment & Summary */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
                            <h2 className="text-xl font-black text-gray-900 mb-6">Payment Method</h2>

                            <div className="space-y-4 mb-8">
                                <button
                                    onClick={() => setPaymentMethod('cash')}
                                    className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all group ${paymentMethod === 'cash' ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-50 hover:border-emerald-200'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl transition-colors ${paymentMethod === 'cash' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                            <Banknote className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-gray-900">Cash on Delivery</p>
                                            <p className="text-xs text-gray-500">Pay when items arrive</p>
                                        </div>
                                    </div>
                                    {paymentMethod === 'cash' && <div className="w-5 h-5 rounded-full bg-emerald-600 border-4 border-emerald-100"></div>}
                                </button>

                                <button
                                    onClick={() => setPaymentMethod('online')}
                                    className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all group ${paymentMethod === 'online' ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-50 hover:border-emerald-200'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl transition-colors ${paymentMethod === 'online' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                            <CreditCard className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-gray-900">Online Payment</p>
                                            <p className="text-xs text-gray-500">Fast & Secure via Stripe</p>
                                        </div>
                                    </div>
                                    {paymentMethod === 'online' && <div className="w-5 h-5 rounded-full bg-emerald-600 border-4 border-emerald-100"></div>}
                                </button>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-gray-100">
                                <Button
                                    onClick={form.handleSubmit(handlePayment)}
                                    disabled={loading}
                                    className="w-full h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg shadow-xl shadow-emerald-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin w-6 h-6" />
                                    ) : (
                                        <>
                                            {paymentMethod === 'cash' ? 'Complete Order' : 'Go to Payment'}
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </Button>
                                <p className="text-[10px] text-gray-400 text-center px-4">
                                    By clicking the button, you agree to our Terms of Service and Privacy Policy. All transactions are encrypted.
                                </p>
                            </div>
                        </div>

                        {/* Order Summary Note */}
                        <div className="bg-emerald-600 rounded-[2rem] p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                            <h3 className="text-lg font-black mb-2 relative z-10">Premium Delivery</h3>
                            <p className="text-emerald-50/80 text-sm font-medium relative z-10">
                                Enjoy free shipping on your first order! Your items will be carefully packed and delivered within 2-4 business days.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
