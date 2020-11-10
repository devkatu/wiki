const initialState = {
  fuga: 1
}

export default function reducer(state = initialState, action) {
  switch(action.type){
    case 'INCREMENT':
      alert();
      state = {...state, fuga: state.fuga+1};
      break;
    default:
      return state
  }
}