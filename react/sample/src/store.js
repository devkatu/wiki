import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import reducer from "./reducers/reducer";

// ★ミドルウェアの定義
// ミドルウェアはdispatchが発生したときにreducerに処理が行く前に呼出される
// ここではやってないけど自分で定義したものもapplyMiddlewareの引数に設定することで織り込める。
// thunkはdispatch内でactionオブジェクト以外にも関数を渡せるようにするもの。
// createLoggerはaction時の変更前stateと変更後stateがコンソールに表示できるようになる
const middleware = applyMiddleware(thunk, createLogger());

// ★store(stateの保持、reducerによるstate更新方法の定義があるもの)を作成する。
// このstoreはproviderに設定され、reactで使えるようになる
export default createStore(reducer, middleware);