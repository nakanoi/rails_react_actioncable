import React, { useState } from "react";
import axios from "axios";
import Cable from "./Cable";
import { API_ROOT } from "../lib/const";


const Room = (props) => {
  const [message, setMessage] = useState('');

  const submitMessage = async (event) => {
    event.preventDefault();
    const newMessage = {
      content: message,
      user_id: props.user.id,
      room_id: props.currentRoom.id,
    }
    // /api/v1/messagesにPOSTリクエストを送り、
    // Messageを作成
    try {
      await axios.post(
        `${API_ROOT}/messages`,
        newMessage,
        {headers: props.headers()}
      );
    } catch (err) {
      console.error(err);
    }
    setMessage('');
  }

  // 現在のメッセージ一覧を表示
  const showMessages = () => {
    return props.currentRoom.messages.slice().reverse().map(mes => {
      return <li>{mes.content}</li>
    });
  }

  return (
    <React.Fragment>
      <h2>Title: {props.currentRoom.title}</h2>
      <form>
        <textarea
          required
          label="content"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        ></textarea>
        <button
          type="submit"
          onClick={(event) => submitMessage(event)}
        >Submit</button>
      </form>
      <h2>Messages</h2>
      <ul>{showMessages()}</ul>
      <Cable
        Cable={props.Cable}
        getCurrentRoom={props.getCurrentRoom}
        setCurrentRoom={props.setCurrentRoom}
      ></Cable>
    </React.Fragment>
  )
}

export default Room;
