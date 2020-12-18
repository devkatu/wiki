// -------- 初期状態 --------
const initialState = {
  filterColor: "none",
  filterComplete: true,
}

// -------- レデューサー --------
export const FiltersReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FILTERS/FILTER_CHANGED":
      return {
        ...state,
        filterColor: action.payload.color,
      }


    default:
      return state;
  }
}

// -------- セレクタ― --------


// -------- アクションクリエイター --------
export const filterChanged = (filter) => {
  return {
    type: "FILTERS/FILTER_CHANGED",
    payload: {
      color: filter
    }
  }
}