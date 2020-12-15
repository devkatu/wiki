const initialState = {
  todos: {
    todo: "test todo",
    complete: false,
    color: "nothing",

  }
  ,
  
  
  fetching: false,
  fetched: false
}

export const TodosReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_TODO":
      return {
        ...state,
        fetching: true
      }
    default:
      return state;
  }
}