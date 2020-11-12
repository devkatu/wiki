import Axios from 'axios';

// ★actionクリエイターとは
// dispatchする(reducerに引き渡す)typeやpayloadを含むactionオブジェクトを生成する
// ここで定義した関数を実行して返ってくるactionオブジェクトをdispatch()に渡すことでreducerが動く
export function addTodo(id, text) {
  return {
    type: "ADD_TODO",
  };
}

export function onChangeText(text) {
  return {
    type: "CHANGE_TEXT",
    payload: text
  };
}

export function fetchTweets() {
  return (dispatch) => {
    dispatch({ type: 'FETCH_TWEETS_START' });
    Axios.get("http://localhost:18080")
      .then((res) => {
        dispatch({
          type: 'RECIEVE_TWEETS',
          payload: res.data
        })
      })
      .catch((e) => {
        dispatch({
          type: 'FETCH_TWEETS_ERROR',
          payload: e
        })
      })
  }
}