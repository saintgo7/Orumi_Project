// Excel 내보내기 기능

function exportToExcel() {
    // 여행 일정 내용 가져오기
    const content = document.getElementById('chat-content').innerText;

    // 내용이 비어있는지 확인
    if (!content || content === '여행 일정이 완성되고 있습니다. 잠시만 기다려주세요 :)') {
        alert('내보낼 여행 일정이 없습니다. 먼저 여행 계획을 생성해주세요.');
        return;
    }

    // 현재 날짜와 시간 가져오기
    const now = new Date();
    const dateStr = now.toLocaleDateString('ko-KR').replace(/\. /g, '-').replace('.', '');
    const timeStr = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }).replace(':', '-');

    // 사용자 입력 정보 가져오기
    const startPoint = document.getElementById("start-point").value || '미입력';
    const destination = document.getElementById("destination").value || '미입력';
    const departDate = document.getElementById("depart-schedule").value || '미입력';
    const arriveDate = document.getElementById("arrive-schedule").value || '미입력';

    // 선호하는 테마 가져오기
    const temaInputs = document.getElementsByName('tema');
    let temas = [];
    for (let i = 0; i < temaInputs.length; i++) {
        if (temaInputs[i].checked) {
            temas.push(temaInputs[i].nextElementSibling.textContent);
        }
    }
    const temaStr = temas.length > 0 ? temas.join(', ') : '미선택';

    // 차량 렌트 정보 가져오기
    const carRentInputs = document.getElementsByName("car-rent");
    let carRent = '미선택';
    for (let i = 0; i < carRentInputs.length; i++) {
        if (carRentInputs[i].checked) {
            carRent = carRentInputs[i].value === 'yes' ? '예' : '아니오';
            break;
        }
    }

    // Excel 데이터 준비
    const data = [
        ['🇯🇵 Travel Japan - 일본 여행 플래너'],
        [''],
        ['📋 여행 정보'],
        ['출발지', startPoint],
        ['여행지', destination],
        ['출발일', departDate],
        ['도착일', arriveDate],
        ['선호 테마', temaStr],
        ['차량 렌트', carRent],
        [''],
        ['✈️ 여행 일정'],
        [''],
    ];

    // 여행 일정 내용을 줄 단위로 분리하여 추가
    const lines = content.split('\n');
    lines.forEach(line => {
        data.push([line]);
    });

    // 하단 정보 추가
    data.push(['']);
    data.push(['생성 일시', `${dateStr} ${timeStr}`]);
    data.push(['생성 도구', 'Travel Japan (https://kimyeoju.github.io/Orumi_Project/)']);

    // 워크시트 생성
    const ws = XLSX.utils.aoa_to_sheet(data);

    // 열 너비 설정
    ws['!cols'] = [
        { wch: 15 },  // A열
        { wch: 80 }   // B열
    ];

    // 스타일 설정 (제목 행)
    ws['A1'].s = {
        font: { bold: true, sz: 16, color: { rgb: "E63946" } },
        alignment: { horizontal: "center", vertical: "center" }
    };

    // 워크북 생성
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "여행 일정");

    // 맛집 정보 추출 및 시트 생성
    const restaurantPattern = /(?:아침|점심|저녁|식사):\s*([^(]+)\s*\(([^)]+)\)\s*⭐([\d.]+)/g;
    const restaurants = [];
    let match;

    while ((match = restaurantPattern.exec(content)) !== null) {
        const restaurantName = match[1].trim();
        const japaneseName = match[2].trim();
        const rating = match[3];

        // Google Maps 검색 URL 생성 (여행지 + 맛집명)
        const searchQuery = `${destination} ${restaurantName} ${japaneseName}`;
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;

        restaurants.push({
            name: restaurantName,
            japanese: japaneseName,
            rating: rating,
            url: mapsUrl
        });
    }

    // 맛집이 있으면 별도 시트 추가
    if (restaurants.length > 0) {
        const restaurantData = [
            ['🍽️ 추천 맛집 정보'],
            [''],
            ['맛집명', '일본어명', '평점', 'Google Maps 링크']
        ];

        restaurants.forEach(restaurant => {
            restaurantData.push([
                restaurant.name,
                restaurant.japanese,
                `⭐${restaurant.rating}`,
                restaurant.url
            ]);
        });

        const wsRestaurant = XLSX.utils.aoa_to_sheet(restaurantData);

        // 맛집 시트 열 너비 설정
        wsRestaurant['!cols'] = [
            { wch: 25 },  // 맛집명
            { wch: 25 },  // 일본어명
            { wch: 10 },  // 평점
            { wch: 60 }   // Google Maps 링크
        ];

        // 제목 스타일
        wsRestaurant['A1'].s = {
            font: { bold: true, sz: 16, color: { rgb: "E63946" } },
            alignment: { horizontal: "center", vertical: "center" }
        };

        XLSX.utils.book_append_sheet(wb, wsRestaurant, "맛집 정보");
    }

    // 파일명 생성
    const fileName = `일본여행계획_${destination}_${dateStr}.xlsx`;

    // Excel 파일 다운로드
    XLSX.writeFile(wb, fileName);

    // 성공 메시지
    console.log(`Excel 파일이 생성되었습니다: ${fileName}`);
}

// 답변이 있을 때만 버튼 활성화
document.addEventListener('DOMContentLoaded', function() {
    const chatContent = document.getElementById('chat-content');
    const exportBtn = document.getElementById('export-excel-btn');

    // 초기 상태 설정
    if (exportBtn) {
        exportBtn.disabled = true;
        exportBtn.style.opacity = '0.5';
        exportBtn.style.cursor = 'not-allowed';
    }

    // 답변 내용 변경 감지
    if (chatContent) {
        // textarea 값 변경 감지를 위한 MutationObserver 사용
        const observer = new MutationObserver(function() {
            checkContent();
        });

        // input 이벤트로도 감지
        chatContent.addEventListener('input', checkContent);
        chatContent.addEventListener('change', checkContent);

        function checkContent() {
            const content = chatContent.innerText;
            if (exportBtn) {
                if (content && content !== '여행 일정이 완성되고 있습니다. 잠시만 기다려주세요 :)') {
                    exportBtn.disabled = false;
                    exportBtn.style.opacity = '1';
                    exportBtn.style.cursor = 'pointer';
                } else {
                    exportBtn.disabled = true;
                    exportBtn.style.opacity = '0.5';
                    exportBtn.style.cursor = 'not-allowed';
                }
            }
        }
    }
});
