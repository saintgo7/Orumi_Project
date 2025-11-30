// 항공권 및 숙소 예약 링크 생성 (최종 수정: 호텔 검색 최적화)

function generateBookingLinks() {
    // 1. 사용자 입력값 가져오기
    let startPoint = document.getElementById("start-point").value;
    let destination = document.getElementById("destination").value;
    const departDate = document.getElementById("depart-schedule").value;
    const arriveDate = document.getElementById("arrive-schedule").value;

    if (!destination || !departDate || !arriveDate) {
        return;
    }

    // [신규] AI 데이터 읽기 & 호텔 이름 정제
    let aiStartCode = null;
    let aiDestCode = null;
    let aiHotelName = null;

    const aiDataBox = document.getElementById('ai-travel-data');
    if (aiDataBox) {
        // 공항 정보 가져오기
        if (aiDataBox.dataset.start) aiStartCode = aiDataBox.dataset.start;
        if (aiDataBox.dataset.end) aiDestCode = aiDataBox.dataset.end;
        if (aiDataBox.dataset.startName) startPoint = aiDataBox.dataset.startName;
        if (aiDataBox.dataset.endName) destination = aiDataBox.dataset.endName;
        
        // 호텔 정보 가져오기 & 특수문자 제거 (안전장치)
        if (aiDataBox.dataset.hotel) {
            let rawHotel = aiDataBox.dataset.hotel;
            // 별표(*), 대괄호([]), 따옴표 등을 제거하고 순수 텍스트만 남김
            aiHotelName = rawHotel.replace(/[\*\[\]"']/g, '').trim();
            console.log("🏨 정제된 호텔 검색어:", aiHotelName);
        }
    }

    // 숙소 검색어 결정: 호텔 이름이 있으면 '호텔 이름'만 사용 (중복 방지)
    // 호텔 이름이 없으면 '도시 이름' 사용
    const hotelQuery = aiHotelName ? aiHotelName : destination;

    // 컨테이너 표시
    const bookingContainer = document.getElementById('booking-container');
    if (bookingContainer) {
        bookingContainer.style.display = 'block';
    }

    // 2. IATA 공항 코드 매핑
    const cityCodes = {
        '인천': 'ICN', '김포': 'GMP', '부산': 'PUS', '대구': 'TAE', '제주': 'CJU', '청주': 'CJJ', '무안': 'MWX', '양양': 'YNY', 
        '광주': 'KWJ', '여수': 'RSU', '울산': 'USN', '포항경주': 'KPO', '진주(사천)': 'HIN', '원주': 'WJU', '군산': 'KUV',
        '도쿄': 'TYO', '오사카': 'OSA', '후쿠오카': 'FUK', '삿포로': 'SPK', '오키나와': 'OKA', '교토': 'OSA', '나고야': 'NGO',
        '방콕': 'BKK', '다낭': 'DAD', '나트랑': 'CXR', '세부': 'CEB', '싱가포르': 'SIN', '호치민': 'SGN', '하노이': 'HAN', '발리': 'DPS', 
        '코타키나발루': 'BKI', '보라카이': 'KLO', '푸켓': 'HKT', '파타야': 'UTP', '마닐라': 'MNL', '자카르타': 'JKT', '쿠알라룸푸르': 'KUL',
        '홍콩': 'HKG', '타이베이': 'TPE', '상하이': 'SHA', '베이징': 'BJS', '마카오': 'MFM', '가오슝': 'KHH',
        '파리': 'PAR', '런던': 'LON', '로마': 'ROM', '바르셀로나': 'BCN', '스위스': 'ZRH', '취리히': 'ZRH', '제네바': 'GVA', 
        '프라하': 'PRG', '빈': 'VIE', '뮌헨': 'MUC', '베를린': 'BER', '프랑크푸르트': 'FRA', '이스탄불': 'IST', '밀라노': 'MIL', 
        '피렌체': 'FLR', '베니스': 'VCE', '리옹': 'LYS', '니스': 'NCE', '에든버러': 'EDI', '잘츠부르크': 'SZG',
        '뉴욕': 'NYC', '로스앤젤레스': 'LAX', '하와이': 'HNL', '시드니': 'SYD', '괌': 'GUM', '사이판': 'SPN', '샌프란시스코': 'SFO', 
        '라스베이거스': 'LAS', '시애틀': 'SEA', '밴쿠버': 'YVR', '토론토': 'YTO', '몬트리올': 'YMQ', '멜버른': 'MEL', '골드코스트': 'OOL', 
        '오클랜드': 'AKL', '퀸스타운': 'ZQN', '두바이': 'DXB', '아부다비': 'AUH', '카파도키아': 'NAV'
    };

    const startCode = aiStartCode || cityCodes[startPoint] || 'ICN';
    const destCode = aiDestCode || cityCodes[destination] || 'TYO';

    const dateStart = departDate.replace(/-/g, '');
    const dateEnd = arriveDate.replace(/-/g, '');
    const shortDateStart = dateStart.slice(2);
    const shortDateEnd = dateEnd.slice(2);


    // --- 1. 항공권 링크 ---
    const skyscannerLink = document.getElementById('skyscanner-link');
    if (skyscannerLink) {
        skyscannerLink.href = `https://www.skyscanner.co.kr/transport/flights/${startCode}/${destCode}/${shortDateStart}/${shortDateEnd}`;
    }

    const googleFlightsLink = document.getElementById('google-flights-link');
    if (googleFlightsLink) {
        const query = `Flights from ${startCode} to ${destCode} on ${departDate} through ${arriveDate}`;
        googleFlightsLink.href = `https://www.google.com/travel/flights?q=${encodeURIComponent(query)}`;
    }

    const kayakLink = document.getElementById('kayak-link');
    if (kayakLink) {
        kayakLink.href = `https://www.kayak.co.kr/flights/${startCode}-${destCode}/${departDate}/${arriveDate}`;
    }

    const naverLink = document.getElementById('naver-flight-link');
    if (naverLink) {
        const query = `${startPoint}에서 ${destination} 항공권`;
        naverLink.href = `https://search.naver.com/search.naver?query=${encodeURIComponent(query)}`;
    }


    // --- 2. 숙소 링크 (파라미터 최적화) ---

    // Booking.com (ss: 검색어)
    const bookingComLink = document.getElementById('booking-com-link');
    if (bookingComLink) {
        bookingComLink.href = `https://www.booking.com/searchresults.ko.html?ss=${encodeURIComponent(hotelQuery)}&checkin=${departDate}&checkout=${arriveDate}&group_adults=2`;
    }

    // Airbnb (query: 검색어 - 에어비앤비는 호텔명보다 지역명이 나을 수 있으나 일관성을 위해 hotelQuery 사용)
    const airbnbLink = document.getElementById('airbnb-link');
    if (airbnbLink) {
        // 만약 호텔 이름이 있다면 에어비앤비에서는 검색이 안 될 확률이 높으므로
        // 호텔 이름이 있을 땐 '지역명'으로 검색하도록 예외 처리
        const airbnbQuery = aiHotelName ? destination : hotelQuery;
        airbnbLink.href = `https://www.airbnb.co.kr/s/${encodeURIComponent(airbnbQuery)}/homes?checkin=${departDate}&checkout=${arriveDate}&adults=2`;
    }

    // Expedia (destination: 검색어, d1/d2: 날짜)
    const expediaLink = document.getElementById('expedia-link');
    if (expediaLink) {
        // 날짜 형식을 startDate/endDate에서 d1/d2로 변경 (호환성 향상)
        expediaLink.href = `https://www.expedia.co.kr/Hotel-Search?destination=${encodeURIComponent(hotelQuery)}&d1=${departDate}&d2=${arriveDate}&adults=2`;
    }

    // Hotels.com (q-destination: 검색어, d1/d2: 날짜)
    const hotelsComLink = document.getElementById('hotels-com-link');
    if (hotelsComLink) {
        hotelsComLink.href = `https://kr.hotels.com/Hotel-Search?destination=${encodeURIComponent(hotelQuery)}&d1=${departDate}&d2=${arriveDate}&adults=2`;
    }
}

// 예산 계산기 기능
function setupBudgetCalculator() {
    const totalBudgetInput = document.getElementById('total-budget');
    const categoryInputs = [
        document.getElementById('budget-flight'),
        document.getElementById('budget-accommodation'),
        document.getElementById('budget-food'),
        document.getElementById('budget-activity'),
        document.getElementById('budget-transport'),
        document.getElementById('budget-shopping')
    ];
    const categoryTotalElement = document.getElementById('category-total');

    function calculateCategoryTotal() {
        let total = 0;
        categoryInputs.forEach(input => {
            if (input) {
                const value = parseInt(input.value) || 0;
                total += value;
            }
        });

        if (categoryTotalElement) {
            categoryTotalElement.textContent = total.toLocaleString();
            const totalBudget = totalBudgetInput ? (parseInt(totalBudgetInput.value) || 0) : 0;
            if (totalBudget > 0) {
                if (total > totalBudget) {
                    categoryTotalElement.style.color = '#F44336';
                } else if (total === totalBudget) {
                    categoryTotalElement.style.color = '#4CAF50';
                } else {
                    categoryTotalElement.style.color = '#FF9800';
                }
            } else {
                categoryTotalElement.style.color = 'inherit';
            }
        }
    }

    if (totalBudgetInput) {
        totalBudgetInput.addEventListener('input', function() {
            const totalBudget = parseInt(this.value) || 0;
            const allEmpty = categoryInputs.every(input => !input || !input.value || input.value === '0');

            if (totalBudget > 0 && allEmpty) {
                const percentages = [0.30, 0.25, 0.20, 0.15, 0.05, 0.05];
                categoryInputs.forEach((input, index) => {
                    if (input) {
                        const suggested = Math.floor(totalBudget * percentages[index] / 10000) * 10000;
                        input.placeholder = `권장: ${suggested.toLocaleString()}`;
                    }
                });
            }
        });
    }

    categoryInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', calculateCategoryTotal);
        }
    });

    calculateCategoryTotal();
}

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    setupBudgetCalculator();
    const chatContent = document.getElementById('chat-content');
    if (chatContent) {
        chatContent.addEventListener('input', function() {
            if (this.innerText && this.innerText.length > 100) {
                generateBookingLinks();
            }
        });
    }
});