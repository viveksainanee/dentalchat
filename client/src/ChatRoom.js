import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Form from "./Form";
import "./ChatRoom.css";
import useChat from "./useChat";
import {
  faThumbsUp,
  faCommentDots,
  faEdit
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/** ChatRoom Component
 *
 *  Props: NONE
 *
 *  State:
 *    - isReplying: Boolean value to control show/hide thread window
 *    - currentThread: object containing original msg for open thread
 *    - currentThreadId: string with unique message id
 *
 *  App -> ChatRoom -> [useChat(roomId), Form]
 */
function ChatRoom() {
  const [isReplying, setIsReplying] = useState(false);
  const [currentThread, setCurrentThread] = useState();
  const [currentThreadId, setCurrentThreadId] = useState("");
  const [currUser, setCurrUser] = useState(false);
  const { roomName } = useParams();
  const roomId = roomName === "null" ? "Chat Room" : roomName;
  const {
    messages,
    sendMessage,
    sendInThread,
    sendUserIsTyping,
    usersCurrentlyTyping,
  } = useChat(roomId);

  function sendMsg(fData, date, time) {
    sendMessage(fData, date, time);
    if (!currUser) setCurrUser(fData.handle);
  }

  function replyInThread(fData, date, time) {
    fData.handle = currUser;
    sendInThread(fData, currentThreadId, date, time);
  }

  function notifyTyping(handle) {
    sendUserIsTyping(handle);
  }

  function removeTyping() {
    // sendUserNotTyping();
  }

  function closeThreadWindow() {
    setIsReplying(false);
  }

  /** given num (0 or 1) and evt, sets state of
   *    currentThreadId  (ID of the thread that is open)
   *    currentThread    (content of message with currentThreadId)
   *    isReplying    (this opens the thread window)          */
  function handleReplyClick(num, evt) {
    console.debug("handleReplyClick");
    let newThreadMsgId;
    if (evt.target.id === "svg") {
      newThreadMsgId = evt.target.parentNode.parentNode.id;
    } else {
      newThreadMsgId =
        num === 0
          ? evt.target.parentNode.parentNode.parentNode.id
          : evt.target.parentNode.id;
    }
    setCurrentThreadId(newThreadMsgId);
    let threadRoot = messages[newThreadMsgId];
    setCurrentThread(threadRoot);
    setIsReplying(true);
  }

  function handleLikeMessage() {
    console.log("message liked");
  }

  /** given a root message,
   *  returns appropriate count and tense (reply vs replies) */
  function calculateReplies(msgObject) {
    if (msgObject.threadMsgs.length === 1) {
      return (
        <div
          onClick={(evt) => handleReplyClick(1, evt)}
          className="ChatRoom-thread-link my-2 p-2"
        >
          1 reply
        </div>
      );
    } else if (msgObject.threadMsgs.length > 1) {
      return (
        <div
          onClick={(evt) => handleReplyClick(1, evt)}
          className="ChatRoom-thread-link my-2 p-2"
        >
          {msgObject.threadMsgs.length} replies
        </div>
      );
    } else {
      return "";
    }
  }

  /** array of DOM elements containing responses to an original message */
  const currentThreadMsgs = messages[currentThreadId]?.threadMsgs.map((m) => (
    <div key={m.replyId} className="ChatRoom-msg-parent">
      <div id={m.replyId} className={`ChatRoom-msg-txt received`}>
        <div className="ChatRoom-msg-actions mr-3 px-3 py-1">
          <div onClick={handleLikeMessage} className="ChatRoom-msg-like">
            <FontAwesomeIcon icon={faThumbsUp} />
          </div>
          <div className="ChatRoom-msg-edit ml-3">
            <FontAwesomeIcon icon={faEdit} />
          </div>
        </div>
        <p className="font-weight-bold mb-1 px-2">{m.handle}
        <span>
            <small className="timestamp"> - {m.time}</small>
          </span>
        </p>
        <p className="mb-0 px-2">{m.msg}</p>
      </div>
    </div>
  ));

  /** Reply/Thread window DOM element or nothing (depends on isReplying) */
  const replyWindow = isReplying ? (
    <div className="ChatRoom-reply-container col-4 mx-auto">
      
      <div className="ChatRoom-name col-12 p-3">
        <div className="my-auto"><p className="my-0">Thread<span>
            {/* TODO 'with ...' should contain x number of participants */}
            <small> with {currentThread.handle}</small>
          </span>
          </p>
        </div>
        <div className="d-inline-block ml-auto my-auto text-right">
          <button onClick={closeThreadWindow} className="btn btn-dark">
            X
          </button>
        </div>
      </div>

      <div className="ChatRoom-msgs col-12 mx-auto">
        <div className="ChatRoom-msg-parent">
          <div className={`ChatRoom-msg-txt received`}>
            <div className="ChatRoom-msg-actions mr-3 px-3 py-1">
              <div onClick={handleLikeMessage} className="ChatRoom-msg-like">
                <FontAwesomeIcon icon={faThumbsUp} />
              </div>
            </div>
            <p className="font-weight-bold mb-1 px-2">{currentThread.handle}
            <span>
            <small className="timestamp"> - {currentThread.time}</small>
              </span>
            </p>
            <p className="mb-0 px-2">{currentThread.msg}</p>
          </div>
        </div>
        {currentThreadMsgs}
      </div>
      <Form
        isThread="true"
        sendMsg={sendMsg}
        replyInThread={replyInThread}
        notifyTyping={notifyTyping}
        removeTyping={removeTyping}
      />
    </div>
  ) : (
    ""
  );

  const typingNotification =
    usersCurrentlyTyping.length !== 0 ? (
      <div id="msgBubbles" className="received isTypingDiv">
        <p className="mb-0 px-1">{usersCurrentlyTyping.join(", ")} is typing</p>
      </div>
    ) : (
      ""
    );
  
  // console.log(new Intl.DateTimeFormat('en-US',
  //   {
  //     year: 'numeric',
  //     month: '2-digit',
  //     day: '2-digit',
  //     hour: '2-digit',
  //     minute: '2-digit',
  //     second: '2-digit'
  //   }).format(new Date().getTime()));

  /** array of DOM elements containing original messages */
  const currMsgs = Object.entries(messages).map((m) => (
    <div key={m[0]} className="ChatRoom-msg-parent">
      <div id={m[0]} className={`ChatRoom-msg-txt received`}>
        <div className="ChatRoom-msg-actions mr-3 px-3 py-2">
          <FontAwesomeIcon
            className="ChatRoom-msg-reply mr-3 m-1"
            onClick={handleLikeMessage}
            icon={faThumbsUp}
          />
          <FontAwesomeIcon
            id="svg"
            className="ChatRoom-msg-reply-btn m-1"
            icon={faCommentDots}
            onClick={(evt) => handleReplyClick(0, evt)}
          />
          <FontAwesomeIcon className="ChatRoom-msg-edit ml-3 m-1" icon={faEdit} />
        </div>
        <p className="font-weight-bold mb-1 px-2">{m[1].handle}
          <span>
            <small className="timestamp"> - {m[1].time}</small>
          </span>
        </p>
        <p className="font-weight-light mb-0 px-2">{m[1].msg}</p>
        {calculateReplies(m[1])}
      </div>
    </div>
  ));

  return (
    <div className="ChatRoom row">
      <div className="ChatRoom-container col-7 mx-auto">
        <div className="ChatRoom-name pl-3">
          <p className="my-auto">{roomId}</p>
        </div>
        <div className="ChatRoom-msgs col-12 mx-auto">
          {currMsgs}
          {typingNotification}
        </div>
        <section className="form-parent pb-5 pt-1">
          <Form
            isThread="false"
            sendMsg={sendMsg}
            replyInThread={replyInThread}
            notifyTyping={notifyTyping}
            removeTyping={removeTyping}
          />
        </section>
      </div>
      {replyWindow}
    </div>
  );
}

export default ChatRoom;
