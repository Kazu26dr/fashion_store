import {
  signInAction,
  signOutAction,
  setErrorAction,
  resetErrorAction,
  fetchOrdersHistoryAction,
} from "./actions";
import { AppDispatch } from "../store/store";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
  collection,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import { SignUpParams, SignInParams, RootState, CartProduct, OrderData, UserActions, FavoriteProduct } from "./types";
import { FirebaseError } from "firebase/app";
import { NavigateFunction } from "react-router-dom";
import { ProductActions, ProductData } from "../products/types";
import { fetchProductsAction } from "../products/actions";
import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";

// authをインスタンス化
const auth = getAuth();

export const listenAuthState = (navigate: NavigateFunction) => {
  return async (dispatch: AppDispatch) => {
    return auth.onAuthStateChanged(async (user) => {
      if (user) {
        const uid = user.uid;
        const docRef = doc(db, "users", uid);
        const snapshot = await getDoc(docRef);
        const userData = snapshot.data();

        if (userData) {
          // ユーザーのトークンを取得して保存
          const token = await user.getIdToken();
          localStorage.setItem("token", token);

          dispatch(
            signInAction({
              uid: uid,
              username: userData.username,
              role: userData.role,
            })
          );
          return true;
        } else {
          alert("ユーザー情報の取得に失敗しました");
          return false;
        }
      } else {
        navigate("/signin");
      }
    });
  };
};

export const signIn = ({ email, password, navigate }: SignInParams) => {
  return async (dispatch: AppDispatch) => {
    // バリデーション
    if (email === "" || password === "") {
      dispatch(setErrorAction("必須項目が未入力です"));
      return false;
    }

    // パスワードのバリデーション
    if (password.length < 6) {
      dispatch(setErrorAction("パスワードは6文字以上で入力してください"));
      return false;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user) {
        const uid = user.uid;
        const docRef = doc(db, "users", uid);
        const snapshot = await getDoc(docRef);
        const userData = snapshot.data();

        if (userData) {
          // ユーザーのトークンを取得して保存
          const token = await user.getIdToken();
          localStorage.setItem("token", token);

          dispatch(
            signInAction({
              uid: uid,
              username: userData.username,
              role: userData.role,
            })
          );
          navigate("/");
          return true;
        } else {
          dispatch(setErrorAction("ユーザー情報の取得に失敗しました"));
          return false;
        }
      }
      return false;
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/user-not-found":
            dispatch(setErrorAction("ユーザーが見つかりませんでした。"));
            break;
          case "auth/wrong-password":
            dispatch(setErrorAction("パスワードが間違っています。"));
            break;
          default:
            dispatch(
              setErrorAction(
                "サインインに失敗しました。もう一度お試しください。"
              )
            );
        }
        return false;
      }
      return false;
    }
  };
};

export const signUp = ({
  username,
  email,
  password,
  confirmPassword,
  navigate,
}: SignUpParams) => {
  return async (dispatch: AppDispatch) => {
    // バリデーション
    if (
      username === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      dispatch(setErrorAction("必須項目が未入力です"));
      return false;
    }

    if (password !== confirmPassword) {
      dispatch(setErrorAction("パスワードが一致しません"));
      return false;
    }

    // パスワードの追加バリデーション
    if (password.length < 6) {
      dispatch(setErrorAction("パスワードは6文字以上で入力してください"));
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      dispatch(setErrorAction("パスワードには大文字を含める必要があります"));
      return false;
    }

    if (!/[0-9]/.test(password)) {
      dispatch(setErrorAction("パスワードには数字を含める必要があります"));
      return false;
    }

    try {
      // 新しい記法でユーザー作成
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user) {
        const uid = user.uid;
        const timestamp = serverTimestamp();

        const userInitialData = {
          created_at: timestamp,
          email: email,
          role: "customer",
          uid: uid,
          updated_at: timestamp,
          username: username,
        };

        // Firestoreへの書き込み後にナビゲーション
        await setDoc(doc(db, "users", uid), userInitialData).then(() => {
          navigate("/signin");
        });

        return true;
      }
    } catch (error) {
      dispatch(
        setErrorAction(
          "アカウント登録に失敗しました: " +
            (error instanceof Error ? error.message : "不明なエラー")
        )
      );
      return false;
    }
  };
};

