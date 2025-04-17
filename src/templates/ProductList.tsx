import { useEffect, useState } from "react";
import { ProductCard } from "../components/Products";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/products/operations";
import { getProducts } from "../redux/products/selectors";
import { AppDispatch } from "../redux/store/store";
import { useLocation } from "react-router-dom";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Fab } from "@mui/material";

const NUM_OF_ITEMS = 9; // 1ページあたりの商品数

const ProductList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(getProducts);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const query = useLocation().search;
  const gender = /^\?gender=/.test(query) ? query.split("?gender=")[1] : "";
  const category = /^\?category=/.test(query) ? query.split("?category=")[1] : "";

  useEffect(() => {
    // 総ページ数を計算
    const totalPages = Math.ceil(products.length / NUM_OF_ITEMS);
    setLastPage(totalPages);
  }, [products]);

  useEffect(() => {
    dispatch(fetchProducts(gender, category));
  }, [gender, category, dispatch]);

  // スクロールイベントの処理をシンプルに修正
  useEffect(() => {
    const mainContainer = document.querySelector('.c-main');
    if (!mainContainer) return;

    const onScroll = () => {
      const scrolled = mainContainer.scrollTop;
      setShowScrollTop(scrolled > 0);
    };

    // 初期状態のチェック
    onScroll();

    // イベントリスナーの登録
    mainContainer.addEventListener('scroll', onScroll);

    // クリーンアップ
    return () => mainContainer.removeEventListener('scroll', onScroll);
  }, []);

  const onPrev = () => {
    if (page <= 1) return;
    setPage(page - 1);
  };

  const onNext = () => {
    if (page >= lastPage) return;
    setPage(page + 1);
  };

  const scrollToTop = () => {
    console.log("scrollToTop");
    try {
      const mainContainer = document.querySelector('.c-main');
      if (mainContainer) {
        mainContainer.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }
    } catch {
      // スムーススクロールがサポートされていない場合のフォールバック
      const mainContainer = document.querySelector('.c-main');
      if (mainContainer) {
        mainContainer.scrollTop = 0;
      }
    }
  };

  // 現在のページの商品を取得
  const currentProducts = products.slice(
    (page - 1) * NUM_OF_ITEMS,
    page * NUM_OF_ITEMS
  );

  return (
    <section className="c-section-container">
      <div
        className="p-grid__row"
        style={{
          display: "flex",
          flexWrap: "wrap",
          margin: "-8px",
          width: "calc(100% + 16px)",
          justifyContent: "flex-start",
        }}
      >
        {currentProducts.length > 0 &&
          currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
      <div className="pagination" style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          onClick={onPrev}
          disabled={page <= 1}
          style={{
            marginRight: "10px",
            padding: "8px 16px",
            cursor: page <= 1 ? "not-allowed" : "pointer",
            opacity: page <= 1 ? 0.5 : 1,
            border: "none",
            borderRadius: "10px",
          }}
        >
          Prev
        </button>
        <span style={{ margin: "0 10px", color: "#000", fontWeight: "bold" }}>
          {page} / {lastPage}
        </span>
        <button
          onClick={onNext}
          disabled={page >= lastPage}
          style={{
            marginLeft: "10px",
            padding: "8px 16px",
            cursor: page >= lastPage ? "not-allowed" : "pointer",
            opacity: page >= lastPage ? 0.5 : 1,
            border: "none",
            borderRadius: "10px",
          }}
        >
          Next
        </button>
      </div>

      <Fab
        color="primary"
        size="medium"
        onClick={scrollToTop}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          zIndex: 9999,
          backgroundColor: '#666',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '8px 16px',
          opacity: showScrollTop ? 1 : 0,
          visibility: showScrollTop ? 'visible' : 'hidden',
          transition: 'opacity 0.3s, visibility 0.3s',
          pointerEvents: showScrollTop ? 'auto' : 'none',
          cursor: 'pointer',
        }}
        className="scroll-top-button"
        aria-label="トップに戻る"
      >
        <ArrowUpwardIcon />
      </Fab>
    </section>
  );
};

export default ProductList;
