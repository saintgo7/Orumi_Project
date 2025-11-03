# Travel Japan✈️
- 일본 여행만을 다루는 전문적인 일본 여행 플래너 서비스입니다.
  * HTML, CSS, JavaScript을 이용한 미니 프로젝트

## 1. 목표와 기능
### 1.1 목표
- 일본 여행객을 위한 웹 페이지 제작
- ChatGpt API를 이용하여 구체적인 일본 여행 일정 계획 생성
- 사용자의 입력값을 정확히 인식하여 구체적인 결과값으로 반환
- 전체적인 깔끔하고 통일된 디자인으로 HTML,CSS 구성

### 1.2 기능
- ChatGpt API를 이용한 구체적인 여행 플래너 결과값 출력
  * input과 select태그를 사용해 사용자로부터 정확한 입력값 가져오기
- 사용자의 가독성을 높이기 위한 반응형 웹 페이지 구현
  * 웹, 모바일 환경 고려

## 2. 개발 환경 및 배포 URL
### 2.1 개발 환경

 <img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white"> <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">

### 2.2 개발 기간
- 2023년 05월 30일 ~ 2023년 6월 15일

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
│  ├─ data.js
│  ├─ index.js
│  ├─ loader.js
│  ├─ menu.js
│  ├─ reset.js
│  └─ scroll.js
├─ README.md
├─ index.html
├─ join.html
└─ login.html
```

---
 
 ### 3.2 개발 일정
 - 2023년 05월 30일 ~ 2023년 06월 01일
   * 프로젝트 시작
   * 일본 여행 플래너 아이디어 구상
   * HTML 구조 생성, CSS를 활용하여 간단한 디자인 완성

 - 2023년 06월 02일 ~ 2023년 06월 06일
   * ChatGpt API를 이용한 입력값, 출력값 기능 구현
   * 사용자의 입력값을 예상해 data에 Assistant를 주어 정확한 출력값을 반환
   * 화면에 답변을 그려주는 함수로 Html 결과값 박스에 연결
   * 여러 장 사진을 CSS를 통해 이미지 슬라이드 구현
   * CSS로 전체적인 웹 페이지 구조 완성
 
 - 2023년 06월 07일 ~ 2023년 06월 10일
   * 회원가입, 로그인 Html 생성
   * button을 누르면 로딩 이미지가 보여지는 함수와 로딩이 종료되는 함수 구현
   * CSS를 통해 로딩 이미지 가운데로 설정
   * 스크롤 시 생기는 상단 이동 스크롤 버튼 구현
     * 스크롤 거리에 따라 버튼 숨기기, 보이기
     * 스크롤 상단 이동시 속도 함수 구현

- 2023년 06월 11일
  * 상단 메뉴바 웹 반응형 헤더 구현
    * 창 축소 시 햄버거 버튼 구현
  * 디자인 수정

- 2023년 06월 12일
  * 코드 리뷰와 리뷰 후 피드백 반영
    * 로딩 이미지 수정
    * 입력값을 지울 수 있는 리셋 버튼 생성
    * select 태그를 사용하여 사용자 입력값의 오류 감소
    * 화면 크기 변화에 따른 반응형 코드 추가
    * 화면 구성, 로딩 속도 고려
  
- 2023년 06월 13일
  * 리셋 버튼, 로딩 이미지 수정
 
- 2023년 06월 14일 ~ 2023년 06월 15일
- -> 추후에 추가 될 기능
  * 모바일, 웹 환경에 따라 미디어 쿼리 구현중
  * 결과창에 받은 답변 리셋 버튼과 연결 필요
  * 결과값을 txt 또는 pdf로 저장할 수 있는 기능 추가

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

- 사용자의 여행 일정 정보를 통해 구체적인 여행 일정 플래너 출력 (ChatGpt API이용)
![traveljapan](https://github.com/kimyeoju/Orumi_Project/assets/131739526/0da264b6-d66f-4a3e-956e-908f2e925fda)


## 6. 개발하며 느낀점

- "Travel Japan" 프로젝트는 인생에 있어 처음 해보는 프로젝트의며 나의 첫 번째 포트폴리오다.

