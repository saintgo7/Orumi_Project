const toggleBtn = document.querySelector('.header_toogleBtn');
const menu = document.querySelector('.menu');
const icons = document.querySelector('.menu_icons');

// 햄버거 버튼 클릭 활성화
toggleBtn.addEventListener('click', () => {
  menu.classList.toggle('active');
  // icons.classList.toggle('active');
});

// DOM(페이지)이 완전히 로드된 후에 스크립트를 실행합니다.
document.addEventListener('DOMContentLoaded', () => {

    // 1. 우리가 ID로 지정한 'brand-logo-text' 요소를 찾습니다.
    const logoText = document.getElementById('brand-logo-text');

    // 2. 해당 요소가 페이지에 존재할 때만 아래 코드를 실행합니다.
    if (logoText) {
        
        // 3. 바꾸고 싶은 단어 목록을 순서대로 만듭니다. (마지막이 최종 단어)
        const locations = [
            "Travel France", 
            "Travel Spain", 
            "Travel Italy", // 4번 정도 바꾼다고 하셔서 하나 추가했어요.
            "Travel World"  // 마지막에 고정될 단어
        ];
        
        let index = 0; // 현재 몇 번째 단어인지 기억
        
        // 4. 각 단어를 보여줄 시간(1.5초)과 사라지는 시간(0.4초)
        const holdTime = 1500; // 1.5초 (ms)
        const fadeTime = 400;  // 0.4초 (ms) - CSS와 일치

        const changeWord = () => {
            // A. 현재 텍스트를 스르륵 사라지게(투명하게) 함
            logoText.style.opacity = 0;

            // B. 사라지는 시간(0.4초) 후에 실제 텍스트를 변경
            setTimeout(() => {
                // C. 다음 단어로 텍스트를 교체
                logoText.textContent = locations[index];
                
                // D. 다시 스르륵 나타나게(불투명하게) 함
                logoText.style.opacity = 1;
                
                // E. 다음 단어로 인덱스 이동
                index++;
                
                // F. 아직 바꿀 단어가 남아있다면(마지막이 아니라면)
                if (index < locations.length) {
                    // 1.5초 뒤에 다음 단어로 바꾸는 함수를 다시 호출
                    setTimeout(changeWord, holdTime);
                }
                // (locations.length와 같아지면 'Travel World'에서 멈춤)

            }, fadeTime);
        };

        // 5. 페이지가 로드되고 2초 뒤에 첫 번째 애니메이션을 시작합니다.
        setTimeout(changeWord, 2000); // (2초)
    }
});