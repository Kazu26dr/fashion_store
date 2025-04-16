import { firebaseTimestamp } from "../../firebase";
import {
  collection,
  doc,
  setDoc,
  getFirestore,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  getDoc,
  writeBatch,
  where,
} from "firebase/firestore";
import { ProductActions, ProductData, ProductDataFirestore } from "./types";
import { Dispatch } from "redux";
import { RootState } from "../store/store";
import { NavigateFunction } from "react-router-dom";
import { ThunkAction } from "redux-thunk";
import { fetchProductsAction } from "./actions";
import { SerializableCartProduct } from "../users/types";

// Firebase v9 用に更新
const db = getFirestore();
const productsCollection = collection(db, "products");

// このアクションタイプを追加
const SAVE_PRODUCT = "SAVE_PRODUCT";

export const saveProduct = (
  id: string = "",
  name: string,
  description: string,
  price: number,
  category: string,
  gender: string,
  images: string[],
  sizes: { size: string; quantity: number }[],
  user_id: string,
  navigate: NavigateFunction
): ThunkAction<Promise<void>, RootState, unknown, ProductActions> => {
  return async (dispatch: Dispatch<ProductActions>) => {
    const timestamp = firebaseTimestamp.now();

    try {
      let productId = id;
      let docRef;

      const data: ProductDataFirestore = {
        name,
        description,
        category,
        gender,
        price,
        images,
        sizes,
        user_id,
        updated_at: timestamp,
      } as ProductDataFirestore;

      if (id === "") {
        // 新規作成の場合
        docRef = doc(productsCollection);
        productId = docRef.id;
        data.id = productId;
        data.created_at = timestamp;
      } else {
        // 更新の場合
        docRef = doc(db, "products", id);
      }

      // merge: true を使用して既存のドキュメントとマージ
      await setDoc(docRef, data, { merge: true });

      const reduxData: ProductData = {
        name: data.name,
        description: data.description,
        category: data.category,
        gender: data.gender,
        price: data.price,
        images: data.images,
        sizes: data.sizes,
        id: productId,
        timestamp: timestamp.toMillis(),
        createdAt: data.created_at
          ? data.created_at.toMillis()
          : timestamp.toMillis(),
        updated_at: data.updated_at.toMillis(),
        user_id,
      };

      dispatch({
        type: SAVE_PRODUCT,
        payload: [reduxData],
      });

      navigate("/");
    } catch (error) {
      throw new Error(error as string);
    }
  };
};

export const fetchProducts = (gender: string, category: string, keyword?: string): ThunkAction<
  Promise<void>,
  RootState,
  unknown,
  ProductActions
> => {
  return async (dispatch: Dispatch<ProductActions>) => {
    try {
      let q = query(productsCollection, orderBy("updated_at", "desc"));
      if (gender !== "") {
        q = query(q, where("gender", "==", gender));
      }
      if (category !== "") {
        q = query(q, where("category", "==", category));
      }
      const querySnapshot = await getDocs(q);
      const productList: ProductData[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as ProductDataFirestore;
        const timestamp = data.updated_at.toMillis();
        const product: ProductData = {
          id: doc.id,
          images: data.images,
          sizes: data.sizes,
          name: data.name,
          description: data.description,
          category: data.category,
          gender: data.gender,
          price: data.price,
          createdAt: data.created_at?.toMillis() ?? timestamp,
          timestamp: timestamp,
          updated_at: timestamp,
          user_id: data.user_id,
        };

        // キーワード検索の場合、商品名または説明文に検索キーワードが含まれているかチェック
        if (keyword) {
          const normalizedKeyword = keyword.toLowerCase();
          const normalizedName = product.name.toLowerCase();
          // const normalizedDescription = product.description.toLowerCase();

          if (normalizedName.includes(normalizedKeyword) 
            // || normalizedDescription.includes(normalizedKeyword)
          ) {
            productList.push(product);
          }
        } else {
          productList.push(product);
        }
      });

      dispatch(fetchProductsAction(productList));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
};

export const deleteProduct = (
  id: string
): ThunkAction<Promise<void>, RootState, unknown, ProductActions> => {
  return async (dispatch: Dispatch<ProductActions>) => {
    try {
      await deleteDoc(doc(db, "products", id));
      const fetchAction = fetchProducts("", "");
      await dispatch(fetchAction as unknown as ProductActions);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
};

export const orderProduct = (
  productsInCart: SerializableCartProduct[],
  amount: number,
): ThunkAction<Promise<boolean>, RootState, unknown, ProductActions> => {
  return async (
    _dispatch: Dispatch<ProductActions>,
    getState: () => RootState
  ) => {
    const uid = getState().users.uid;
    const timestamp = firebaseTimestamp.now();
    const paymentId = localStorage.getItem("stripePaymentId") || "";

    const products: {
      id: string;
      images: string[];
      name: string;
      price: number;
      size: string;
    }[] = [];
    const soldOutProducts: string[] = [];

    const batch = writeBatch(db);

    for (const product of productsInCart) {
      const productRef = doc(db, "products", product.id);
      const productDoc = await getDoc(productRef);
      const productData = productDoc.data() as ProductDataFirestore;
      
      const updatedSizes = productData.sizes.map((size) => {
        if (size.size === product.size) {
          if (size.quantity === 0) {
            soldOutProducts.push(product.name);
            return size;
          }
          return {
            size: size.size,
            quantity: size.quantity - 1,
          };
        } else {
          return size;
        }
      });

      products.push({
        id: product.productId,
        images: product.images,
        name: product.name,
        price: product.price,
        size: product.size,
      });

      batch.update(productRef, { sizes: updatedSizes });
    }

    if (soldOutProducts.length > 0) {
      const errorMessage =
        soldOutProducts.length > 1
          ? soldOutProducts.join("と")
          : soldOutProducts[0];

      alert(
        "大変申し訳ありません。" +
          errorMessage +
          "が在庫切れになったため、注文処理を中断しました。"
      );
      return false;
    } else {
      try {
        // 注文処理を先に実行
        const orderRef = doc(collection(db, "users", uid, "orders"));
        const date = timestamp.toDate();
        const shippingDate = firebaseTimestamp.fromDate(
          new Date(new Date(date).setDate(new Date(date).getDate() + 3))
        );

        const history = {
          amount: amount,
          created_at: timestamp,
          id: orderRef.id,
          products: products,
          shipping_date: shippingDate,
          updated_at: timestamp,
          payment_id: paymentId
        };

        await setDoc(orderRef, history);

        // 注文IDをローカルストレージに保存
        localStorage.setItem("orderId", orderRef.id);

        // 注文処理が成功したら、カートの商品を削除
        for (const product of productsInCart) {
          const cartRef = doc(db, "users", uid, "cart", product.cartId || product.id);
          batch.delete(cartRef);
        }
        await batch.commit();

        return true;
      } catch {
        alert(
          "注文処理に失敗しました。通信環境をご確認のうえ、もう一度お試しください。"
        );
        return false;
      }
    }
  };
};
