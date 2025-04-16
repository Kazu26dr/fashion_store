// Router.tsx
import { Route, Routes } from "react-router-dom";
import {
  SignUp,
  SignIn,
  Reset,
  ProductEdit,
  ProductList,
  ProductDetail,
  CartList,
  OrderComfirm,
  OrderComplete,
  OrderHistory,
  Favorite,
  Profile,
  Search,
  Payment,
} from "./templates";
import Auth from "./templates/Auth";

const Router = () => {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signin/reset" element={<Reset />} />

      {/* 認証が必要なページ */}
      <Route element={<Auth />}>
        <Route path="/" element={<ProductList />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<Search />} />

        <Route path="/product/edit" element={<ProductEdit />} />
        <Route path="/product/edit/:id" element={<ProductEdit />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartList />} />
        <Route path="/order/confirm" element={<OrderComfirm />} />
        <Route path="/order/complete" element={<OrderComplete />} />
        <Route path="/order/payment" element={<Payment />} />
        <Route path="/order/history" element={<OrderHistory />} />
        <Route path="/favorite" element={<Favorite />} />
      </Route>
    </Routes>
  );
};

export default Router;