export const signOut = ({ navigate }: { navigate: NavigateFunction }) => {
  return async (dispatch: AppDispatch) => {
    await firebaseSignOut(auth);
    localStorage.removeItem("token");
    dispatch(signOutAction());
    navigate("/signin");
  };
};

export const resetPassword = ({
  email,
  navigate,
}: {
  email: string;
  navigate: NavigateFunction;
}) => {
  return async (dispatch: AppDispatch) => {
    // バリデーション
    if (email === "") {
      dispatch(setErrorAction("必須項目が未入力です"));
      return false;
    } else {
      try {
        await sendPasswordResetEmail(auth, email);
        dispatch(
          setErrorAction(
            "入力されたメールアドレスにパスワードリセットのメールを送信しました。"
          )
        );
        navigate("/signin");
      } catch (error) {
        dispatch(
          setErrorAction(
            "パスワードリセットのメールを送信に失敗しました。" +
              (error instanceof Error ? error.message : "不明なエラー")
          )
        );
      }
    }
  };
};

export const resetError = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(resetErrorAction());
  };
};

export const addProductToCart = (product: CartProduct) => {
  return async (_dispatch: AppDispatch, getState: () => RootState) => {
    const uid = getState().users.uid;

    // 商品IDが空の場合は処理しない
    if (!uid) {
      console.error("ユーザーIDが見つかりません");
      return;
    }

    // ランダムなドキュメントIDを生成する（商品IDを使用するのではなく）
    const cartRef = doc(collection(db, "users", uid, "cart"));

    // Firestoreに保存するデータを作成
    const { id, productId, size, quantity, images, name, description, price } =
      product;
    const addedProduct = {
      id,
      productId,
      size,
      quantity,
      images,
      name,
      description,
      price,
      added_at: serverTimestamp(),
    };

    try {
      await setDoc(cartRef, addedProduct);
      // navigate("/cart");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      throw error;
    }
  };
};

export const addFavoriteToCart = (product: FavoriteProduct) => {
  return async (_dispatch: AppDispatch, getState: () => RootState) => {
    const uid = getState().users.uid;

    if (!uid) {
      console.error("ユーザーIDが見つかりません");
      return;
    } 

    const favoriteRef = doc(collection(db, "users", uid, "favorites"));

    const { id, productId, size, images, name, description, price } =
      product;

    const addedFavorite = {
      id,
      productId,
      size,
      images,
      name,
      description,
      price,
      added_at: serverTimestamp(),
    };

    try {
      await setDoc(favoriteRef, addedFavorite);
      // navigate("/favorite");
    } catch (error) {
      console.error("Error adding product to favorites:", error);
      throw error;
    }
  };
};

export const fetchProductsInCart = (
  products: ProductData[]
): ThunkAction<Promise<void>, RootState, unknown, ProductActions> => {
  return async (dispatch: Dispatch<ProductActions>) => {
    dispatch(fetchProductsAction(products));
  };
};

export const fetchOrdersHistory = (): ThunkAction<
  Promise<void>,
  RootState,
  unknown,
  UserActions
> => {
  return async (
    dispatch: Dispatch<UserActions>,
    getState: () => RootState
  ) => {
    const uid = getState().users.uid;
    const list: OrderData[] = [];

    try {
      const ordersRef = collection(db, "users", uid, "orders");
      const q = query(ordersRef, orderBy("updated_at", "desc"));
      const querySnapshot = await getDocs(q);
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const order: OrderData = {
          id: data.id,
          amount: data.amount,
          products: data.products,
          created_at: {
            seconds: data.created_at.seconds,
            nanoseconds: data.created_at.nanoseconds
          },
          updated_at: {
            seconds: data.updated_at.seconds,
            nanoseconds: data.updated_at.nanoseconds
          },
          payment_id: data.payment_id,
          shipping_date: data.shipping_date ? {
            seconds: data.shipping_date.seconds,
            nanoseconds: data.shipping_date.nanoseconds
          } : undefined
        };
        list.push(order);
      });
      
      dispatch(fetchOrdersHistoryAction(list));
    } catch (error) {
      console.error("注文履歴の取得に失敗しました:", error);
    }
  };
};
