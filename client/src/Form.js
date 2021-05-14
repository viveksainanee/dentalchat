import React, { useState } from "react";
import "./Form.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/** Form Component
 *
 *  Props:
 *    - isThread: Boolean value to determine context of Form
 *    - sendMsg: fn passed down from parent
 *    - replyToThread: fn passed down from parent
 *    - notifyTyping: fn passed down from parent
 *    - removeTyping: fn passed down from parent
 *
 *  State:
 *    - formData:
 *        object like {
 *           handle: 'users handle',
 *           msg: 'message here',
 *        }
 *
 *  App -> ChatRoom -> Form
 */
function Form(props) {
  const [formData, setFormData] = useState({ handle: "", msg: "" });
  const {
    isThread,
    sendMsg,
    replyToThread,
    notifyTyping,
    removeTyping,
  } = props;

  function handleChange(evt) {
    // handles formData update while typing
    const { name, value } = evt.target;
    setFormData((fData) => ({
      ...fData,
      [name]: value,
    }));
    // handles typing notification
    if (formData.msg.length > 1) {
      notifyTyping(formData.handle);
    } else {
      removeTyping();
    }
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    if (isThread === "false") {
      sendMsg(formData);
    } else if (isThread === "true") {
      replyToThread(formData);
    }
    setFormData((fData) => ({
      ...fData,
      msg: "",
    }));
  }

  let handleInput = isThread === "false"
    ? <div className="formField">
        <input
          onChange={handleChange}
          required
          name="handle"
          value={formData.handle}
          className="Form-input col-12"
        />
        <label className="Form-formLabel col-12 text-left">Handle</label>
      </div>
    : '';

  return (
    <form className="col-11 mx-auto" onSubmit={handleSubmit}>
      {handleInput}
      <div className="formField">
        <input
          onChange={handleChange}
          required
          name="msg"
          id="msgInput"
          value={formData.msg}
          className="Form-input col-9"
        />
        <label className="Form-formLabel col-12 text-left">Message</label>
        <button type="submit" className="sendBtn px-3">
          <FontAwesomeIcon icon="paper-plane" />
        </button>
      </div>
      
    </form>
  );
}

export default Form;
