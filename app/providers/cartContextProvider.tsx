"use client"
import React, { createContext, useEffect, useState } from 'react'
import { getUserCart } from '../_actions/getUserCartAction';
export const cartContext = createContext<any>(null);
export default function CartContextProvider({ children }: { children: React.ReactNode }) {

    const [products, setProducts] = useState(null)
    const [numOfCartItems, setNumOfCartItems] = useState(0)
    // const [totalPrice, setTotalPrice] = useState(0)
    const [cartId, setCartId] = useState(null)



    //    await getUserCart()

    async function getData() {
        try {
            const userCart = await getUserCart()
            console.log("useCartFromContext", userCart);

            // Only update state if we got valid cart data
            if (userCart && userCart.status !== "fail") {
                setNumOfCartItems(userCart.numOfCartItems || 0)
                setCartId(userCart.cartId || null)
                setProducts(userCart.data?.products || [])
            }
            // If userCart is null (error occurred), keep existing state
            // This prevents clearing cart on temporary errors
        } catch (error) {
            console.error("Error fetching cart data:", error);
            // Don't clear cart on error - keep existing state
        }
    }

    useEffect(() => {
        getData()
    }, [])

    return <cartContext.Provider value={{ products, numOfCartItems, cartId, setNumOfCartItems, getData, setProducts, setCartId }}>
        {children}
    </cartContext.Provider>
}

