import { useEffect } from "react";
import { ProductCard } from "../components/Products";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/products/operations";
import { getProducts } from "../redux/products/selectors";
import { AppDispatch } from "../redux/store/store";
import { useLocation } from "react-router-dom";

const Search = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(getProducts);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword") || "";

  useEffect(() => {
    if (keyword) {
      dispatch(fetchProducts("", "", keyword));
    }
  }, [keyword, dispatch]);

  return (
    <section className="c-section-container">
      <h2 className="u-text__headline u-text-center">検索結果: {keyword}</h2>
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
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="u-text__searchnone u-text-center" style={{ width: "100%", marginTop: "2rem" }}>
            検索結果が見つかりませんでした。
          </p>
        )}
      </div>
    </section>
  );
};

export default Search; 