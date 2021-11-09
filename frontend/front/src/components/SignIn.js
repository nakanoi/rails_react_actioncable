import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Redirect } from "react-router-dom";
import { API_ROOT } from "../lib/const";

const SignIn = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // サインイン関数
  const signin = async (event) => {
    event.preventDefault();
    try {
      // 送信するデータ
      const data = {
        email: email,
        password: password,
      }
      // /api/v1/auth/sign_inへログインリクエスト
      const res = await axios.post(
        `${API_ROOT}/auth/sign_in`,
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
        <h1>Sign In</h1>
        <form>
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
          <button
            onClick={event => signin(event)}
          >Sign In</button>
        </form>
      </React.Fragment>
    )
  }
}

export default SignIn;
