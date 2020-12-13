import { applyMiddleware, combineReducers, createStore } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import { TodosReducer } from "./todo";
import { connectRouter, routerMiddleware } from "connected-react-router";
import history from './history';

// createLoggerはdevelopmentでは入れないようにもできる
const middleware = applyMiddleware(routerMiddleware(history), thunk, createLogger());

export default createStore(
  combineReducers({
    router: connectRouter(history),
    todos: TodosReducer,
  }),
  middleware
);


