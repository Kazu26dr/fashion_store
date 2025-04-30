import { useEffect, useState } from "react";
import { ProductCard } from "../components/Products";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/products/operations";
import { getProducts } from "../redux/products/selectors";
import { AppDispatch } from "../redux/store/store";
import { useLocation } from "react-router-dom";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Fab, TablePagination, useTheme, useMediaQuery } from "@mui/material";

const ITEMS_PER_PAGE = {
  xs: 10,
  sm: 10,
  md: 21
};

const ProductList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(getProducts);
  const [page, setPage] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'));
  const [rowsPerPage, setRowsPerPage] = useState(isMd ? ITEMS_PER_PAGE.md : ITEMS_PER_PAGE.xs);

  const query = useLocation().search;
  const gender = /^\?gender=/.test(query) ? query.split("?gender=")[1] : "";
  const category = /^\?category=/.test(query) ? query.split("?category=")[1] : "";

  useEffect(() => {
    dispatch(fetchProducts(gender, category));
  }, [gender, category, dispatch]);

  useEffect(() => {
    setRowsPerPage(isMd ? ITEMS_PER_PAGE.md : ITEMS_PER_PAGE.xs);
  }, [isMd]);

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
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setRowsPerPage(parseInt(event.target.value));
  };

  return (
    <section className="c-section-container">
      <div
        className="p-grid__row p-flex_start"
      >
        {currentProducts.length > 0 &&
          currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
      <div className="c-container-pagination">
        <TablePagination
          component="div"
          count={products.length}
          page={page - 1}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={isMd ? [ITEMS_PER_PAGE.md] : [ITEMS_PER_PAGE.xs]}
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        />
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
