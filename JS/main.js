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
// [최종 완성] 시스템 프롬프트
const systemPrompt = `당신은 여행을 사랑하는 **열정적이고 친절한 10년 차 베테랑 여행 가이드**입니다. 
사용자의 여행 정보를 바탕으로 읽는 것만으로도 설레는 **감성적인 여행 일정**을 계획해주세요.

**[🌟 답변 스타일 가이드]**
- **[필수] 도입부 인사:** 답변을 시작할 때, **사용자가 선택한 [여행 테마]를 반드시 언급**하며 설레는 인사를 건네주세요. 사용자가 입력한 테마가 잘 반영되었음을 알 수 있게 해주세요.
  - 예: "안녕하세요! **[식도락]** 테마로 떠나는 **[오사카]** 여행이라니, 벌써부터 군침이 도네요! 😋 제가 인생 맛집들로만 꽉 채워드릴게요!"
- **톤앤매너:** 친근하고 생동감 있는 대화체 (~해요, ~어때요?)를 사용하세요. 딱딱한 보고서 말투는 금지입니다.
- **이모지 활용:** ✈️🌴📸🍜✨ 등 상황에 맞는 이모지를 적재적소에 사용하세요.

**[🛫 필수: 항공편 및 이동 경로 점검]**
- 사용자가 선택한 출발지에서 여행지까지 직항이 없거나 비효율적이라면, **"더 편리한 공항(예: 김포 대신 인천)"으로 센스 있게 변경**하여 안내해주세요.

**[📅 일정 작성 규칙 (매우 중요: 줄바꿈과 서식)]**
1. **무조건 글머리 기호(-) 사용:** 모든 시간대별 일정은 **반드시 줄바꿈**되어야 합니다. 각 일정 앞에 하이픈(-)을 붙여 리스트 형태로 작성하세요.
   - (X) 10:00 공항 도착 12:00 점심 식사
   - (O)
     - 10:00 **공항** 도착
     - 12:00 점심: **맛집** 식사
2. **볼드체(** **) 규칙:** 시간이나 '점심:' 같은 단어는 굵게 하지 마세요. 오직 **[장소명]**, **[맛집 이름]**, **[숙소 이름]**에만 볼드체를 적용하세요. (형광펜 효과를 위해 필수)
   - 괄호와 영어 이름은 볼드체 바깥에 써야 합니다. 예: **수완나품 공항** (BKK)
3. **추상적인 일정 금지:** "마사지 받기", "쇼핑하기" 대신 **실제 유명 가게 이름(상호명)**을 추천하세요.

**[맛집, 장소, 숙소 정보 형식]**
- **식사:** [00:00] [식사구분]: **[맛집명]** ([현지어]) ⭐[평점]
- **관광:** [00:00] **[장소명]** ([현지어]) - [활동내용]
- **숙소:** 숙소: **[숙소명]** ([영어/현지어]) ⭐[평점]
  - 예: 숙소: **아바니 리버사이드 방콕** (Avani+ Riverside) ⭐4.5

**[작성 예시]**
(인사말 예시: "**[휴양]** 테마로 떠나는 **[다낭]** 여행! 생각만 해도 힐링 되네요. 🌿 푹 쉴 수 있는 일정으로 준비했어요!")

## 🎈 Day 1: 설레는 여행의 시작!
- 09:00 **인천공항** (ICN) 미팅 ✈️
  _(김포 출발편이 없어서 인천으로 변경해드렸어요! 공항 리무진을 이용하면 편해요.)_

- 13:00 점심: **이치란 라멘** (一蘭) ⭐4.5
  _🍜 "독서실 같은 좌석에서 오직 라멘 맛에만 집중! 반숙 계란 추가는 국룰인 거 아시죠?"_

- 15:00 **오호리 공원** 산책 🌳
  _"여유롭게 오리배를 타며 여행의 낭만을 즐겨보세요."_

숙소: **아바니 리버사이드 방콕** (Avani+ Riverside) ⭐4.5
_"짜오프라야 강의 환상적인 야경이 보이는 인피니티 풀이 예술인 곳이에요!"_

**[🔧 시스템 데이터 출력 (답변 맨 마지막에 필수)]**
- 예약 버튼 작동을 위해 맨 마지막 줄에 **데이터 박스**를 꼭 넣어주세요.
- **[중요]** 일정 중에 추천한 **대표 호텔(숙소) 이름**을 \`data-hotel\` 속성에 적어주세요.
- 형식: \`<div id="ai-travel-data" style="display:none" data-start="실제출발코드" data-end="실제도착코드" data-start-name="출발지명" data-end-name="도착지명" data-hotel="추천호텔명"></div>\`
`;

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


// [수정] 화면에 답변을 그려주고 섹션을 전환하는 함수
const printAnswer = (answer) => {
    let chat_content = document.getElementById("chat-content");
    
    // 섹션 요소 가져오기
    const sectionPlanner = document.getElementById("section-planner");
    const sectionResult = document.getElementById("section-result");

    // 로딩 종료
    btnhide();

    // 1. 답변 출력
    chat_content.innerHTML = marked.parse(answer);
    
    // 2. 섹션 전환 (플래너 숨기고 결과창 보이기)
    if(sectionPlanner && sectionResult) {
        sectionPlanner.style.display = "none";
        sectionResult.style.display = "block";
        window.scrollTo(0, 0); // 화면 맨 위로 이동
    }

    // Excel 내보내기 버튼 활성화를 위해 change 이벤트 트리거
    chat_content.dispatchEvent(new Event('input'));
};

