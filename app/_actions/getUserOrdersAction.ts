"use server"
import axios from "axios"
import { getUserToken } from "@/lib/getUserToken"

export async function getUserOrders() {
    try {
        const token = await getUserToken()

        if (!token) {
            return {
                success: false,
                message: "User not authenticated",
                data: []
            }
        }

        const response = await axios.get(
            `https://ecommerce.routemisr.com/api/v1/orders/`,
            {
                headers: {
                    token: token
                }
            }
        )

        console.log("Orders API Response:", response.data)

        // The API might return data directly as array or wrapped in an object
        // Handle both cases
        const ordersData = Array.isArray(response.data)
            ? response.data
            : response.data.data || response.data.orders || []

        return {
            success: true,
            data: ordersData
        }
    } catch (error: any) {
        console.error("Error fetching orders:", error.response?.data || error.message)
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch orders",
            data: []
        }
    }
}
