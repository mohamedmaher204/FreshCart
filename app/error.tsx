'use client'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-rose-100 border border-rose-50 max-w-xl w-full animate-reveal">
                <div className="w-24 h-24 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 mx-auto mb-8 shadow-inner animate-float">
                    <AlertCircle className="w-12 h-12" />
                </div>

                <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight uppercase">SOMETHING WENT WRONG</h2>
                <p className="text-gray-500 font-medium leading-relaxed mb-10">
                    We encountered an unexpected error while processing your request. Our technical team has been notified.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                        onClick={reset}
                        className="flex-1 bg-gray-900 hover:bg-black text-white h-14 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" /> Try Re-syncing
                    </Button>
                    <Link href="/" className="flex-1">
                        <Button variant="outline" className="w-full h-14 rounded-2xl border-gray-100 font-black uppercase tracking-widest text-xs hover:bg-gray-50">
                            <Home className="w-4 h-4 mr-2" /> Return Home
                        </Button>
                    </Link>
                </div>
            </div>

            <p className="mt-12 text-[10px] text-gray-300 font-black uppercase tracking-[0.4em]">System Hash: {error.digest || 'VO-AUTH-ERR'}</p>
        </div>
    )
}
