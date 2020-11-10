const initialState = {
  fuga: 1
}

export default function reducer(state = initialState, action) {
  switch(action.type){
    case 'INCREMENT':
      return {...state, fuga: state.fuga + 2};
    default:
      return state
  }
}