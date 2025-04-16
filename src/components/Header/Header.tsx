import { AppBar, Toolbar } from "@mui/material";
import logo from "../../assets/img/icons/logo.jpg";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HeaderMenus, ClosableDrawer } from "./index";
import { RootState } from "../../redux/store/store";
import { useState, useCallback } from "react";
import { getDocs, where, query } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { db } from "../../firebase";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  menuBar: {
    backgroundColor: "#fff",
    color: "#444",
  },
  tollBar: {
    margin: "0 auto",
    maxWidth: 1024,
    width: "100%",
  },
  iconButton: {
    margin: "0 0 0 auto",
  },
  iconImage: {
    cursor: "pointer",
  },
});

const Header = () => {
  const classes = useStyles();
  const selector = useSelector((state: RootState) => state.users);
  const isSignedIn = selector.isSignedIn;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleDrawerToggle = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>) => {
      if (e.type === "keydown" && (e as React.KeyboardEvent).key === "Tab" || (e as React.KeyboardEvent).key === "Shift") {
        return;
      }
      setOpen(!open);
    },
    [setOpen, open]
  );

  // 検索関数の実装
  const handleSearch = useCallback(async (keyword: string) => {
    if (!keyword || keyword.trim() === "") {
      alert("検索キーワードを入力してください");
      return;
    }
    
    try {
      // Firestoreから商品データを検索
      const productsRef = collection(db, "products");
      
      // キーワードを含む商品名で検索
      const nameQuery = query(productsRef, where("name", ">=", keyword), where("name", "<=", keyword + "\uf8ff"));
      //const nameSnapshot = await getDocs(nameQuery);
      
      // 説明文の検索は一時的に無効化
      // const descQuery = query(productsRef, where("description", ">=", keyword), where("description", "<=", keyword + "\uf8ff"));
      // const descSnapshot = await getDocs(descQuery);
      
      // 結果を配列に変換
      //const nameResults = nameSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
      
      // 説明文の検索結果は一時的に無効化
      // const descResults = descSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
      
      // 重複を除いた結果を結合
      //const allResults = [...nameResults];
      // descResults.forEach(item => {
      //   if (!allResults.some(result => result.id === item.id)) {
      //     allResults.push(item);
      //   }
      // });
      await getDocs(nameQuery);
      // 検索結果ページに遷移
      navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
      
    } catch (error) {
      console.error("検索エラー:", error);
      alert("検索中にエラーが発生しました");
    }
  }, [navigate]);

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={classes.menuBar}
        style={{ backgroundColor: "#fff" }}
      >
        <Toolbar className={classes.tollBar}>
          <img
            src={logo}
            alt="logo"
            width="110px"
            className={classes.iconImage}
            onClick={() => navigate("/")}
          />
          {isSignedIn && (
            <div className={classes.iconButton}>
              <HeaderMenus handleDrawerToggle={handleDrawerToggle} />
            </div>
          )}
        </Toolbar>
      </AppBar>
      <ClosableDrawer 
        open={open} 
        onClose={() => setOpen(false)} 
        title="Search" 
        onSearch={handleSearch}
        container={null}
      >
        <div />
      </ClosableDrawer>
    </div>
  );
};

export default Header;
