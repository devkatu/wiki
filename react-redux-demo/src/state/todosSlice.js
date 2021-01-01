import { SatelliteSharp } from "@material-ui/icons";
import { createSelector } from "reselect";

// -------- 初期状態 --------
const initialState = {
  entities:
    // [todo.id]: {
    [
      {
        id: 1,
        text: "test1",
        completed: false,
        color: "none",
      },
      {
        id: 2,
        text: "test2",
        completed: false,
        color: "green",
      },
      {
        id: 3,
        text: "test3",
        completed: true,
        color: "none",
      },

    ]


  // fetching: false,
  // fetched: false
}

// -------- id更新関数 --------
function nextTodoId(todos){
  const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1);
  return maxId + 1;
}


// -------- レデューサー --------
export const TodosReducer = (state = initialState, action) => {
  switch (action.type) {
    case "TODOS/TODO_ADDED":
      const todo = action.payload;
      return {
        ...state,
        entities: [
          ...state.entities,
          {
            id: nextTodoId(state.entities),
            text: todo.text,
            completed: false,
            color: "none"
          }
        ]
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
export const selectTodos = (state) => {
  return state.todos.entities;
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
export const todoAdd = (text) => {
  return {
    type: "TODOS/TODO_ADDED",
    payload: {
      text: text,
      completed: false,
      color: "nothing"
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
  const initTodo = {text};  //{text:'textの値'}
  const response = await client.post('fakeApi/todos', {todo: initTodo});
  dispatch(todoAdd(response.todo));
}


export const fetchTodos = () => async (dispatch) => {
  dispatch({type:"test",payload:{}});
  // const response = await client.get();
  dispatch({type:"test",payload:{}})

}

