# Firebase 설정 가이드

회원가입 및 로그인 기능을 사용하기 위해 Firebase를 설정해야 합니다.

## 1. Firebase 콘솔에서 설정 정보 가져오기

### 1단계: Firebase 콘솔 접속
1. [Firebase 콘솔](https://console.firebase.google.com/)에 접속합니다.
2. 프로젝트 `travel-8d33b`를 선택합니다.

### 2단계: 웹 앱 설정 확인
1. 프로젝트 개요 페이지에서 톱니바퀴 아이콘(⚙️) → **프로젝트 설정**을 클릭합니다.
2. 아래로 스크롤하여 **"내 앱"** 섹션을 찾습니다.
3. 웹 앱(</>)이 등록되어 있지 않다면:
   - **앱 추가** → **웹(</>)** 선택
   - 앱 닉네임 입력 (예: "Travel Planner Web")
   - **앱 등록** 클릭

### 3단계: SDK 구성 정보 복사
**"SDK 설정 및 구성"** 섹션에서 다음과 같은 정보를 확인할 수 있습니다:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "travel-8d33b.firebaseapp.com",
  projectId: "travel-8d33b",
  storageBucket: "travel-8d33b.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

## 2. 프로젝트에 Firebase 설정 적용

### 설정 파일 생성

**중요: 보안을 위해 실제 API 키는 Git에 커밋되지 않습니다.**

1. `JS/firebase-config.example.js` 파일을 복사하여 `JS/firebase-config.js`로 저장합니다:
   ```bash
   # 터미널에서 실행 (Mac/Linux)
   cp JS/firebase-config.example.js JS/firebase-config.js

   # Windows에서는
   copy JS\firebase-config.example.js JS\firebase-config.js
   ```

2. 생성된 `JS/firebase-config.js` 파일을 열고 Firebase 콘솔에서 복사한 값으로 아래 항목들을 교체합니다:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",           // ← Firebase 콘솔에서 복사
  authDomain: "travel-8d33b.firebaseapp.com",
  projectId: "travel-8d33b",
  storageBucket: "travel-8d33b.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",  // ← Firebase 콘솔에서 복사
  appId: "YOUR_APP_ID"              // ← Firebase 콘솔에서 복사
};
```

**주의:**
- `apiKey`, `messagingSenderId`, `appId` 값만 변경하면 됩니다.
- 나머지 값(`authDomain`, `projectId`, `storageBucket`)은 이미 올바르게 설정되어 있습니다.
- `firebase-config.js` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.
- **절대로 `firebase-config.js` 파일을 Git에 추가하지 마세요!**

## 3. Firestore 데이터베이스 활성화

### 1단계: Firestore 생성
1. Firebase 콘솔 왼쪽 메뉴에서 **Firestore Database**를 클릭합니다.
2. **데이터베이스 만들기** 버튼을 클릭합니다.
3. 보안 규칙 선택:
   - **테스트 모드로 시작** 선택 (개발 중)
   - 나중에 프로덕션 모드로 변경 가능
4. 위치 선택:
   - `asia-northeast1` (도쿄) 또는 `asia-northeast3` (서울) 선택
   - **완료** 클릭

### 2단계: 보안 규칙 확인
Firestore 보안 규칙이 다음과 같이 설정되어 있는지 확인합니다:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 12, 28);
    }
  }
}
```

**주의:** 이 규칙은 개발용입니다. 프로덕션 배포 전에 더 안전한 규칙으로 변경해야 합니다.

## 4. 기능 테스트

### 회원가입 테스트
1. 브라우저에서 `join.html` 페이지를 엽니다.
2. 회원 정보를 입력하고 **회원가입** 버튼을 클릭합니다.
3. 성공 메시지가 표시되고 로그인 페이지로 이동하는지 확인합니다.
4. Firebase 콘솔 → Firestore Database에서 `users` 컬렉션에 데이터가 저장되었는지 확인합니다.

### 로그인 테스트
1. 브라우저에서 `login.html` 페이지를 엽니다.
2. 회원가입한 아이디와 비밀번호를 입력합니다.
3. **로그인** 버튼을 클릭합니다.
4. 환영 메시지가 표시되고 메인 페이지로 이동하는지 확인합니다.

## 5. Firestore 데이터 구조

회원 정보는 다음과 같은 구조로 저장됩니다:

```
users (컬렉션)
  └── {userId} (문서 ID)
        ├── userId: "user123"
        ├── email: "user@example.com"
        ├── password: "해시된_비밀번호"
        ├── nickname: "닉네임"
        ├── gender: "male" | "female" | "choice"
        ├── favoriteThemes: ["food-travel", "nature-travel", ...]
        ├── createdAt: Timestamp
        ├── updatedAt: Timestamp
        └── lastLogin: Timestamp
```

## 6. 보안 권장사항

### 프로덕션 배포 전 확인사항:

1. **Firestore 보안 규칙 강화**
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         // 본인의 데이터만 읽기 가능
         allow read: if request.auth != null && request.auth.uid == userId;
         // 신규 사용자 등록만 허용
         allow create: if request.auth == null;
         // 본인의 데이터만 수정 가능
         allow update: if request.auth != null && request.auth.uid == userId;
         // 삭제 비허용
         allow delete: if false;
       }
     }
   }
   ```

2. **비밀번호 정책 강화**
   - 최소 8자 이상
   - 대소문자, 숫자, 특수문자 조합 권장

3. **API 키 보호**
   - Firebase API 키는 클라이언트에 노출되어도 괜찮지만
   - Firestore 보안 규칙으로 데이터 접근을 제어해야 합니다.
   - `firebase-config.js` 파일은 `.gitignore`에 포함되어 Git 저장소에 업로드되지 않습니다.
   - 팀원과 협업 시, `firebase-config.example.js`를 복사하여 각자 설정 파일을 만들어야 합니다.

## 문제 해결

### 오류: "Firebase is not defined"
→ `firebase-config.js`보다 Firebase SDK 스크립트가 먼저 로드되는지 확인하세요.

### 오류: "Permission denied"
→ Firestore 보안 규칙을 확인하세요. 개발 중에는 테스트 모드 규칙을 사용하세요.

### 회원가입 후 Firestore에 데이터가 없음
→ Firebase 콘솔에서 프로젝트 ID와 설정이 올바른지 확인하세요.

## 추가 자료

- [Firebase 공식 문서](https://firebase.google.com/docs)
- [Firestore 보안 규칙 가이드](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase 인증 문서](https://firebase.google.com/docs/auth)
