const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

// Gemini API 키를 여기에 입력하세요.
const apiKey = "AIzaSyBNasLRCOQNGfwXAAzxTKnSS6K543pilZg";

// Gemini Pro API 엔드포인트 URL
const apiEndpoint =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

// 서울 로봇고등학교 원서 상담 정보 (PDF 데이터를 요약하여 포함)
const schoolInfo = `
당신은 서울 로봇고등학교 입학 상담원입니다. 다음 입학 정보와 지침을 바탕으로 대답해 주세요:

학교명: 서울로봇고등학교
학과:
- 로봇설계과
- 로봇제어과
- 로봇소프트웨어과
- 로봇정보통신과 (국방부 지정 마이스터 군특성화 계열)

입학 전형:
1. 일반 전형: 중학교 졸업 예정자, 졸업자 또는 동등 학력자
2. 특별 전형: 마이스터 인재 및 사회통합 전형 (기회균등, 사회다양성)

입학 지원 자격 및 조건:
- 산업수요 맞춤형 진로지도 동의서 제출 가능자
- 교과 성적, 출결 성적, 봉사활동 성적을 반영
- 면접 및 마이스터 인·적성검사 실시

기숙사 정보:
- 기숙사 수용 인원: 44명
- 서울 외 지역 합격자 우선 배정
- 경기도 및 원거리 통학생 배정 가능

면접 기출 질문:
1. 로봇 분야에 관심을 가지게 된 계기는 무엇인가요?
2. 로봇 설계와 제어의 차이에 대해 설명해보세요.
3. 로봇의 미래 발전 방향에 대해 본인의 생각을 말해보세요.

대화 스타일 지침:
1. 항상 한국어로 답변하세요.
2. 입학 정보와 관련된 질문에 정확하게 대답하세요.
3. 예의 바르고, 친절한 어조로 응답하세요.
4. 입학 정보와 관련되지 않은 질문에는 답변을 거부하세요.
`;

function appendMessage(message, sender) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", sender);
  messageElement.textContent = message;
  chatbox.appendChild(messageElement);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function clearChatHistory() {
  chatbox.innerHTML = "";
}

sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

async function sendMessage() {
  const userMessage = userInput.value.trim();
  userInput.value = "";

  if (userMessage.toLowerCase() === "clear~!") {
    clearChatHistory();
    return;
  }

  appendMessage(userMessage, "user");

  // Gemini API 호출
  try {
    const response = await fetch(`${apiEndpoint}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `당신은 서울 로봇고등학교 입학 상담원입니다. 다음 정보를 바탕으로 응답해주세요:

${schoolInfo}

질문: ${userMessage}
응답: `,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(
        `API 요청 오류: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (
      !data.candidates ||
      data.candidates.length === 0 ||
      !data.candidates[0].content
    ) {
      throw new Error("API 응답 형식 오류: 예상된 응답 구조가 없습니다.");
    }

    const chatbotMessage = data.candidates[0].content.parts[0].text;
    appendMessage(chatbotMessage, "bot");
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
    appendMessage(
      "현재 상담을 진행할 수 없습니다. 나중에 다시 시도해 주세요.",
      "bot"
    );
  }
}
