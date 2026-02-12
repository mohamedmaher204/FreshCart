import { CategoryType } from "../_types/Product.type";

 export async function getAllCategories(): Promise<CategoryType[]|null> {

    try {
        const response = await fetch(`https://ecommerce.routemisr.com/api/v1/categories`, {
            // cache: 'force-cache',
        });
        const data = await response.json();
        console.log(data.data);
        return data.data;
    } catch (error) {
        console.log("error", error);
        return null;
    }
    
  
  }