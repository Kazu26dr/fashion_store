import { NavigateFunction } from "react-router-dom";
import { ProductData } from "../products/types";
import { FavoriteProduct, OrderData, SerializableCartProduct } from "./types";

// action
export const SIGN_IN = "SIGN_IN";
export const signInAction = (userState: { uid: string; username: string; role: string }) => {
    return {
        type: SIGN_IN, 
        payload: {
            isSignedIn: true,
            role: userState.role,
            uid: userState.uid,
            username: userState.username,
            error: ""
        }
    }
}

// 追加：SIGN_UPアクションタイプとアクションクリエイターを定義
export const SIGN_UP = "SIGN_UP";
export const signUpAction = (params: { username: string; email: string; password: string; confirmPassword: string; navigate: NavigateFunction }) => {
    return {
        type: SIGN_UP,
        payload: {
            ...params
        }
    }
}

export const SET_ERROR = "SET_ERROR";
export const setErrorAction = (error: string) => {
    return {
        type: SET_ERROR,
        payload: {
            error
        }
    }
}

export const RESET_ERROR = "RESET_ERROR";
export const resetErrorAction = () => {
    return {
        type: RESET_ERROR,
        payload: {
            error: ""
        }
    }
}

export const SIGN_OUT = "SIGN_OUT";
export const signOutAction = () => {
    return {
        type: SIGN_OUT, 
        payload: {
            isSignedIn: false,
            role: "",
            uid: "",
            username: "",
            error: ""
        }
    }
}

export const ADD_PRODUCT_TO_CART = "ADD_PRODUCT_TO_CART";
export const addProductToCartAction = (product: ProductData) => {
    return {
        type: ADD_PRODUCT_TO_CART,
        payload: {
            product
        }
    }
}

export const FETCH_PRODUCTS_IN_CART = "FETCH_PRODUCTS_IN_CART";
export const fetchProductsInCartAction = (products: SerializableCartProduct[]) => {
    return {
        type: FETCH_PRODUCTS_IN_CART,
        payload: { products }
    }
}

export const FETCH_ORDERS_HISTORY = "FETCH_ORDERS_HISTORY";
export const fetchOrdersHistoryAction = (orders: OrderData[]) => {
    return {
        type: FETCH_ORDERS_HISTORY,
        payload: { orders }
    }
}

export const FETCH_FAVORITES = "FETCH_FAVORITES";
export const fetchFavoritesAction = (favorites: FavoriteProduct[]) => {
    return {
        type: FETCH_FAVORITES,
        payload: { favorites }
    }
}