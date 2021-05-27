import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import io from "socket.io-client";

const SERVER = "http://localhost:8000";

/** Custom Hook
 *
 *  roomName passed down when hook is called
 */
function useChat(roomName) {
  const [usersCurrentlyTyping, setUsersCurrentlyTyping] = useState([]);
  const [messages, setMessages] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io(SERVER, {
      query: { roomName },
    });


    /*************************************
     *************************************
     ***** Must Update ../server.js too *****
     *************************************
     *************************************/

    /** Listens for incoming messages 
     *  message obj like:
     *  {
          msgId,
          msg: fData.msg,
          handle: fData.handle,
          senderId: socketRef.current.id,
        }                                   */
    socketRef.current.on("newChat", (message) => {
      const msgId = message.msgId;
      const incomingMessage = {
        ...message,
        threadMsgs: [],
      };
      setMessages((messages) => ({
        ...messages,
        [msgId]: incomingMessage,
      }));
      setIsTyping(false);
    });

    /** Listens for incoming messages in threads
        message is obj like:
        { 
          newThreadMsgId: "eb7...", 
          msg: "string", 
          handle: "string", 
          senderId: "2mm..."
        }                               */
    socketRef.current.on("newThreadReply", (message) => {
      const threadId = message.newThreadMsgId;
      const replyId = uuid();
      const existingThreadMsgs = [...messages[threadId]?.threadMsgs];
      const incomingMessage = {
        ...message,
        replyId,
      };
      setMessages((messages) => ({
        ...messages,
        [threadId]: ({
          ...messages[threadId],
          threadMsgs: [...existingThreadMsgs, incomingMessage],
        }),
      }));
      setUsersCurrentlyTyping([]);
      setIsTyping(false);
    });

    socketRef.current.on("userIsTyping", function (handle) {
      setUsersCurrentlyTyping((usersCurrentlyTyping) => {
        if (!usersCurrentlyTyping.includes(handle)) {
          return [...usersCurrentlyTyping, handle];
        }
        return usersCurrentlyTyping;
      });
    });

    // ends connection
    return () => {
      socketRef.current.disconnect();
    };
  }, [roomName, messages]);
  /*************** END useEFFECT **************/

  function sendMessage(fData) {
    const msgId = uuid();
    socketRef.current.emit("newChat", {
      msgId,
      msg: fData.msg,
      handle: fData.handle,
      senderId: socketRef.current.id,
    });
  }

  function sendInThread(fData, newThreadMsgId) {
    socketRef.current.emit("newThreadReply", {
      newThreadMsgId,
      msg: fData.msg,
      handle: fData.handle,
      senderId: socketRef.current.id,
    });
  }

  function sendUserIsTyping(handle) {
    socketRef.current.emit("userIsTyping", handle);
  }

  return {
    messages,
    sendMessage,
    sendInThread,
    sendUserIsTyping,
    usersCurrentlyTyping,
  };
}

export default useChat;
