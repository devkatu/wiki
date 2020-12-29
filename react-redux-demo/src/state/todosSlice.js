import { SatelliteSharp } from "@material-ui/icons";
import { createSelector } from "reselect";

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
        entities: state.entities.map(todo => {
          if(todo.id !== action.payload.id){
            return todo;
          }
          return{
            ...todo,
            color: action.payload.color
          }
        })          
      }
    case "TODOS/CHANGE_COMPLETE":
      return {
        ...state,
        entities: state.entities.map(todo => {
          if(todo.id !== action.payload.id){
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
  // state => state.filters.filterColor,
  state => state.filters,
  ( todos, filter) => {
    return todos.filter((todo) => {
      if(
        filter.filterColor === "none" || todo.color === filter.filterColor
        // todo.completed === (filter.filterComplete === "complete") || 
        // todo.completed === (filter.filterComplete === "not")
        
        ) return todo
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