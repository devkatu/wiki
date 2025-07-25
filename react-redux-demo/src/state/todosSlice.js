import { createSelector } from "reselect";
import { client } from "../api/client";
import { db, FirebaseTimestamp } from '../firebase';

// -------- 初期状態 --------
// stateの初期状態を定義している
const initialState = {
  entities: []

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

  , fetchState: {
    fetching: false,
    fetched: false,
  }
}

// -------- id更新関数 --------
// sliceに必須なものではないよ！
// api使わないで自分のstoreを更新するだけのときに使ってた
// 多分大抵のapiはIDは更新して返してくると思う
function nextTodoId(todos) {
  const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1);
  return maxId + 1;
}


// -------- レデューサー --------
// actionがdispatchされるとここの処理が呼ばれる
// action.typeにより処理が分岐し、stateの更新を行う
export const TodosReducer = (state = initialState, action) => {
  switch (action.type) {
    case "TODOS/TODO_ADDED":
      const todo = action.payload;
      return {
        ...state,
        entities: [
          ...state.entities,
          {
            // id: nextTodoId(state.entities),
            id: todo.id,
            text: todo.text,
            completed: todo.completed,
            color: todo.color,
            image: todo.image
          }
        ]
      }
    case "TOODS/CHANGE_TODO":
      // API側のtodoの色や完了フラグが変更された後に変更されたtodoがdispatchされてくる
      // entitiesをmapして渡されたIDと一致するものを更新する
      return {
        ...state,
        entities: state.entities.map(entity => {
          if (entity.id !== action.payload.id) return entity;
          return {
            ...entity,
            completed: action.payload.completed,
            color: action.payload.color,
            image: action.payload.image
          }
        })
      }
    case "TODOS/FETCH_TODO_ACTION":
      return {
        ...state,
        entities: action.payload
      }
    case "TODOS/FETCH_STATE_CHANGE":
      return {
        ...state,
        fetchState: {
          fetching: action.payload.fetching,
          fetched: action.payload.fetched,
        }
      }
    case "TODOS/DELETED_TODO":
      // API側のtodoが削除された後に削除されたtodoのIDがdispatchされてくる
      // entitiesをfilterして渡されたIDは取り除く
      return {
        ...state,
        entities: state.entities.filter(entity => {
          if (entity.id !== action.payload.id) return entity;
        })
      }
    case "TODOS/CHANGE_COLOR":
      return {
        ...state,
        entities: state.entities.map(todo => {
          if (todo.id !== action.payload.id) {
            return todo;
          }
          return {
            ...todo,
            color: action.payload.color
          }
        })
      }
    case "TODOS/CHANGE_COMPLETE":
      return {
        ...state,
        entities: state.entities.map(todo => {
          if (todo.id !== action.payload.id) {
            return todo;
          }
          return {
            ...todo,
            completed: action.payload.completed
          }
        }),
      }


    case "FETCH_TODO":
      return {
        ...state,
        fetching: true
      }
    default:
      return state;
  }
}

// -------- セレクタ― --------
// コンポーネント側でuseSelectorに渡してstoreにアクセスするためのもの
// 詳しくはメモ参照
export const selectTodos = (state) => {
  return state.todos.entities;
}
export const selectFetch = (state) => {
  return state.todos.fetchState;
}
export const selectTodoIds = createSelector(
  selectTodos,
  todos => todos.map(todo => todo.id)
)
export const selectCompletedTodos = createSelector(
  selectTodos,
  todos => todos.filter((todo) => todo.completed).length
)
// createSelectorの最後の引数が最終的なセレクター
// その前のcreateSelectorの引数が最終的なセレクターの引数となる
export const selectFilteredTodos = createSelector(
  selectTodos,
  state => state.filters.filterComplete,
  state => state.filters.filterColor,
  (todos, filterComplete, filterColor) => {
    return todos.filter((todo) => {
      const matchColor = todo.color === filterColor || filterColor === "none";
      const matchComplete = todo.completed === filterComplete || filterComplete === "none";
      if (matchColor && matchComplete) return todo
    })
  }
)
export const selectTodoById = (state, id) => {
  return selectTodos(state).find(todo => todo.id === id);
}

