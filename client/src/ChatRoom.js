import React from "react";
import { useParams } from "react-router-dom";
import Form from "./Form";
import "./ChatRoom.css";
import useChat from "./useChat";

/** ChatRoom Component
 *
 *  Props: NONE
 *
 *  State: NONE
 *
 *  App -> ChatRoom -> [useChat(roomId), Form]
 */
function ChatRoom() {
  const { roomName } = useParams();
  const roomId = roomName === "null" ? "Chat Room" : roomName;
  const {
    messages,
    sendMessage,
    sendUserIsTyping,
    usersCurrentlyTyping,
    sendUserNoLongerTyping,
  } = useChat(roomId);

  function sendMsg(fData) {
    sendMessage(fData);
  }

  function notifyTyping(handle) {
    sendUserIsTyping(handle);
  }

  function noLongerTyping(handle) {
    sendUserNoLongerTyping(handle);
  }

  // could be const ?
  let typingNotification =
    usersCurrentlyTyping.length !== 0 ? (
      <div id="msgBubbles" className="received isTypingDiv">
        <p className="mb-0 px-1">{usersCurrentlyTyping.join(", ")} is typing</p>
      </div>
    ) : (
      ""
    );

  // could be const ?
  let currMsgs = messages.map((m, i) => (
    <div
      id="msgBubbles"
      className={`${m.sentByMe ? "sent ml-auto" : "received"}`}
      key={i}
    >
      <p className="mb-0 px-1">{m.msg}</p>
    </div>
  ));

  return (
    <div className="ChatRoom">
      <div className="ChatRoom-container">
        <div className="ChatRoom-name col-10 mx-auto">
          <p>{roomId}</p>
        </div>
        <div className="ChatRoom-msgs col-10 mx-auto">
          {currMsgs}
          {typingNotification}
        </div>
        <Form
          sendMsg={sendMsg}
          notifyTyping={notifyTyping}
          noLongerTyping={noLongerTyping}
        />
      </div>
    </div>
  );
}

export default ChatRoom;
