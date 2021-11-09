import './App.css';
import React, { useState, useEffect } from 'react';
import actionCable from 'actioncable';
import Cookie from 'js-cookie';
import axios from 'axios';
import {
  Switch,
  Route,
  BrowserRouter as Router,
  Link,
} from 'react-router-dom';

// ホームページ
import Home from './components/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
// ユーザー一覧表示
import Users from './components/Users';
// チャットルーム
import Room from './components/Room';
// 各定数
import {
  API_ROOT,
  WS_CABLE,
} from './lib/const'


const App = () => {
  const initialCurrentRoom = {
    room: {},
    users: [],
    messages: [],
  }
  // ログイン管理
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // ログインユーザー情報
  const [user, setUser] = useState({});
  // WebSocketを使用しているRoomの情報
  // 変数は initialCurrentRoom のような辞書
  const [currentRoom, setCurrentRoom] = useState(initialCurrentRoom);
  // ユーザーの持つすべてのルーム
  const [allRooms, setAllRooms] = useState([]);

  // Action Cable用
  // ws://localhost:8080/cableに接続することで
  // cunsumer(WebSocket)を使用するインスタンスを生成する
  const Cable = {
    cable: actionCable.createConsumer(WS_CABLE),
  }

  // クッキーにあるログイン情報
  // access-token/client/uidを返す
  const headers = () => {
    return {
      'access-token': Cookie.get('access-token'),
      'client': Cookie.get('client'),
      'uid': Cookie.get('uid'),
    }
  }

  // ログインユーザーを取得/扱う
  const handleCurrentUser = async () => {
    try {
      // localhost:8080/api/v1/auth/sessions へGET
      // headersにCookieのヘッダーを乗せることで認証を行う
      const res = await axios.get(
        `${API_ROOT}/auth/sessions`,
        {headers: headers()}
      );
      if (res.data.is_login) {
        setIsLoggedIn(true);
        // ログインユーザー情報を user 変数に設定
        setUser(res.data.user);
        // ログインユーザーのすべてのrooms情報を allRooms 変数に設定
        setAllRooms(res.data.rooms);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Room.jsにおいて、現在いるRoomの情報を取得
  const getCurrentRoom = async () => {
    const token = window.location.href.split('/').slice(-1)[0];
    try {
      const res = await axios.get(
        `${API_ROOT}/rooms/${token}`,
        {headers: headers()}
      );
      if (res.data.status === 200) {
        setCurrentRoom(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // allRoomsから自身の持つRoomsのリストをレンダーする
  const showRooms = () => {
    return (
      allRooms.map(room => {
        return (
          <li>
            <Link to={`/rooms/${room.token}`}>{room.title}</Link>
          </li>
        );
      })
    );
  }

  useEffect(() => {
    handleCurrentUser();
  }, []);

  return (
    <React.Fragment>
      <Router>
        <Link to="/">/ Home / </Link>
        {!isLoggedIn && <Link to="/signin"> / SignIn / </Link>}
        {!isLoggedIn && <Link to="/signup"> / SignUp / </Link>}
        {isLoggedIn && <Link to="/users"> / Users /</Link>}
        <div>
          <h3>Name</h3>
          <p>{user.name}</p>
          <h3>Email</h3>
          <p>{user.email}</p>
          <h3>Rooms</h3>
          <ul>{showRooms()}</ul>
        </div>
        <Switch>
          <Route
            path="/signin"
            exact
            render={
              () => <SignIn
                isLoggedIn={isLoggedIn}
                handleCurrentUser={handleCurrentUser}
              />
            }
          ></Route>
          <Route
            path="/signup"
            exact
            render={
              () => <SignUp
                isLoggedIn={isLoggedIn}
                handleCurrentUser={handleCurrentUser}
              />
            }
          ></Route>
          <Route
            path="/users"
            exact
            render={
              () => <Users
                headers={headers}
                user={user}
                handleCurrentUser={handleCurrentUser}
              />
            }
          ></Route>
          <Route
            path="/rooms/:token"
            exact
            render={
              () => <Room
                Cable={Cable}
                getCurrentRoom={getCurrentRoom}
                currentRoom={currentRoom}
                setCurrentRoom={setCurrentRoom}
                user={user}
                headers={headers}
              />
            }
          ></Route>
          <Route path="/" exact component={Home}></Route>
        </Switch>
      </Router>
    </React.Fragment>
  );
};

export default App;
