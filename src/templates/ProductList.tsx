import { useEffect } from "react";
import { ProductCard } from "../components/Products";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/products/operations";
import { getProducts } from "../redux/products/selectors";
import { AppDispatch } from "../redux/store/store";
import { useLocation } from "react-router-dom";

const ProductList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(getProducts);

  const query = useLocation().search;
  const gender = /^\?gender=/.test(query) ? query.split("?gender=")[1] : "";
  const category = /^\?category=/.test(query) ? query.split("?category=")[1] : "";

  useEffect(() => {
    dispatch(fetchProducts(gender, category));
  }, [gender, category, dispatch]);


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
        {products.length > 0 &&
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
    </section>
  );
};

export default ProductList;
