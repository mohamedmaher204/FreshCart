"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../_Schema/loginSchema'
import { Loader2, Mail, Lock, ArrowRight, LogIn } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter } from "next/navigation"
import { toast } from 'sonner'
import Link from 'next/link'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const form = useForm<loginSchema>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(values: loginSchema) {
    try {
      setLoading(true)
      const result = await signIn('credentials', {
        ...values,
        redirect: false,
      })

      if (result?.error) {
        toast.error("Invalid email or password", { position: "top-center" })
        return
      }

      toast.success("Welcome back! 🎉", { position: "top-center" })
      router.replace("/")
      router.refresh()
    } catch (err) {
      toast.error("Something went wrong. Please try again.", { position: "top-center" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-gray-50/50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-emerald-900/5 border border-gray-100 p-8 md:p-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mb-4">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">Please enter your details to log in</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</FieldLabel>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                  <Input
                    {...field}
                    type="email"
                    className="h-14 pl-11 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-lg"
                    placeholder="name@example.com"
                  />
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center justify-between ml-1 mb-1.5">
                  <FieldLabel className="text-xs font-bold text-gray-400 uppercase tracking-wider">Password</FieldLabel>
                  <Link href="/forgot-password" title="Forgot Password" className="text-xs font-bold text-emerald-600 hover:underline">Forgot?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                  <Input
                    {...field}
                    type="password"
                    className="h-14 pl-11 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-lg"
                    placeholder="••••••••"
                  />
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
          >
            {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <>Log In Now <ArrowRight className="w-5 h-5" /></>}
          </Button>

          <p className="text-center text-gray-500 text-sm font-medium pt-4">
            Don't have an account?{" "}
            <Link href="/signup" className="text-emerald-600 font-bold hover:underline">
              Sign Up Free
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
