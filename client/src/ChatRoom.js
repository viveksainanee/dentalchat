

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Form from "./Form";
import "./ChatRoom.css";
import useChat from "./useChat";

/** ChatRoom Component
 *
 *  Props: NONE
 *
 *  State:
 *    - isReplying: Boolean value to control show/hide thread window
 *    - currThread: object containing original msg for open thread
 *    - currThreadId: string with unique message id
 *
 *  App -> ChatRoom -> [useChat(roomId), Form]
 */
function ChatRoom() {
  const [isReplying, setIsReplying] = useState(false);
  const [currThread, setCurrThread] = useState();
  const [currThreadId, setCurrThreadId] = useState('');
  const [currUser, setCurrUser] = useState('');
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

  /** given num (0 or 1) and evt, sets state of 
   *    currThreadId  (ID of the thread that is open)
   *    currThread    (content of message with currThreadId)
   *    isReplying    (this opens the thread window)          */
  function handleReplyClick(num, evt) {
    console.debug("handleReplyClick");
    let newThreadMsgId = num === 0
      ? evt.target.parentNode.parentNode.id
      : evt.target.parentNode.id;
    setCurrThreadId(newThreadMsgId);
    let threadRoot = messages[newThreadMsgId];
    setCurrThread(threadRoot);
    setIsReplying(true);
  }

  /** TODO */
  function handleLikeMessage() {
    console.log('message liked')
  }

  /** given a root message, 
   *  returns appropriate count and tense (reply vs replies) */
  // TODO: consider better function name
  function calculateReplies(msgObject) {
    if (msgObject.threadMsgs.length === 1) {
      return (
        <div
          onClick={(evt) => handleReplyClick(1, evt)}
          className="ChatRoom-thread-link my-2 p-2">1 reply
        </div>
      );
    } else if (msgObject.threadMsgs.length > 1) {
      return (
        <div
          onClick={(evt) => handleReplyClick(1, evt)}
          className="ChatRoom-thread-link my-2 p-2">{msgObject.threadMsgs.length} replies
        </div>
      );
    } else {
      return '';
    }
  }


  /** array of DOM elements containing responses to an original message */
  const currThreadMsgs = messages[currThreadId]?.threadMsgs.map((m) => (
    <div key={m.replyId} className="ChatRoom-msg-parent">
      <div id={m.replyId} className={`ChatRoom-msg-txt received`}>
        <div className="ChatRoom-msg-actions mr-3 px-3 py-1">
          <div onClick={handleLikeMessage} className="ChatRoom-msg-like">
            Like
          </div>
          <div className="ChatRoom-msg-edit ml-3">Edit</div>
        </div>
        <p className="mb-0 px-2">{m.msg}</p>
      </div>
    </div>
  ));

  /** Reply/Thread window DOM element or nothing (depends on isReplying) */
  const replyWindow = isReplying
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
        <div className="ChatRoom-msg-parent">
          <div  className={`ChatRoom-msg-txt received`}>
            <div className="ChatRoom-msg-actions mr-3 px-3 py-1">
              <div onClick={handleLikeMessage}
                className="ChatRoom-msg-like">Like
              </div>
            </div>
            <p className="mb-0 px-2">{currThread.msg}</p>
          </div>
        </div>
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

  const typingNotification = isTyping ? (
    <div id="msgBubbles" className="received isTypingDiv">
      <p className="mb-0 px-1">...</p>
    </div>
  ) : (
    ""
  );

  /** array of DOM elements containing original messages */
  const currMsgs = Object.entries(messages).map((m) => (
    <div key={m[0]} className="ChatRoom-msg-parent">
      <div id={m[0]} className={`ChatRoom-msg-txt received`}>
        <div className="ChatRoom-msg-actions mr-3 px-3 py-1">
          <div onClick={handleLikeMessage} className="ChatRoom-msg-reply mr-3">
            Like
          </div>
          <div onClick={(evt) => handleReplyClick(0, evt)} className="ChatRoom-msg-reply">
            Reply
          </div>
          <div className="ChatRoom-msg-edit ml-3">Edit</div>
        </div>
        <p className="mb-0 px-2">{m[1].msg}</p>
        {calculateReplies(m[1])}
      </div>
    </div>
  ));


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

