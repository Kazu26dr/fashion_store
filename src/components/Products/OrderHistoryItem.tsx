import { CartProduct, OrderData } from "../../redux/users/types";
import Divider from "@mui/material/Divider";
import { TextDetail } from "../UIkit";
import OrderedProducts from "./OrderedProducts";

const datetimeToString = (timestamp: { seconds: number; nanoseconds: number }) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.getFullYear() + "-"
    + ("00" + (date.getMonth() + 1)).slice(-2) + "-"
    + ("00" + date.getDate()).slice(-2) + " "
    + ("00" + date.getHours()).slice(-2) + ":"
    + ("00" + date.getMinutes()).slice(-2) + ":"
    + ("00" + date.getSeconds()).slice(-2);
}

const dateToString = (timestamp: { seconds: number; nanoseconds: number }) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.getFullYear() + "-"
    + ("00" + (date.getMonth() + 1)).slice(-2) + "-"
    + ("00" + date.getDate()).slice(-2);
}

const OrderHistoryItem = (props: OrderData) => {
    const orderedDatetime = datetimeToString(props.updated_at);
    const shippingDate = dateToString(props.created_at);
    const price = "￥" + props.amount.toLocaleString();

    return (
        <div>
            <div className="module-spacer--small" />
            <TextDetail label="注文ID" value={props.id} />
            <TextDetail label="注文日時" value={orderedDatetime} />
            <TextDetail label="発送予定日" value={shippingDate} />
            <TextDetail label="注文金額" value={price} />
            {props.products.length > 0 && (
                <OrderedProducts products={props.products as CartProduct[]} />
            )}
            <div className="module-spacer--extra-extra-small" />
            <Divider />
        </div>
    )
};

export default OrderHistoryItem;

