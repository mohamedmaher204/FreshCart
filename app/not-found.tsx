import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Search, Loader2 } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            <div className="relative mb-8">
                <h1 className="text-[12rem] md:text-[18rem] font-black text-emerald-50 opacity-[0.05] select-none">
                    404
                </h1>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-emerald-100 border border-emerald-50 flex flex-col items-center animate-reveal">
                        <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center text-white mb-6 animate-float shadow-xl shadow-emerald-200">
                            <Search className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tighter">LOST IN SPACE?</h2>
                        <p className="text-gray-400 font-medium max-w-xs mx-auto mb-8">
                            The page you are looking for has been moved or doesn't exist anymore. Let's get you back home.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <Link href="/" className="flex-1">
                                <Button className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-100 transition-all active:scale-95 group">
                                    <Home className="w-4 h-4 mr-2 group-hover:-translate-y-1 transition-transform" /> Back to Safety
                                </Button>
                            </Link>
                            <Link href="/products" className="flex-1">
                                <Button variant="outline" className="w-full h-14 rounded-2xl border-gray-100 font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-all active:scale-95">
                                    Explore Catalog
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-gray-300 text-[10px] font-black uppercase tracking-[0.4em]">Error Reference: FRESH-VOID-404</p>
        </div>
    )
}
