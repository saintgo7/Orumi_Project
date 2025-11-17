// 초대 기능 관련 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const inviteForm = document.querySelector('.invite-form');
    const copyButton = document.getElementById('copy-link');
    const shareLink = document.getElementById('share-link');
    const inviteResult = document.getElementById('invite-result');

    // 이메일 초대 폼 제출 처리
    inviteForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const friendEmail = document.getElementById('friend-email').value;
        const friendName = document.getElementById('friend-name').value;
        const inviteMessage = document.getElementById('invite-message').value;

        // 실제 구현에서는 서버로 데이터를 전송해야 하지만,
        // 데모를 위해 성공 메시지만 표시
        sendInviteEmail(friendEmail, friendName, inviteMessage);
    });

    // 링크 복사 기능
    copyButton.addEventListener('click', function() {
        shareLink.select();
        shareLink.setSelectionRange(0, 99999); // 모바일 지원
        
        try {
            navigator.clipboard.writeText(shareLink.value).then(function() {
                showCopySuccess();
            }).catch(function() {
                // 폴백: 구식 방법 사용
                document.execCommand('copy');
                showCopySuccess();
            });
        } catch (err) {
            console.error('복사 실패:', err);
            alert('링크 복사에 실패했습니다.');
        }
    });

    function showCopySuccess() {
        const originalText = copyButton.textContent;
        copyButton.textContent = '복사됨!';
        copyButton.style.backgroundColor = '#28a745';
        
        setTimeout(() => {
            copyButton.textContent = originalText;
            copyButton.style.backgroundColor = '';
        }, 2000);
    }

    function sendInviteEmail(email, name, message) {
        // 실제 이메일 전송 로직은 백엔드에서 처리되어야 합니다.
        // 여기서는 시뮬레이션만 합니다.
        
        // 로딩 표시
        const submitButton = document.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        submitButton.textContent = '전송 중...';
        submitButton.disabled = true;

        // 2초 후 성공 메시지 표시 (실제로는 서버 응답을 기다림)
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
            // 성공 메시지 표시
            inviteResult.style.display = 'block';
            inviteResult.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <p><strong>${name || email}</strong>님께 초대 이메일이 전송되었습니다!</p>
                </div>
            `;
            
            // 폼 초기화
            inviteForm.reset();
            
            // 3초 후 성공 메시지 숨기기
            setTimeout(() => {
                inviteResult.style.display = 'none';
            }, 3000);
        }, 2000);
    }
});

// 소셜 미디어 공유 기능
function shareKakao() {
    // 실제 카카오톡 공유 API 구현 필요
    alert('카카오톡 공유 기능은 개발 중입니다.');
}

function shareFacebook() {
    const url = encodeURIComponent('https://kimyeoju.github.io/Orumi_Project/');
    const text = encodeURIComponent('Travel Japan에서 함께 일본 여행을 계획해보세요!');
    
    window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
        'facebook-share',
        'width=580,height=296'
    );
}

function shareTwitter() {
    const url = encodeURIComponent('https://kimyeoju.github.io/Orumi_Project/');
    const text = encodeURIComponent('Travel Japan에서 함께 일본 여행을 계획해보세요! #TravelJapan #일본여행');
    
    window.open(
        `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
        'twitter-share',
        'width=550,height=420'
    );
}