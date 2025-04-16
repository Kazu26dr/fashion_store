import { CartProduct } from "../../redux/users/types";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import PrimaryButton from "../UIkit/PrimaryButton";
import { useNavigate } from "react-router-dom";
import NoImage from "../../assets/img/src/no_image.png";

const useStyles = makeStyles({
  list: {
    background: "#fff",
    height: "auto",
    padding: "0 !important",
  },
  image: {
    objectFit: "cover",
    margin: "8px 16px 8px 0",
    height: 96,
    width: 96,
  },
  text: {
    width: "100%",
  },
});

const OrderedProducts = (props: { products: CartProduct[] }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  
  const goToProductDetail = (id: string) => {
    navigate(`/product/${id}`);
  };

  return (
    <List>
      {props.products.map((product) => (
        <ListItem className={classes.list} key={product.id}>
          <ListItemAvatar>
            <img
              className={classes.image}
              src={product.images[0] || NoImage}
              alt="商品画像"
            />
          </ListItemAvatar>
          <div className={classes.text}>
            <ListItemText
              primary={product.name}
              secondary={"サイズ：" + product.size}
            />
            <ListItemText primary={"￥" + product.price.toLocaleString()} />
          </div>
          <PrimaryButton label="商品の詳細を見る" onClick={() => goToProductDetail(product.id)}/>
          {props.products.length > 1 && <Divider />}
        </ListItem>
      ))}
    </List>
  );
};

export default OrderedProducts;
