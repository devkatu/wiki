import { applyMiddleware, combineReducers, createStore } from "redux";
import { createLogger } from "redux-logger";  // action時の変更前stateと変更後stateがコンソールに表示できるようになる
import thunk from "redux-thunk";  // middlewareでactionオブジェクトを返す代わりに、関数を返す処理を呼出すことができるようになる
import axios from "axios";  // fetchみたいな感じの事ができる

const reducer = (state = 0, action) => {
  // 第二引数actionオブジェクトにはdispatchの時に渡したオブジェクトが入っている
  // 渡されたactionのタイプによってstateの更新処理を分岐する
  // stateを更新すると自動的にレンダリングするはず
  // console.log("reducer has been called");
  switch(action.type){
    case "INC":
      return state + action.payload;
    case "DEC":
      return state - action.payload;
  }
  return state;
}

const userReducer = (state = {
  
  // user: {name: "katu", age: 32}

}, action) => {
  switch(action.type){
    case "CHANGE_NAME":
      // 以下のようにしてしまうとreducerを複数回呼び出ししたときのstateが同一オブジェクトとなってしまい
      // store.subscribeで呼出すstoreが複数回全て同じものとなってしまう
      // state.name = action.payload;

      // 引数で渡されたstateから新しいオブジェクトを作成することでstore.subscribeでの問題回避できる
      // ...stateで渡されたstateを展開して、対象のプロパティのみ更新する
      state = {...state, name: action.payload};

      break;
    case "CHANGE_AGE":
      // state.age = action.payload;
      state = {...state, age: action.payload};
      break;
  }
  return state;
}

const tweetsReducer = (state = [], action) => {
  switch(action.type){
    case "ADD_TWEET":
      state = state.concat({id: Date.now(), text: action.payload});
  }
  return state;
}

const fetchiniState = {
  fetching: false,
  fetched: false,
  users: [],
  error: null
}
const fetchReducer = (state = fetchiniState, action) => {
  switch(action.type){
    case "FETCH_USERS_START":
      return {...state, fetching: true};
    case "FETCH_USERS_ERROR":
      return {...state, fetching: false, error: action.payload}
    case "RECIEVE_USERS":
      return {
        ...state,
        fetching: false,
        fetched: true,
        users: action.payload
      }
  }
  return state;
};

// combineReducersメソッドは複数のreducerを纏める役割をもつ
const reducers = combineReducers({
  user: userReducer,
  tweets: tweetsReducer,
  users: fetchReducer
});

// ここで定義しているのはmiddleware
// actionがdispatchされるとreducerに行く前にmiddlewareが呼出される
// 下で使っているアロー関数はこれと同義
// function logger(store){
//   return function (next){
//     return function (action){
//       console.log("action fired", action);
//     }
//   }
// }
const logger = (store) => (next) => (action) => {
  // console.log("action fire", action);
  next(action); //next(action)で次のmidddlewareに進む。もうmiddlewareがない時はreducerに進む。これを入れないと処理が進まないよ！
}
const error = (store) => (next) => (action) => {
  try{
    next(action); //next(action)で次のmidddlewareに進む。もうmiddlewareがない時はreducerに進む。
  }catch(e){
    console.log("Error", e);
  }
}
const middleware = applyMiddleware(thunk, logger, error, createLogger());  //middelwareを作成する。引数に渡した関数を順に実行していく

// export const store = createStore(reducer, 1); //storeを作る。引数１がreducer、引数２がデータの初期値、引数３(任意)がmiddlewareとなっている
export const store = createStore(reducers, {user: {name: "katu", age: 32}, tweets: [], users: {  fetching: false, fetched: false,  users: [],  error: null}}, middleware);

store.subscribe(() => {
  // subscribeメソッドはstoreが変更されたときに呼出される
  console.log("store changed", store.getState());
});

// dispatchメソッドはstoreにactionを送信する(dispatchするとreducerが呼出されstate更新処理を分岐する)
// 引数に渡したオブジェクトがactionオブジェクトとなる部分
// この第二引数に状況にあったデータを入れていくといい
// store.dispatch({type: "INC", payload: 1});
// store.dispatch({type: "INC", payload: 123});

// store.dispatch({type: "CHANGE_NAME", payload: "chinko"});


// store.dispatch((dispatch) => {
    // 以下でダミーのローカルサーバーを立てておくと下記が有効
    //   $ node << EOF
    // var http = require('http');
    // http.createServer(function (req, res) {
    //   res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
    //   setTimeout(() => res.end('{age: 30, id: 0, name: "foo", age: 25, id: 1, name: "bar"}'), 1000);
    // }).listen(18080);
  // dispatch({type: "FETCH_USERS_START"});
  // axios.get("http://localhost:18080").then((response) => {
  //   dispatch({type: "RECIEVE_USERS", payload: response.data});
  // }).catch((e) => {
  //   dispatch({type: "FETCH_USERS_ERROR", payload: e});
  // });
// });


export function fetchUsers(){
  return (dispatch) => {
    dispatch({type: "FETCH_USERS_START"});
    axios.get("http://localhost:18080").then((response) => {
      dispatch({type: "RECIEVE_USERS", payload: response.data});
    }).catch((e) => {
      dispatch({type: "FETCH_USERS_ERROR", payload: e});
    });
  }
}

export function changeName(){
  return {
    type: "CHANGE_NAME",
    payload: "unkomannnnn"
  }
}