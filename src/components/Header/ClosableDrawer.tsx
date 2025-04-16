import {
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { styled } from "@mui/material/styles";
import { TextInput } from "../UIkit";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import HistoryIcon from "@mui/icons-material/History";
import PersonIcon from "@mui/icons-material/Person";
import { signOut } from "../../redux/users/operations";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store/store";
import { getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import { collection } from "firebase/firestore";

const DrawerComponent = styled("nav")(({ theme }) => ({
  [theme.breakpoints.up("sm")]: {
    flexShrink: 0,
    width: 256,
  },
}));

const DrawerPaper = styled("div")({
  width: 256,
});

const SearchField = styled("div")({
  alignItems: "center",
  display: "flex",
  marginLeft: "32px",
});

const ClosableDrawer = (props: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  container: HTMLElement | null;
  onSearch: (keyword: string) => void;
  onClose: () => void;
}) => {
  const { container } = props;
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const inputKeyword = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(event.target.value);
    },
    []
  );

  const selectMenu = (_e: React.MouseEvent<HTMLDivElement>, path: string) => {
    navigate(path);
    props.onClose();
  };

  const [filters, setFilters] = useState([
    {
      func: selectMenu,
      label: "All",
      id: "all",
      value: "/",
    },
    {
      func: selectMenu,
      label: "Men",
      id: "male",
      value: "/?gender=male",
    },
    {
      func: selectMenu,
      label: "Women",
      id: "female",
      value: "/?gender=female",
    },
  ]);

  const menus = [
    {
      func: selectMenu,
      label: "商品登録",
      icon: <AddCircleIcon />,
      id: "register",
      value: "/product/edit",
    },
    {
      func: selectMenu,
      label: "注文履歴",
      icon: <HistoryIcon />,
      id: "history",
      value: "/order/history",
    },
    {
      func: selectMenu,
      label: "プロフィール",
      icon: <PersonIcon />,
      id: "profile",
      value: "/profile",
    },
    {
      func: selectMenu,
      label: "お気に入り",
      icon: <FavoriteBorderIcon />,
      id: "favorite",
      value: "/favorite",
    },
  ] as const;

  const handleSearch = () => {
    if (keyword.trim() !== "") {
      props.onSearch(keyword);
      props.onClose();
      setKeyword("");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesRef = collection(db, "categories");
      const q = query(categoriesRef, orderBy("order", "asc"));
      const snapshot = await getDocs(q);
      const categoriesData = snapshot.docs.map((doc) => ({
        func: selectMenu,
        label: doc.data().name,
        id: doc.id,
        value: `/?category=${doc.data().id}`,
      }));
      setFilters((prevFilters) => [...prevFilters, ...categoriesData]);
    };
    fetchCategories();
  }, []);

  return (
    <DrawerComponent>
      <Drawer
        container={container}
        variant="temporary"
        anchor="right"
        open={props.open}
        onClose={props.onClose}
        PaperProps={{
          component: DrawerPaper,
        }}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <SearchField>
          <TextInput
            label="Search"
            fullWidth={false}
            placeholder="Search"
            multiline={false}
            rows={1}
            value={keyword}
            type="text"
            required={false}
            onChange={inputKeyword}
            onKeyPress={handleKeyPress}
          />
          <IconButton onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
        </SearchField>
        <Divider />
        <List>
          {menus.map((menu) => (
            <ListItem key={menu.id} disablePadding>
              <ListItemButton onClick={(e) => menu.func(e, menu.value)}>
                <ListItemIcon>{menu.icon}</ListItemIcon>
                <ListItemText primary={menu.label} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem key="logout" disablePadding>
            <ListItemButton
              onClick={() => {
                dispatch(signOut({ navigate }));
                props.onClose();
              }}
            >
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
          {filters.map((filter) => (
            <ListItem key={filter.id} disablePadding>
              <ListItemButton onClick={(e) => filter.func(e, filter.value)}>
                <ListItemText primary={filter.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </DrawerComponent>
  );
};

export default ClosableDrawer;
