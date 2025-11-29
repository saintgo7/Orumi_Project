// Google Maps 표시 기능 (AI 연동 및 최신 URL 적용)

function displayTravelMap() {
    // 1. 기본 사용자 입력값 가져오기
    let destination = document.getElementById("destination").value;

    if (!destination) {
        return;
    }

    // 2. AI가 변경한 여행지 정보가 있는지 확인
    const aiDataBox = document.getElementById('ai-travel-data');
    if (aiDataBox && aiDataBox.dataset.endName) {
        console.log(`🗺️ 지도: AI가 제안한 여행지(${aiDataBox.dataset.endName})로 업데이트합니다.`);
        destination = aiDataBox.dataset.endName;
    }

    // 지도 컨테이너 표시
    const mapContainer = document.getElementById('map-container');
    const travelMap = document.getElementById('travel-map');
    const googleMapsLink = document.getElementById('google-maps-link');

    if (!mapContainer || !travelMap) {
        return;
    }

    // 섹션이 보일 때만 지도 표시
    mapContainer.style.display = 'block';

    // 3. 지도 URL 생성 (수정됨: '여행' 키워드 제거)
    // 도시 이름만 깔끔하게 검색해야 지도가 정확한 위치를 찾습니다.
    const query = destination; 
    
    // Google Maps Embed URL
    const mapHTML = `
        <iframe
            width="100%"
            height="100%"
            style="border:0; border-radius: 12px;"
            loading="lazy"
            allowfullscreen
            referrerpolicy="no-referrer-when-downgrade"
            src="https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed">
        </iframe>
    `;

    travelMap.innerHTML = mapHTML;

    // 4. 구글 맵 '크게 보기' 링크 업데이트
    if (googleMapsLink) {
        const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
        googleMapsLink.href = mapsUrl;
    }
}

// 답변 생성 감지 및 지도 업데이트
document.addEventListener('DOMContentLoaded', function() {
    const chatContent = document.getElementById('chat-content');

    if (chatContent) {
        // 답변이 작성되는 동안(input)에는 너무 빈번하므로,
        // 일정 생성이 거의 완료되었을 때나 변경이 감지되었을 때 실행
        chatContent.addEventListener('input', function() {
            const content = chatContent.innerText;

            // 내용이 충분히 생성되었을 때 지도 표시
            if (content && content.length > 100) {
                // 약간의 딜레이를 주어 AI 데이터 박스가 생성된 후 지도를 그립니다.
                setTimeout(displayTravelMap, 500); 
            }
        });
    }
});