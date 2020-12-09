import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import reducer from "./reducers/reducer";
import * as History from 'history';
import { routerMiddleware } from "connected-react-router";

export const history = History.createBrowserHistory();

// createLoggerはdevelopmentでは入れないようにもできる
const middleware = applyMiddleware(routerMiddleware(history), thunk, createLogger());

export default createStore(reducer, middleware);