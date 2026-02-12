"use client"
import React, { useEffect, useState } from 'react'
import { getUserOrders } from '../_actions/getUserOrdersAction'
import { Package, Calendar, CreditCard, MapPin, Loader2, ShoppingBag, CheckCircle2, Clock, Truck, XCircle, Filter, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface OrderProduct {
    count: number
    _id: string
    product: {
        _id: string
        title: string
        imageCover: string
        category: {
            _id: string
            name: string
        }
        brand: {
            _id: string
            name: string
        }
    }
    price: number
}

interface Order {
    _id: string
    totalOrderPrice: number
    paymentMethodType: string
    isPaid: boolean
    isDelivered: boolean
    createdAt: string
    cartItems: OrderProduct[]
    shippingAddress: {
        details: string
        phone: string
        city: string
    }
    user: {
        _id: string
        name: string
        email: string
    }
}

export default function AllOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'delivered' | 'pending'>('all')
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        async function fetchOrders() {
            setLoading(true)
            const result = await getUserOrders()

            if (result.success) {
                // Ensure data is always an array
                const ordersArray = Array.isArray(result.data) ? result.data : []
                setOrders(ordersArray)
            } else {
                setError(result.message || 'Failed to load orders')
                setOrders([]) // Set empty array on error
            }
            setLoading(false)
        }

        fetchOrders()
    }, [])

    const getStatusBadge = (order: Order) => {
        if (order.isDelivered) {
            return <Badge className="bg-green-500 hover:bg-green-600 text-white border-0"><CheckCircle2 className="w-3 h-3 mr-1" /> Delivered</Badge>
        } else if (order.isPaid) {
            return <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-0"><Truck className="w-3 h-3 mr-1" /> In Transit</Badge>
        } else {
            return <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-0"><Clock className="w-3 h-3 mr-1" /> Pending Payment</Badge>
        }
    }

    const filteredOrders = (Array.isArray(orders) ? orders : []).filter(order => {
        // Filter by status
        if (filterStatus === 'paid' && !order.isPaid) return false
        if (filterStatus === 'delivered' && !order.isDelivered) return false
        if (filterStatus === 'pending' && order.isPaid) return false

        // Filter by search term
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase()
            return (
                order._id.toLowerCase().includes(searchLower) ||
                order.cartItems.some(item =>
                    item.product.title.toLowerCase().includes(searchLower)
                )
            )
        }

        return true
    })

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
                <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mb-4" />
                <h2 className="text-2xl font-semibold text-gray-700">Loading your orders...</h2>
                <p className="text-gray-500 mt-2">Please wait while we fetch your order history</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-gradient-to-br from-red-50 to-gray-50">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-red-100">
                    <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-10 h-10 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Orders</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-gradient-to-br from-emerald-50 to-gray-50 animate-in fade-in zoom-in duration-500">
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl text-center max-w-md w-full border border-gray-100">
                    <div className="bg-emerald-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-12 h-12 text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">No Orders Yet</h2>
                    <p className="text-gray-500 mb-8">You haven't placed any orders yet. Start shopping to see your orders here!</p>
                    <Link href="/product">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200" size="lg">
                            <ShoppingBag className="mr-2 w-5 h-5" /> Start Shopping
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <section className="bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 md:py-12 min-h-screen">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <Package className="w-8 h-8 md:w-10 md:h-10 text-emerald-600" />
                        My Orders
                    </h1>
                    <p className="text-gray-600 text-lg">Track and manage all your orders in one place</p>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        {/* Search */}
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by order ID or product name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                            />
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex gap-2 flex-wrap">
                            <Button
                                variant={filterStatus === 'all' ? 'default' : 'outline'}
                                onClick={() => setFilterStatus('all')}
                                className={filterStatus === 'all' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                                size="sm"
                            >
                                All Orders ({Array.isArray(orders) ? orders.length : 0})
                            </Button>
                            <Button
                                variant={filterStatus === 'pending' ? 'default' : 'outline'}
                                onClick={() => setFilterStatus('pending')}
                                className={filterStatus === 'pending' ? 'bg-amber-500 hover:bg-amber-600' : ''}
                                size="sm"
                            >
                                Pending ({Array.isArray(orders) ? orders.filter(o => !o.isPaid).length : 0})
                            </Button>
                            <Button
                                variant={filterStatus === 'paid' ? 'default' : 'outline'}
                                onClick={() => setFilterStatus('paid')}
                                className={filterStatus === 'paid' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                                size="sm"
                            >
                                Paid ({Array.isArray(orders) ? orders.filter(o => o.isPaid).length : 0})
                            </Button>
                            <Button
                                variant={filterStatus === 'delivered' ? 'default' : 'outline'}
                                onClick={() => setFilterStatus('delivered')}
                                className={filterStatus === 'delivered' ? 'bg-green-500 hover:bg-green-600' : ''}
                                size="sm"
                            >
                                Delivered ({Array.isArray(orders) ? orders.filter(o => o.isDelivered).length : 0})
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                        <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders found</h3>
                        <p className="text-gray-500">Try adjusting your filters or search term</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
                            >
                                {/* Order Header */}
                                <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-4 md:p-6 border-b border-gray-100">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg md:text-xl font-bold text-gray-900">
                                                    Order #{order._id.slice(-8).toUpperCase()}
                                                </h3>
                                                {getStatusBadge(order)}
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <CreditCard className="w-4 h-4" />
                                                    {order.paymentMethodType === 'cash' ? 'Cash on Delivery' : 'Card Payment'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-left md:text-right">
                                            <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                                            <p className="text-2xl md:text-3xl font-bold text-emerald-600">
                                                ${order.totalOrderPrice}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-4 md:p-6">
                                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Package className="w-5 h-5 text-emerald-600" />
                                        Order Items ({order.cartItems.length})
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                        {order.cartItems.map((item) => (
                                            <div
                                                key={item._id}
                                                className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden relative border border-gray-200">
                                                    <Image
                                                        src={item.product.imageCover}
                                                        alt={item.product.title}
                                                        fill
                                                        className="object-contain p-1"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h5 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                                                        {item.product.title}
                                                    </h5>
                                                    <p className="text-xs text-gray-500 mb-1">{item.product.brand?.name}</p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-emerald-600 font-medium">Qty: {item.count}</span>
                                                        <span className="text-sm font-bold text-gray-900">${item.price}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Shipping Address */}
                                    <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg p-4 border border-blue-100">
                                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-blue-600" />
                                            Shipping Address
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                            <div>
                                                <p className="text-gray-500 mb-1">Address</p>
                                                <p className="font-medium text-gray-900">{order.shippingAddress?.details || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 mb-1">City</p>
                                                <p className="font-medium text-gray-900">{order.shippingAddress?.city || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 mb-1">Phone</p>
                                                <p className="font-medium text-gray-900">{order.shippingAddress?.phone || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Summary Stats */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-emerald-100 text-sm mb-1">Total Orders</p>
                                <p className="text-3xl font-bold">{Array.isArray(orders) ? orders.length : 0}</p>
                            </div>
                            <Package className="w-12 h-12 text-emerald-200" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm mb-1">Total Spent</p>
                                <p className="text-3xl font-bold">
                                    ${Array.isArray(orders) ? orders.reduce((sum, order) => sum + order.totalOrderPrice, 0) : 0}
                                </p>
                            </div>
                            <CreditCard className="w-12 h-12 text-blue-200" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm mb-1">Delivered</p>
                                <p className="text-3xl font-bold">
                                    {Array.isArray(orders) ? orders.filter(o => o.isDelivered).length : 0}
                                </p>
                            </div>
                            <CheckCircle2 className="w-12 h-12 text-green-200" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
