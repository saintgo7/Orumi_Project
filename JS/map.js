// Google Maps 표시 기능

// 여행지 정보 추출 및 지도 표시
function displayTravelMap() {
    const destination = document.getElementById("destination").value;

    if (!destination) {
        return;
    }

    // 지도 컨테이너 표시
    const mapContainer = document.getElementById('map-container');
    const travelMap = document.getElementById('travel-map');
    const googleMapsLink = document.getElementById('google-maps-link');

    if (!mapContainer || !travelMap) {
        return;
    }

    mapContainer.style.display = 'block';

    // 일본 주요 도시 좌표
    const cityCoordinates = {
        '삿포로': '43.0642,141.3469',
        '센다이': '38.2682,140.8694',
        '도쿄': '35.6762,139.6503',
        '나고야': '35.1815,136.9066',
        '오사카': '34.6937,135.5023',
        '교토': '35.0116,135.7681',
        '도쿠시마': '34.0658,134.5594',
        '히로시마': '34.3853,132.4553',
        '규슈': '33.5904,130.4017', // 후쿠오카 기준
        '오키나와': '26.2124,127.6809'
    };

    const coordinates = cityCoordinates[destination] || '35.6762,139.6503'; // 기본값: 도쿄
    const cityName = destination;

    // Google Maps Embed API 사용 (완전 무료)
    const mapHTML = `
        <iframe
            width="100%"
            height="100%"
            style="border:0; border-radius: 12px;"
            loading="lazy"
            allowfullscreen
            referrerpolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(cityName)},일본&zoom=12&language=ko">
        </iframe>
    `;

    travelMap.innerHTML = mapHTML;

    // 구글 맵 링크 설정
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cityName)}+일본`;
    googleMapsLink.href = mapsUrl;
}

// 맛집 정보에서 링크 생성
function createRestaurantLinks() {
    const content = document.getElementById('chat-content').value;

    if (!content) return;

    // 맛집 정보 패턴 찾기: "맛집명 (일본어명)" 형태
    const restaurantPattern = /(?:아침|점심|저녁|식사):\s*([^(]+)\s*\(([^)]+)\)/g;
    const matches = [...content.matchAll(restaurantPattern)];

    if (matches.length > 0) {
        console.log(`${matches.length}개의 맛집 정보를 찾았습니다.`);
        // 여기서 필요시 맛집 링크 정보를 추가로 처리할 수 있습니다
    }
}

// 답변 수신 후 자동으로 지도 표시
window.addEventListener('DOMContentLoaded', function() {
    const chatContent = document.getElementById('chat-content');

    if (chatContent) {
        // 답변 내용이 변경될 때마다 확인
        chatContent.addEventListener('input', function() {
            const content = chatContent.value;

            // 실제 답변이 있을 때만 지도 표시
            if (content && content !== '여행 일정이 완성되고 있습니다. 잠시만 기다려주세요 :)') {
                setTimeout(() => {
                    displayTravelMap();
                    createRestaurantLinks();
                }, 500);
            }
        });
    }
});
