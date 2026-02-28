"use client"
import { Button } from '@/components/ui/button'

import axios from 'axios'
import { useSession } from 'next-auth/react'
import { Loader, ShoppingCart } from 'lucide-react'
import { cartContext } from '@/app/providers/cartContextProvider'
import React, { useContext, useState } from 'react'
import { toast } from 'sonner'
import { useTrackActivity } from '@/app/_hooks/useTrackActivity'
type AddToCartBtnProps = {
  productId: string
}
export default function AddToCartBtn({ productId }: AddToCartBtnProps) {

  const { data: session } = useSession();
  const { getData: refreshCart } = useContext(cartContext);
  const { trackAction } = useTrackActivity();
  const [loading, setLoading] = useState(false);

  async function AddToCart() {
    if (!session) {
      toast.error("Please login to add products to cart", { position: "top-center" });
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post("/api/cart", {
        productId
      });

      toast.success("Product added to cart successfully", { position: "top-center" })
      refreshCart(); // Refresh cart data
      trackAction(productId, 'ADD_TO_CART'); // Track behavior

    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to add product to cart";
      toast.error(message);
      console.error(error);
    }
    setLoading(false);
  }

  return <>

    <Button onClick={AddToCart} className='w-full my-2.5 cursor-pointer'> {loading ? <Loader className='animate-spin' /> : <ShoppingCart />}      Add To Cart  </Button>
  </>
}

