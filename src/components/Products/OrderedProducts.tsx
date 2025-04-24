import { CartProduct } from "../../redux/users/types";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Skeleton
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import PrimaryButton from "../UIkit/PrimaryButton";
import { useNavigate } from "react-router-dom";
import NoImage from "../../assets/img/src/no_image.png";
import { useState } from "react";

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
  skeleton: {
    margin: "8px 16px 8px 0",
    height: 96,
    width: 96,
  }
});

const OrderedProducts = (props: { products: CartProduct[] }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>({});
  
  const goToProductDetail = (id: string) => {
    navigate(`/product/${id}`);
  };

  const handleImageLoad = (productId: string, index: number) => {
    setLoadedImages(prev => ({
      ...prev,
      [`${productId}-${index}`]: true
    }));
  };

  return (
    <List>
      {props.products.map((product, index) => (
        <ListItem className={classes.list} key={`${product.id}-${index}`}>
          <ListItemAvatar>
            {!loadedImages[`${product.id}-${index}`] && (
              <Skeleton 
                variant="rectangular" 
                className={classes.skeleton}
                animation="wave"
                sx={{ bgcolor: 'rgb(255, 252, 252)' }} 
              />
            )}
            <img
              className={classes.image}
              src={product.images[0] || NoImage}
              alt="商品画像"
              style={{ display: loadedImages[`${product.id}-${index}`] ? 'block' : 'none' }}
              onLoad={() => handleImageLoad(product.id, index)}
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
