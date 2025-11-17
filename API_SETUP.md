# Google Gemini API 설정 가이드

이 프로젝트는 Google Gemini API를 사용하여 AI 기반 일본 여행 계획을 생성합니다.

## 1. Gemini API 키 발급받기

### 1.1 Google AI Studio 접속
1. 브라우저에서 [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey) 접속
2. Google 계정으로 로그인

### 1.2 API 키 생성
1. "Create API Key" 버튼 클릭
2. 프로젝트 선택 또는 새 프로젝트 생성
3. API 키가 생성되면 복사 (예: `AIzaSyABC123...`)

⚠️ **주의**: API 키는 안전하게 보관하고 공개 저장소에 업로드하지 마세요!

---

## 2. 프로젝트에 API 키 적용하기

### 2.1 웹 페이지에서 직접 설정 (권장)

**코드 수정 없이 웹 페이지에서 직접 설정 가능합니다!**

1. 웹 브라우저에서 `index.html` 파일 열기
2. "Google Gemini API 설정" 섹션 찾기 (여행 플래너 상단)
3. 섹션 펼치기 (화살표 버튼 클릭)
4. API 키 입력란에 발급받은 API 키 붙여넣기
5. "저장" 버튼 클릭
6. ✅ "API 키가 성공적으로 저장되었습니다!" 메시지 확인

**장점:**
- ✅ 코드 수정 불필요
- ✅ LocalStorage에 안전하게 저장
- ✅ 브라우저를 닫아도 유지됨
- ✅ 서버로 전송되지 않음
- ✅ 언제든지 변경/삭제 가능

### 2.2 코드에서 직접 설정 (선택사항)

웹 페이지에서 설정하는 방법을 권장하지만, 원한다면 코드에서도 설정 가능합니다:

1. `JS/main.js` 파일을 텍스트 에디터로 열기
2. `getApiKey()` 함수를 수정하여 API 키 하드코딩:
   ```javascript
   function getApiKey() {
       return 'AIzaSyABC123...'; // 실제 발급받은 키 입력
   }
   ```
3. 파일 저장

⚠️ **주의**: 이 방법은 Git에 커밋하면 API 키가 노출되므로 권장하지 않습니다.

---

## 3. 테스트하기

1. 웹 브라우저에서 `index.html` 파일 열기
2. 여행 정보 입력:
   - 출발지 선택
   - 여행지 선택
   - 출발일/도착일 선택
   - 여행 테마 선택
   - 차량 렌트 여부 선택
3. "일정 생성" 버튼 클릭
4. 로딩 후 AI가 생성한 여행 계획 확인

---

## 4. 문제 해결

### API 키 오류가 발생하는 경우
- **증상**: "오류가 발생했습니다: API_KEY_INVALID"
- **해결방법**:
  1. API 키가 정확히 복사되었는지 확인
  2. Google AI Studio에서 API 키 활성화 상태 확인
  3. API 키 앞뒤 공백 제거 확인

### CORS 오류가 발생하는 경우
- **증상**: "CORS policy" 관련 오류
- **해결방법**:
  1. 로컬 서버 사용 권장 (VS Code Live Server, Python http.server 등)
  2. `file://` 프로토콜 대신 `http://localhost` 사용

### 응답이 없는 경우
- **증상**: 로딩만 계속되고 결과가 나오지 않음
- **해결방법**:
  1. 인터넷 연결 확인
  2. 브라우저 콘솔(F12)에서 에러 메시지 확인
  3. API 사용 할당량 확인 (무료 버전은 일일 요청 제한 있음)

---

## 5. API 사용 제한

### 무료 플랜 (Free tier)
- **요청 제한**: 분당 60회
- **일일 제한**: 약 1,500회
- **토큰 제한**: 요청당 최대 32,760 토큰

더 많은 사용이 필요한 경우 Google Cloud Console에서 유료 플랜 전환 가능

---

## 6. 보안 권장사항

### 개발 환경
✅ **권장**: 환경 변수 사용
```javascript
const API_KEY = process.env.GEMINI_API_KEY;
```

✅ **권장**: `.gitignore`에 API 키 포함 파일 추가
```
# .gitignore
config.js
.env
```

❌ **비권장**: 소스 코드에 직접 하드코딩

### 프로덕션 환경
- 백엔드 서버에서 API 호출
- 프론트엔드에 API 키 노출 금지
- API 키 회전(rotation) 주기적 실행

---

## 7. 추가 자료

- [Google AI for Developers 공식 문서](https://ai.google.dev/)
- [Gemini API 레퍼런스](https://ai.google.dev/api/rest)
- [API 할당량 관리](https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas)

---

## 변경 이력

- **2024-11**: OpenAI API에서 Google Gemini API로 변경
  - 이유: 더 나은 성능과 무료 할당량
  - 주요 변경사항: API 엔드포인트, 요청/응답 형식
