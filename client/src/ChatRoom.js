import React, { useEffect, useState } from "react";
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
  const [isReplying, setIsReplying] = useState(false);
  const [currThread, setCurrThread] = useState({});
  // set state for room members 
  const { roomName } = useParams();
  const roomId = roomName === "null" ? "Chat Room" : roomName;
  const {
    messages,
    sendMessage,
    sendInThread,
    sendUserIsTyping,
    isTyping,
    sendUserNotTyping,
  } = useChat(roomId);

  function sendMsg(fData) {
    sendMessage(fData);
  }

  function replyToThread(fData) {
    sendInThread(fData);
  }

  function notifyTyping(handle) {
    sendUserIsTyping(handle);
  }

  function removeTyping() {
    sendUserNotTyping();
  }

  function closeThreadWindow() {
    setIsReplying(false);
  }

  function handleReplyClick(evt) {
    console.debug("handleReplyClick");
    let newThreadMsgId = evt.target.parentNode.parentNode.id;
    let messagesCopy = [...messages];
    let [threadRoot] = messagesCopy.filter((m) => m.msgId === newThreadMsgId);
    setCurrThread(threadRoot);
    setIsReplying(true);
  }

  let replyWindow = isReplying
    ? <div className="ChatRoom-reply-container col-4 mx-auto">
      <div className="ChatRoom-name col-8 mt-4 mx-auto d-inline-block">
        <p>Thread
          <span className="my-0">
            <small> with {currThread.handle}</small>
          </span>
        </p>
        </div>
      <div className="d-inline-block col-4 text-right">
        <button onClick={closeThreadWindow} className="btn btn-dark">X</button>
      </div>
        <div className="ChatRoom-msgs col-12 mx-auto">
          {currThread.msg}
        </div>
      <Form
        isThread="true"
        sendMsg={sendMsg}
        replyToThread={replyToThread}
        notifyTyping={notifyTyping}
        removeTyping={removeTyping}/>
      </div>
    : '';

  // could be const ?
  let typingNotification = isTyping ? (
    <div id="msgBubbles" className="received isTypingDiv">
      <p className="mb-0 px-1">...</p>
    </div>
  ) : (
    ""
  );

  // could be const ?
  let currMsgs = messages.map((m, i) => (
    <div key={`${m.msgId}`} className="ChatRoom-msg-parent">
      <div id={`${m.msgId}`} className={`ChatRoom-msg-txt received`}>
        <div className="ChatRoom-msg-actions mr-3 px-3 py-1">
          <div onClick={handleReplyClick} className="ChatRoom-msg-reply mr-3">
            Reply
          </div>
          <div className="ChatRoom-msg-edit">Edit</div>
        </div>
        <p className="mb-0 px-1">{m.msg}</p>
      </div>
    </div>
  ));

  // console.log("currMsgs :>> ", currMsgs);

  return (
    <div className="ChatRoom row">
      <div className="ChatRoom-container col-7 mx-auto">
        <div className="ChatRoom-name col-12 mt-4 mx-auto">
          <p>{roomId}</p>
        </div>
        <div className="ChatRoom-msgs col-12 mx-auto">
          {currMsgs}
          {typingNotification}
        </div>
        <Form
          isThread="false"
          sendMsg={sendMsg}
          replyToThread={replyToThread}
          notifyTyping={notifyTyping}
          removeTyping={removeTyping}
        />
      </div>
      {replyWindow}
    </div>
  );
}

export default ChatRoom;
