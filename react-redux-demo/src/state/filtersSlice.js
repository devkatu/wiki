// -------- 初期状態 --------
const initialState = {
  filterColor: "none",
  filterComplete: true,
}

// -------- レデューサー --------
export const FiltersReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FILTERS/FILTER_COLOR_CHANGED":
      return {
        ...state,
        filterColor: action.payload.color,
      }
    case "FILTERS/FILTER_COMPLETE_CAHNGED":
      return {
        ...state,
        filterComplete: action.payload.complete
      }

    default:
      return state;
  }
}

// -------- セレクタ― --------


// -------- アクションクリエイター --------
export const filterColorChanged = (filter) => {
  return {
    type: "FILTERS/FILTER_COLOR_CHANGED",
    payload: {
      color: filter
    }
  }
}
export const filterCompleteChanged = (complete) => {
  return {
    type: "FILTERS/FILTER_COMPLETE_CAHNGED",
    payload: {
      complete: complete
    }
  }
}