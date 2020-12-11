const initialState = {
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