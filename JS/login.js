// 로그인 기능

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form');

    if (!loginForm) return;

    // 이미 로그인되어 있다면 메인 페이지로 리다이렉트
    if (isLoggedIn()) {
        const user = getCurrentUser();
        if (confirm(`이미 ${user.nickname}님으로 로그인되어 있습니다. 메인 페이지로 이동하시겠습니까?`)) {
            window.location.href = './index.html';
        }
    }

    // 아이디 저장 기능
    const saveIdCheckbox = document.getElementById('save-id');
    const userIdInput = document.getElementById('user-id');

    // 저장된 아이디 불러오기
    const savedUserId = localStorage.getItem('savedUserId');
    if (savedUserId) {
        userIdInput.value = savedUserId;
        saveIdCheckbox.checked = true;
    }

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // 입력값 가져오기
        const userId = userIdInput.value.trim();
        const userPw = document.getElementById('user-pw').value;

        // 유효성 검사
        if (!userId) {
            alert('아이디를 입력해주세요.');
            return;
        }
        if (!userPw) {
            alert('비밀번호를 입력해주세요.');
            return;
        }

        try {
            // Firestore에서 사용자 정보 조회
            const userDoc = await usersCollection.doc(userId).get();

            if (!userDoc.exists) {
                alert('존재하지 않는 아이디입니다.');
                return;
            }

            const userData = userDoc.data();

            // 비밀번호 확인
            const hashedPassword = await hashPassword(userPw);
            if (hashedPassword !== userData.password) {
                alert('비밀번호가 일치하지 않습니다.');
                return;
            }

            // 아이디 저장 처리
            if (saveIdCheckbox.checked) {
                localStorage.setItem('savedUserId', userId);
            } else {
                localStorage.removeItem('savedUserId');
            }

            // 로그인 성공 - 사용자 정보 저장 (비밀번호 제외)
            const loginUser = {
                userId: userData.userId,
                email: userData.email,
                nickname: userData.nickname,
                gender: userData.gender,
                favoriteThemes: userData.favoriteThemes,
                loginTime: new Date().toISOString()
            };

            setCurrentUser(loginUser);

            // 마지막 로그인 시간 업데이트
            await usersCollection.doc(userId).update({
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });

            alert(`환영합니다, ${loginUser.nickname}님!`);
            window.location.href = './index.html';

        } catch (error) {
            console.error('로그인 오류:', error);
            alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.\n오류: ' + error.message);
        }
    });
});
