import { applyMiddleware, combineReducers, createStore } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import { TodosReducer } from "./modules/todo";
import * as History from 'history';
import { connectRouter, routerMiddleware } from "connected-react-router";

export const history = History.createBrowserHistory();

// createLoggerはdevelopmentでは入れないようにもできる
const middleware = applyMiddleware(routerMiddleware(history), thunk, createLogger());

export default createStore(
  combineReducers({
    todos: TodosReducer,
    router: connectRouter(history)
  }),
  middleware
);


