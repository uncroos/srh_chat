// src/App.js
import React from "react";
import Chatbot from "./components/Chatbot"; // Chatbot 컴포넌트 임포트
import "./App.css"; // 기존 CSS 유지

function App() {
  return (
    <div className="App">
      <Chatbot /> {/* Chatbot 컴포넌트를 렌더링 */}
    </div>
  );
}

export default App;
