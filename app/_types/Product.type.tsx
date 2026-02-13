
export type Producttype = {
    title: string;
    description: string;
    price: number;
    imageCover: string;
    images: string[];
    id: string;
    ratingsAverage: number;
    ratingsQuantity: number;
    priceAfterDiscount: number;
    brand: BrandType;
    category: CategoryType;
    quantity: number;
}

export type BrandType = {
    image: string;
    name: string;
    slug: string;
    _id: string;


}
export type CategoryType = {
    image: string;
    name: string;
    slug: string;
    _id: string;


}