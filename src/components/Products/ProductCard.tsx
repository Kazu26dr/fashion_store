import { ProductData } from "../../redux/products/types";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../redux/store/store";
import { useDispatch } from "react-redux";
import { deleteProduct } from "../../redux/products/operations";
import NoImage from "../../assets/img/src/no_image.png";
import { getAuth } from "firebase/auth";

type ProductCardProps = {
  product: ProductData;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const price = product.price.toLocaleString();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isOwner = currentUser && currentUser.uid === product.user_id;
  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 576,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Card
        sx={{
          margin: 1,
          width: {
            xs: "calc(100% - 16px)",
            sm: "calc(50% - 16px)",
            md: "calc(33.333% - 16px)",
          },
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardMedia
          component="img"
          image={
            product.images && product.images.length > 0
              ? product.images[0]
              : NoImage
          }
          alt={product.name}
          sx={{
            height: 200,
            objectFit: "cover",
            cursor: "pointer",
            loading: "lazy",
            transform: "translateZ(0)",
            willChange: "transform",
          }}
          onClick={() => navigate(`/product/${product.id}`)}
        />
        <CardContent
          sx={{
            padding: 2,
            "&:last-child": {
              paddingBottom: 2,
            },
          }}
        >
          <Typography
            component="h3"
            sx={{
              fontSize: "1rem",
              fontWeight: 500,
              marginBottom: 1,
              color: "text.primary",
            }}
          >
            {product.name}
          </Typography>
          <Typography
            component="p"
            sx={{
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "error.main",
            }}
          >
            ￥{price}
          </Typography>
          {isOwner && (
            <IconButton
              style={{ marginLeft: "auto", display: "flex" }}
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
          )}
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => navigate(`/product/edit/${product.id}`)}>
              編集する
            </MenuItem>
            <MenuItem onClick={() => dispatch(deleteProduct(product.id))}>
              削除する
            </MenuItem>
          </Menu>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default ProductCard;
