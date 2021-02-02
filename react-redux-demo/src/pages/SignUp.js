import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import "../assets/css/SignUp/SignUp.css";
import { listenAuthState, signIn, signUp, signOut } from '../state/usersSlice';
import { Button, TextField } from '@material-ui/core';

const SignUp = () => {

  const dispatch = useDispatch();

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const inputUserName = (e) => {
    setUserName(e.target.value);
  }
  const inputEmail = (e) => {
    setEmail(e.target.value);
  }
  const inputPassword = (e) => {
    setPassword(e.target.value);
  }
  const inputConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  }
  const handleUserCreate = () => {
    // ★デバッグ
    dispatch(signUp(userName, email, password, confirmPassword));
    // dispatch(signIn(email,password))
    // dispatch(signOut())
  }
  // ★デバッグ用
  const handleListen = () => {
    dispatch(listenAuthState())
  }

  console.log("update", userName)

  return (
    <div>
      <h2>アカウント登録</h2>
      <p>
        <TextField
          placeholder="User"
          label="ユーザー名"
          type="text"
          value={userName}
          onChange={inputUserName} />
      </p>
      <p>
        <TextField
          placeholder="mail"
          label="メールアドレス"
          type="mail"
          value={email}
          onChange={inputEmail} />
      </p>
      <p>
        <TextField
          placeholder="pass"
          label="パスワード"
          type="password"
          value={password}
          onChange={inputPassword} />
      </p>
      <p>
        <TextField
          placeholder="confirm"
          label="確認用パスワード"
          type="password"
          value={confirmPassword}
          onChange={inputConfirmPassword} />
      </p>
      <p>
        <Button
          variant="contained"
          onClick={handleUserCreate}>
          サインイン
        </Button>
      </p>

      <p>
        <button onClick={handleListen}>auth listen</button>
      </p>
    </div>
  )
}

export default SignUp;