import * as Actions from "./actions";
import initialState from "../store/initialState";
import { Reducer } from 'redux';
import { UserState, UserActions, SignInAction, SignOutAction, SetErrorAction, FetchProductsInCartAction, FetchOrdersHistoryAction, FetchFavoritesAction } from "./types";

const initialUserState: UserState = {
  cart: [],
  favorites: [],
  isSignedIn: false,
  uid: "",
  username: "",
  error: "",
  orders: [],
  currentUser: null,
};

export const UserReducer: Reducer<UserState, UserActions> = (
  state = { ...initialUserState, ...initialState.users },
  action: UserActions
) => {
  switch (action.type) {
    case Actions.SIGN_IN:
      return {
        ...state,
        ...(action as SignInAction).payload,
      };
    case Actions.SET_ERROR:
      return {
        ...state,
        error: (action as SetErrorAction).payload.error
      };
    case Actions.RESET_ERROR:
      return {
        ...state,
        error: ""
      };
    case Actions.SIGN_OUT:
      if ('payload' in action) {
        return {
          ...state,
          ...((action as unknown) as SignOutAction).payload,
          cart: [],
        };
      }
      return state;
    case Actions.FETCH_PRODUCTS_IN_CART:
      return {
        ...state,
        cart: (action as FetchProductsInCartAction).payload.products
      };
    case Actions.FETCH_ORDERS_HISTORY:
      return {
        ...state,
        orders: (action as FetchOrdersHistoryAction).payload.orders
      };
    case Actions.FETCH_FAVORITES:
      return {
        ...state,
        favorites: (action as FetchFavoritesAction).payload.favorites
      };
    default:
      return state;
  }
};
