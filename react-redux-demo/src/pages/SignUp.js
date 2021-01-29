import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import "../assets/css/SignUp/SignUp.css";
import { listenAuthState, signUp } from '../state/usersSlice';

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
    dispatch(signUp(userName, email, password, confirmPassword));
  }

  console.log("update", userName)

  return (
    <div>
      <h2>アカウント登録</h2>
      <p>
        <label>
          ユーザー名
          <input type="text" onChange={inputUserName} required/>
        </label>
      </p>
      <p>
        <label>
          メールアドレス
          <input type="mail" onChange={inputEmail}/>
        </label>
      </p>
      <p>
        <label>
          パスワード
          <input type="password" onChange={inputPassword}/>
        </label>
      </p>
      <p>
        <label>
          パスワードの確認
          <input type="password" onChange={inputConfirmPassword}/>
        </label>
      </p>
      <p>
        <button onClick={handleUserCreate}>登録する</button>
      </p>
    </div>
  )
}

export default SignUp;