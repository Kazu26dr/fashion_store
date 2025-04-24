import { FavoriteProduct } from "../../redux/users/types";
import { ProductData } from "../../redux/products/types";

// 請求先情報の型定義
export interface BillingDetails {
    name: string;
    email: string;
    phone: string;
    address: {
      postal_code: string;
      state: string;
      line1: string;
      country: string;
    };
}

// お気に入りアイテムの型定義
export interface FavoriteItemProps extends FavoriteProduct {
    onDelete: (id: string) => void;
}

// 画像エリアの型定義
export interface ImageAreaProps {
  image: string;
  setImage: (image: string) => void;
  images?: Array<{ id: string; path: string }>;
  setImages?: React.Dispatch<
    React.SetStateAction<Array<{ id: string; path: string }>>
  >;
}

// 画像プレビューの型定義
export interface ImagePreviewProps {
  id: string;
  path: string;
  delete: (id: string) => void;
}

// 商品カードの型定義
export interface ProductCardProps {
  product: ProductData;
}

// サイズアイテムの型定義
export interface SizeItem {
  size: string;
  quantity: number;
}

export interface SetSizeAreaProps {
  sizes: SizeItem[];
  setSizes?: (sizes: SizeItem[]) => void;
}

// サイズテーブルの型定義
export interface SizeTableProps {
  id: string;
  productId: string;
  size: string;
  quantity: number;
  images: string[];
  name: string;
  description: string;
  price: number;
}



