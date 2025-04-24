import { ListItemText, ListItem, ListItemAvatar } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FavoriteProduct } from "../../redux/users/types";
import PrimaryButton from "../UIkit/PrimaryButton";
import { useNavigate } from "react-router-dom";
import NoImage from "../../assets/img/src/no_image.png";
import DeleteButton from "../UIkit/DeleteButton";
import { deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { doc } from "firebase/firestore";
import { auth } from "../../firebase";
import { useState } from "react";
import { FavoriteItemProps } from "./types";

const useStyles = makeStyles({
  list: {
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    padding: "1rem",
    backgroundColor: "#ffffffe0",
    width: "100%",
    maxWidth: "none",
    boxSizing: "border-box",
    height: "auto",
    display: "flex",
    flexDirection: "column",
    marginBottom: "16px",
    "@media (min-width: 768px)": {
      flexDirection: "row",
    },
  },
  image: {
    objectFit: "cover",
    margin: "8px 16px 8px 0",
    height: 128,
    width: 128,
    "@media (max-width: 767px)": {
        height: 186,
        width: 186,
    },
  },
  text: {
    width: "100%",
    marginBottom: "16px",
    "@media (min-width: 768px)": {
      marginBottom: 0,
    },
  },
  buttonContainer: {
    gap: "16px",
    maxWidth: "350px",
    display: "flex",
    justifyContent: "flex-end",
    "@media (max-width: 767px)": {
      justifyContent: "center",
      flexDirection: "column",
    },
  },
});

const FavoriteItem = (props: FavoriteItemProps) => {
  const classes = useStyles();
  const navigate = useNavigate();
  
  const goToProductDetail = (id: string) => {
    navigate(`/product/${id}`);
  };

  const deleteFavorite = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    try {
      const favoriteRef = doc(db, "users", uid, "favorites", props.id);
      await deleteDoc(favoriteRef);
      props.onDelete(props.id);
    } catch (error) {
      console.error("お気に入りの削除に失敗しました:", error);
    }
  };

  return (
    <ListItem className={classes.list}>
      <ListItemAvatar>
        <img
          className={classes.image}
          src={props.images[0] || NoImage}
          alt="商品画像"
        />
      </ListItemAvatar>
      <div className={classes.text}>
        <ListItemText
          primary={props.name}
          secondary={"サイズ：" + props.size}
        />
        <ListItemText primary={"￥" + props.price.toLocaleString()} />
      </div>
      <div className={classes.buttonContainer}>
        <PrimaryButton label="商品の詳細を見る" onClick={() => goToProductDetail(props.productId)}/>
        <DeleteButton label="お気に入り解除" onClick={deleteFavorite}/>
      </div>
    </ListItem>
  );
};

export default FavoriteItem;


