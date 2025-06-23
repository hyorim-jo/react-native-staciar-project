const stories = window.stories;
let anim = null;
let didPlay = false;
const startA = 0, endA = 60;
const startB = 60, endB = 120;

function initLottie() {  
    const container = document.getElementById('lottie-container');

    if (!container) return;
    if (anim) {
        anim.goToAndPlay(0); // 처음부터 재생
        return;
    }

    anim = lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        path: '../assets/lottie/speaking.json'
    });
    resetAnimation();
}

function startAnimation() {
    if (!anim) {
        initLottie();
        return;
    }

    anim.play();
}

function resetAnimation() {
    if (anim) {
        anim.goToAndStop(0, true);
    }
}

function animate() {
    let targetFrames = [0, 0];
    if (!didPlay) {
        didPlay = true;
        targetFrames = [startA, endA];
    } else {
        didPlay = false;
        targetFrames = [startB, endB];
    }
    anim.playSegments(targetFrames, true);
}

async function AIConversation() {
    const userInput = await startVoiceInput();

    try {
        // 동화 생성 프롬프트
        const prompt = `
        [동화 생성 규칙]
        1. 사용자 정보:
        - 아이 이름: ${userData.name || '주인공'}
        - 지금까지의 이야기: ${stories.length > 0 ? stories.join('\n') : '없음 (새로운 이야기 시작)'}
        - 사용자 음성 입력: "${userInput}"

        2. 생성 요구사항:
        * 4-7세 아이를 위한 단순한 어휘 사용
        * 지금까지의 이야기와 자연스럽게 연결될 것
        * 2-4문장으로 구성된 짧은 이야기
        * 이야기 중간에 이미지 삽화가 들어갈 부분 지정 → [삽화] 표시
        * 마지막 문장은 사용자가 쉽게 답변할 수 있는 질문
        * 반드시 JSON 형식으로 출력

        3. 출력 형식:
        {
            "Story": "생성된 이야기 내용"
        }

        [지시사항]
        1. 지금까지의 이야기에 이어서 자연스러운 다음 이야기를 생성하세요.
        2. 이야기 중간에 이미지 삽화가 들어갈 위치에 [삽화] 태그를 넣으세요.
        3. [삽화] 태그 뒤에 삽화 설명을 10단어 이내로 추가하세요.
        4. 반드시 마지막 문장은 아이가 쉽게 답변할 수 있는 질문으로 작성하세요.
        5. 반드시 지정된 JSON 형식으로만 응답하고 다른 텍스트는 포함하지 마세요.
    `;

        // Gemini API 호출
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }],
                    generationConfig: {
                        temperature: 0.5,
                        topP: 0.9,
                        maxOutputTokens: 500,
                        stopSequences: ["\n\n"]
                    }
                })
            }
        );

        const data = await response.json();
        const content = data.candidates[0].content.parts[0].text;

        // JSON 추출
        const jsonStart = content.indexOf('{');
        const jsonEnd = content.lastIndexOf('}') + 1;
        const jsonContent = content.substring(jsonStart, jsonEnd);
        const result = JSON.parse(jsonContent);

        onConversationComplete(result.Story);
    } catch (error) {
        console.error('이야기 생성 실패:', error);
        startVoiceInput();
    }
}

// 음성 입력 시작 함수
function startVoiceInput() {
    return new Promise((resolve, reject) => {
        // 브라우저 지원 확인
        if (!('webkitSpeechRecognition' in window)) {
            reject(new Error('브라우저가 음성 인식을 지원하지 않습니다'));
            return;
        }

        // 음성 인식 객체 생성
        speechRecognition = new webkitSpeechRecognition();
        speechRecognition.lang = 'ko-KR';
        speechRecognition.interimResults = false;

        speechRecognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            resolve(transcript);
        };

        speechRecognition.onerror = (event) => {
            alert('음성 인식 오류가 발생했습니다.');
            reject(event.error);
        };

        try {
            speechRecognition.start();
        } catch (e) {
            alert('음성 인식 시작에 실패했습니다.');
            provideTextInputFallback();
            reject(e);
        }
    });
}

// 음성 인식 중지 
function stopVoiceInput() {
    if (speechRecognition) {
        speechRecognition.stop();
        updateVoiceUI('idle');
    }
}

async function onConversationComplete(newStory) {
    // 새 이야기 추가
    window.stories.push(newStory);
    localStorage.setItem('bookStory', JSON.stringify({
        stories: window.stories
    }));

    const parts = parseStory(newStory);
    for (const part of parts) {
        if (part.type === 'image' && !storyIllustrations[part.description]) {
            storyIllustrations[part.description] = await generateIllustration(part.description);
        }
    }

    // 섹션 전환
    select('#speaking-section').style('display', 'none');
    select('#story-section').style('display', 'block');

    // 캔버스 갱신
    redraw();
} 