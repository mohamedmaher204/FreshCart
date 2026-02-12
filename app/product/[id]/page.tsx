
import { getProduct } from '@/app/_services/products.services';
import React from 'react'
import { FaStar } from 'react-icons/fa6';
type ProductDetailsProps={
    params:{
        id:string
    }
}
export default async function page(props:ProductDetailsProps) {

// const data =await props.params  ;
const data =await props.params;

console.log(data.id);
const productData = await getProduct(data.id);

  return<>

    <div className="grid grid-cols-4 gap-5 container ">

        <div>
            <img className='w-full' src={productData?.imageCover} alt={productData?.title} />
        </div>

        <div className='col-span-3 gap-5 items-center text-center my-auto bg-amber-50 p-5' >
            <h1 className='text-3xl '>{productData?.title}</h1>
            {productData?.priceAfterDiscount? <>
            <p><span className='line-through text-red-500'>Price:{productData?.price}</span>  <span className='text-green-600 font-bold'> {productData?.priceAfterDiscount} </span> </p>
            </>: <> <p className='font-bold text-green-600'>Peice {productData?.price} </p>
            </>}

            <p className='text-xl'>brand: {productData?.brand.name}</p>
            <p className='text-xl'>category: {productData?.category.name}</p>
            <p className='flex gap-1 text-center justify-center
 '><span className='text-yellow-400 text-center'><FaStar /></span> {productData?.ratingsQuantity}</p>
        <button className='bg-emerald-400 text-white p-3  w-full gap-3 px-5 py-2 mt-6 cursor-pointer rounded-2xl hover:bg-emerald-600 hover:text-xl transition-all duration-300 '>ِAdd To Cart</button>


        </div>

    </div>


  
  
  </>
}
