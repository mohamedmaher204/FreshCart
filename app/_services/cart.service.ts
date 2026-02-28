import axios from "axios";

export async function addToCart(productId: string) {
    const { data } = await axios.post("/api/cart", { productId });
    return data;
}

export async function getUserCart() {
    const { data } = await axios.get("/api/cart");
    return data;
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
    const { data } = await axios.put(`/api/cart/${itemId}`, { quantity });
    return data;
}

export async function removeCartItem(itemId: string) {
    const { data } = await axios.delete(`/api/cart/${itemId}`);
    return data;
}

export async function clearCart() {
    const { data } = await axios.delete("/api/cart");
    return data;
}
