// src/components/Chatbot.js
import React, { useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import "./Chatbot.css";

// PDF에서 추출한 정보
const admissionInfo = {
  departments: [
    {
      name: "로봇설계과",
      totalSeats: 36,
      specialSeats: 16,
      generalSeats: 20,
    },
    {
      name: "로봇제어과",
      totalSeats: 36,
      specialSeats: 16,
      generalSeats: 20,
    },
    {
      name: "로봇소프트웨어과",
      totalSeats: 36,
      specialSeats: 16,
      generalSeats: 20,
    },
    {
      name: "로봇정보통신과",
      totalSeats: 36,
      specialSeats: 16,
      generalSeats: 20,
    },
  ],
  eligibility: {
    general: "중학교 졸업 예정자 및 졸업자, 중학교 졸업 동등 학력 인정자",
    special: {
      maestroTalent:
        "중학교 재학 중 로봇 관련 분야에 적성과 소질이 있어 추천을 받은 자",
      socialIntegration: "기회균등 대상자 및 사회 다양성 전형 대상자",
    },
  },
  application: {
    firstRound: "교과 성적, 출결 성적, 봉사활동 성적",
    secondRound: "마이스터 인·적성검사, 심층 면접",
  },
};

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      text: "안녕하세요! 서울로봇고등학교 입학 상담 챗봇입니다. 무엇을 도와드릴까요?",
      sender: "bot",
    },
  ]);

  const handleSendMessage = (message) => {
    setMessages([...messages, { text: message, sender: "user" }]);
    const response = generateResponse(message);
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: response, sender: "bot" },
    ]);
  };

  // src/components/Chatbot.js
  const generateResponse = (message) => {
    if (message.includes("학과") || message.includes("정원")) {
      return admissionInfo.departments
        .map(
          (dept) =>
            `${dept.name}: 총 ${dept.totalSeats}명\n(특별전형 ${dept.specialSeats}명, 일반전형 ${dept.generalSeats}명)`
        )
        .join("\n\n"); // 각 학과 정보를 줄바꿈으로 구분
    } else if (message.includes("지원 자격") || message.includes("자격")) {
      return `일반 전형:\n${admissionInfo.eligibility.general}\n\n특별 전형:\n- 마이스터 인재 전형: ${admissionInfo.eligibility.special.maestroTalent}\n- 사회 통합 전형: ${admissionInfo.eligibility.special.socialIntegration}`;
    } else if (message.includes("전형")) {
      return `1차 전형:\n${admissionInfo.application.firstRound}\n\n2차 전형:\n${admissionInfo.application.secondRound}`;
    } else {
      return "문의하신 내용에 대한 정보가 없습니다. 다시 질문해 주세요.";
    }
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
