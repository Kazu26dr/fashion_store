import { NavigateFunction } from "react-router-dom";
import * as Actions from "./actions";
import { UnknownAction } from 'redux';
import { ProductData } from "../products/types";
import { Timestamp } from "firebase/firestore";

// Firestore用のCartProduct型定義（非シリアライズ可能）
export interface CartProduct extends ProductData {
  added_at: Timestamp;
  size: string;
  quantity: number;
  productId: string;
}

// Firestore用のFavoriteProduct型定義（非シリアライズ可能）
export interface FavoriteProduct extends ProductData {
  added_at: Timestamp;
  size: string;
  productId: string;
}

// Reduxストア用のシリアライズ可能なCartProduct型定義
export interface SerializableCartProduct extends ProductData {
  added_at: {
    seconds: number;
    nanoseconds: number;
  };
  size: string;
  quantity: number;
  productId: string;
  cartId?: string;
}

// ユーザー状態の型定義
export interface UserState {
  cart: SerializableCartProduct[];
  favorites: FavoriteProduct[];
  error: string;
  isSignedIn: boolean;
  uid: string;
  username: string;
  orders: OrderData[];
  currentUser: {
    uid: string;
    username: string;
    role: string;
  } | null;
}

// アクションの型定義
export interface SignInAction {
  type: typeof Actions.SIGN_IN;
  payload: {
    isSignedIn: boolean;
    uid: string;
    username: string;
    error: string;
  };
} 

export interface OrderData {
  id: string;
  amount: number;
  created_at: {
    seconds: number;
    nanoseconds: number;
  };
  updated_at: {
    seconds: number;
    nanoseconds: number;
  };
  products: {
    id: string;
    name: string;
    price: number;
    size: string;
  }[];
  payment_id?: string;
  shipping_date?: {
    seconds: number;
    nanoseconds: number;
  };
}

export interface FetchOrdersHistoryAction {
  type: typeof Actions.FETCH_ORDERS_HISTORY;
  payload: {
    orders: OrderData[];
  };
}

export interface FetchFavoritesAction {
  type: typeof Actions.FETCH_FAVORITES;
  payload: {
    favorites: FavoriteProduct[];
  };
}
export interface SignOutAction {
  type: typeof Actions.SIGN_OUT;
  payload: {
    isSignedIn: boolean;
    uid: string;
    username: string;
    error: string;
  };
}

export interface SetErrorAction {
  type: typeof Actions.SET_ERROR;
  payload: {
    error: string;
  };
}

export interface ResetErrorAction {
  type: typeof Actions.RESET_ERROR;
  payload: {
    error: string;
  };
}

export interface FetchProductsInCartAction {
  type: typeof Actions.FETCH_PRODUCTS_IN_CART;
  payload: {
    products: SerializableCartProduct[];
  };
}

export type SignUpParams = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  navigate: NavigateFunction;
};

export type SignInParams = {
  email: string;
  password: string;
  navigate: NavigateFunction;
};

// すべての可能なアクションの型
export type UserActions = 
  | SignInAction 
  | SignOutAction 
  | SetErrorAction 
  | ResetErrorAction 
  | FetchProductsInCartAction 
  | FetchOrdersHistoryAction
  | FetchFavoritesAction
  | UnknownAction;

// ルート状態の型
export interface RootState {
  users: UserState;
  // 他のリデューサーの状態もここに追加できます
}