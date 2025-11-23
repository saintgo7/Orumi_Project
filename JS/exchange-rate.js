// ./JS/exchange-rate.js

async function fetchExchangeRate() {
    const rateElement = document.getElementById('jpy-rate');
    const timestampElement = document.getElementById('rate-timestamp');
    const rateSection = document.getElementById('exchange-rate-section');

    // 로딩 상태 표시
    rateElement.textContent = '... 로딩 중 ...';
    timestampElement.textContent = '데이터를 가져오고 있습니다.';
    
    // 이전에 표시된 상태 클래스 초기화
    rateSection.classList.remove('good-time', 'bad-time');


    // =========================================================
    // 💡 1. 지난달 엔화(100 JPY 기준) 평균 환율 설정 (가정값)
    // 실제 지난달 과거 환율 데이터를 가져와 평균을 계산해야 하지만,
    // 여기서는 테스트를 위해 945.00원으로 가정합니다.
    // =========================================================
    const LAST_MONTH_AVERAGE_KRW_PER_100JPY = 949.96; 
    
    // API 인증 키와 URL 설정 (이전 단계에서 설정한 값 사용)
    const API_KEY = 'api-key'; 
    const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/KRW`; 
    

    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (data.result === 'error') {
            throw new Error(`API 오류: ${data['error-type']}`);
        }
        
        // JPY 환율 데이터 추출 및 100 JPY 당 KRW로 역산
        const jpyRatePerKrw = data.conversion_rates.JPY;
        const krwPer100Jpy = (1 / jpyRatePerKrw * 100).toFixed(2);
        
        const currentRate = parseFloat(krwPer100Jpy); // 현재 환율 (숫자형)
        
        // 2. 환율 정보 업데이트
        rateElement.textContent = `${currentRate.toFixed(2)} 원 (100 JPY)`;

        // 3. 여행 적기 판단 로직 (지난달 평균과 비교)
        let adviceMessage = "";
        
        if (currentRate < LAST_MONTH_AVERAGE_KRW_PER_100JPY) {
            // 현재 환율이 평균보다 낮음 (여행 가기 좋은 시기)
            adviceMessage = "✅ 여행 가기 좋은 시기입니다! (지난달 평균보다 낮음)";
            rateSection.classList.add('good-time'); 
            rateSection.classList.remove('bad-time');
        } else {
            // 현재 환율이 평균보다 높거나 같음 (여행 가기 안 좋은 시기)
            adviceMessage = "⚠️ 환율이 지난달 평균보다 높습니다. 여행 계획을 다시 고려해보세요.";
            rateSection.classList.add('bad-time'); 
            rateSection.classList.remove('good-time');
        }
        
        // 4. 판단 결과 표시 (DOM 조작)
        const adviceDiv = document.createElement('p');
        adviceDiv.id = 'rate-advice';
        adviceDiv.textContent = adviceMessage;
        
        // 기존 조언 메시지가 있으면 제거
        const existingAdvice = document.getElementById('rate-advice');
        if (existingAdvice) {
            existingAdvice.remove();
        }
        
        // 조언 메시지를 rate-container 내부에 삽입
        document.querySelector('.rate-container').appendChild(adviceDiv);

        // 5. 타임스탬프 업데이트
        const now = new Date();
        const timeString = now.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        // 표시 텍스트를 "지난달 평균"으로 변경
        timestampElement.textContent = `마지막 업데이트: ${timeString} | 지난달 평균: ${LAST_MONTH_AVERAGE_KRW_PER_100JPY}원`;

    } catch (error) {
        console.error("환율 정보를 가져오는 데 실패했습니다:", error);
        rateElement.textContent = '데이터를 불러올 수 없습니다.';
        timestampElement.textContent = '업데이트 실패';
        rateSection.classList.add('bad-time');
    }
}

document.addEventListener('DOMContentLoaded', fetchExchangeRate);