import { List, Typography, Box, Button } from "@mui/material";
import { getProductsInCart } from "../redux/users/selectors";
import { useSelector } from "react-redux";
import CartListItem from "../components/Products/CartListItem";
import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "../components/UIkit";
import { useCallback } from "react";

const CartList = () => {
  const productsInCart = useSelector(getProductsInCart);
  const navigate = useNavigate();

  const goToOrder = useCallback(() => {
    navigate("/order/confirm");
  }, [navigate]);

  const goToShopping = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <section className="c-section-container">
      <h2 className="u-text__headline">ショッピングカート</h2>
      <div className="c-container">
        {productsInCart.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              カートに商品がありません
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              素敵な商品を見つけて、ショッピングをお楽しみください。
            </Typography>
            <Button variant="contained" onClick={goToShopping}>ショッピングを始める</Button>
          </Box>
        ) : (
          <>
            <List>
              {productsInCart.map((product) => (
                <CartListItem key={product.cartId} product={product} />
              ))}
            </List>
            <div className="module-spacer--medium"></div>
            <div className="p-grid__column">
              <PrimaryButton label={"レジへ進む"} onClick={goToOrder} />
              <div className="module-spacer--small"></div>
              <PrimaryButton label={"ショッピングを続ける"} onClick={goToShopping} />
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CartList;