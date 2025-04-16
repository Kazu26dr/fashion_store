import { Timestamp } from "firebase/firestore";

// 商品状態の型定義
export interface ProductState {
  list: ProductData[];
  selectedProduct: ProductData | null;
}

// ルートステートの型定義
export interface RootState {
  products: ProductState;
  router: {
    location: {
      pathname: string;
    };
  };
}

// Firestore用のデータ型
export interface ProductDataFirestore {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  gender: string;
  images: string[];
  sizes: { size: string; quantity: number }[];
  timestamp?: Timestamp;
  createdAt?: Timestamp;
  created_at?: Timestamp;
  updated_at: Timestamp;
  user_id: string;
}

// Redux状態用のデータ型（シリアライズ可能）
export interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  gender: string;
  images: string[];
  sizes: { size: string; quantity: number }[];
  timestamp: number;
  createdAt: number;
  updated_at: number;
  user_id: string;
}

export interface ProductActions {
  type: string;
  payload: ProductData[];
}

export interface DeleteProductActions {
  type: string;
  payload: string;
}