// -------- アクションクリエイター --------
// コンポーネント側でこれらの関数を実行してactionオブジェクトを取り出す
// 基本typeプロパティとpayloadプロパティで構成されて
// reducerに渡されるとtypeプロパティを元に処理分岐する
export const todoAdd = (todo) => {
  // export const todoAdd = (text) => {
  return {
    type: "TODOS/TODO_ADDED",
    payload: {
      id: todo.id,
      text: todo.text,
      completed: todo.completed,
      color: todo.color,
      image: todo.image
    }
  }
}
export const changeTodo = (todo) => {
  return {
    type: "TOODS/CHANGE_TODO",
    payload: {
      id: todo.id,
      text: todo.text,
      completed: todo.completed,
      color: todo.color,
      image: todo.image
    }
  }
}
export const fetchTodoAction = (todoLists) => {
  return {
    type: "TODOS/FETCH_TODO_ACTION",
    payload: todoLists
  }
}
export const todoFetch = () => {
  return {
    type: "TODOS/FETCH_STATE_CHANGE",
    payload: {
      fetching: true,
      fetched: false
    }
  }
}
export const todoFetchFin = () => {
  return {
    type: "TODOS/FETCH_STATE_CHANGE",
    payload: {
      fetching: false,
      fetched: true
    }
  }
}
export const deletedTodo = (id) => {
  return {
    type: "TODOS/DELETED_TODO",
    payload: {
      id
    }
  }
}
export const changeComplete = (id, complete) => {
  return {
    type: "TODOS/CHANGE_COMPLETE",
    payload: {
      id: id,
      completed: complete,
    }
  }
}

export const changeColor = (id, color) => {
  return {
    type: "TODOS/CHANGE_COLOR",
    payload: {
      id: id,
      color: color
    }
  }
}

// -------- サンク関数 --------
// アクションクリエイターみたいにコンポーネント側で実行する
// 実行するとasyncなfunctionを返す。これがそのままdispatch()に渡される

// 新規に登録するtodo
// コンポーネント側よりtextをもらって、APIにpostする
// responseは従来のtodoAddアクションクリエイターによって処理してもらう
export const saveNewTodo = (text) => async (dispatch) => {
  const timestamp = FirebaseTimestamp.now();
  const initTodo = {
    text,
    completed: false,
    color: "none",
    image: null,
    timestamp
  };  //textについては→のように展開される {text:'textの値'}

  // ローカルのjson serverで開発するときに活かしてたやつ
  // const response = await client.post('http://localhost:3030/todos', initTodo);
  // dispatch(todoAdd(response));

  const todosRef = db.collection('todos');
  const id = todosRef.doc().id;
  initTodo.id = id;
  await todosRef.doc(id).set(initTodo).catch(e => { throw new Error(e) });
  dispatch(todoAdd(initTodo));

  // asyncじゃない書き方
  // todosRef.doc(id).set(initTodo)
  //   .then(() => {
  //     dispatch(todoAdd(initTodo));
  //   }).catch((error) => {
  //     throw new Error(error);
  //   });


}

// 公式のやつはこんな感じなのか？確認
// 公式では纏めてdispatchしてreducer側で展開するような感じになっている
export const fetchTodos = (color = 'none', filter = "none") => async (dispatch) => {
  dispatch(todoFetch());

  // json serverで使うやつ
  // const response = await client.get('http://localhost:3030/todos');
  // dispatch(todoFetchFin());
  // for(const r of response){
  //   dispatch(todoAdd(r));
  // }

  // orderByで引数１のプロパティについて、引数２がascなら昇順、descなら降順でｿｰﾄする
  // 複合クエリを使うときはFirestore indexを設定しなければならない
  // エラーメッセージをクリックして自動で作る事もできるし、ローカルからfirestore.indexes.jsonを更新してデプロイしてもOK
  let query = db.collection('todos').orderBy('timestamp', 'asc');
  // query = query.where('color', '==', color);   // test クエリを投げる場合はfirestore.rulesのread(list)で見ている条件を必ず書かなければならない
  query = (color !== "none") ? query.where('color', '==', color) : query
  query = (filter !== "none") ? query.where('completed', '==', filter) : query
  query.get()
    .then(snapshots => {
      dispatch(todoFetchFin());
      const todosList = [];
      snapshots.forEach(snapshot => {
        const todo = snapshot.data();
        todosList.push(todo);
        // dispatch(todoAdd(todo));  //これでやると何回もactionが走るので下の方法で
      });
      dispatch(fetchTodoAction(todosList))
    })

}

export const updateTodo = (id, todo) => async (dispatch) => {
  const sendTodo = todo;
  // json-serverのやつ
  // const response = await client.put('http://localhost:3030/todos/' + id, sendTodo);

  // set()メソッドでも第1引数にデータ、第二引数に{marge: true}ってすればいいみたいだけど・・・？
  // updateとだと特定のﾌｨｰﾙﾄﾞのみ更新するようにして使える
  // db.collection('todos').doc(id).update(sendTodo)
  //   .then(() => {
  //     dispatch(changeTodo(sendTodo));
  //   });

  const batch = db.batch();
  batch.update(db.collection('todos').doc(id), sendTodo);
  batch.set(db.collection('order').doc(id), { id, update_at: FirebaseTimestamp.now() }, { marge: true });
  batch.commit()
    .then(() => {
      dispatch(changeTodo(sendTodo));
    })
    .catch(() => {
      alert('todo更新失敗！')

    })


}

export const deleteTodo = (id) => async (dispatch) => {
  // const response = await client.delete('http://localhost:3030/todos/' + id);

  db.collection('todos').doc(id).delete()
    .then(() => {
      dispatch(deletedTodo(id));
    });
}

