import { Box, Button, List, Typography } from "@mui/material";
import { FavoriteProduct } from "../redux/users/types";
import { makeStyles } from "@mui/styles";
import { FavoriteItem } from "../components/Products";
import { useCallback, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Alert } from "../components/UIkit";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  orderList: {
    background: "none !important",
  },
});

const Favorite = () => {
  const classes = useStyles();
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const uid = auth.currentUser?.uid;
  const navigate = useNavigate();

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

  const goToShopping = useCallback(() => {
    navigate("/");
  }, [navigate]);

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
        <div className="c-container">
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              お気に入り商品がありません
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              素敵な商品を見つけて、ショッピングをお楽しみください。
            </Typography>
            <Button variant="contained" onClick={goToShopping}>
              ショッピングを始める
            </Button>
          </Box>
        </div>
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
