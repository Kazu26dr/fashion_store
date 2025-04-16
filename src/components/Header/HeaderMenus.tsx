import { IconButton, Badge, Tooltip } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch, useSelector } from "react-redux";
import { getProductsInCart } from "../../redux/users/selectors";
import { getUserId } from "../../redux/users/selectors";
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import { AppDispatch } from "../../redux/store/store";
import { fetchProductsInCartAction } from "../../redux/users/actions";
import { CartProduct, SerializableCartProduct } from "../../redux/users/types";
import { Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { HeaderMenusProps } from "./type";

const HeaderMenus = (props: HeaderMenusProps) => {
  const navigate = useNavigate();
  const productsInCart = useSelector(getProductsInCart);
  const uid = useSelector(getUserId);
  const dispatch = useDispatch<AppDispatch>();
  const [isInitialized, setIsInitialized] = useState(false);

  // FirebaseのCartProductをシリアライズ可能な形式に変換するヘルパー関数
  const convertToSerializableProduct = (
    product: CartProduct,
    docId: string
  ): SerializableCartProduct => {
    const serializedProduct: SerializableCartProduct = {
      ...product,
      cartId: docId,
    };

    // added_atがTimestampの場合、シリアライズ可能な形式に変換
    if (product.added_at && product.added_at instanceof Timestamp) {
      serializedProduct.added_at = {
        seconds: product.added_at.seconds,
        nanoseconds: product.added_at.nanoseconds,
      };
    }

    return serializedProduct;
  };

  // すべてのカート商品を取得して処理する関数
  const processAllCartProducts = (snapshot: QuerySnapshot<DocumentData>) => {
    // すべてのドキュメントを処理
    const allProducts: SerializableCartProduct[] = snapshot.docs.map((doc) => {
      const product = doc.data() as CartProduct;
      return convertToSerializableProduct(product, doc.id);
    });

    // すべての商品をストアに保存
    dispatch(fetchProductsInCartAction(allProducts));
    setIsInitialized(true);
  };

  // 初期化時にカート内の全商品を取得
  useEffect(() => {
    if (!uid || isInitialized) return;

    const fetchCartItems = async () => {
      try {
        const userCartRef = collection(db, "users", uid, "cart");
        const cartDocs = await getDocs(userCartRef);

        if (!cartDocs.empty) {
          const allProducts: SerializableCartProduct[] = cartDocs.docs.map(
            (doc) => {
              const product = doc.data() as CartProduct;
              return convertToSerializableProduct(product, doc.id);
            }
          );

          dispatch(fetchProductsInCartAction(allProducts));
        }
        setIsInitialized(true);
      } catch (error) {
        console.error("カートアイテムの取得に失敗しました:", error);
        setIsInitialized(true);
      }
    };

    fetchCartItems();
  }, [uid, dispatch, isInitialized]);

  // リアルタイム更新をリッスン
  useEffect(() => {
    if (!uid) return;

    const userCartRef = collection(db, "users", uid, "cart");
    const unsubscribe = onSnapshot(userCartRef, (snapshots) => {
      if (!isInitialized) {
        processAllCartProducts(snapshots);
        return;
      }

      // 変更のみを処理
      const changes = snapshots.docChanges();
      if (changes.length === 0) return;

      // 現在のカート内容をコピー
      let updatedProducts = [...productsInCart];
      let shouldDispatch = false;

      changes.forEach((change) => {
        const product = change.doc.data() as CartProduct;
        const serializedProduct = convertToSerializableProduct(
          product,
          change.doc.id
        );

        switch (change.type) {
          case "added": {
            // すでに存在するか確認（IDで）
            const existingIndex = updatedProducts.findIndex(
              (p) => p.cartId === change.doc.id
            );
            if (existingIndex === -1) {
              updatedProducts = [...updatedProducts, serializedProduct];
              shouldDispatch = true;
            }
            break;
          }
          case "modified": {
            const index = updatedProducts.findIndex(
              (p) => p.cartId === change.doc.id
            );
            if (index !== -1) {
              updatedProducts = [
                ...updatedProducts.slice(0, index),
                serializedProduct,
                ...updatedProducts.slice(index + 1),
              ];
              shouldDispatch = true;
            }
            break;
          }
          case "removed": {
            const previousLength = updatedProducts.length;
            updatedProducts = updatedProducts.filter(
              (p) => p.cartId !== change.doc.id
            );
            if (previousLength !== updatedProducts.length) {
              shouldDispatch = true;
            }
            break;
          }
        }
      });

      // 変更があった場合のみdispatch
      if (shouldDispatch) {
        dispatch(fetchProductsInCartAction(updatedProducts));
      }
    });

    return () => unsubscribe();
  }, [uid, dispatch, productsInCart, isInitialized]);

  return (
    <>
      <Tooltip title="cart" arrow placement="bottom">
        <IconButton onClick={() => navigate("/cart")}>
          <Badge badgeContent={productsInCart.length} color="primary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Tooltip title="favorite" placement="bottom" arrow>
        <IconButton onClick={() => navigate("/favorite")}>
          <FavoriteBorderIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="menu" placement="bottom" arrow>
        <IconButton onClick={(e) => props.handleDrawerToggle(e)}>
          <MenuIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default HeaderMenus;
