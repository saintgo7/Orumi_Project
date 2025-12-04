# Travel Planner✈️
- 여행을 다루는 전문적인 여행 플래너 서비스입니다.
  * HTML, CSS, JavaScript을 이용한 미니 프로젝트

## 1. 목표와 기능
### 1.1 목표
- 여행객을 위한 웹 페이지 제작
- **Google Gemini API**를 이용하여 구체적인 여행 일정 계획 생성
- 사용자의 입력값을 정확히 인식하여 구체적인 결과값으로 반환
- 전체적인 깔끔하고 통일된 디자인으로 HTML,CSS 구성

### 1.2 기능
- **Google Gemini API**를 이용한 구체적인 여행 플래너 결과값 출력
  * input과 select태그를 사용해 사용자로부터 정확한 입력값 가져오기
  * 여러 여행 테마 동시 선택 가능 (식도락, 자연풍경, 역사유적, 액티비티, 쇼핑, 온천)
- 사용자의 가독성을 높이기 위한 반응형 웹 페이지 구현
  * 웹, 모바일 환경 고려
  * 지도와, 실시간 환율정보를 페이지내에서 쉽게 확인 가능

### 1.3 API 설정
- Google Gemini API 키가 필요합니다
- 자세한 설정 방법은 [API_SETUP.md](./API_SETUP.md) 참고

## 2. 개발 환경 및 배포 URL
### 2.1 개발 환경

 <img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white"> <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">

### 2.2 개발 기간
- 2025년 09월 30일 ~ 2025년 11월 30일

### 2.3 배포 URL
- https://kimyeoju.github.io/Orumi_Project/

## 3. 프로젝트 구조와 개발 일정
### 3.1 프로젝트 구조
---
```
📦 Project_1
├─ CSS
│  ├─ media.css
│  ├─ menu.css
│  ├─ slide.css
│  └─ style.css
├─ Img
│  ├─ 1.jpeg
│  ├─ 2.avif
│  ├─ 3.jpeg
│  ├─ 4.avif
│  ├─ 5.jpeg
│  ├─ 6.jpeg
│  ├─ hukuoka.jpeg
│  ├─ osaka.avif
│  ├─ spin.gif
│  └─ tokyo.jpeg
├─ JS
│  ├─ .DS_Store
│  ├─ .firebaserc
│  ├─ .gitignore
│  ├─ API_SETUP.md
│  ├─ FIREBASE_SETUP
│  ├─ README.md
│  ├─ firebase.json
│  ├─ firestore.indexes.json
│  ├─ firestore.rules
│  └─ index.html
│  ├─ join.html
│  ├─ login.html

```

---
 
 ### 3.2 개발 일정
 - 2025년 09월 30일 ~ 2025년 11월 30일
   * 프로젝트 시작
   * 여행 플래너 아이디어 구상
   * HTML 구조 생성, CSS를 활용하여 간단한 디자인 완성

 - 2025년 09월 30일 ~ 2025년 10월 14일
   * AI API를 이용한 입력값, 출력값 기능 구현
   * 사용자의 입력값을 시스템 프롬프트와 결합하여 정확한 출력값 반환
   * 화면에 답변을 그려주는 함수로 Html 결과값 박스에 연결
   * 여러 장 사진을 CSS를 통해 이미지 슬라이드 구현
   * CSS로 전체적인 웹 페이지 구조 완성
 
 - 2025년 10월 14일 ~ 2025년 11월 15일
   * 회원가입, 로그인, 시작화면 Html 생성
   * button을 누르면 로딩 이미지가 보여지는 함수와 로딩이 종료되는 함수 구현
   * CSS를 통해 로딩 이미지 가운데로 설정
   * 스크롤 시 생기는 상단 이동 스크롤 버튼 구현
     * 스크롤 거리에 따라 버튼 숨기기, 보이기
     * 스크롤 상단 이동시 속도 함수 구현

- 2025년 11월 16일 ~ 2025년 11월 29일
  * 상단 메뉴바 웹 반응형 헤더 구현
  * 창 축소 시 햄버거 버튼 구현
  * 디자인 수정
  * 지도 추가 html, css작성

- 2025년 11월 30일 ~ 2025년 12월 1일
  * 코드 리뷰와 리뷰 후 피드백 반영
  * 로딩 이미지 수정
  * 입력값을 지울 수 있는 리셋 버튼 생성
  * select 태그를 사용하여 사용자 입력값의 오류 감소
  * 화면 크기 변화에 따른 반응형 코드 추가
  * 화면 구성, 로딩 속도 고려
  * 실시간 환율계산 기능 추가
  * 리셋 버튼, 로딩 이미지 수정
 
- -> 추후에 추가 될 기능
  * 모바일, 웹 환경에 따라 미디어 쿼리 구현중
  * 실시간 날씨정보 기능 추가
  * 게시판, 마이페이지 추가
  * 생성한 일정 저장 기능 추

## 4. UI

 ### - **index.html**
 * 웹 페이지
![kimyeoju github io_Orumi_Project_ (4)](https://github.com/kimyeoju/Orumi_Project/assets/131739526/a48da348-2e6f-4602-8f00-12c396390451)



### - **login.html**
* 로그인 페이지
![kimyeoju github io_Orumi_Project_login html (1)](https://github.com/kimyeoju/Orumi_Project/assets/131739526/9032522e-50a9-4328-815d-bf8e262a88f0)


### - **join.html**
* 회원가입 페이지
![kimyeoju github io_Orumi_Project_join html (1)](https://github.com/kimyeoju/Orumi_Project/assets/131739526/865b5a4c-8db3-40b7-880e-98e4d5453484)

## 5. 메인 기능

- 사용자의 여행 일정 정보를 통해 구체적인 여행 일정 플래너 출력 (**Google Gemini API** 이용)
  * 출발지/여행지 선택
  * 여행 날짜 지정
  * 여행 테마 다중 선택 가능 (식도락, 자연풍경, 역사유적, 액티비티, 쇼핑, 온천)
  * 차량 렌트 여부 선택
  * AI가 생성한 Day별 상세 여행 계획 제공


## 6. API 변경 이력

### 2025년 11월 업데이트
- **변경**: OpenAI ChatGPT API → Google Gemini API
- **이유**:
  - 더 나은 무료 할당량 제공
  - 한국어 성능 향상
  - 안정적인 서비스 제공
- **주요 개선사항**:
  - 여러 여행 테마 동시 선택 가능
  - 더 자세한 시스템 프롬프트로 응답 품질 향상
  - 에러 핸들링 개선
