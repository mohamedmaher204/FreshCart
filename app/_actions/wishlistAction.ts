"use server"
import axios from "axios"
import { getUserToken } from "@/lib/getUserToken"
import { revalidatePath } from "next/cache"

const BASE_URL = "https://ecommerce.routemisr.com/api/v1/wishlist"

export async function addToWishlist(productId: string) {
    const token = await getUserToken()
    if (!token) return { success: false, message: "Please login first" }

    try {
        const { data } = await axios.post(
            BASE_URL,
            { productId },
            { headers: { token } }
        )
        revalidatePath("/")
        return { success: true, data }
    } catch (error: any) {
        return { success: false, message: error.response?.data?.message || "Failed to add to wishlist" }
    }
}

export async function removeFromWishlist(productId: string) {
    const token = await getUserToken()
    if (!token) return { success: false, message: "Please login first" }

    try {
        const { data } = await axios.delete(
            `${BASE_URL}/${productId}`,
            { headers: { token } }
        )
        revalidatePath("/")
        return { success: true, data }
    } catch (error: any) {
        return { success: false, message: error.response?.data?.message || "Failed to remove from wishlist" }
    }
}

export async function getUserWishlist() {
    const token = await getUserToken()
    if (!token) return { success: false, message: "Please login first" }

    try {
        const { data } = await axios.get(BASE_URL, { headers: { token } })
        return { success: true, data: data.data }
    } catch (error: any) {
        return { success: false, message: error.response?.data?.message || "Failed to fetch wishlist", data: [] }
    }
}
