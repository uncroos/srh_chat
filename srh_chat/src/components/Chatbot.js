// src/components/Chatbot.js
import React, { useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { extractTextFromPdf } from "../utils/pdfUtils";
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "안녕하세요! PDF 파일을 업로드해주세요.", sender: "bot" },
  ]);

  const handleSendMessage = async (message) => {
    setMessages([...messages, { text: message, sender: "user" }]);

    // PDF 파일 업로드 처리
    if (message.file) {
      const extractedText = await extractTextFromPdf(message.file);
      const apiResponse = await callChatApi(extractedText);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: apiResponse, sender: "bot" },
      ]);
    } else {
      const apiResponse = await callChatApi(message.text);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: apiResponse, sender: "bot" },
      ]);
    }
  };

  const callChatApi = async (text) => {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: text }],
      }),
    });
    const data = await response.json();
    return data.choices[0].message.content;
  };

  return (
    <div className="chatbot">
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <ChatMessage key={index} text={msg.text} sender={msg.sender} />
        ))}
      </div>
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default Chatbot;