// [추가] 다시 계획하기 버튼 기능 (결과창 -> 플래너)
function backToPlanner() {
    const sectionPlanner = document.getElementById("section-planner");
    const sectionResult = document.getElementById("section-result");
    
    if(sectionPlanner && sectionResult) {
        sectionResult.style.display = "none";
        sectionPlanner.style.display = "block";
        window.scrollTo(0, 0);
    }
}

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

// =========================================
// [최종 기능] 환율 계산기 & 지도 검색
// =========================================

// 1. 환율 계산 함수
async function calculateExchange() {
    const amountInput = document.getElementById('krw-input');
    const targetCurrency = document.getElementById('currency-select').value;
    const resultInput = document.getElementById('foreign-input');
    const infoText = document.getElementById('rate-info');

    // 콤마 제거 후 숫자만 추출
    const rawAmount = amountInput.value.replace(/,/g, '');

    // 값이 없으면 결과창 비우고 안내 메시지
    if (!rawAmount) {
        resultInput.value = ""; 
        infoText.innerText = "금액을 입력하면 환율이 계산됩니다.";
        return;
    }

    infoText.innerText = "최신 환율 정보를 가져오는 중...";

    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/KRW`);
        const data = await response.json();

        if (!data || !data.rates) {
            throw new Error("데이터 수신 실패");
        }

        const rate = data.rates[targetCurrency];
        const result = (parseFloat(rawAmount) * rate).toFixed(2);
        const date = data.date;

        // 결과값 콤마 포맷팅
        resultInput.value = parseFloat(result).toLocaleString(undefined, {
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2
        });
        
        infoText.innerHTML = `
            1 KRW = <b>${rate} ${targetCurrency}</b><br>
            <span style="font-size: 0.8em; color: #888;">(기준일: ${date})</span>
        `;

    } catch (error) {
        console.error("환율 계산 오류:", error);
        infoText.innerText = "환율 정보를 불러올 수 없습니다.";
    }
}

// 숫자 콤마 자동 입력 함수
function formatNumber(input) {
    let value = input.value.replace(/[^\d]/g, '');
    if (value) {
        input.value = parseInt(value).toLocaleString();
    } else {
        input.value = '';
    }
}

// 2. 지도 장소 검색 함수
function searchPlace() {
    const query = document.getElementById('map-search-input').value;
    const mapFrame = document.getElementById('mini-map-frame');

    if (!query) {
        alert("검색할 장소를 입력해주세요.");
        return;
    }

    const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
    mapFrame.src = mapUrl;
}

// 3. 초기화 및 이벤트 연결
setTimeout(() => {
    const krwInput = document.getElementById('krw-input');
    
    if(krwInput) {
        krwInput.addEventListener('input', function() { formatNumber(this); });
        krwInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') calculateExchange();
        });
        formatNumber(krwInput);
        calculateExchange(); 
    }

    const mapInput = document.getElementById('map-search-input');
    if(mapInput) {
        mapInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') searchPlace();
        });
    }
}, 1000);

// =========================================
// [추가 기능] 일정 수정 및 재생성 요청
// =========================================

// [최종 수정] 일정 수정 및 재생성 요청 (서식 유지 기능 강화)
const regeneratePlan = async () => {
    const modifyInput = document.getElementById('modify-input');
    const request = modifyInput.value.trim();
    // 현재 화면의 텍스트만 가져옴 (서식 정보 소실됨)
    const currentItinerary = document.getElementById('chat-content').innerText;

    if (!request) {
        alert("수정할 내용을 입력해주세요! (예: 2일차 점심은 라멘으로 바꿔줘)");
        return;
    }

    if (currentItinerary.length < 50) {
        alert("먼저 여행 일정을 생성해주세요.");
        return;
    }

    // 로딩 시작
    btnshow();

    // [핵심] 재생성용 프롬프트 조합 (서식 재적용 명령 추가)
    const regenerationPrompt = `${systemPrompt}

**[현재 생성된 여행 일정 (참고용)]**
${currentItinerary}

**[사용자 수정 요청사항]**
"${request}"

**[지시사항]**
1. 위 "현재 생성된 여행 일정"을 기반으로, "사용자 수정 요청사항"을 반영하여 **전체 일정을 다시 작성**해주세요.
2. **[서식 복구 필수]** 위 참고용 일정 텍스트에는 굵기 표시가 빠져있을 수 있습니다. **새로 작성하는 일정에는 반드시 시스템 프롬프트의 [일정 작성 규칙]을 따라 장소와 맛집 이름에 볼드체(** **)를 다시 적용해야 합니다.** (형광펜 효과를 위해 필수)
3. **[수정 내역 요약]** 답변의 **가장 첫 줄**에 \`### 🔔 수정 완료: [어떤 내용을 변경했는지 1~2문장 요약]\` 형식으로 안내 멘트를 작성해주세요.
4. 톤앤매너(친절한 가이드, 이모지 등)는 그대로 유지하세요.
5. **[시스템 데이터 필수]** 답변의 맨 마지막 줄에 **데이터 박스(ai-travel-data)**를 반드시 다시 출력해야 합니다. (여행지가 변경되었을 수 있으므로)`;

    // AI에게 요청 전송
    await apiPost(regenerationPrompt);
    
    // 입력창 비우기
    modifyInput.value = '';
};