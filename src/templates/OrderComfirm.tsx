import { Box, Divider, List, Typography, styled, CircularProgress, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import { getProductsInCart } from "../redux/users/selectors";
import { CartListItem } from "../components/Products";
import { PrimaryButton, TextDetail } from "../components/UIkit";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const DetailBox = styled("div")(({ theme }) => ({
  margin: "0 auto",
  [theme.breakpoints.down("sm")]: {
    width: "320px",
  },
  [theme.breakpoints.up("sm")]: {
    width: "512px",
  },
}));

const OrderBox = styled("div")({
  border: "1px solid rgba(0, 0, 0, 0.2)",
  borderRadius: "4px",
  boxShadow: "0 4px 2px 2px rgba(0, 0, 0, 0.2)",
  height: "256px",
  margin: "24px auto 16px auto",
  padding: "16px",
  width: "288px",
});

const EmptyCartBox = styled(Box)({
  textAlign: "center",
  padding: "32px 16px",
  margin: "24px auto",
  border: "1px solid rgba(0, 0, 0, 0.1)",
  borderRadius: "4px",
  maxWidth: "600px",
});

const OrderComfirm = () => {
  const selector = useSelector((state: RootState) => state);
  const productsInCart = getProductsInCart(selector);
  const navigate = useNavigate();
  const [isOrdering, setIsOrdering] = useState(false);

  const subTotal = useMemo(() => {
    return productsInCart.reduce((sum, product) => (sum += product.price), 0);
  }, [productsInCart]);

  const shippingFee = subTotal >= 10000 ? 0 : 210;

  const tax = useMemo(() => {
    return Math.floor((subTotal + shippingFee) * 0.1);
  }, [subTotal, shippingFee]);

  const total = useMemo(() => {
    return subTotal + shippingFee + tax;
  }, [subTotal, shippingFee, tax]);

  const order = useCallback(async () => {
    setIsOrdering(true);
    try {
      navigate("/order/payment");
    } catch (error) {
      console.error('Error navigating to payment:', error);
      alert('決済画面への遷移に失敗しました。');
      setIsOrdering(false);
    }
  }, [navigate]);

  const goToCart = useCallback(() => {
    navigate("/cart");
  }, [navigate]);

  const goToShopping = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <section className="c-section-wrapin">
      <h2 className="u-text__headline">注文確認</h2>
      <div className="c-container">
        {productsInCart.length === 0 && !isOrdering ? (
          <EmptyCartBox>
            <Typography variant="h6" sx={{ mb: 2 }}>
              カートに商品がありません
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              注文確認を行うには、カートに商品を追加してください。
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: "240px", margin: "0 auto", border: "none" }}>
              <Button variant="contained" onClick={goToCart}>カートに戻る</Button>
              <Button variant="contained" onClick={goToShopping}>ショッピングを続ける</Button>
            </Box>
          </EmptyCartBox>
        ) : (
          <div className="p-grid__row">
            <DetailBox>
              <List>
                {productsInCart.map((product, index: number) => (
                  <CartListItem
                    key={`${product.cartId || product.id}-${index}`}
                    product={product}
                  />
                ))}
              </List>
            </DetailBox>
            <OrderBox style={{ backgroundColor: "#fff" }}>
              <TextDetail
                label="商品合計"
                value={"￥" + subTotal.toLocaleString()}
              />
              <TextDetail
                label="送料"
                value={"￥" + shippingFee.toLocaleString()}
              />
              <TextDetail label="消費税" value={"￥" + tax.toLocaleString()} />
              <Divider />
              <TextDetail
                label="合計（税込）"
                value={"￥" + total.toLocaleString()}
              />
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                {isOrdering ? (
                  <CircularProgress />
                ) : (
                  <PrimaryButton label={"注文する"} onClick={order} />
                )}
              </Box>
            </OrderBox>
          </div>
        )}
      </div>
    </section>
  );
};

export default OrderComfirm;