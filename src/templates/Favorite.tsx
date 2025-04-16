import { List } from "@mui/material";
import { FavoriteProduct } from "../redux/users/types";
import { makeStyles } from "@mui/styles";
import { FavoriteItem } from "../components/Products";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Alert } from "../components/UIkit";

const useStyles = makeStyles({
  orderList: {
    background: "none !important",
  },
});

const Favorite = () => {
  const classes = useStyles();
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const uid = auth.currentUser?.uid;

  const fetchFavoriteData = async () => {
    if (!uid) return;
    const collectionRef = collection(db, "users", uid, "favorites");
    const snapshot = await getDocs(collectionRef);
    const data: FavoriteProduct[] = [];
    snapshot.forEach((doc) => {
      const favorite = doc.data() as FavoriteProduct;
      data.push({ ...favorite, id: `${favorite.id}_${favorite.size}` });
    });
    setFavorites(data);
  };

  useEffect(() => {
    fetchFavoriteData();
  }, []);

  const handleDelete = (id: string) => {
    setFavorites(favorites.filter((favorite) => favorite.id !== id));
  };

  return (
    <section className="c-section-container">
      <h2 className="u-text__headline u-text-center">お気に入り商品</h2>
      {favorites.length > 0 ? (
        <List className={classes.orderList}>
          {favorites.map((favorite: FavoriteProduct) => (
            <FavoriteItem
              key={favorite.id}
              {...favorite}
              onDelete={handleDelete}
            />
          ))}
        </List>
      ) : (
        <p className="u-text-center">お気に入り商品がありません</p>
      )}
      <div className="u-text-center">
        {favorites.length > 0 && (
          <Alert severity="info" message="お気に入りに追加済み " />
        )}
      </div>
    </section>
  );
};

export default Favorite;
