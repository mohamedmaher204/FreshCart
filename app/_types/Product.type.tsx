
export type Producttype = {
          title: string;
         
          price: number;
          imageCover: string;
          id: string;
          ratingsAverage: number;
          ratingsQuantity: number;
          priceAfterDiscount: number;
          brand: BrandType;
          category: CategoryType;
        }
        
        export type BrandType={
            image:string;
            name:string;
            slug:string;
            _id:string;


        }
        export type CategoryType={
            image:string;
            name:string;
            slug:string;
            _id:string;


        }