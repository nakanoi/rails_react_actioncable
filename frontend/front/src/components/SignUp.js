import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Redirect } from "react-router-dom";
import { API_ROOT } from "../lib/const";

const SignUp = (props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');

  // サインイン関数
  const signup = async (event) => {
    event.preventDefault();
    try {
      // 送信するデータ
      const data = {
        name: name,
        email: email,
        password: password,
        password_confirmation: password_confirmation,
      }
      // /api/v1/auth へサインアップリクエスト
      const res = await axios.post(
        `${API_ROOT}/auth`,
        data,
      );
      // 成功したら access-token, client, uid をクッキーに設置
      if (res.status === 200) {
        Cookies.set('access-token', res.headers['access-token']);
        Cookies.set('client', res.headers['client']);
        Cookies.set('uid', res.headers['uid']);
        // App.js の handleCurrentUser を発火させ、
        // ログインユーザーの情報を設置する
        props.handleCurrentUser();
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (props.isLoggedIn) {
    // ログインユーザーなら Home へリダイレクト
    return <Redirect to="/" />
  } else {
    return (
      <React.Fragment>
        <h1>Sign Up</h1>
        <form>
          <p>Name</p>
          <input
            required
            type="text"
            value={name}
            label="Name"
            onChange={event => setName(event.target.value)}
          />
          <p>Email</p>
          <input
            required
            type="email"
            value={email}
            label="Email"
            onChange={event => setEmail(event.target.value)}
          />
          <p>Password</p>
          <input
            required
            type="password"
            value={password}
            label="Password"
            onChange={event => setPassword(event.target.value)}
          />
          <p>Password Confirmation</p>
          <input
            required
            type="password"
            value={password_confirmation}
            label="Password Confirmation"
            onChange={event => setPasswordConfirmation(event.target.value)}
          />
          <button
            onClick={event => signup(event)}
          >Sign Up</button>
        </form>
      </React.Fragment>
    )
  }
}

export default SignUp;
