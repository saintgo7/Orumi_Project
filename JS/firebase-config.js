// Firebase Configuration
// Firebase 콘솔(https://console.firebase.google.com/)에서 프로젝트 설정을 확인하여 아래 값을 채워주세요.
// 프로젝트 설정 > 일반 > "내 앱" 섹션에서 Firebase SDK snippet을 확인할 수 있습니다.

const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Firebase 콘솔에서 확인
  authDomain: "travel-8d33b.firebaseapp.com",
  projectId: "travel-8d33b",
  storageBucket: "travel-8d33b.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Firebase 콘솔에서 확인
  appId: "YOUR_APP_ID" // Firebase 콘솔에서 확인
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);

// Firestore 데이터베이스 참조
const db = firebase.firestore();

// 사용자 컬렉션 참조
const usersCollection = db.collection('users');

// 비밀번호 해싱 함수 (SHA-256)
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hash));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// 로그인 상태 확인
function isLoggedIn() {
  return localStorage.getItem('currentUser') !== null;
}

// 현재 로그인한 사용자 정보 가져오기
function getCurrentUser() {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
}

// 로그인 정보 저장
function setCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

// 로그아웃
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = './index.html';
}
