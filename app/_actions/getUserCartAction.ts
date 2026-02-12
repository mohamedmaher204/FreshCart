"use server"

import { getUserToken } from "@/lib/getUserToken";
import axios from "axios";

export async function getUserCart() {
    try {
        const token = await getUserToken()

        if (!token) {
            return null
        }

        const { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/cart", {
            headers: {
                token: token as string
            }
        })

        return data
    } catch (error: any) {
        console.error("Error fetching cart:", error.response?.status, error.response?.data || error.message)

        // Only return empty cart if cart doesn't exist (404 or similar)
        // For other errors, return null to keep existing cart data
        if (error.response?.status === 404 || error.response?.data?.message?.includes("No cart")) {
            return {
                status: "success",
                numOfCartItems: 0,
                data: { products: [] }
            }
        }

        // For other errors (500, network issues, etc.), return null
        // This prevents clearing the cart on temporary errors
        return null
    }
}