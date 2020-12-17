// -------- 初期状態 --------
const initialState = {
  filterColor: "",
  filterComplete: true,
}

// -------- レデューサー --------
export const FiltersReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FILTERS/FILTER_CHANGED":
      return {
        ...state,
        filterColor: action.payload,
      }


    default:
      return state;
  }
}

// -------- セレクタ― --------


// -------- アクションクリエイター --------
export const filterChanged = (filter) => {
  return {
    type: "TODOS/TODO_ADDED",
    payload: {
      completed: false,
      color: "nothing"
    }
  }
}