import {
  Divider,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import { SerializableCartProduct } from "../../redux/users/types";
import { getUserId } from "../../redux/users/selectors";
import { db } from "../../firebase";
import { collection, deleteDoc, getDocs } from "firebase/firestore";
import NoImage from "../../assets/img/src/no_image.png";

const useStyles = makeStyles(() => ({
  list: {
    height: 128,
  },
  image: {
    objectFit: "cover",
    margin: 16,
    height: 96,
    width: 96,
  },
  text: {
    width: "100%",
  },
}));

const CartListItem = (props: { product: SerializableCartProduct }) => {
  const classes = useStyles();
  const uid = useSelector(getUserId);

  const image = props.product.images[0];
  const price = props.product.price.toLocaleString();
  const name = props.product.name;
  const size = props.product.size;

  const removeProductCart = async (id: string) => {
    const userCartRef = collection(db, "users", uid, "cart");
    const cartDocs = await getDocs(userCartRef);
    const cartDoc = cartDocs.docs.find((doc) => doc.id === id);
    if (cartDoc) {
      await deleteDoc(cartDoc.ref);
    }
  };
  return (
    <>
      <ListItem className={classes.list}>
        <ListItemAvatar> 
            {props.product.images.length === 0 ? (
                <img src={NoImage} alt="商品画像" className={classes.image} />
            ) : (
                <img src={image} alt="商品画像" className={classes.image} />
            )}
        </ListItemAvatar>
        <div className={classes.text}>
          <ListItemText primary={name} secondary={"サイズ：" + size} />
          <ListItemText primary={"￥" + price} />
        </div>
        <Tooltip title="delete" placement="bottom" arrow>
          <IconButton onClick={() => removeProductCart(props.product.cartId || props.product.id)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </ListItem>
      <Divider />
    </>
  );
};

export default CartListItem;
