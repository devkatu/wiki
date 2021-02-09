import { push } from "connected-react-router";
import { createSelector } from "reselect";
import { client } from "../api/client";
import { auth, db, FirebaseTimestamp } from '../firebase';

// -------- 初期状態 --------
// stateの初期状態を定義している
const initialState = {
  isSignedIn: false,
  uid: ""

  // entities:
  //   // [todo.id]: {
  //   [
  //     {
  //       id: 1,
  //       text: "test1",
  //       completed: false,
  //       color: "none",
  //     },
  //     {
  //       id: 2,
  //       text: "test2",
  //       completed: false,
  //       color: "green",
  //     },
  //     {
  //       id: 3,
  //       text: "test3",
  //       completed: true,
  //       color: "none",
  //     },
  //   ]
  // fetching: false,
  // fetched: false
}



// -------- レデューサー --------
// actionがdispatchされるとここの処理が呼ばれる
// action.typeにより処理が分岐し、stateの更新を行う
export const UsersReducer = (state = initialState, action) => {
  switch (action.type) {
    case "USERS/AUTH_STATE_CHANGE":
      return {
        ...state,
        isSignedIn: action.payload.isSignedIn
      };


    default:
      return state;
  }
}

// -------- セレクタ― --------
// コンポーネント側でuseSelectorに渡してstoreにアクセスするためのもの
// 詳しくはメモ参照
export const selectIsSignedIn = (state) => {
  return state.users.isSignedIn;
}

// -------- アクションクリエイター --------
// コンポーネント側でこれらの関数を実行してactionオブジェクトを取り出す
// 基本typeプロパティとpayloadプロパティで構成されて
// reducerに渡されるとtypeプロパティを元に処理分岐する
export const signInAction = () => {
  return {
    type: "USERS/AUTH_STATE_CHANGE",
    payload: {
      isSignedIn: true
    }
  }
}
export const signOutAction = () => {
  return {
    type: "USERS/AUTH_STATE_CHANGE",
    payload: {
      isSignedIn: false
    }
  }
}



// -------- サンク関数 --------
// アクションクリエイターみたいにコンポーネント側で実行する
// 実行するとasyncなfunctionを返す。これがそのままdispatch()に渡される

// サインアップ関数
export const signUp = (username, email, password, confirmPassword) => async (dispatch) => {
  return auth.createUserWithEmailAndPassword(email, password)
    .then(result => {
      const user = result.user;

      console.log(result);
      
      if (user) {
        const uid = user.uid;
        const timestamp = FirebaseTimestamp.now();
        const userInitialData = {
          created_at: timestamp,
          email: email,
          role: "customer",
          uid: uid,
          updated_at: timestamp,
          username: username
        }
        db.collection('users').doc(uid).set(userInitialData)
          .then(() => {
            console.log('ｄｂにも登録したよ')
            dispatch(signInAction());
            dispatch(push('./'));
          })

      }
    })
}

// サインイン関数
export const signIn = (email, password) => async (dispatch, getState) => {
  return auth.signInWithEmailAndPassword(email, password)
    .then(result => {
      const user = result.user;
      if (!user) {
        console.log('userIDない')
      }
      const uid = user.uid;
      return db.collection('users').doc(uid).get()
        .then(snapshot => {
          const data = snapshot.data();
          if (!data) {
            console.log('userデータなし')
          }
          console.log(data)
          dispatch(signInAction());
          dispatch(push('./a'));
        })
    }).catch(() => {
      console.log('サインイン失敗')
    })

}

// サインアウト関数
export const signOut = () => async (dispatch) => {
  return auth.signOut().then(() => {
    console.log('サインアウトしました');
    dispatch(signOutAction());
    dispatch(push('./SignIn'));
  })
}



// 認証状態確認
export const listenAuthState = () => async (dispatch) => {
  return auth.onAuthStateChanged(user => {
    if (user) {
      const uid = user.uid;

      db.collection('users').doc(uid).get()
        .then(snapshot => {
          const data = snapshot.data();
          dispatch(signOutAction());
          console.log(data);
        })
    } else {
      console.log('loginしてません')
      dispatch(push('./SignIn'));
    }
  })
}

