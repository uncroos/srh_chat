// src/components/ChatInput.js
import React, { useState } from "react";
import "./ChatInput.css";

const ChatInput = ({ onSendMessage }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="질문을 입력하세요..."
      />
      <button onClick={handleSend}>보내기</button>
    </div>
  );
};

export default ChatInput;
