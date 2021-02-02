import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { listenAuthState, selectIsSignedIn } from './state/usersSlice';

const Auth = (props) => {
  const dispatch = useDispatch();
  const isSignedIn = useSelector(selectIsSignedIn);

  useEffect(() => {
    if(!isSignedIn){
      dispatch(listenAuthState());
    }
  }, [])

  return (
    isSignedIn ? props.children : "loginして下さい"
    )
}

export default Auth;