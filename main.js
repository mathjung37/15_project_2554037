const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// 🟢 시스템 프롬프트 설정 (이 부분을 자유롭게 수정하여 보시면 됩니다)
const systemPrompt = `
당신은 광신방송예술고등학교를 중학교 3학년 학생들에게 친절하고 설레게 소개하는 최고의 상담 선생님입니다.

학생들이 진로와 고등학교 선택에 대해 궁금해할 수 있으므로, 다음의 내용을 쉽고 생생하게 전달해주세요:

1. 광신방송예술고등학교의 4개 학과 — 미디어메이크업아티스트과, 연예엔터테인먼트과, 방송영상과, 만화영상과 — 의 교육과정과 졸업 후 진로를 구체적으로, 그리고 긍정적으로 안내해주세요.

2. 고등학교에서의 생활이 얼마나 즐겁고 보람찰 수 있는지, 예를 들어 아침조회, 전공수업, 친구들과의 프로젝트 활동 같은 일상을 친근한 예시로 설명해주세요.

3. 다양한 공모전 참여 기회와 실습 위주의 전공체험활동이 있다는 점을 강조해주세요. 학생들이 자신의 꿈을 실현해 나가는 데 얼마나 많은 경험을 쌓을 수 있는지 알려주세요.

4. 설명은 항상 따뜻하고 희망적인 어조로 진행하며, 중학교 3학년 학생의 눈높이에 맞춰 쉽고 흥미롭게 표현해주세요.

5. 대답을 마칠 때는 “이런 설명이 도움이 되었니?” 또는 “혹시 더 궁금한 점 있을까?”처럼 학생과의 대화를 자연스럽게 이어가 주세요.

당신의 역할은 단순한 정보 제공자가 아니라, 중학생이 진심으로 진로에 설레게 만드는 꿈의 조력자입니다.

`;

// 🟡 대화 맥락을 저장하는 배열 (시스템 프롬프트 포함)
const conversationHistory = [
  { role: "system", content: systemPrompt }
];

async function fetchGPTResponse() {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4-turbo", //이 부분에서 모델을 바꿔볼 수 있습니다.
      messages: conversationHistory,
      temperature: 0.7, //이 부분은 모델의 창의성을 조절하는 부분입니다. 0정답중심, 1자유로운 창의적인 응답
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

async function handleSend() {
  const prompt = userInput.value.trim();
  if (!prompt) return;

  // 사용자 입력 UI에 출력
  chatbox.innerHTML += `<div class="text-right mb-2 text-blue-600">나: ${prompt}</div>`;
  chatbox.scrollTop = chatbox.scrollHeight;

  // 사용자 메시지를 대화 이력에 추가
  conversationHistory.push({ role: "user", content: prompt });

  // 입력 필드 초기화
  userInput.value = '';

  // GPT 응답 받아오기
  const reply = await fetchGPTResponse();

  // GPT 응답 UI에 출력
  chatbox.innerHTML += `<div class="text-left mb-2 text-gray-800">GPT: ${reply}</div>`;
  chatbox.scrollTop = chatbox.scrollHeight;

  // GPT 응답도 대화 이력에 추가
  conversationHistory.push({ role: "assistant", content: reply });
}

// 버튼 클릭 시 작동
sendBtn.addEventListener('click', handleSend);

// 엔터키 입력 시 작동
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
});


// 페이지 로드 시 기본 안내 문구 출력
window.addEventListener('DOMContentLoaded', () => {
  const chatbox = document.getElementById('chatbox');
  chatbox.innerHTML += `
    <div class="text-left mb-2 text-gray-300">
      안녕하세요! 👋<br>
      저는 광신방송예술고등학교를 소개하는 챗봇이에요.<br>
      궁금한 학과나 학교생활에 대해 질문해 주세요 😊
    </div>
  `;
});
