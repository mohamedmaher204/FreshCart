"use client"
import React, { useEffect, useState, useContext } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { CheckCircle2, Loader2, ArrowRight, Package, Home } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cartContext } from '@/app/providers/cartContextProvider'

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams()
    const sessionId = searchParams.get('session_id')
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const router = useRouter()
    const { getData: refreshCart } = useContext(cartContext);

    useEffect(() => {
        if (sessionId) {
            confirmPayment()
        } else {
            setStatus('error')
        }
    }, [sessionId])

    async function confirmPayment() {
        try {
            const res = await axios.get(`/api/orders/confirm?session_id=${sessionId}`)
            if (res.data.status === 'success' || res.data.status === 'already_done') {
                setStatus('success')
                refreshCart() // Clear cart in UI
            } else {
                setStatus('error')
            }
        } catch (error) {
            console.error(error)
            setStatus('error')
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 text-center animate-in zoom-in duration-500">

                {status === 'loading' && (
                    <div className="space-y-6">
                        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 mb-2">Verifying Payment</h1>
                            <p className="text-gray-500 font-medium">Please wait while we confirm your order details...</p>
                        </div>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-6">
                        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto animate-in bounce-in">
                            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 mb-2">Payment Successful!</h1>
                            <p className="text-gray-500 font-medium">Thank you for your purchase. Your order has been placed successfully.</p>
                        </div>
                        <div className="pt-6 space-y-3">
                            <Link href="/allorders">
                                <Button className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 group">
                                    View My Orders <Package className="ml-2 w-5 h-5 group-hover:animate-bounce" />
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button variant="outline" className="w-full h-14 rounded-2xl border-2 font-black uppercase tracking-widest text-gray-400 hover:text-emerald-600 transition-all">
                                    <Home className="mr-2 w-5 h-5" /> Back to Home
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-6">
                        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                            <div className="w-12 h-12 text-red-500">❌</div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 mb-2">Payment Failed</h1>
                            <p className="text-gray-500 font-medium">We couldn't verify your payment. Please contact support if the amount was deducted.</p>
                        </div>
                        <div className="pt-6">
                            <Link href="/checkout">
                                <Button className="w-full h-12 bg-gray-900 text-white rounded-2xl font-bold">
                                    Try Again
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
