import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import { useEffect } from "react";
import { List } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { fetchOrdersHistory } from "../redux/users/operations";
import { OrderHistoryItem } from "../components/Products";
import { OrderData } from "../redux/users/types";
import { AppDispatch } from "../redux/store/store";

const useStyles = makeStyles({
  orderList: {
    background: "#fff",
    margin: "0 auto !important",
    padding: "32px !important",
    width: "100%",
    "@media (min-width: 960px)": {
      width: 768,
    },
  },
});

const OrderHistory = () => {
  const orders = useSelector((state: RootState) => state.users.orders);
  const classes = useStyles();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchOrdersHistory());
  }, [dispatch]);

  return (
    <section className="c-section-wrapin">
      <h2 className="u-text__headline u-text-center">注文履歴</h2>
      <List className={classes.orderList}>
        {orders.length > 0 ? (
          orders.map((order: OrderData) => (
            <OrderHistoryItem key={order.id} {...order} />
          ))
        ) : (
          <p>注文履歴がありません</p>
        )}
      </List>
    </section>
  );
};

export default OrderHistory;
