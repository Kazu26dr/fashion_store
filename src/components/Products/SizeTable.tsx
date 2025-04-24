import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Alert } from "../UIkit";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { SizeTableProps } from "./types";

const useStyles = makeStyles({
  iconCell: {
    height: 48,
    width: 48,
  },
  checkIcon: {
    float: "right",
  },
});

const SizeTable = (props: { sizes: SizeTableProps[], addProduct: (size: string) => void, addFavorite: (size: string) => void }) => {
  const classes = useStyles();
  const sizes = props.sizes;
  const [favoriteSizes, setFavoriteSizes] = useState<{[size: string]: boolean}>({});
  
  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const initialFavorites: {[size: string]: boolean} = {};
      for (const size of sizes) {
        const favoriteRef = doc(db, "users", uid, "favorites", `${size.productId}_${size.size}`);
        const favoriteDoc = await getDoc(favoriteRef);
        initialFavorites[size.size] = favoriteDoc.exists();
      }
      setFavoriteSizes(initialFavorites);
    };

    fetchFavoriteStatus();
  }, [sizes]);

  const handleFavoriteToggle = async (size: string) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const newFavoriteSizes = {
      ...favoriteSizes,
      [size]: !favoriteSizes[size]
    };
    
    setFavoriteSizes(newFavoriteSizes);
    
    const sizeData = sizes.find(s => s.size === size);
    if (!sizeData || !sizeData.productId) {
      console.error('商品情報が不足しています');
      return;
    }

    const favoriteRef = doc(db, "users", uid, "favorites", `${sizeData.productId}_${size}`);
    if (newFavoriteSizes[size]) {
      const addedFavorite = {
        id: sizeData.productId,
        productId: sizeData.productId,
        size: size,
        images: sizeData.images || [],
        name: sizeData.name || '',
        description: sizeData.description || '',
        price: sizeData.price || 0,
        added_at: serverTimestamp(),
      };
      await setDoc(favoriteRef, addedFavorite);
    } else {
      await deleteDoc(favoriteRef);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {sizes.length > 0 &&
            sizes.map((size) => (
              <TableRow key={size.size}>
                <TableCell component="th" scope="row">
                  {size.size}
                </TableCell>
                <TableCell>
                  残り{size.quantity}点
                </TableCell>
                <TableCell className={classes.iconCell}>
                  {size.quantity > 0 ? (
                    <IconButton onClick={() => props.addProduct(size.size)}>
                      <ShoppingCartIcon />
                    </IconButton>
                  ) : (
                    <div>
                     売切
                    </div>
                  )}
                </TableCell>
                <TableCell className={classes.iconCell}>
                  <IconButton onClick={() => handleFavoriteToggle(size.size)}>
                    {favoriteSizes[size.size] ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <div className="u-text-center">
        {
          Object.values(favoriteSizes).some((isFavorite) => isFavorite) && (
            <Alert severity="info" message="お気に入りに追加済み" />
          )
        }
      </div>
    </TableContainer>
  );
};

export default SizeTable;