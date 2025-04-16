import { createBrowserHistory } from 'history';
import { combineReducers, Store } from 'redux';
import { configureStore } from "@reduxjs/toolkit";
import { createReduxHistoryContext } from 'redux-first-history';
import { UserReducer } from "../users/reducers";
import { ProductReducer } from "../products/reducers";
import { thunk } from 'redux-thunk';

// 1. ベースとなる browser history を作成
const browserHistory = createBrowserHistory();

// 2. redux-first-history context を作成（ここに browserHistory を渡す）
const {
  createReduxHistory,
  routerMiddleware,
  routerReducer
} = createReduxHistoryContext({
  history: browserHistory,
  savePreviousLocations: 1
});

// 3. reducer をまとめる
const rootReducer = combineReducers({
  router: routerReducer,
  users: UserReducer,
  products: ProductReducer,
});

// 4. store 作成
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
        routerMiddleware,
        thunk
    ),
  
});

// 5. React Router 用の history を作成（Redux に紐づいた version）
export const history = createReduxHistory(store as unknown as Store);

// 型定義
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;