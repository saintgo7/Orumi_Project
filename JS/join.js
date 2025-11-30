// 회원가입 기능

document.addEventListener('DOMContentLoaded', function() {
    const joinForm = document.querySelector('.join-form');

    if (!joinForm) return;

    joinForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // 입력값 가져오기
        const userId = document.getElementById('user-id').value.trim();
        const userEmail = document.getElementById('user-email').value.trim();
        const userPw = document.getElementById('user-pw').value;
        const userNickname = document.getElementById('user-nickname').value.trim();

        // 성별과 여행테마는 간소화된 폼에서는 선택 사항
        const gender = '';
        const favorites = [];

        // 유효성 검사
        if (!userId) {
            alert('아이디를 입력해주세요.');
            return;
        }
        if (!userEmail) {
            alert('이메일을 입력해주세요.');
            return;
        }
        if (!userPw) {
            alert('비밀번호를 입력해주세요.');
            return;
        }
        if (userPw.length < 6) {
            alert('비밀번호는 최소 6자 이상이어야 합니다.');
            return;
        }
        if (!userNickname) {
            alert('닉네임을 입력해주세요.');
            return;
        }

        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userEmail)) {
            alert('올바른 이메일 형식을 입력해주세요.');
            return;
        }

        try {
            // 중복 체크 - 아이디
            const userIdCheck = await usersCollection.where('userId', '==', userId).get();
            if (!userIdCheck.empty) {
                alert('이미 사용 중인 아이디입니다.');
                return;
            }

            // 중복 체크 - 이메일
            const emailCheck = await usersCollection.where('email', '==', userEmail).get();
            if (!emailCheck.empty) {
                alert('이미 사용 중인 이메일입니다.');
                return;
            }

            // 비밀번호 해싱
            const hashedPassword = await hashPassword(userPw);

            // Firestore에 사용자 정보 저장
            const userData = {
                userId: userId,
                email: userEmail,
                password: hashedPassword,
                nickname: userNickname,
                gender: gender,
                favoriteThemes: favorites,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            await usersCollection.doc(userId).set(userData);

            alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
            window.location.href = './login.html';

        } catch (error) {
            console.error('회원가입 오류:', error);
            alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.\n오류: ' + error.message);
        }
    });
});
