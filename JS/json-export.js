// JSON 형식으로 여행 일정을 파싱하고 Excel로 내보내기

// 여행 일정을 JSON으로 파싱하는 함수
function parseItineraryToJSON() {
    const content = document.getElementById('chat-content').value;

    if (!content || content === '여행 일정이 완성되고 있습니다. 잠시만 기다려주세요 :)') {
        return null;
    }

    // 사용자 입력 정보 수집
    const tripInfo = {
        startPoint: document.getElementById("start-point").value || '미입력',
        destination: document.getElementById("destination").value || '미입력',
        departDate: document.getElementById("depart-schedule").value || '미입력',
        arriveDate: document.getElementById("arrive-schedule").value || '미입력',
        themes: [],
        carRent: '미선택'
    };

    // 선호하는 테마 수집
    const temaInputs = document.getElementsByName('tema');
    for (let i = 0; i < temaInputs.length; i++) {
        if (temaInputs[i].checked) {
            tripInfo.themes.push(temaInputs[i].nextElementSibling.textContent);
        }
    }

    // 차량 렌트 정보
    const carRentInputs = document.getElementsByName("car-rent");
    for (let i = 0; i < carRentInputs.length; i++) {
        if (carRentInputs[i].checked) {
            tripInfo.carRent = carRentInputs[i].value === 'yes' ? '예' : '아니오';
            break;
        }
    }

    // 일정 파싱
    const itinerary = [];
    const restaurants = [];
    const lines = content.split('\n');

    let currentDay = null;
    const dayPattern = /^Day\s*(\d+)/i;
    const timePattern = /^(\d{1,2}:\d{2})\s+(.+)/;
    const restaurantPattern = /(?:아침|점심|저녁|식사):\s*([^(]+)\s*\(([^)]+)\)\s*⭐([\d.]+)(?:\s*-\s*(.+))?/;

    lines.forEach(line => {
        line = line.trim();
        if (!line) return;

        // Day 패턴 매칭
        const dayMatch = line.match(dayPattern);
        if (dayMatch) {
            if (currentDay) {
                itinerary.push(currentDay);
            }
            currentDay = {
                day: parseInt(dayMatch[1]),
                date: line.includes('-') ? line.split('-')[1].trim() : '',
                activities: []
            };
            return;
        }

        // 시간대별 활동 패턴 매칭
        if (currentDay) {
            const timeMatch = line.match(timePattern);
            if (timeMatch) {
                const time = timeMatch[1];
                const description = timeMatch[2];

                const activity = {
                    time: time,
                    description: description
                };

                // 맛집 정보 파싱
                const restaurantMatch = description.match(restaurantPattern);
                if (restaurantMatch) {
                    const mealType = description.split(':')[0];
                    const restaurant = {
                        name: restaurantMatch[1].trim(),
                        japaneseName: restaurantMatch[2].trim(),
                        rating: restaurantMatch[3],
                        menu: restaurantMatch[4] ? restaurantMatch[4].trim() : '',
                        mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tripInfo.destination + ' ' + restaurantMatch[1].trim() + ' ' + restaurantMatch[2].trim())}`
                    };

                    activity.type = 'meal';
                    activity.mealType = mealType;
                    activity.restaurant = restaurant;

                    // 맛집 목록에 추가 (중복 체크)
                    if (!restaurants.find(r => r.name === restaurant.name && r.japaneseName === restaurant.japaneseName)) {
                        restaurants.push({
                            ...restaurant,
                            day: currentDay.day,
                            time: time,
                            mealType: mealType
                        });
                    }
                } else {
                    activity.type = 'activity';
                }

                currentDay.activities.push(activity);
            }
        }
    });

    // 마지막 day 추가
    if (currentDay && currentDay.activities.length > 0) {
        itinerary.push(currentDay);
    }

    return {
        tripInfo: tripInfo,
        itinerary: itinerary,
        restaurants: restaurants,
        generatedAt: new Date().toISOString()
    };
}

// JSON을 Excel로 변환하여 다운로드
function exportJSONToExcel() {
    const jsonData = parseItineraryToJSON();

    if (!jsonData) {
        alert('내보낼 여행 일정이 없습니다. 먼저 여행 계획을 생성해주세요.');
        return;
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('ko-KR').replace(/\. /g, '-').replace('.', '');

    // 워크북 생성
    const wb = XLSX.utils.book_new();

    // 1. 여행 정보 시트
    const tripInfoData = [
        ['🇯🇵 Travel Japan - 여행 정보 (JSON 형식)'],
        [''],
        ['항목', '내용'],
        ['출발지', jsonData.tripInfo.startPoint],
        ['여행지', jsonData.tripInfo.destination],
        ['출발일', jsonData.tripInfo.departDate],
        ['도착일', jsonData.tripInfo.arriveDate],
        ['선호 테마', jsonData.tripInfo.themes.join(', ')],
        ['차량 렌트', jsonData.tripInfo.carRent],
        ['생성 일시', new Date(jsonData.generatedAt).toLocaleString('ko-KR')]
    ];

    const wsTripInfo = XLSX.utils.aoa_to_sheet(tripInfoData);
    wsTripInfo['!cols'] = [{ wch: 15 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(wb, wsTripInfo, "여행정보");

    // 2. 일정별 상세 시트
    const itineraryData = [
        ['📅 상세 일정'],
        [''],
        ['Day', '날짜', '시간', '유형', '활동 내용', '맛집명', '일본어명', '평점', '대표 메뉴']
    ];

    jsonData.itinerary.forEach(day => {
        day.activities.forEach(activity => {
            const row = [
                `Day ${day.day}`,
                day.date,
                activity.time,
                activity.type === 'meal' ? '식사' : '관광',
                activity.description
            ];

            if (activity.restaurant) {
                row.push(
                    activity.restaurant.name,
                    activity.restaurant.japaneseName,
                    `⭐${activity.restaurant.rating}`,
                    activity.restaurant.menu
                );
            } else {
                row.push('', '', '', '');
            }

            itineraryData.push(row);
        });
        // Day 구분선
        itineraryData.push(['', '', '', '', '', '', '', '', '']);
    });

    const wsItinerary = XLSX.utils.aoa_to_sheet(itineraryData);
    wsItinerary['!cols'] = [
        { wch: 8 },   // Day
        { wch: 12 },  // 날짜
        { wch: 8 },   // 시간
        { wch: 8 },   // 유형
        { wch: 40 },  // 활동 내용
        { wch: 20 },  // 맛집명
        { wch: 20 },  // 일본어명
        { wch: 8 },   // 평점
        { wch: 25 }   // 대표 메뉴
    ];
    XLSX.utils.book_append_sheet(wb, wsItinerary, "상세일정");

    // 3. 맛집 정보 시트 (있을 경우)
    if (jsonData.restaurants.length > 0) {
        const restaurantData = [
            ['🍽️ 맛집 정보'],
            [''],
            ['Day', '시간', '식사', '맛집명', '일본어명', '평점', '대표 메뉴', 'Google Maps 링크']
        ];

        jsonData.restaurants.forEach(restaurant => {
            restaurantData.push([
                `Day ${restaurant.day}`,
                restaurant.time,
                restaurant.mealType,
                restaurant.name,
                restaurant.japaneseName,
                `⭐${restaurant.rating}`,
                restaurant.menu,
                restaurant.mapsUrl
            ]);
        });

        const wsRestaurant = XLSX.utils.aoa_to_sheet(restaurantData);
        wsRestaurant['!cols'] = [
            { wch: 8 },   // Day
            { wch: 8 },   // 시간
            { wch: 8 },   // 식사
            { wch: 25 },  // 맛집명
            { wch: 25 },  // 일본어명
            { wch: 8 },   // 평점
            { wch: 25 },  // 대표 메뉴
            { wch: 60 }   // Google Maps 링크
        ];
        XLSX.utils.book_append_sheet(wb, wsRestaurant, "맛집정보");
    }

    // 4. JSON Raw Data 시트
    const jsonRawData = [
        ['📋 JSON Raw Data'],
        [''],
        ['여행 일정 전체 데이터 (JSON 형식)'],
        [''],
        [JSON.stringify(jsonData, null, 2)]
    ];

    const wsJSON = XLSX.utils.aoa_to_sheet(jsonRawData);
    wsJSON['!cols'] = [{ wch: 100 }];
    XLSX.utils.book_append_sheet(wb, wsJSON, "JSON데이터");

    // 파일명 생성
    const fileName = `일본여행계획_JSON_${jsonData.tripInfo.destination}_${dateStr}.xlsx`;

    // Excel 파일 다운로드
    XLSX.writeFile(wb, fileName);

    console.log(`JSON Excel 파일이 생성되었습니다: ${fileName}`);
}

// JSON 파일로 다운로드하는 함수
function downloadJSON() {
    const jsonData = parseItineraryToJSON();

    if (!jsonData) {
        alert('내보낼 여행 일정이 없습니다. 먼저 여행 계획을 생성해주세요.');
        return;
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('ko-KR').replace(/\. /g, '-').replace('.', '');
    const fileName = `일본여행계획_${jsonData.tripInfo.destination}_${dateStr}.json`;

    // JSON 문자열 생성
    const jsonString = JSON.stringify(jsonData, null, 2);

    // Blob 생성
    const blob = new Blob([jsonString], { type: 'application/json' });

    // 다운로드 링크 생성
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

    // URL 해제
    URL.revokeObjectURL(link.href);

    console.log(`JSON 파일이 생성되었습니다: ${fileName}`);
}

// 버튼 활성화 상태 관리
document.addEventListener('DOMContentLoaded', function() {
    const chatContent = document.getElementById('chat-content');
    const jsonExcelBtn = document.getElementById('json-excel-btn');
    const jsonDownloadBtn = document.getElementById('json-download-btn');

    // 초기 상태 설정
    if (jsonExcelBtn) {
        jsonExcelBtn.disabled = true;
        jsonExcelBtn.style.opacity = '0.5';
        jsonExcelBtn.style.cursor = 'not-allowed';
    }

    if (jsonDownloadBtn) {
        jsonDownloadBtn.disabled = true;
        jsonDownloadBtn.style.opacity = '0.5';
        jsonDownloadBtn.style.cursor = 'not-allowed';
    }

    // 답변 내용 변경 감지
    if (chatContent) {
        chatContent.addEventListener('input', checkContent);
        chatContent.addEventListener('change', checkContent);

        function checkContent() {
            const content = chatContent.value;
            const hasContent = content && content !== '여행 일정이 완성되고 있습니다. 잠시만 기다려주세요 :)';

            [jsonExcelBtn, jsonDownloadBtn].forEach(btn => {
                if (btn) {
                    if (hasContent) {
                        btn.disabled = false;
                        btn.style.opacity = '1';
                        btn.style.cursor = 'pointer';
                    } else {
                        btn.disabled = true;
                        btn.style.opacity = '0.5';
                        btn.style.cursor = 'not-allowed';
                    }
                }
            });
        }
    }
});
