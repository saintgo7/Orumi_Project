// Google Gemini API
// API 키는 웹 페이지에서 직접 설정할 수 있습니다

let $form = document.querySelector('.chat-form');

// API 키를 LocalStorage에서 가져오는 함수
function getApiKey() {
    try {
        return localStorage.getItem('gemini_api_key') || '';
    } catch (error) {
        console.error('API 키 불러오기 실패:', error);
        return '';
    }
}

// API URL 생성 함수
function getApiUrl() {
    const apiKey = getApiKey();
    if (!apiKey) {
        return null;
    }
    return `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
}

// 시스템 프롬프트 정의
const systemPrompt = `당신은 전세계 여행 전문가입니다. 사용자의 여행 정보를 바탕으로 구체적인 일정을 Day1, Day2, Day3 형식으로 생성해주세요.

아래 지침을 따라주세요:
- 출발지에 따라 여행지까지 가는 방법을 안내해주세요 (항공편, 교통수단 등)
- 각 일차별로 시간대별 상세 일정을 작성해주세요
- 매일 아침, 점심, 저녁 식사 시간과 추천 맛집을 반드시 포함해주세요
- 여행지의 현지 문화와 특성을 반영한 일정을 구성해주세요

**맛집 정보 작성 규칙:**
- 형식: [시간] 식사: [맛집명] ([현지어명]) ⭐[평점]
- 예시: 12:00 점심: 스시 대 (すし大) ⭐4.2 / 12:00 점심: Le Jules Verne ⭐4.5
- 평점 3.8 이상의 검증된 맛집만 추천
- 맛집 위치는 여행 동선에 맞게 배치
- 현지 대표 메뉴 1-2가지 간단히 언급
- 해당 국가/도시의 유명한 현지 음식 포함

**예산 고려사항 (예산 정보가 제공된 경우):**
- 총 예산 범위 내에서 일정을 계획
- 항공권, 숙박, 식비, 관광, 교통, 쇼핑 예산을 고려하여 추천
- 예산이 제한적인 경우: 가성비 좋은 현지 맛집, 무료 관광지, 대중교통 활용
- 예산이 여유로운 경우: 고급 레스토랑, 프리미엄 관광 체험 포함

**테마별 추천:**
- 선호하는 테마가 '식도락'인 경우: 미슐랭 가이드 또는 현지 유명 맛집 중심으로
- 선호하는 테마가 '자연 풍경'인 경우: 자연 경관, 국립공원, 전망대 등 추천
- 선호하는 테마가 '역사 유적'인 경우: 역사 유적지, 박물관, 문화재 추천
- 선호하는 테마가 '액티비티'인 경우: 현지 특색있는 체험 활동 추천
- 선호하는 테마가 '쇼핑'인 경우: 현지 쇼핑 명소, 시장, 백화점 추천
- 선호하는 테마가 '온천'인 경우: 온천, 스파 명소 추천
- 차량 렌트를 한다면: 드라이브 코스와 차로 이동하기 좋은 장소 포함

**지역별 특별 고려사항:**
- 아시아: 현지 시장, 사원, 전통 음식 체험
- 유럽: 박물관, 역사 유적, 카페 문화
- 미주: 자연 경관, 테마파크, 다양한 음식 문화
- 오세아니아: 해양 액티비티, 자연 탐험
- 중동: 전통 시장, 사막 투어, 현지 문화 체험

**일정 작성 예시:**
Day 1 - [날짜]
08:00 호텔 출발
09:00 [관광지명] 방문 (입장료: 약 X원, 소요시간: X시간)
12:00 점심: [맛집명] ([현지어명]) ⭐[평점] - [대표메뉴] (예산: 약 X원)
14:00 [관광지명] 방문
18:30 저녁: [맛집명] ([현지어명]) ⭐[평점] - [대표메뉴] (예산: 약 X원)
21:00 호텔 복귀

**가격 표시:**
- 모든 금액은 한국 원화(원)로 표시
- 대략적인 예상 비용 포함 (입장료, 식사비, 교통비 등)`;

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

    // 선호하는 여행테마 값 읽어오기 (텍스트 입력)
    let favoriteInput = document.getElementById("theme-input");
    // 입력값이 없으면 '일반 관광'을 기본값으로 사용
    let favorite = favoriteInput.value.trim() || '일반 관광';

    // 차량 렌트 값 읽어오기
    let carRentInputs = document.getElementsByName("car-rent");
    let carRent = '미정';
    for (let i = 0; i < carRentInputs.length; i++) {
      if (carRentInputs[i].checked) {
        carRent = carRentInputs[i].value === 'yes' ? '예' : '아니오';
        break;
      }
    }

    // 예산 정보 읽어오기
    const totalBudget = document.getElementById('total-budget').value;
    const budgetFlight = document.getElementById('budget-flight').value;
    const budgetAccommodation = document.getElementById('budget-accommodation').value;
    const budgetFood = document.getElementById('budget-food').value;
    const budgetActivity = document.getElementById('budget-activity').value;
    const budgetTransport = document.getElementById('budget-transport').value;
    const budgetShopping = document.getElementById('budget-shopping').value;

    let budgetInfo = '';
    if (totalBudget) {
        budgetInfo = `\n\n**예산 정보:**\n- 총 예산: ${parseInt(totalBudget).toLocaleString()}원`;

        if (budgetFlight || budgetAccommodation || budgetFood || budgetActivity || budgetTransport || budgetShopping) {
            budgetInfo += '\n- 카테고리별 예산:';
            if (budgetFlight) budgetInfo += `\n  • 항공권: ${parseInt(budgetFlight).toLocaleString()}원`;
            if (budgetAccommodation) budgetInfo += `\n  • 숙박: ${parseInt(budgetAccommodation).toLocaleString()}원`;
            if (budgetFood) budgetInfo += `\n  • 식비: ${parseInt(budgetFood).toLocaleString()}원`;
            if (budgetActivity) budgetInfo += `\n  • 관광/활동: ${parseInt(budgetActivity).toLocaleString()}원`;
            if (budgetTransport) budgetInfo += `\n  • 교통: ${parseInt(budgetTransport).toLocaleString()}원`;
            if (budgetShopping) budgetInfo += `\n  • 쇼핑: ${parseInt(budgetShopping).toLocaleString()}원`;
        }
        budgetInfo += '\n\n위 예산 범위 내에서 최적의 여행 계획을 작성해주세요.';
    }

    // Gemini API 형식의 프롬프트 생성
    const userPrompt = `${systemPrompt}

사용자 여행 정보:
- 출발지: ${start}
- 여행지: ${destination}
- 출발일: ${depart}
- 도착일: ${arrive}
- 선호하는 여행 테마: ${favorite}
- 차량 렌트: ${carRent}${budgetInfo}

위 정보를 바탕으로 구체적인 여행 계획을 작성해주세요.`;

    return userPrompt;
}


// Gemini API 요청 보내는 함수
const apiPost = async (prompt) => {
    // API 키 확인
    const url = getApiUrl();
    if (!url) {
        printAnswer('⚠️ API 키가 설정되지 않았습니다.\n\n위의 "Google Gemini API 설정" 섹션에서 API 키를 설정해주세요.\n\nAPI 키는 https://makersuite.google.com/app/apikey 에서 무료로 발급받을 수 있습니다.');
        return;
    }

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
            printAnswer(`❌ 오류가 발생했습니다: ${data.error.message}\n\n가능한 원인:\n1. API 키가 잘못되었습니다.\n2. API 할당량이 초과되었습니다.\n3. API 키가 활성화되지 않았습니다.\n\nAPI 키를 다시 확인하거나 새로운 키를 발급받아주세요.`);
        } else {
            printAnswer('❌ 응답을 받지 못했습니다. 다시 시도해주세요.');
        }
    } catch (err) {
        console.error(err);
        printAnswer('❌ 네트워크 오류가 발생했습니다.\n\nAPI 키와 인터넷 연결을 확인해주세요.');
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
    // 로딩 시작 함수
    btnshow();
    // marked 라이브러리를 사용해 마크다운을 HTML로 변환
    chat_content.innerHTML = marked.parse(answer);
    // 로딩을 종료해주는 함수
    btnhide();
    // Excel 내보내기 버튼 활성화를 위해 change 이벤트 트리거
    chat_content.dispatchEvent(new Event('input'));
};

// 메인 슬라이드 자동 넘기기 기능
document.addEventListener("DOMContentLoaded", function() {
    // 슬라이드 라디오 버튼들을 모두 가져옵니다 (name="radio-btn")
    const slides = document.querySelectorAll('input[name="radio-btn"]');
    
    // 8초(8000ms)마다 슬라이드를 넘깁니다
    const intervalTime = 8000; 
    
    setInterval(function() {
        // 현재 체크된 슬라이드 찾기
        let activeIndex = 0;
        for (let i = 0; i < slides.length; i++) {
            if (slides[i].checked) {
                activeIndex = i;
                break;
            }
        }
        
        // 다음 슬라이드 체크 (마지막이면 처음으로 돌아감)
        // % 연산자를 사용하여 순환하도록 함
        const nextIndex = (activeIndex + 1) % slides.length;
        slides[nextIndex].checked = true;
        
    }, intervalTime);
});

// [화면 전환 로직]
document.addEventListener("DOMContentLoaded", function() {
    const btnStart = document.getElementById("btn-start");       // '로그인 없이 시작' 버튼
    const btnGoPlanner = document.getElementById("btn-go-planner"); // '계획 짜러 가기' 버튼
    
    const sectionLanding = document.getElementById("section-landing");
    const sectionInfo = document.getElementById("section-info");
    const sectionPlanner = document.getElementById("section-planner");

    // 1. 시작 버튼 클릭 -> 랜딩 숨기고 정보 섹션 보여주기
    if (btnStart) {
        btnStart.addEventListener("click", function() {
            sectionLanding.style.display = "none";
            sectionInfo.style.display = "block";
            window.scrollTo(0, 0);
        });
    }

    // 2. 계획 짜기 버튼 클릭 -> 정보 섹션 숨기고 플래너 보여주기
    if (btnGoPlanner) {
        btnGoPlanner.addEventListener("click", function() {
            sectionInfo.style.display = "none"; // 정보창 숨김 (계속 띄우려면 이 줄 삭제)
            sectionPlanner.style.display = "block";
            window.scrollTo(0, 0);
        });
    }
});