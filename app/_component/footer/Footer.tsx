
// import React from 'react'
// import Image from 'next/image'
// import Link from 'next/link'
// import logo from '@/images/freshcart-logo.svg'
// import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ArrowRight } from 'lucide-react'

// export default function Footer() {
//     return (
//         <footer className="bg-emerald-950 text-white pt-20 pb-10">
//             <div className="container mx-auto px-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
//                     {/* Brand Info */}
//                     <div className="space-y-6">
//                         <Link href="/" className="flex items-center gap-3">
//                             <Image src={logo} alt="Logo" className="w-10 h-10 brightness-0 invert" />
//                             <span className="text-2xl font-black tracking-tighter">FRESH<span className="text-emerald-400">CART</span></span>
//                         </Link>
//                         <p className="text-emerald-100/60 leading-relaxed">
//                             Your premier destination for high-quality electronics, fashion, and daily essentials. We deliver excellence to your doorstep.
//                         </p>
//                         <div className="flex gap-4">
//                             <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-500 transition-colors">
//                                 <Facebook className="w-5 h-5" />
//                             </a>
//                             <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-500 transition-colors">
//                                 <Twitter className="w-5 h-5" />
//                             </a>
//                             <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-500 transition-colors">
//                                 <Instagram className="w-5 h-5" />
//                             </a>
//                             <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-500 transition-colors">
//                                 <Youtube className="w-5 h-5" />
//                             </a>
//                         </div>
//                     </div>

//                     {/* Quick Links */}
//                     <div>
//                         <h4 className="text-lg font-bold mb-8 relative inline-block">
//                             Quick Links
//                             <span className="absolute bottom-0 left-0 w-8 h-1 bg-emerald-400 -mb-2"></span>
//                         </h4>
//                         <ul className="space-y-4">
//                             <li><Link href="/" className="text-emerald-100/60 hover:text-emerald-400 transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" /> Home</Link></li>
//                             <li><Link href="/products" className="text-emerald-100/60 hover:text-emerald-400 transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" /> Products</Link></li>
//                             <li><Link href="/cart" className="text-emerald-100/60 hover:text-emerald-400 transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" /> Shopping Cart</Link></li>
//                             <li><Link href="/allorders" className="text-emerald-100/60 hover:text-emerald-400 transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" /> Track Orders</Link></li>
//                             <li><Link href="/brands" className="text-emerald-100/60 hover:text-emerald-400 transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" /> Top Brands</Link></li>
//                         </ul>
//                     </div>

//                     {/* Contact Info */}
//                     <div>
//                         <h4 className="text-lg font-bold mb-8 relative inline-block">
//                             Support
//                             <span className="absolute bottom-0 left-0 w-8 h-1 bg-emerald-400 -mb-2"></span>
//                         </h4>
//                         <ul className="space-y-4">
//                             <li className="flex items-start gap-4 text-emerald-100/60">
//                                 <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
//                                     <Phone className="w-5 h-5 text-emerald-400" />
//                                 </div>
//                                 <div>
//                                     <p className="text-sm font-bold text-white">Call Us</p>
//                                     <p>+20 123 456 7890</p>
//                                 </div>
//                             </li>
//                             <li className="flex items-start gap-4 text-emerald-100/60">
//                                 <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
//                                     <Mail className="w-5 h-5 text-emerald-400" />
//                                 </div>
//                                 <div>
//                                     <p className="text-sm font-bold text-white">Email Us</p>
//                                     <p>support@freshcart.com</p>
//                                 </div>
//                             </li>
//                             <li className="flex items-start gap-4 text-emerald-100/60">
//                                 <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
//                                     <MapPin className="w-5 h-5 text-emerald-400" />
//                                 </div>
//                                 <div>
//                                     <p className="text-sm font-bold text-white">Visit Us</p>
//                                     <p>123 Shopping St, Cairo, EG</p>
//                                 </div>
//                             </li>
//                         </ul>
//                     </div>

//                     {/* Newsletter */}
//                     <div>
//                         <h4 className="text-lg font-bold mb-8 relative inline-block">
//                             App Links
//                             <span className="absolute bottom-0 left-0 w-8 h-1 bg-emerald-400 -mb-2"></span>
//                         </h4>
//                         <p className="text-emerald-100/60 mb-6">Download our mobile app for better experience and exclusive deals.</p>
//                         <div className="space-y-3">
//                             <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer group">
//                                 <div className="w-10 h-10 bg-emerald-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
//                                     <Image src={logo} alt="Logo" className="w-6 h-6" />
//                                 </div>
//                                 <div className="text-xs">
//                                     <p className="opacity-60 uppercase font-black tracking-widest">Get it on</p>
//                                     <p className="text-lg font-black tracking-tight">Google Play</p>
//                                 </div>
//                             </div>
//                             <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer group">
//                                 <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
//                                     <Image src={logo} alt="Logo" className="w-6 h-6" />
//                                 </div>
//                                 <div className="text-xs">
//                                     <p className="opacity-60 uppercase font-black tracking-widest">Download on the</p>
//                                     <p className="text-lg font-black tracking-tight">App Store</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Bottom Bar */}
//                 <div className="pt-10 border-t border-emerald-900 flex flex-col md:flex-row justify-between items-center gap-6">
//                     <p className="text-emerald-100/40 text-sm">
//                         © 2026 FreshCart Ecommerce. All rights reserved. Developed with ❤️ for quality shopping.
//                     </p>
//                     <div className="flex gap-8 text-emerald-100/40 text-sm">
//                         <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
//                         <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
//                         <a href="#" className="hover:text-emerald-400 transition-colors">Cookies</a>
//                     </div>
//                 </div>
//             </div>
//         </footer>
//     )
// }
