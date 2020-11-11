const initialState = {
  tweets: [
    "no tweets"
  ],
  fetching: false,
  fetched: false
}

export default function reducer(state = initialState, action) {
  switch(action.type){
    case 'FETCH_TWEETS':
      return {
        ...state, 
        fetching: true
      };
    case 'FETCH_TWEETS_FULFILLED':
      return {
        ...state,
        fetching: false,
        fetched: true,
        tweets: action.payload
      }
    default:
      return state
  }
}