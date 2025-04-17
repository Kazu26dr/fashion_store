import { useCallback, useEffect, useState } from "react";
import { ProductData } from "../redux/products/types";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db, firebaseTimestamp } from "../firebase";
import { styled } from "@mui/system";
import HTMLReactParser from "html-react-parser";
import { ImageSwiper, SizeTable } from "../components/Products";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store/store";
import { addFavoriteToCart, addProductToCart } from "../redux/users/operations";
import { Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FavoriteProduct } from "../redux/users/types";

type CartProduct = ProductData & {
  added_at: Timestamp;
  size: string;
  quantity: number;
  productId: string;
};

// スタイル付きコンポーネントを作成
const SliderBox = styled("div")(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    margin: "0 auto 20px auto",
    height: "250px",
    width: "320px",
  },
  [theme.breakpoints.up("sm")]: {
    margin: "0 auto",
    height: "350px",
    width: "400px",
  },
}));

const DetailBox = styled("div")(({ theme }) => ({
  textAlign: "left",
  [theme.breakpoints.down("sm")]: {
    margin: "0 auto 16px auto",
    height: "auto",
    width: "320px",
  },
  [theme.breakpoints.up("sm")]: {
    margin: "0 auto",
    height: "auto",
    width: "400px",
  },
}));

const Price = styled("p")({
  fontSize: "16px",
  fontWeight: "bold",
});

const returnCodeToBr = (text: string) => {
  if (text === "") {
    return "";
  } else {
    return HTMLReactParser(text.replace(/\n/g, "<br />"));
  }
};

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const auth = getAuth();

  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const addProduct = useCallback(
    (selectedSize: string) => {
      if (!product) return;
      
      const timestamp = firebaseTimestamp.now();
      const cartProduct: CartProduct = {
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        gender: product.gender,
        price: product.price,
        images: product.images,
        sizes: product.sizes,
        timestamp: product.timestamp,
        createdAt: product.createdAt,
        updated_at: product.updated_at,
        productId: product.id,
        size: selectedSize,
        quantity: 1,
        added_at: timestamp,
        user_id: auth.currentUser?.uid || "",
      };
      
      dispatch(addProductToCart(cartProduct));
    },
    [dispatch, product]
  );

  const addFavorite = useCallback(
    (selectedSize: string) => {
      if (!product) return;

      const timestamp = firebaseTimestamp.now();
      const favoriteProduct: FavoriteProduct = {
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        gender: product.gender,
        price: product.price,
        images: product.images, 
        sizes: product.sizes,
        timestamp: product.timestamp,
        createdAt: product.createdAt,
        updated_at: product.updated_at,
        productId: product.id,
        size: selectedSize, 
        user_id: auth.currentUser?.uid || "",
        added_at: timestamp,
      };

      dispatch(addFavoriteToCart(favoriteProduct));
    },
    [dispatch, product]
  );

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!id) {
          setError("商品IDが見つかりません");
          setLoading(false);
          return;
        }

        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct(docSnap.data() as ProductData);
        } else {
          setError("商品が見つかりません");
        }
      } catch (err) {
        console.error("商品の取得中にエラーが発生しました:", err);
        setError("商品の取得中にエラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const transformedSizes = product?.sizes.map(size => ({
    ...size,
    id: product.id,
    productId: product.id,
    images: product.images,
    name: product.name,
    description: product.description,
    price: product.price
  })) || [];

  if (loading) {
    return <div className="c-section-wrapin">読み込み中...</div>;
  }

  if (error) {
    return <div className="c-section-wrapin">エラー: {error}</div>;
  }

  return (
    <section className="c-section-wrapin">
      <div className="c-container" style={{ marginTop: 20 }}>
        {product && (
          <div className="p-grid__row">
            <SliderBox>
              <ImageSwiper images={product.images} />
            </SliderBox>
            <DetailBox>
              <h2 className="u-product-detail__headline">{product.name}</h2>
              <Price>価格：{product.price.toLocaleString()}円</Price>
              <div className="module-spacer--small" />
              <SizeTable addProduct={addProduct} addFavorite={addFavorite} sizes={transformedSizes} />
              <div className="module-spacer--small" />
              <p>{returnCodeToBr(product.description)}</p>
            </DetailBox>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductDetail;
