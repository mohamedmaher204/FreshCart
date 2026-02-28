"use client"
import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'

export const cartContext = createContext<any>(null);

export default function CartContextProvider({ children }: { children: React.ReactNode }) {
    const { status } = useSession()
    const [products, setProducts] = useState(null)
    const [numOfCartItems, setNumOfCartItems] = useState(0)
    const [cartId, setCartId] = useState(null)

    async function getData() {
        if (status !== 'authenticated') return;

        try {
            const { data: response } = await axios.get("/api/cart");
            const userCart = response.data;

            console.log("useCartFromContext", userCart);

            if (userCart) {
                // Calculate item count from items array
                const itemCount = userCart.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
                setNumOfCartItems(itemCount);
                setCartId(userCart.id || null);
                setProducts(userCart.items || []);
            }
        } catch (error) {
            console.error("Error fetching cart data:", error);
            // Don't clear cart on error - keep existing state
        }
    }

    useEffect(() => {
        getData()
    }, [status])

    return <cartContext.Provider value={{ products, numOfCartItems, cartId, setNumOfCartItems, getData, setProducts, setCartId }}>
        {children}
    </cartContext.Provider>
}

