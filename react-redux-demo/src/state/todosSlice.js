// -------- 初期状態 --------
const initialState = {
  entities: 
    // [todo.id]: {
      [
        {
          id: "1",
          text: "test1",
          completed: false,
          color: "none",
        },
        {
          id: "2",
          text: "test2",
          completed: false,
          color: "green",
        },
        {
          id: "3",
          text: "test3",
          completed: true,
          color: "none",
        },
        
      ]


  // fetching: false,
  // fetched: false
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
            id: "",
            text: todo.text,
            completed: false,
            color: "none"
          }
        ]
      }
    case "TODOS/CHANGE_COLOR":
      return {
        ...state,
        entities: [
          ...state.entities,

        ]
      }
    case "TODOS/CHANGE_COMPLETE":
      return {
        ...state,
        entities: [
          ...state.entities,
          {
            id: "",
            completed: action.payload.completed
          }
        ]
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
export const selectTodoIds = (state) => {
  return state.todos.entities.map(todo => todo.id)
}
export const selectFilteredTodos = (state) => {
  const todos = state.todos.entities;
  const filter = state.filters.filterColor;
  return todos.filter((todo) => {
    if (todo.color === filter) return todo;
  })
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

export const changeComplete = (complete) => {
  return {
    type: "TODOS/CHANGE_COMPLETE",
    payload: {
      // text: text,
      completed: complete,
      color: ""
    }
  }
}