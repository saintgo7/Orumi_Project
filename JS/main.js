// Google Gemini API
// API 키는 https://makersuite.google.com/app/apikey 에서 발급받으세요
const API_KEY = 'YOUR_GEMINI_API_KEY'; // 여기에 발급받은 API 키를 입력하세요
let url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

let $form = document.querySelector('.chat-form');

// 시스템 프롬프트 정의
const systemPrompt = `당신은 일본 여행 전문가입니다. 사용자의 여행 정보를 바탕으로 구체적인 일정을 Day1, Day2, Day3 형식으로 생성해주세요.

아래 지침을 따라주세요:
- 출발지에 따라 여행지까지 가는 방법을 안내해주세요
- 선호하는 테마가 '식도락'인 경우: 해당 지역의 구글 맵 평점 3.8 이상인 맛집을 추천해주세요
- 선호하는 테마가 '자연 풍경'인 경우: 자연 경관을 볼 수 있는 관광지를 추천해주세요
- 선호하는 테마가 '역사 유적'인 경우: 역사가 깊은 유적지나 박물관을 추천해주세요
- 선호하는 테마가 '액티비티'인 경우: 체험 가능한 레크레이션 활동을 추천해주세요
- 선호하는 테마가 '쇼핑'인 경우: 백화점, 아울렛 등 쇼핑 명소를 추천해주세요
- 선호하는 테마가 '온천'인 경우: 유명한 온천 명소를 추천해주세요
- 차량 렌트를 한다면: 드라이브 코스를 포함해주세요
- 각 일차별로 시간대별 상세 일정을 작성해주세요`;

// 사용자의 질문을 생성하는 함수
const makePrompt = function () {
    // 출발지 값 읽어오기
    let startInput = document.getElementById("start-point");
    let start = startInput.options[startInput.selectedIndex].value;

    // 여행지 값 읽어오기
    let destinationInput = document.getElementById("destination");
    let destination = destinationInput.options[destinationInput.selectedIndex].value;

    // 출발일 값 읽어오기
    let departInput = document.getElementById("depart-schedule");
    let depart = departInput.value;

    // 도착일 값 읽어오기
    let arriveInput = document.getElementById("arrive-schedule");
    let arrive = arriveInput.value;

    // 선호하는 여행테마 값 읽어오기 (모든 체크된 항목)
    let favoriteInputs = document.getElementsByName('tema');
    let favorites = [];
    for (let i = 0; i < favoriteInputs.length; i++){
        if (favoriteInputs[i].checked) {
            favorites.push(favoriteInputs[i].value);
        }
    }
    let favorite = favorites.join(', ') || '일반 관광';

    // 차량 렌트 값 읽어오기
    let carRentInputs = document.getElementsByName("car-rent");
    let carRent = '미정';
    for (let i = 0; i < carRentInputs.length; i++) {
      if (carRentInputs[i].checked) {
        carRent = carRentInputs[i].value === 'yes' ? '예' : '아니오';
        break;
      }
    }

    // Gemini API 형식의 프롬프트 생성
    const userPrompt = `${systemPrompt}

사용자 여행 정보:
- 출발지: ${start}
- 여행지: ${destination}
- 출발일: ${depart}
- 도착일: ${arrive}
- 선호하는 여행 테마: ${favorite}
- 차량 렌트: ${carRent}

위 정보를 바탕으로 구체적인 일본 여행 계획을 작성해주세요.`;

    return userPrompt;
}


// Gemini API 요청 보내는 함수
const apiPost = async (prompt) => {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            printAnswer(data.candidates[0].content.parts[0].text);
        } else if (data.error) {
            printAnswer(`오류가 발생했습니다: ${data.error.message}\n\nAPI 키를 확인해주세요.`);
        } else {
            printAnswer('응답을 받지 못했습니다. 다시 시도해주세요.');
        }
    } catch (err) {
        console.error(err);
        printAnswer('네트워크 오류가 발생했습니다. API 키와 인터넷 연결을 확인해주세요.');
    }
};


// submit
$form.addEventListener("submit", (e) => {
    e.preventDefault();
    // 로딩 시작
    btnshow();
    const prompt = makePrompt();
    apiPost(prompt);
});


// 화면에 답변 그려주는 함수
const printAnswer = (answer) => {
    let chat_content = document.getElementById("chat-content");
    chat_content.value = answer;
    // 로딩을 종료해주는 함수
    btnhide();
};