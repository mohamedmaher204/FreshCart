"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'Order Status',
        message: ''
    });
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.message) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setIsSending(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({ name: '', email: '', subject: 'Order Status', message: '' });
        setIsSending(false);
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-20 px-4 transition-colors duration-500">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-20 animate-reveal">
                    <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white mb-6 tracking-tight">
                        Get in <span className="text-emerald-500">Touch</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg font-medium">
                        Have questions about our products or need help with an order? Our support team is here to help you 24/7.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* WhatsApp Card */}
                        <a 
                            href="https://wa.me/201271410168" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-100 dark:border-zinc-800 hover:border-emerald-500 transition-all group"
                        >
                            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
                                <MessageCircle className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">WhatsApp Support</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4">Fastest response time for quick questions.</p>
                            <span className="text-emerald-500 font-bold text-sm flex items-center gap-2">
                                Chat with us <Send className="w-4 h-4" />
                            </span>
                        </a>

                        {/* Phone Card */}
                        <div className="p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-100 dark:border-zinc-800">
                            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6">
                                <Phone className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Call Us</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-2">Available Sun-Thu, 9am - 6pm</p>
                            <p className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">+20 0127 141 0168</p>
                        </div>

                        {/* Email Card */}
                        <div className="p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-100 dark:border-zinc-800">
                            <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mb-6">
                                <Mail className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Email Support</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-2">For detailed inquiries and complaints</p>
                            <p className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">support@freshcart.com</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="p-10 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-100 dark:border-zinc-800">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Full Name</label>
                                        <input 
                                            type="text" 
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            placeholder="John Doe"
                                            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl py-4 px-6 focus:border-emerald-500 outline-none transition-all dark:text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Email Address</label>
                                        <input 
                                            type="email" 
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            placeholder="john@example.com"
                                            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl py-4 px-6 focus:border-emerald-500 outline-none transition-all dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Subject</label>
                                    <select 
                                        value={formData.subject}
                                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                        className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl py-4 px-6 focus:border-emerald-500 outline-none transition-all dark:text-white appearance-none">
                                        <option>Order Status</option>
                                        <option>Product Inquiry</option>
                                        <option>Payment Issue</option>
                                        <option>Return Request</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Message</label>
                                    <textarea 
                                        rows={5}
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        placeholder="How can we help you?"
                                        className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl py-4 px-6 focus:border-emerald-500 outline-none transition-all dark:text-white resize-none"
                                    ></textarea>
                                </div>

                                <button 
                                    disabled={isSending}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-400 text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-3">
                                    {isSending ? "Sending..." : "Send Message"} <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
