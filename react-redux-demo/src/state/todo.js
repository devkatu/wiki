const initialState = {
  entities: 
    // [todo.id]: {
      [
        {
          id: "1",
          text: "test1",
          completed: false,
          color: "nothing",
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
          color: "nothing",
        },
        
      ]


  // fetching: false,
  // fetched: false
}

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
            color: "nothing"
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