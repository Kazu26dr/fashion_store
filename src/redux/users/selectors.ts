import { createSelector } from "reselect";
import { RootState } from "./types";

const usersSelector = (state: RootState) => state.users;

export const getIsSignedIn = createSelector(
  [usersSelector],
  (userState) => userState.isSignedIn
);

export const getUserId = createSelector(
  [usersSelector],
  (userState) => userState.uid
);

export const getUserName = createSelector(
  [usersSelector],
  (userState) => userState.username
);

export const getProductsInCart = createSelector(
  [usersSelector],
  (userState) => userState.cart
);

export const getOrdersHistory = createSelector(
  [usersSelector],
  (userState) => userState.orders
);

export const getFavorites = createSelector(
  [usersSelector],
  (userState) => userState.favorites
);
