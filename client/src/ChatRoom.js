import React, { useState } from "react";
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
  const [currThread, setCurrThread] = useState();
  const [currThreadId, setCurrThreadId] = useState('');
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
    // console.log('currThread :>> ', currThread);
    sendInThread(fData, currThreadId);
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
    setCurrThreadId(newThreadMsgId);
    // let messagesCopy = [...messages];
    // let [threadRoot] = messagesCopy.filter((m) => m.msgId === newThreadMsgId);
    let threadRoot = messages[newThreadMsgId];
    // console.log('threadRoot :>> ', threadRoot);
    setCurrThread(threadRoot);
    setIsReplying(true);
  }
  // could be const ?

  // let messageImLookingFor = currThread.newThreadMsgId;
  // let threadMsgs = messages[currThreadId]?.threadMsgs || [];
  // console.log('threadMsgs :>> ', threadMsgs);

  console.log('messages[currThreadId]?.threadMsgs :>> ', messages[currThreadId]?.threadMsgs);

  let currThreadMsgs = messages[currThreadId]?.threadMsgs.map((m) => (
    <div key={m.replyId} className="ChatRoom-msg-parent">
      <div id={m.replyId} className={`ChatRoom-msg-txt received`}>
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
        {currThreadMsgs}
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

  // console.log(messages);


  // could be const ?
  let currMsgs = Object.entries(messages).map((m, i) => (
    <div key={m[0]} className="ChatRoom-msg-parent">
      <div id={m[0]} className={`ChatRoom-msg-txt received`}>
        <div className="ChatRoom-msg-actions mr-3 px-3 py-1">
          <div onClick={handleReplyClick} className="ChatRoom-msg-reply mr-3">
            Reply
          </div>
          <div className="ChatRoom-msg-edit">Edit</div>
        </div>
        <p className="mb-0 px-1">{m[1].msg}</p>
      </div>
    </div>
  ));
  
    // console.log('currMsgs :>> ', currMsgs);

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
