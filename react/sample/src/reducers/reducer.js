import { combineReducers } from "redux"

// ★stateの初期値設定
// createStoreの第二引数に渡しても初期値設定はできるけどこっちのがわかりやすい？
const todoInitialState = {
  todos: [],
  input: "",
}
const fetchInitialState = {
  fetching: false,
  fetched: false,
  tweets: [],
  error: ""
}

// ★reducerとは
// dispatch()が実行されると、reducerが呼出され、state、actionが渡される
// それらを元に新しいstateをどのように更新して返すか定義しているところ
// stateが更新されると自動で再レンダリングする
// 複数のreducerを一緒くたに書くとネストが深くなり、変更前のステート
// ...stateを書くのが多くなり見づらくなるので分割するのがよい
function todoReducer(state = todoInitialState, action) {
  switch(action.type){
    case 'ADD_TODO':
      return {
        // 基本的に、まず変更前のstateを適用する
        ...state,
        // その後、更新するstateを定義する
        todos: [
          ...state.todos,
          state.input
        ]
      }      
    case 'CHANGE_TEXT':
      return {
        ...state,
        input: action.payload
      }
    default:
      return state
  }
}

function fetchReducer(state = fetchInitialState, action){
  switch(action.type){
    case 'FETCH_TWEETS_START':
      return {
        ...state,
        fetching: true
      }
    case 'FETCH_TWEETS_ERROR':
      return{
        ...state,
        fetching: false,
        error: action.payload
      }
    case 'RECIEVE_TWEETS':
      return{
        ...state,
        fetching: false,
        fetched: true,
        tweets: action.payload
      }
    default:
      return state;
  }
}

// ★複数のreducerを纏めてexportする
// 単一のreducerの場合は単純に
// export default function reducer(){~}となる
export default combineReducers({
  todoReducer,
  fetchReducer
});
