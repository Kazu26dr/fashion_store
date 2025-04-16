import { ProductData } from "./types";

export const FETCH_PRODUCTS = "FETCH_PRODUCTS";
export const fetchProductsAction = (products: ProductData[]) => {
    return {
        type: "FETCH_PRODUCTS",
        payload: products
    }
}
export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const deleteProductAction = (id: string) => {
    return {
        type: "DELETE_PRODUCT",
        payload: id
    }
}