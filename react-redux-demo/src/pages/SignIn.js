import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, TextField, TextInput } from '@material-ui/core';
import "../assets/css/SignUp/SignUp.css";
import { listenAuthState, signIn, signUp, signOut, todoAdd } from '../state/usersSlice';

const SignIn = () => {

  const dispatch = useDispatch();
  const [mailaddres, setMailaddres] = useState("");
  const [password, setPassword] = useState("");


  const handleInputMailaddres = (e) => {
    setMailaddres(e.target.value);
  }
  const handleInputPassword = (e) => {
    setPassword(e.target.value);
  }
  const handleButtonClick = async () => {
    dispatch(signIn(mailaddres, password))
  }



  return (
    <div>
      <h2>サインイン</h2>
      <p>
        <TextField
          placeholder="mail"
          label="メールアドレス"
          type="mail"
          value={mailaddres}
          onChange={handleInputMailaddres} />
      </p>
      <p>
        <TextField
          placeholder="pass"
          label="パスワード"
          type="password"
          value={password}
          onChange={handleInputPassword} />
      </p>
      <p>
        <Button
          variant="contained"
          onClick={handleButtonClick}>
          サインイン
        </Button>
      </p>
      {}
    </div >
  )
}

export default SignIn;