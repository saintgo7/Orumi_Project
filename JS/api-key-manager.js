// Google Gemini API 키 관리

const API_KEY_STORAGE_KEY = 'gemini_api_key';

// API 키 저장
function saveApiKey(apiKey) {
    try {
        localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
        return true;
    } catch (error) {
        console.error('API 키 저장 실패:', error);
        return false;
    }
}

// API 키 불러오기
function getApiKey() {
    try {
        return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
    } catch (error) {
        console.error('API 키 불러오기 실패:', error);
        return '';
    }
}

// API 키 삭제
function clearApiKey() {
    try {
        localStorage.removeItem(API_KEY_STORAGE_KEY);
        return true;
    } catch (error) {
        console.error('API 키 삭제 실패:', error);
        return false;
    }
}

// API 키 유효성 검사 (기본적인 형식 체크)
function validateApiKey(apiKey) {
    if (!apiKey || apiKey.trim() === '') {
        return { valid: false, message: 'API 키를 입력해주세요.' };
    }

    if (apiKey.length < 20) {
        return { valid: false, message: 'API 키가 너무 짧습니다. 올바른 키를 입력해주세요.' };
    }

    // Google API 키는 일반적으로 "AIza"로 시작
    if (!apiKey.startsWith('AIza')) {
        return { valid: false, message: '올바른 Google API 키 형식이 아닙니다. (AIza로 시작해야 합니다)' };
    }

    return { valid: true, message: 'API 키가 유효합니다.' };
}

// API 키 마스킹 (표시용)
function maskApiKey(apiKey) {
    if (!apiKey || apiKey.length < 8) return '****';
    return apiKey.substring(0, 8) + '****' + apiKey.substring(apiKey.length - 4);
}

// UI 업데이트
function updateApiKeyStatus() {
    const apiKey = getApiKey();
    const statusElement = document.getElementById('api-status-text');
    const statusContainer = document.getElementById('api-key-status');
    const apiKeyInput = document.getElementById('api-key-input');

    if (apiKey) {
        statusElement.innerHTML = `
            <i class="fa-solid fa-circle-check"></i>
            API 키가 설정되었습니다: <code>${maskApiKey(apiKey)}</code>
        `;
        statusContainer.classList.add('status-success');
        statusContainer.classList.remove('status-error');
        apiKeyInput.value = apiKey;
    } else {
        statusElement.innerHTML = `
            <i class="fa-solid fa-circle-info"></i>
            API 키가 설정되지 않았습니다.
        `;
        statusContainer.classList.remove('status-success');
        statusContainer.classList.add('status-error');
        apiKeyInput.value = '';
    }
}

// DOM이 로드되면 초기화
document.addEventListener('DOMContentLoaded', function() {
    const apiKeyInput = document.getElementById('api-key-input');
    const saveButton = document.getElementById('save-api-key');
    const clearButton = document.getElementById('clear-api-key');
    const toggleVisibility = document.getElementById('toggle-visibility');
    const toggleSection = document.getElementById('toggle-api-section');
    const apiKeySection = document.getElementById('api-key-section');

    // 초기 상태 업데이트
    updateApiKeyStatus();

    // API 섹션 토글
    if (toggleSection) {
        toggleSection.addEventListener('click', function() {
            const isVisible = apiKeySection.style.display !== 'none';
            apiKeySection.style.display = isVisible ? 'none' : 'block';
            const icon = toggleSection.querySelector('i');
            icon.className = isVisible ? 'fa-solid fa-chevron-down' : 'fa-solid fa-chevron-up';
        });
    }

    // 비밀번호 표시/숨김 토글
    if (toggleVisibility) {
        toggleVisibility.addEventListener('click', function() {
            const type = apiKeyInput.type === 'password' ? 'text' : 'password';
            apiKeyInput.type = type;
            const icon = toggleVisibility.querySelector('i');
            icon.className = type === 'password' ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
        });
    }

    // API 키 저장
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            const apiKey = apiKeyInput.value.trim();

            // 유효성 검사
            const validation = validateApiKey(apiKey);
            if (!validation.valid) {
                alert(validation.message);
                return;
            }

            // 저장
            if (saveApiKey(apiKey)) {
                alert('API 키가 성공적으로 저장되었습니다!');
                updateApiKeyStatus();
            } else {
                alert('API 키 저장에 실패했습니다. 다시 시도해주세요.');
            }
        });
    }

    // API 키 삭제
    if (clearButton) {
        clearButton.addEventListener('click', function() {
            if (confirm('저장된 API 키를 삭제하시겠습니까?')) {
                if (clearApiKey()) {
                    alert('API 키가 삭제되었습니다.');
                    updateApiKeyStatus();
                } else {
                    alert('API 키 삭제에 실패했습니다.');
                }
            }
        });
    }

    // Enter 키로 저장
    if (apiKeyInput) {
        apiKeyInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveButton.click();
            }
        });
    }
});
