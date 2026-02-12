"use client"
import { Button } from '@/components/ui/button'

import axios from 'axios'
import { useSession } from 'next-auth/react'
import { Loader, ShoppingCart } from 'lucide-react'
import { cartContext } from '@/app/providers/cartContextProvider'
import React, { useContext, useState } from 'react'
import { toast } from 'sonner'
type AddToCartBtnProps = {
  productId: string
}
export default function AddToCartBtn({ productId }: AddToCartBtnProps) {

  const { data: session } = useSession();
  const { getData: refreshCart } = useContext(cartContext);
  const [loading, setLoading] = useState(false);

  async function AddToCart() {
    setLoading(true);

    console.log("adding to cart", productId);
    // @ts-ignore
    const token = session?.user?.userTokenfromBackend;

    // هنا ممكن تضيف منطق اضافة المنتج الى السلة
    try {
      const { data } = await axios.post("https://ecommerce.routemisr.com/api/v1/cart", {
        productId
      },

        {
          headers: {
            token: token,
          }
        }

      )
      console.log("response from add to cart", data);
      if (data.status === "success") {
        toast.success("Product added to cart successfully", { position: "top-center" })
        refreshCart(); // Refresh cart data
      }
    } catch (error) {
      toast.error("Failed to add product to cart");
      console.error(error);
    }
    setLoading(false);
  }

  return <>

    <Button onClick={AddToCart} className='w-full my-2.5 cursor-pointer'> {loading ? <Loader className='animate-spin' /> : <ShoppingCart />}      Add To Cart  </Button>
  </>
}

