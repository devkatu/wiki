import { createSelector } from "reselect";
import { client } from "../api/client";

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
}

// -------- id更新関数 --------
// sliceに必須なものではないよ！
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
            color: todo.color
          }
        ]
      }
    case "TOODS/CHANGE_TODO":
      return {
        ...state,
        entities: state.entities.map(entity => {
          if(entity.id !== action.payload.id) return entity;
          return {
            ...entity,
            completed: action.payload.completed,
            color: action.payload.color,
          }
        })
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
      return {
        ...state,
        entities: state.entities.filter(entity => {
          if(entity.id !== action.payload.id) return entity;
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
      color: todo.color
    }
  }
}
export const changeTodo = (todo) =>{
  return {
    type: "TOODS/CHANGE_TODO",
    payload:{
      id: todo.id,
      text: todo.text,
      completed: todo.completed,
      color: todo.color
    }
  }
}
export const todoFetch = () =>{
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
  const initTodo = { text };  //{text:'textの値'}
  console.log(initTodo)
  const response = await client.post('http://localhost:3030/todos', initTodo);
  dispatch(todoAdd(response));
}

// 公式のやつはこんな感じなのか？確認
export const fetchTodos = () => async (dispatch) => {
  dispatch(todoFetch());
  const response = await client.get('http://localhost:3030/todos');
  dispatch(todoFetchFin());
  for(const r of response){
    dispatch(todoAdd(r));
  }
}

export const updateTodo = (id, todo) => async (dispatch) => {
  const sendTodo = todo;
  const response = await client.put('http://localhost:3030/todos/' + id, sendTodo);
  dispatch(changeTodo(response));
}

export const deleteTodo = (id) => async (dispatch) => {
  const response = await client.delete('http://localhost:3030/todos/' + id);
  dispatch(deletedTodo(id));
}

