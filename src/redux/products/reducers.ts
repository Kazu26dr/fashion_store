import * as Actions from "./actions";
import initialState from "../store/initialState";
import { ProductActions, DeleteProductActions, ProductData } from "./types";

// 結合型を使用して、両方のアクション型を受け入れるようにする
type AllProductActions = ProductActions | DeleteProductActions;

export const ProductReducer = (
  state = initialState.products,
  action: AllProductActions
) => {
  switch (action.type) {
    case Actions.FETCH_PRODUCTS:
      return {
        ...state,
        list: [...action.payload as ProductData[]],
      };
    case Actions.DELETE_PRODUCT:
      return {
        ...state,
        list: state.list.filter((product: ProductData) => product.id !== action.payload),
      };
    default:
      return state;
  }
};