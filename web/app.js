document.addEventListener("DOMContentLoaded", () => {
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

  학교 관련 정보:
  전화 및 팩스: 교무실 02)2226-2141∼2, 팩스 02)2226-5346
  `;

  // 메시지를 추가하고 스크롤 조정하는 함수
  function appendMessage(message, sender) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    messageElement.textContent = message;
    chatbox.appendChild(messageElement);
    setTimeout(() => {
      chatbox.scrollTop = chatbox.scrollHeight;
    }, 100); // 스크롤을 약간 지연해서 조정
  }

  // 챗박스의 DOM 변화 감지하여 스크롤 조정
  const observer = new MutationObserver(() => {
    chatbox.scrollTop = chatbox.scrollHeight;
  });

  // chatbox 내부의 변화를 감지하도록 설정
  observer.observe(chatbox, { childList: true });

  function clearChatHistory() {
    chatbox.innerHTML = "";
  }

  // 질문 분류 함수
  function classifyQuestion(question) {
    if (question.includes("안녕하세요")) {
      return "greeting";
    } else if (question.includes("학과") || question.includes("전공")) {
      return "department";
    } else if (question.includes("기숙사") || question.includes("숙소")) {
      return "dormitory";
    } else if (question.includes("입학") || question.includes("전형")) {
      return "admission";
    } else if (
      question.includes("전화") ||
      question.includes("팩스") ||
      question.includes("담당 선생님")
    ) {
      return "schoolInfo";
    } else {
      return "general";
    }
  }

  // 질문 유형별 응답 생성
  function generateFixedResponse(type) {
    switch (type) {
      case "greeting":
        return "안녕하세요, 서울로봇고등학교 입학상담원입니다. 무엇을 도와드릴까요?";
      case "department":
        return "서울로봇고등학교에는 4개의 학과가 있습니다. 로봇설계과, 로봇제어과, 로봇소프트웨어과, 로봇정보통신과입니다.";
      case "dormitory":
        return "기숙사는 총 44명을 수용할 수 있으며, 서울 외 지역 합격자와 경기도 및 원거리 통학생에게 우선 배정됩니다.";
      case "admission":
        return "서울로봇고등학교의 입학 전형은 일반 전형과 특별 전형으로 나누어집니다. 일반 전형은 중학교 졸업 예정자와 졸업자가 대상이며, 특별 전형은 마이스터 인재 및 사회통합 전형으로 구성됩니다.";
      case "schoolInfo":
        return "서울로봇고등학교 교무실 전화번호는 02-2226-2141~2이며, 팩스 번호는 02-2226-5346입니다. 더 궁금한 사항이 있으면 알려주세요!";
      default:
        return null; // 일반 질문의 경우 null 반환
    }
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

    const questionType = classifyQuestion(userMessage);
    const fixedResponse = generateFixedResponse(questionType);

    // 고정 응답이 있으면 바로 응답, 없으면 API 호출
    if (fixedResponse) {
      appendMessage(fixedResponse, "bot");
    } else {
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
                    text: `다음 사용자의 질문에 응답하세요: "${userMessage}". 
                    응답은 한 번에 하나의 문장으로만 이루어져야 합니다. 
                    질문 외의 응답을 생성하지 마세요. 응답은 문장 단위로 줄바꿈을 추가하여 작성하세요.`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.6, // 0.0 ~ 1.0 (값이 낮을수록 보수적인 응답)
              topK: 40, // 응답의 다양성을 제어하는 값
              topP: 0.9, // 낮출수록 더욱 결정적인 응답
              maxOutputTokens: 1024, // 최대 출력 길이 설정
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

        // 응답을 문장 단위로 나누기
        const chatbotMessage = data.candidates[0].content.parts[0].text.trim();
        const sentences = chatbotMessage
          .split(".")
          .map((s) => s.trim())
          .filter((s) => s);

        // 한 문장씩 순차적으로 추가
        for (let sentence of sentences) {
          appendMessage(sentence + ".", "bot");
          await delay(1500); // 각 문장 간의 시간 지연 추가 (1.5초)
        }
      } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
        appendMessage(
          "현재 상담을 진행할 수 없습니다. 나중에 다시 시도해 주세요.",
          "bot"
        );
      }
    }
  }

  // 비동기 지연 함수
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
});
