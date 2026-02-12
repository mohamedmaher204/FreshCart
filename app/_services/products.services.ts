import { Producttype } from './../_types/Product.type';


 
 





 export async function getAllProduct(): Promise<Producttype[]|null> {

    try {
        const response = await fetch(`https://ecommerce.routemisr.com/api/v1/products`, {
            cache: 'force-cache',
        });
        const data = await response.json();
        console.log(data.data);
        return data.data;
    } catch (error) {
        console.log("error", error);
        return null;
    }
    
  
  }

 export async function getProduct(id: string): Promise<Producttype | null> {

    try {
        const response = await fetch(`https://ecommerce.routemisr.com/api/v1/products/${id}`, {
            cache: 'force-cache',
        });
        const data = await response.json();
        console.log(data.data);
        return data.data;
    } catch (error) {
        console.log("error", error);
        return null;
    }
    
  
  }





 