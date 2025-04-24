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
  Skeleton,
  Box
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../redux/store/store";
import { useDispatch } from "react-redux";
import { deleteProduct } from "../../redux/products/operations";
import NoImage from "../../assets/img/src/no_image.png";
import { getAuth } from "firebase/auth";
import { ProductCardProps } from "./types";

const ProductCard = ({ product }: ProductCardProps) => {
  const price = product.price.toLocaleString();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // 商品コンテンツの読み込み状態をシミュレート
  useEffect(() => {
    const timer = setTimeout(() => {
      setContentLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
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
        {!imageLoaded && (
          <Skeleton 
            variant="rectangular" 
            height={200}
            animation="wave"
            sx={{ 
              bgcolor: 'rgb(255, 252, 252)',
            }}
          />
        )}
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
            display: imageLoaded ? 'block' : 'none',
          }}
          onClick={() => navigate(`/product/${product.id}`)}
          onLoad={handleImageLoad}
        />
        <CardContent
          sx={{
            padding: 2,
            "&:last-child": {
              paddingBottom: 2,
            },
          }}
        >
          {!contentLoaded ? (
            <Box>
              <Skeleton 
                variant="text" 
                height={28} 
                animation="wave"
                sx={{ bgcolor: 'rgb(255, 252, 252)' }}
              />
              <Skeleton 
                variant="text" 
                width="60%" 
                height={32} 
                animation="wave"
                sx={{ bgcolor: 'rgb(255, 252, 252)', mt: 1 }}
              />
            </Box>
          ) : (
            <>
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
            </>
          )}
          {isOwner && contentLoaded && (
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
