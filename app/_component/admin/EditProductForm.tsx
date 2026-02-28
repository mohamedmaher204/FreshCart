"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import {
    ArrowLeft,
    PackageCheck,
    Tag,
    DollarSign,
    Layers,
    Type,
    FileText,
    Image as ImageIcon,
    Loader2
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productSchema, ProductInput } from '@/app/_lib/validations'
import ImageUpload from '@/app/_component/admin/ImageUpload'

interface EditProductFormProps {
    initialData: any
}

export default function EditProductForm({ initialData }: EditProductFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const form = useForm<ProductInput>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            title: initialData.title,
            description: initialData.description,
            price: initialData.price,
            priceAfterDiscount: initialData.priceAfterDiscount,
            quantity: initialData.quantity,
            category: initialData.category,
            brand: initialData.brand,
            imageCover: initialData.imageCover,
            images: initialData.images || []
        }
    })

    const { register, formState: { errors }, watch, setValue } = form;
    const imageCover = watch('imageCover');
    const images = watch('images');

    const onSubmit: SubmitHandler<ProductInput> = async (data) => {
        setLoading(true);
        try {
            const res = await axios.put(`/api/products/${initialData.id}`, data);
            if (res.status === 200) {
                toast.success("Product updated successfully!");
                router.push('/admin/products');
                router.refresh();
            }
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.message || "Failed to update product.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <Link href="/admin/products" className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:border-emerald-100 transition-all shadow-sm group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">EDIT <span className="text-emerald-500">PRODUCT</span></h1>
                        <p className="text-gray-500 font-medium tracking-tight">Update details for: {initialData.title}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit as any)} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <PackageCheck className="w-4 h-4" />
                            </div>
                            <h2 className="text-lg font-black uppercase tracking-tight">Core <span className="text-emerald-600">Information</span></h2>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Product Title</label>
                                <input {...register("title")} className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-gray-800" />
                                {errors.title && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.title.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                                <textarea {...register("description")} className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 outline-none transition-all font-medium text-gray-800 h-40 resize-none" />
                                {errors.description && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.description.message}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <DollarSign className="w-4 h-4" />
                            </div>
                            <h2 className="text-lg font-black uppercase tracking-tight">Pricing & <span className="text-emerald-600">Stock</span></h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price</label>
                                <input type="number" {...register("price")} className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 outline-none transition-all font-black" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Discount Price</label>
                                <input type="number" {...register("priceAfterDiscount")} className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 outline-none transition-all font-black text-emerald-600" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Stock</label>
                                <input type="number" {...register("quantity")} className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <Tag className="w-4 h-4" />
                            </div>
                            <h2 className="text-lg font-black uppercase tracking-tight">Organization</h2>
                        </div>
                        <div className="space-y-4">
                            <select {...register("category")} className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 outline-none transition-all font-black text-xs uppercase cursor-pointer">
                                <option value="Electronics">Electronics</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Mobile">Mobile</option>
                                <option value="Appliances">Appliances</option>
                            </select>
                            <input {...register("brand")} placeholder="Brand" className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold" />
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <ImageIcon className="w-4 h-4" />
                            </div>
                            <h2 className="text-lg font-black uppercase tracking-tight">Media</h2>
                        </div>
                        <div className="space-y-6">
                            <ImageUpload label="Cover Image" value={imageCover} onChange={(url) => setValue('imageCover', url as string)} />
                            <ImageUpload label="Gallery" value={images} multiple onChange={(urls) => setValue('images', urls as string[])} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Button type="submit" disabled={loading} className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
                        </Button>
                        <Link href="/admin/products" className="block w-full">
                            <Button variant="ghost" className="w-full h-14 rounded-xl text-gray-400 font-black uppercase tracking-widest text-[10px] hover:text-red-500">Discard</Button>
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    )
}
