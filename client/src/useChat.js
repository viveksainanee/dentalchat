import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import io from "socket.io-client";

const SERVER = "http://localhost:8000";

/** Custom Hook
 *
 *  roomName passed down when hook is called
 */
function useChat(roomName) {
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

    // Listens for incoming messages
    socketRef.current.on("newChat", (message) => {
      const msgId = uuid();
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
        message is object like:
                { 
                  newThreadMsgId: "eb7...", 
                  msg: "string", 
                  handle: "string", 
                  senderId: "2mm..."
                }                               */
    socketRef.current.on("newThreadReply", (message) => {
      const threadId = message.newThreadMsgId;
      const replyId = uuid();
      const existingThreadMsgs = [...messages[threadId].threadMsgs];
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
      setIsTyping(false);
    });

    socketRef.current.on("userIsTyping", function (handle) {
      setIsTyping(true);
    });

    socketRef.current.on("userNotTyping", function () {
      setIsTyping(false);
    });

    // ends connection
    return () => {
      socketRef.current.disconnect();
    };
  }, [roomName, messages]);

  function sendMessage(fData) {
    socketRef.current.emit("newChat", {
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

  function sendUserNotTyping() {
    socketRef.current.emit("userNotTyping");
  }

  return {
    messages,
    sendMessage,
    sendInThread,
    sendUserIsTyping,
    isTyping,
    sendUserNotTyping,
  };
}

export default useChat;
