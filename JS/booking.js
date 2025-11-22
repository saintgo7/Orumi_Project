// 항공권 및 숙소 예약 링크 생성

// 예약 링크 자동 생성 및 표시
function generateBookingLinks() {
    const startPoint = document.getElementById("start-point").value;
    const destination = document.getElementById("destination").value;
    const departDate = document.getElementById("depart-schedule").value;
    const arriveDate = document.getElementById("arrive-schedule").value;

    if (!destination || !departDate || !arriveDate) {
        return;
    }

    // 컨테이너 표시
    const bookingContainer = document.getElementById('booking-container');
    if (bookingContainer) {
        bookingContainer.style.display = 'block';
    }

    // 날짜 포맷 변환 (YYYY-MM-DD)
    const formatDate = (dateStr) => {
        return dateStr.replace(/-/g, '');
    };

    const formattedDepart = formatDate(departDate);
    const formattedReturn = formatDate(arriveDate);

    // 항공권 검색 링크 생성
    // Skyscanner
    const skyscannerLink = document.getElementById('skyscanner-link');
    if (skyscannerLink && startPoint) {
        // Skyscanner: https://www.skyscanner.co.kr/transport/flights/{origin}/{destination}/{outbound}/{inbound}
        const skyscannerUrl = `https://www.skyscanner.co.kr/transport/flights-from/${encodeURIComponent(startPoint)}/to/${encodeURIComponent(destination)}/${departDate}/${arriveDate}/`;
        skyscannerLink.href = skyscannerUrl;
    }

    // Google Flights
    const googleFlightsLink = document.getElementById('google-flights-link');
    if (googleFlightsLink && startPoint) {
        // Google Flights URL 형식
        const googleFlightsUrl = `https://www.google.com/travel/flights?q=flights%20from%20${encodeURIComponent(startPoint)}%20to%20${encodeURIComponent(destination)}%20on%20${departDate}%20return%20${arriveDate}`;
        googleFlightsLink.href = googleFlightsUrl;
    }

    // Kayak
    const kayakLink = document.getElementById('kayak-link');
    if (kayakLink && startPoint) {
        // Kayak URL 형식
        const kayakUrl = `https://www.kayak.co.kr/flights/${encodeURIComponent(startPoint)}-${encodeURIComponent(destination)}/${departDate}/${arriveDate}`;
        kayakLink.href = kayakUrl;
    }

    // 숙소 검색 링크 생성
    // Booking.com
    const bookingComLink = document.getElementById('booking-com-link');
    if (bookingComLink) {
        const checkIn = departDate;
        const checkOut = arriveDate;
        const bookingComUrl = `https://www.booking.com/searchresults.ko.html?ss=${encodeURIComponent(destination)}&checkin=${checkIn}&checkout=${checkOut}&group_adults=2&no_rooms=1`;
        bookingComLink.href = bookingComUrl;
    }

    // Airbnb
    const airbnbLink = document.getElementById('airbnb-link');
    if (airbnbLink) {
        const airbnbUrl = `https://www.airbnb.co.kr/s/${encodeURIComponent(destination)}/homes?checkin=${departDate}&checkout=${arriveDate}&adults=2`;
        airbnbLink.href = airbnbUrl;
    }

    // Agoda
    const agodaLink = document.getElementById('agoda-link');
    if (agodaLink) {
        const agodaUrl = `https://www.agoda.com/search?city=${encodeURIComponent(destination)}&checkIn=${departDate}&checkOut=${arriveDate}&rooms=1&adults=2`;
        agodaLink.href = agodaUrl;
    }

    // Hotels.com
    const hotelsComLink = document.getElementById('hotels-com-link');
    if (hotelsComLink) {
        const hotelsComUrl = `https://kr.hotels.com/search.do?q-destination=${encodeURIComponent(destination)}&q-check-in=${departDate}&q-check-out=${arriveDate}&q-rooms=1&q-room-0-adults=2`;
        hotelsComLink.href = hotelsComUrl;
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

    // 카테고리 합계 계산
    function calculateCategoryTotal() {
        let total = 0;
        categoryInputs.forEach(input => {
            const value = parseInt(input.value) || 0;
            total += value;
        });

        if (categoryTotalElement) {
            categoryTotalElement.textContent = total.toLocaleString();

            // 총 예산과 비교하여 색상 변경
            const totalBudget = parseInt(totalBudgetInput.value) || 0;
            if (totalBudget > 0) {
                if (total > totalBudget) {
                    categoryTotalElement.style.color = '#F44336'; // 빨강 (초과)
                } else if (total === totalBudget) {
                    categoryTotalElement.style.color = '#4CAF50'; // 초록 (정확히 맞음)
                } else {
                    categoryTotalElement.style.color = '#FF9800'; // 주황 (여유 있음)
                }
            } else {
                categoryTotalElement.style.color = 'inherit';
            }
        }
    }

    // 총 예산이 변경되면 카테고리 자동 분배 제안
    if (totalBudgetInput) {
        totalBudgetInput.addEventListener('input', function() {
            const totalBudget = parseInt(this.value) || 0;

            // 카테고리 입력이 모두 비어있을 때만 자동 분배
            const allEmpty = categoryInputs.every(input => !input.value || input.value === '0');

            if (totalBudget > 0 && allEmpty) {
                // 일반적인 예산 분배 비율
                // 항공권 30%, 숙박 25%, 식비 20%, 관광 15%, 교통 5%, 쇼핑 5%
                const percentages = [0.30, 0.25, 0.20, 0.15, 0.05, 0.05];

                categoryInputs.forEach((input, index) => {
                    const suggested = Math.floor(totalBudget * percentages[index] / 10000) * 10000;
                    input.placeholder = `권장: ${suggested.toLocaleString()}`;
                });
            }
        });
    }

    // 각 카테고리 입력 변경 시 합계 업데이트
    categoryInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', calculateCategoryTotal);
        }
    });

    // 초기 합계 계산
    calculateCategoryTotal();
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    setupBudgetCalculator();

    // 일정 생성 버튼 클릭 시 예약 링크 생성
    const chatContent = document.getElementById('chat-content');
    if (chatContent) {
        chatContent.addEventListener('input', function() {
            // 일정이 생성되면 예약 링크도 생성
            if (this.innerText && this.innerText.length > 100) {
                generateBookingLinks();
            }
        });
    }
});
