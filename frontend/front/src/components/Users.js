import React, { useState, useEffect } from "react";
import axios from 'axios';
import {
  Link,
} from 'react-router-dom';
import { API_ROOT } from "../lib/const";


const Users = (props) => {
  const [users, setUsers] = useState([]);

  // ユーザーをすべて返す
  const getAllUsers = async () => {
    try {
      // /api/v1/usersへログインリクエスト
      const res = await axios.get(
        `${API_ROOT}/users`,
        {headers: props.headers()}
      );
      // 成功したら users 変数に設置
      if (res.status === 200) {
        setUsers(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // ユーザー名をクリックして新しいRoom作成するとき、
  // そのRoom用の40文字トークンを生成する
  // ex: return /rooms/agjt93azjvag4rdg46a4FG4d65
  const createNewRoomToken = () => {
    const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const N = 40;
    return Array.from(
        crypto.getRandomValues(new Uint8Array(N))
      ).map(
        (n)=>S[n % S.length]
      ).join('');
  }

  // クリックされたユーザーとととも新たなRoomを作成するよう
  // バックエンドにリクエストを送る
  const createNewRoom = async (event) => {
    event.preventDefault();
    try {
      // button の "data-id"属性から、クリックされた
      // ユーザーのIDを取得する
      const userID = event.target.dataset.id,
            username = event.target.dataset.name,
            token = event.target.dataset.token,
            data = {
              title: `${props.user.name} & ${username}`,
              token: token,
              partner: Number(userID),
            }
      // /api/v1/rooms にリクエスト
      const res = await axios.post(
        `${API_ROOT}/rooms`,
        data,
        {headers: props.headers()}
      );
      if (res.status === 200) {
        props.handleCurrentUser();
      }
    } catch (error) {
      console.error(error);
    };
  }

  const showAllUsers = () => {
    return (
      users.map(user => {
        const token = createNewRoomToken();
        return (
          <li>
            <Link to={`/rooms/${token}}`}>
              <button
                data-id={user.id}
                data-name={user.name}
                data-token={token}
                onClick={(event) => createNewRoom(event)}
              >{user.name}</button>
            </Link>
          </li>
        );
      })
    );
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <React.Fragment>
      <h1>All Users</h1>
      <ul>{showAllUsers()}</ul>
    </React.Fragment>
  )
}

export default Users;
