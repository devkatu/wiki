import { applyMiddleware, combineReducers, createStore } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import { TodosReducer } from "./todosSlice";
import { FiltersReducer } from "./filtersSlice";
import { connectRouter, routerMiddleware } from "connected-react-router";
import history from './history';

const middleware = [routerMiddleware(history), thunk];

// createLoggerはdevelopmentでは入れない
// process.env.NODE_ENVには開発中はdevelopment,buildするとproductionが入る
// 他にも本番環境に残したくないものがあればこれを使う
if(process.env.NODE_ENV === 'development'){
  const logger = createLogger();
  middleware.push(logger);
}

// const middleware = applyMiddleware(routerMiddleware(history), thunk, createLogger());

// storeを作成する
// 各sliceファイルのreducerの他connectRouter関連のやつもある
export default createStore(
  combineReducers({
    router: connectRouter(history),
    todos: TodosReducer,
    filters: FiltersReducer,
  }),
  applyMiddleware(...middleware)
);


