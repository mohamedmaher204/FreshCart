"use client"
import React, { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

interface ImageUploadProps {
    value: string | string[]
    onChange: (value: string | string[]) => void
    multiple?: boolean
    label?: string
}

export default function ImageUpload({ value, onChange, multiple, label }: ImageUploadProps) {
    const [loading, setLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setLoading(true)
        const toastId = toast.loading("Uploading image...")

        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                const formData = new FormData()
                formData.append('file', file)
                formData.append('upload_preset', uploadPreset!)

                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    {
                        method: 'POST',
                        body: formData,
                    }
                )

                if (!response.ok) throw new Error('Upload failed')
                const data = await response.json()
                return data.secure_url
            })

            const uploadedUrls = await Promise.all(uploadPromises)

            if (multiple) {
                const currentValues = Array.isArray(value) ? value : []
                onChange([...currentValues, ...uploadedUrls])
            } else {
                onChange(uploadedUrls[0])
            }

            toast.success("Uploaded successfully", { id: toastId })
        } catch (error) {
            console.error(error)
            toast.error("Upload failed. Check your Cloudinary settings.", { id: toastId })
        } finally {
            setLoading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const removeImage = (urlToRemove: string) => {
        if (multiple && Array.isArray(value)) {
            onChange(value.filter((url) => url !== urlToRemove))
        } else {
            onChange('')
        }
    }

    const triggerUpload = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className="space-y-4 w-full">
            {label && <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>}

            <input
                type="file"
                ref={fileInputRef}
                onChange={onUpload}
                accept="image/*"
                multiple={multiple}
                className="hidden"
            />

            <div className="grid grid-cols-2 gap-4">
                {/* Single Image Display */}
                {!multiple && typeof value === 'string' && value && (
                    <div className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 group">
                        <Image
                            src={value}
                            alt="Upload"
                            fill
                            className="object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => removeImage(value)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Multiple Images Display */}
                {multiple && Array.isArray(value) && value.map((url) => (
                    <div key={url} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 group">
                        <Image
                            src={url}
                            alt="Upload"
                            fill
                            className="object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => removeImage(url)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                {/* Upload Trigger */}
                {(multiple || (!multiple && !value)) && (
                    <button
                        type="button"
                        onClick={triggerUpload}
                        disabled={loading}
                        className="aspect-square border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                        ) : (
                            <>
                                <Upload className="w-6 h-6 text-gray-300" />
                                <span className="text-[10px] font-black text-gray-400 uppercase">
                                    {multiple ? 'Add Images' : 'Upload'}
                                </span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    )
}
